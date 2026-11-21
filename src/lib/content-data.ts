import type { z } from "zod";
import type { projectSchema, jobOpeningSchema } from "./validations/crud";
type ProjectInput = z.infer<typeof projectSchema>;
type JobInput = z.infer<typeof jobOpeningSchema>;
export function projectFields(data: ProjectInput) {
  return { slug: data.slug, projectUrl: data.projectUrl || null, startedAt: data.startedAt ? new Date(data.startedAt) : null, completedAt: data.completedAt ? new Date(data.completedAt) : null, durationMonths: data.durationMonths ? Number(data.durationMonths) : null, teamSize: data.teamSize ? Number(data.teamSize) : null, isFeatured: data.isFeatured, isPublished: data.isPublished, sortOrder: data.sortOrder };
}
export function projectTranslation(data: ProjectInput) {
  return { title: data.title, summary: data.summary || null, challenge: data.challenge || null, solution: data.solution || null, result: data.result || null, content: data.content || null };
}
export function jobFields(data: JobInput) {
  return { slug: data.slug, department: data.department || null, employmentType: data.employmentType, workMode: data.workMode, location: data.location || null, salaryMin: data.salaryMin ? Number(data.salaryMin) : null, salaryMax: data.salaryMax ? Number(data.salaryMax) : null, showSalary: data.showSalary, status: data.status, closesAt: data.closesAt ? new Date(data.closesAt) : null };
}
export function jobTranslation(data: JobInput) {
  return { title: data.title, description: data.description || null, responsibilities: data.responsibilities || null, requirements: data.requirements || null, benefits: data.benefits || null };
}
