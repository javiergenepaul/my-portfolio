import { YearNavigator } from "@/components/common/navigation/YearNavigator";
import { NavigationProgress } from "@/components/common/navigation/NavigationProgress";
import { ContentProvider } from "@/providers/ContentProvider";

/**
 * Shared layout wrapping all year routes.
 * Renders the floating year navigator (bottom-left / bottom-right arrows)
 * and a top progress bar for intra-year page navigation.
 *
 * ContentProvider kicks off the one-time fetch of all published content into
 * the shared store, so any entry point into a year has data ready.
 */
export default function YearsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentProvider>
      <NavigationProgress />
      {children}
      <YearNavigator />
    </ContentProvider>
  );
}
