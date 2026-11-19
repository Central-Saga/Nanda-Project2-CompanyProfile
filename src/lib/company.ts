import { cache } from "react";
import { prisma } from "./prisma";
export const getCompany = cache(() => prisma.companyProfile.findFirst());
