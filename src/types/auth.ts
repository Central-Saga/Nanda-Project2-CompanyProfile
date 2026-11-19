import { z } from "zod";

export const roleSchema = z.enum(["super_admin", "editor"]);
export type RoleName = z.infer<typeof roleSchema>;
