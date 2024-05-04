import { getColor } from "@/lib";
import { useLoadingStore, useSettingsStore } from "@/stores";
import PuffLoader from "react-spinners/PuffLoader";
import { twMerge } from "tailwind-merge";

export const LoadingMask = () => {
  const { color } = useSettingsStore();
  const { loading } = useLoadingStore();

  return (
    <div
      className={twMerge(
        "w-screen h-screen fixed z-50 bg-background/50 cursor-progress flex justify-center items-center",
        loading ? "fixed" : "hidden"
      )}
    >
      <PuffLoader
        color={getColor(color)}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
