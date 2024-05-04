export const DEV_MODE: "development" | "production" = import.meta.env
  .VITE_DEV_MODE;
export const EMAIL_SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const EMAIL_TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
export const EMAIL_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
