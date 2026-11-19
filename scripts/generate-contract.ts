import { z } from "zod";
import { readFileSync, writeFileSync } from "node:fs";
import { mutationResponseSchema, leadStatusSchema, bookingStatusSchema } from "../src/types/domain";
const paths = Object.fromEntries([["leads", leadStatusSchema], ["bookings", bookingStatusSchema]].map(([resource, schema]) => [`/api/v1/${resource}/{id}`, {
  patch: { security: [{ session: [], csrf: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
    requestBody: { required: true, content: { "application/json": { schema: z.toJSONSchema(z.object({ status: schema })) } } },
    responses: Object.fromEntries([200, 401, 403, 404, 422, 503].map((status) => [status, { description: status === 200 ? "Updated" : "Error", content: { "application/json": { schema: z.toJSONSchema(mutationResponseSchema) } } }])) }
}]));
const document = { openapi: "3.1.0", info: { title: "Company Profile API", version: "1.0.0" }, paths,
  components: { securitySchemes: { session: { type: "apiKey", in: "cookie", name: "session_token" }, csrf: { type: "apiKey", in: "header", name: "x-csrf-token" } } } };
const output = JSON.stringify(document, null, 2) + "\n";
const path = "docs/openapi.json";
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8") !== output) throw new Error("API contract drift. Run npm run codegen.");
  process.stdout.write("Contract drift: 0\n");
} else writeFileSync(path, output);
