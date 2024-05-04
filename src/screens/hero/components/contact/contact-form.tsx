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
import { useLoadingStore, useResendTimerStore } from "@/stores";
import { useEffect } from "react";

export const ContactForm = () => {
  const { toast } = useToast();
  const { setLoading } = useLoadingStore();
  const { timer, setTimer } = useResendTimerStore();

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
        setTimer(3 * 60);
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
    const timerinterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setTimer(0);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timerinterval);
  }, [timer]);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Form {...form}>
      <form className="h-full" onSubmit={form.handleSubmit(onFinishForm)}>
        <div className="flex flex-col justify-between h-full gap-8">
          <div className="grid gap-4">
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
          </div>
          <Button
            disabled={timer !== 0}
            className={"select-none"}
            type="submit"
          >
            {timer === 0
              ? translate("contact.button.submit")
              : translate("contact.button.resend", {
                  time: formatTime(timer),
                })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
