import "dotenv/config";
import { ensurePrivateBucket } from "../src/lib/storage";
async function main() {
  try { await ensurePrivateBucket(); process.stdout.write("Storage policy: verified non-public.\n"); }
  catch { process.stderr.write("Storage policy could not be verified; uploads must fail closed. Check endpoint and GetBucketPolicy permission.\n"); process.exitCode = 1; }
}
void main();
