import ReactGa from "react-ga4";

/**
 * Initializes Google Analytics tracking for the application.
 *
 * This function sets up ReactGA with the provided measurement ID,
 * enabling analytics tracking throughout the app.
 *
 * @remarks
 * Make sure that `MEASUREMENT_ID` is defined and that `ReactGa` is properly imported.
 */
export const initAnalytics = () => {
  ReactGa.initialize(import.meta.env.VITE_G_ANALYTICS_ID);
};

/**
 * Logs a page view to Google Analytics.
 *
 * This function sends a pageview event to Google Analytics with the specified path.
 *
 * @param path - The path of the page being viewed.
 */
export const logPageView = (path: string) => {
  ReactGa.send({
    hitType: "pageview",
    page: path,
  });
};

/**
 * Logs an event to Google Analytics.
 *
 * This function sends an event to Google Analytics with the specified category,
 * action, and optional label.
 *
 * @param props - The properties of the event to log.
 * @param props.category - The category of the event.
 * @param props.action - The action of the event.
 * @param props.label - An optional label for the event.
 */
export const logEvent = (props: {
  category: string;
  action: string;
  label?: string;
}) => {
  const { category, action, label } = props;
  ReactGa.event({
    category,
    action,
    label,
  });
};
