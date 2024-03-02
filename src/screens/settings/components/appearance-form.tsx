import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button,
  FormDescription,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components";
import { ChevronDownIcon } from "lucide-react";
import { useThemeStore } from "@/stores";

const appearanceFormSchema = z.object({
  font: z.enum(["inter", "manrope", "system"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export const AppearanceForm = () => {
  const { setTheme, setFont } = useThemeStore();
  const { toast } = useToast();

  const defaultValue: z.infer<typeof appearanceFormSchema> = {
    font: "inter",
    theme: "system",
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
              <FormLabel>Font</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="manrope">Manrope</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>Set the font you like.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme you like.</FormDescription>
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
                      System
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
                      Light
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
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        {/* Add other fields as needed */}
        <Button type="submit">Update preferences</Button>
      </form>
    </FormProvider>
  );
};
