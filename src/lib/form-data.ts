export function readServiceForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    icon: formData.get("icon"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    summary: formData.get("summary"),
    description: formData.get("description"),
  };
}

export function readProjectForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    projectUrl: formData.get("projectUrl"),
    startedAt: formData.get("startedAt"),
    completedAt: formData.get("completedAt"),
    durationMonths: formData.get("durationMonths") || "",
    teamSize: formData.get("teamSize") || "",
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
    sortOrder: formData.get("sortOrder"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    challenge: formData.get("challenge"),
    solution: formData.get("solution"),
    result: formData.get("result"),
    content: formData.get("content"),
  };
}

export function readPostForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId") || "",
    status: formData.get("status") || "draft",
    isFeatured: formData.get("isFeatured") === "on",
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
  };
}

export function readJobForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    department: formData.get("department"),
    employmentType: formData.get("employmentType") || "full_time",
    workMode: formData.get("workMode") || "onsite",
    location: formData.get("location"),
    salaryMin: formData.get("salaryMin") || "",
    salaryMax: formData.get("salaryMax") || "",
    showSalary: formData.get("showSalary") === "on",
    status: formData.get("status") || "draft",
    closesAt: formData.get("closesAt") || "",
    title: formData.get("title"),
    description: formData.get("description"),
    responsibilities: formData.get("responsibilities"),
    requirements: formData.get("requirements"),
    benefits: formData.get("benefits"),
  };
}

export function readPublicIdentity(formData: FormData) {
  return { fullName: formData.get("fullName"), email: formData.get("email"), phone: formData.get("phone") || "", companyName: formData.get("companyName") || "", consentPrivacy: formData.get("consentPrivacy") === "on", websiteUrl: formData.get("websiteUrl") || "" };
}
