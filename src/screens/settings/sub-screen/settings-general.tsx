import { i18n, translate } from "@/i18n";
import { GeneralLangOption, GeneralLangOptions } from "../components";
import { JPFlag, PHFlag, USFlag } from "@/assets";
import { DEFAULT_LANGUAGE, useLanguageStore } from "@/stores";
import {
  Button,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  useToast,
} from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const generalSettingsFormSchema = z.object({
  lang: z.enum(["en", "ja", "fil", "ceb"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsFormSchema>;

export const SettingsGeneral = () => {
  const { setLanguage } = useLanguageStore();
  const { toast } = useToast();

  const LANGUAGE_OPTIONS: GeneralLangOptions[] = [
    {
      value: "en",
      name: translate("sidebar.languageOption.english"),
      icon: <img width={"170px"} height={"80px"} src={USFlag} />,
    },
    {
      value: "ja",
      name: translate("sidebar.languageOption.japanese"),
      icon: <img width={"170px"} height={"80px"} src={JPFlag} />,
    },
    {
      value: "fil",
      name: translate("sidebar.languageOption.tagalog"),
      icon: <img width={"170px"} height={"80px"} src={PHFlag} />,
    },
    {
      value: "ceb",
      name: translate("sidebar.languageOption.cebuano"),
      icon: <img width={"170px"} height={"80px"} src={PHFlag} />,
    },
  ];

  const defaultValue: z.infer<typeof generalSettingsFormSchema> = {
    lang: DEFAULT_LANGUAGE,
  };

  const { handleSubmit, control } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsFormSchema),
    defaultValues: defaultValue,
  });

  const onSubmitForm = (data: GeneralSettingsFormValues) => {
    setLanguage(data.lang);
    i18n.changeLanguage(data.lang);
    toast({
      variant: "success",
      duration: 3000,
      title: "Settings Updated",
      description: "General Settings Successfully Updated",
    });
  };

  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
        <FormField
          control={control}
          name="lang"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{translate("sidebar.changeLanguage")}</FormLabel>
              <FormDescription>Select the language you like.</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-4 gap-4"
              >
                {LANGUAGE_OPTIONS.map(
                  (lang: GeneralLangOptions, index: React.Key) => {
                    return <GeneralLangOption key={index} {...lang} />;
                  }
                )}
              </RadioGroup>
            </FormItem>
          )}
        />
        <Button type="submit">Update Settings</Button>
      </form>
    </FormProvider>
  );
};
