import { Icon } from "@iconify/react/dist/iconify.js";
import React, { forwardRef } from "react";

export const ThemeSwitch = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <label className="cursor-pointer">
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
      {/* <div
          className={`w-17 p-1 rounded-full ${
            props.checked
              ? "bg-transparent border border-black"
              : "border border-white"
          } transition-all duration-300`}
        >
          <div
            className={`w-fit p-0.5 shadow-sm rounded-full ${
              props.checked ? "text-black" : "text-white"
            } relative overflow-hidden`}
          >
            <div
              className={`flex gap-2  absolute pl-0.5 pt-0.5 top-0 left-0 ${
                props.checked
                  ? "translate-x-[-2.5rem] opacity-0"
                  : "translate-x-0 opacity-1"
              } transition-all duration-300`}
            >
              <div className="text-white transition-all duration-300">dark</div>
              <Icon
                icon="heroicons:moon-solid"
                width={"24px"}
                height={"24px"}
              />
            </div>
            <div
              className={`flex gap-2 ${
                props.checked
                  ? "translate-x-0 opacity-1"
                  : "translate-x-10 opacity-0"
              } transition-all duration-300`}
            >
              <Icon icon="fa6-solid:sun" width={"24px"} height={"24px"} />
              <div className="text-black transition-all duration-300">
                light
              </div>
            </div>
          </div>
        </div> */}
    </label>
  );
});
