import { YearNavigator } from "@/components/navigation/YearNavigator";

/**
 * Shared layout wrapping all year routes.
 * Renders the floating year navigator (bottom-left / bottom-right arrows).
 */
export default function YearsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <YearNavigator />
    </>
  );
}
