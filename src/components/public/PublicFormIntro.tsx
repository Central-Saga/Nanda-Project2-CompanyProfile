import { FormFeedback } from "./FormFeedback";
import { Input } from "@/components/shared/ui/Input";
import type { FormActionResult } from "@/app/actions/public";
export interface PublicFormIntroProps { state: FormActionResult | null; }
export function PublicFormIntro({ state }: PublicFormIntroProps) {
  return <><FormFeedback state={state} /><Input type="text" name="websiteUrl" hidden tabIndex={-1} autoComplete="off" /></>;
}
