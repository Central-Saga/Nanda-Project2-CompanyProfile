import { Input } from "@/components/shared/ui/Input";
export interface PrivacyConsentProps { errors?: string[]; text: string; }
export function PrivacyConsent({ errors, text }: PrivacyConsentProps) {
  return <div><label className="flex cursor-pointer items-start gap-2"><Input type="checkbox" name="consentPrivacy" required aria-invalid={!!errors?.length} aria-describedby={errors?.length ? "consent-errors" : undefined} /><span className="text-xs text-zinc-400">{text}</span></label>
    {!!errors?.length && <p role="alert" id="consent-errors" className="text-sm text-red-300">{errors[0]}</p>}</div>;
}
