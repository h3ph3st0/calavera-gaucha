import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { validateFile, validateFileMagicBytes, MAX_FILES } from "@/lib/validations/quote";
import { checkRateLimit } from "@/lib/security/ratelimit";
import { getClientIp } from "@/lib/security/sanitize";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: quoteId } = await params;

  if (!UUID_RE.test(quoteId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(ip, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Esperá un momento." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const rawFiles = formData.getAll("files") as File[];
  if (rawFiles.length === 0) {
    return NextResponse.json({ uploaded: 0 }, { status: 200 });
  }

  const supabase = createServiceClient();

  // Verificar que el presupuesto existe antes de subir archivos
  const { data: quote, error: quoteErr } = await supabase
    .from("quotes")
    .select("id")
    .eq("id", quoteId)
    .single();

  if (quoteErr || !quote) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  const filesToProcess = rawFiles.slice(0, MAX_FILES);
  const uploaded: string[] = [];
  const errors: string[] = [];

  for (const file of filesToProcess) {
    const validation = validateFile(file);
    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
      continue;
    }

    const magicValid = await validateFileMagicBytes(file);
    if (!magicValid) {
      errors.push(`${file.name}: el contenido no coincide con la extensión declarada`);
      continue;
    }

    const storagePath = `${quoteId}/${Date.now()}_${validation.safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from("quote-files")
      .upload(storagePath, await file.arrayBuffer(), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadErr) {
      console.error("[files] storage upload error", uploadErr.message);
      errors.push(`${file.name}: error al subir`);
      continue;
    }

    const { error: insertErr } = await supabase.from("quote_files").insert({
      quote_id: quoteId,
      storage_path: storagePath,
      original_name: file.name.slice(0, 200),
      file_type: file.type || "application/octet-stream",
      size_bytes: file.size,
    });

    if (insertErr) {
      // Si falla el registro, borramos el archivo para no dejar huérfanos
      await supabase.storage.from("quote-files").remove([storagePath]);
      errors.push(`${file.name}: error al registrar`);
      continue;
    }

    uploaded.push(validation.safeName);
  }

  return NextResponse.json({ uploaded: uploaded.length, errors }, {
    status: errors.length === filesToProcess.length ? 500 : 200,
  });
}
