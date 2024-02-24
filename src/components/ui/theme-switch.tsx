import { translate } from "@/i18n";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { forwardRef } from "react";

export const ThemeSwitch = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <label className="cursor-pointer" aria-label={translate("header.ariaLabel.themeSwitch")}>
      <input type="checkbox" className="hidden" ref={ref} {...props} />
      <div
        className={`w-17 px-2 py-1.5 rounded-full ${
          props.checked ? "bg-white text-black" : "bg-black text-white"
        } relative transition-all duration-300`}
      >
        <div
          className={`absolute top-1 left-1.5  ${
            props.checked ? "translate-x-0 bg-black" : "translate-x-10 bg-white"
          }  h-7 w-7 rounded-full duration-300`}
        />
        <div className="flex gap-4">
          <Icon icon="heroicons:moon-solid" width={"24px"} height={"24px"} />
          <Icon icon="fa6-solid:sun" width={"24px"} height={"24px"} />
        </div>
      </div>
    </label>
  );
});
