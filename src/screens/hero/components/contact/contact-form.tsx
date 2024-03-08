import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Textarea,
  useToast,
} from "@/components";
import {
  ContactFormSchema,
  ContactRequestInterface,
  defaultContactFormForm,
} from "./contact-form.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { translate } from "@/i18n";

export const ContactForm = () => {
  const { toast } = useToast();

  const form = useForm<ContactRequestInterface>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: defaultContactFormForm,
  });

  const onFinishForm = (values: ContactRequestInterface) => {
    console.log(values);
    // TODO:: on fuccess submit email.. show toast.. else show desctrutive
    if (!values.email) {
      toast({
        variant: "success",
        duration: 3000,
        title: translate("contact.toast.success.title"),
        description: translate("contact.toast.success.description"),
      });
    } else {
      toast({
        variant: "destructive",
        duration: 3000,
        // TODO:: change message
        // title: translate("contact.toast.error.title"),
        title: "Not yet working Available Soon!",
        description: translate("contact.toast.error.description"),
      });
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onFinishForm)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={
                    fieldState.invalid
                      ? "border-destructive text-destructive placeholder:text-destructive focus-visible:ring-destructive"
                      : "caret-primary"
                  }
                  placeholder={translate("contact.placeHolder.name")}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={
                    fieldState.invalid
                      ? "border-destructive text-destructive placeholder:text-destructive focus-visible:ring-destructive"
                      : "caret-primary"
                  }
                  placeholder={translate("contact.placeHolder.email")}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <>
                  <Textarea
                    maxLength={255}
                    className={
                      fieldState.invalid
                        ? "border-destructive text-destructive placeholder:text-destructive focus-visible:ring-destructive"
                        : "caret-primary"
                    }
                    placeholder={translate("contact.placeHolder.message")}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...field}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-8 select-none" type="submit">
          {translate("contact.button.submit")}
        </Button>
      </form>
    </Form>
  );
};
