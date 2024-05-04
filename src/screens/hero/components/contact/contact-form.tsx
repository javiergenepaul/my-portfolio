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
import {
  EMAIL_PUBLIC_KEY,
  EMAIL_SERVICE_ID,
  EMAIL_TEMPLATE_ID,
  EmailInterface,
} from "@/config";
import { SendEmail } from "@/services";
import { useLoadingStore } from "@/stores";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ContactForm = () => {
  const { toast } = useToast();
  const { setLoading } = useLoadingStore();
  const [secondsLeft, setSecondsLeft] = useState(0);

  const form = useForm<ContactRequestInterface>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: defaultContactFormForm,
  });

  const onFinishForm = (values: ContactRequestInterface) => {
    const data: EmailInterface = {
      service_id: EMAIL_SERVICE_ID,
      template_id: EMAIL_TEMPLATE_ID,
      user_id: EMAIL_PUBLIC_KEY,
      template_params: { ...values, to_name: "Gene Paul Mar Javier" },
    };

    if (!data.service_id || !data.template_id || !data.user_id) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: translate("contact.toast.errrorConfig.title"),
        description: translate("contact.toast.errrorConfig.description"),
      });
      return null;
    }
    SendEmail({
      data: data,
      setLoading: setLoading,
      onSuccess: () => {
        toast({
          variant: "success",
          duration: 3000,
          title: translate("contact.toast.success.title"),
          description: translate("contact.toast.success.description"),
        });
        form.reset();
        setSecondsLeft(3 * 60);
      },
      onError: () => {
        toast({
          variant: "destructive",
          duration: 3000,
          title: translate("contact.toast.error.title"),
          description: translate("contact.toast.error.description"),
        });
      },
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1);
      } else {
        setSecondsLeft(0);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(onFinishForm)}>
        <FormField
          control={form.control}
          name="from_name"
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
          name="from_email"
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
        <Button
          disabled={secondsLeft !== 0}
          className={"mt-4 select-none"}
          type="submit"
        >
          {secondsLeft === 0
            ? translate("contact.button.submit")
            : translate("contact.button.resend", {
                time: formatTime(secondsLeft),
              })}
        </Button>
      </form>
    </Form>
  );
};
