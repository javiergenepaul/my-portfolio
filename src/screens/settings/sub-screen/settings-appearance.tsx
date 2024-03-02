import {
  useToast,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Button,
  Select,
  RadioGroup,
  RadioGroupItem,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { translate } from "@/i18n";
import { useThemeStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

const appearanceFormSchema = z.object({
  font: z.enum(["inter", "manrope", "system"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
});

type Theme = "dark" | "light" | "system";
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export const SettingsAppearance = () => {
  const { setTheme, setFont, getSystemTheme } = useThemeStore();
  const { toast } = useToast();
  console.log(getSystemTheme());

  const defaultValue: z.infer<typeof appearanceFormSchema> = {
    font: "inter",
    theme: getSystemTheme() as Theme,
  };

  const { handleSubmit, control } = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: defaultValue,
  });

  const methods = useForm();

  const onSubmitForm = (data: AppearanceFormValues) => {
    setFont(data.font);
    setTheme(data.theme);

    toast({
      variant: "success",
      duration: 3000,
      title: "Settings Updated",
      description: "Appreance Settings Successfully Updated",
    });
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          control={control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate("settings.font.font")}</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="inter">
                          {translate("settings.font.type.inter")}
                        </SelectItem>
                        {/* TODO:: change later */}
                        <SelectItem value="manrope">Manrope</SelectItem>
                        {/* TODO:: change later */}
                        <SelectItem value="system">System</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>
                {translate("settings.font.instruction")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{translate("settings.theme.theme")}</FormLabel>
              <FormDescription>
                {translate("settings.theme.formDescription")}
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-[800px] grid-cols-1 md:grid-cols-3 gap-8 pt-2"
              >
                {/* System */}
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="system" className="sr-only" />
                    </FormControl>
                    <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
                      <div className="p-2 space-y-2 rounded-sm bg-slate-950">
                        <div className="p-2 space-y-2 rounded-md shadow-sm bg-slate-200">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-200">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-200">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 font-normal text-center">
                      {translate("settings.theme.mode.system")}
                    </span>
                  </FormLabel>
                </FormItem>
                {/* Light */}
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center p-1 border-2 rounded-md border-muted hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="p-2 space-y-2 bg-white rounded-md shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 font-normal text-center">
                      {translate("settings.theme.mode.light")}
                    </span>
                  </FormLabel>
                </FormItem>
                {/* Dark */}
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
                      <div className="p-2 space-y-2 rounded-sm bg-slate-950">
                        <div className="p-2 space-y-2 rounded-md shadow-sm bg-slate-800">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
                          <div className="w-4 h-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 font-normal text-center">
                      {translate("settings.theme.mode.dark")}
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <Button type="submit">
          {translate("settings.theme.button.update")}
        </Button>
      </form>
    </FormProvider>
  );
};
