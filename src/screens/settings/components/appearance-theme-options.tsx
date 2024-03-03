import { Label, RadioGroupItem } from "@/components";
import { Theme } from "@/stores";

export interface ApperanceThemeOptionInterface {
  value: Theme;
  name: string;
  icon: React.ReactNode;
}

export const ApperanceThemeOption = (props: ApperanceThemeOptionInterface) => {
  const { value, name, icon } = props;

  // const RenderSelector = (): React.ReactNode => {
  //   switch (value) {
  //     case "dark":
  //       return (
  //         <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
  //           <div className="p-2 space-y-2 rounded-sm bg-slate-950">
  //             <div className="p-2 space-y-2 rounded-md shadow-sm bg-slate-800">
  //               <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
  //               <div className="w-4 h-4 rounded-full bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-800">
  //               <div className="w-4 h-4 rounded-full bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     case "light":
  //       return (
  //         <div className="items-center p-1 border-2 rounded-md border-muted hover:border-accent">
  //           <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
  //             <div className="p-2 space-y-2 bg-white rounded-md shadow-sm">
  //               <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
  //               <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
  //               <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
  //               <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 bg-white rounded-md shadow-sm">
  //               <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
  //               <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     case "system":
  //       return (
  //         <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
  //           <div className="p-2 space-y-2 rounded-sm bg-slate-950">
  //             <div className="p-2 space-y-2 rounded-md shadow-sm bg-slate-200">
  //               <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-200">
  //               <div className="w-4 h-4 rounded-full bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //             <div className="flex items-center p-2 space-x-2 rounded-md shadow-sm bg-slate-200">
  //               <div className="w-4 h-4 rounded-full bg-slate-400" />
  //               <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     default:
  //       break;
  //   }
  // };

  return (
    <div>
      <RadioGroupItem
        value={value as string}
        id={value}
        className="sr-only peer"
      />
      <Label
        htmlFor={value}
        className="flex gap-4 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        {icon}
        {name}
      </Label>
      {/* <RadioGroupItem value={value as string} id={value} className="sr-only" />
      <Label
        htmlFor={value}
        className="[&:has([data-state=checked])>div]:border-primary"
      >
        {RenderSelector()}
        <span className="block w-full p-2 font-normal text-center">{name}</span>
      </Label> */}
    </div>
  );
};
