import { translate } from "@/i18n";
import * as z from "zod";

export type ContactRequestInterface = z.infer<typeof ContactFormSchema>;
export const defaultContactFormForm: z.infer<typeof ContactFormSchema> = {
  from_name: "",
  from_email: "",
  message: "",
};

export const ContactFormSchema = z.object({
  from_name: z.string().min(1, {
    message: translate("errorMessages.required"),
  }),
  from_email: z
    .string()
    .email(translate("errorMessages.invalidEmail"))
    .min(1, {
      message: translate("errorMessages.required"),
    }),
  message: z
    .string()
    .min(1, {
      message: translate("errorMessages.required"),
    })
    .max(255 , {
      message: translate("errorMessages.maximumCharacter", { count: "255" }),
    }),
});
