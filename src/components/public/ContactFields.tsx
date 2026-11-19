import { FormField } from "@/components/admin/FormField";
export interface ContactFieldsProps { errors?: Record<string, string[]>; }
export function ContactFields({ errors }: ContactFieldsProps) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <FormField label="Nama Lengkap" name="fullName" required errors={errors?.fullName} />
    <FormField label="Email Perusahaan" name="email" type="email" required errors={errors?.email} />
    <FormField label="Nomor Telepon" name="phone" type="tel" errors={errors?.phone} />
    <FormField label="Organisasi / Perusahaan" name="companyName" errors={errors?.companyName} />
  </div>;
}
