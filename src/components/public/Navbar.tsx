import { cookies } from "next/headers";
import { getCompany } from "@/lib/company";
import { getLocale } from "@/lib/locale";
import { MobileNavbar } from "./MobileNavbar";

export async function Navbar() {
  const company = await getCompany();
  const brandName = company?.companyName || "PT Rekasaya Digital International";

  return <MobileNavbar initialTheme={(await cookies()).get("theme")?.value === "light" ? "light" : "dark"} locale={await getLocale()} brandName={brandName} />;
}
