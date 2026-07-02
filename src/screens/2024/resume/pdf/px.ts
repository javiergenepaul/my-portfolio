/**
 * The on-screen resume renders at 794px wide (A4 @ 96dpi). react-pdf lays
 * pages out in points (A4 @ 72dpi). This converts a px value from the HTML
 * templates to the equivalent pt value so PDF proportions match the preview.
 */
export const px = (n: number) => Math.round(n * 0.75 * 100) / 100;
