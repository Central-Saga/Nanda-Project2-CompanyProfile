import type { JobOpening } from "@prisma/client";

export interface JobFormData {
    id: string;
    slug: string;
    department?: string | null;
    employmentType: JobOpening["employmentType"];
    workMode: JobOpening["workMode"];
    location?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    showSalary: boolean;
    status: JobOpening["status"];
    closesAt?: string | null;
    title: string;
    description?: string | null;
    responsibilities?: string | null;
    requirements?: string | null;
    benefits?: string | null;
}

export interface ProjectFormData {
    id: string;
    slug: string;
    projectUrl?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    durationMonths?: number | null;
    teamSize?: number | null;
    isFeatured: boolean;
    isPublished: boolean;
    sortOrder: number;
    title: string;
    summary?: string | null;
    challenge?: string | null;
    solution?: string | null;
    result?: string | null;
    content?: string | null;
}

