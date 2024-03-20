// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

function custoRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

export { default as userEvent } from "@testing-library/user-event";

// override render export
export { custoRender as render };
