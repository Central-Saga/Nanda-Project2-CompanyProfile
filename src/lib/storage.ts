import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, GetBucketPolicyCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET || "compro-uploads";

const s3Client = new S3Client({
  endpoint,
  region,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  forcePathStyle: true, // Required for MinIO & local S3-compatible storage
});

function publicPrincipal(value: unknown): boolean {
  if (typeof value === "string") return value === "*" || /AllUsers|AuthenticatedUsers/.test(value);
  if (Array.isArray(value)) return value.some(publicPrincipal);
  return !!value && typeof value === "object" && Object.values(value).some(publicPrincipal);
}
export async function ensurePrivateBucket(): Promise<void> {
  try {
    const result = await s3Client.send(new GetBucketPolicyCommand({ Bucket: S3_BUCKET }), { abortSignal: AbortSignal.timeout(10000) });
    const policy: unknown = JSON.parse(result.Policy || "{}");
    if (!policy || typeof policy !== "object" || !("Statement" in policy)) throw new Error("Kebijakan bucket tidak dapat diverifikasi.");
    const statements = Array.isArray(policy.Statement) ? policy.Statement : [policy.Statement];
    for (const statement of statements) {
      if (!statement || typeof statement !== "object" || !("Effect" in statement)) throw new Error("Kebijakan bucket tidak valid.");
      if (statement.Effect === "Allow" && (!("Principal" in statement) || publicPrincipal(statement.Principal))) throw new Error("Upload memerlukan bucket privat.");
    }
  } catch (reason) {
    if (reason instanceof Error && reason.name === "NoSuchBucketPolicy") return;
    throw reason;
  }
}

export async function uploadToStorage(params: {
  key: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<{ url: string; key: string }> {
  await ensurePrivateBucket();
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: params.key,
    Body: params.buffer,
    ContentType: params.mimeType,
  });

  await s3Client.send(command, { abortSignal: AbortSignal.timeout(10000) });

  // If using public URL format:
  const publicBaseUrl = process.env.S3_PUBLIC_URL || `${endpoint}/${S3_BUCKET}`;
  const url = `${publicBaseUrl}/${params.key}`;

  return { url, key: params.key };
}

export async function deleteFromStorage(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command, { abortSignal: AbortSignal.timeout(10000) });
}

export async function downloadFromStorage(key: string) {
  return s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }), { abortSignal: AbortSignal.timeout(10000) });
}
