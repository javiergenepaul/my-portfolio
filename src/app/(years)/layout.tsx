import { YearNavigator } from "@/components/navigation/YearNavigator";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";

/**
 * Shared layout wrapping all year routes.
 * Renders the floating year navigator (bottom-left / bottom-right arrows)
 * and a top progress bar for intra-year page navigation.
 */
export default function YearsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationProgress />
      {children}
      <YearNavigator />
    </>
  );
}
