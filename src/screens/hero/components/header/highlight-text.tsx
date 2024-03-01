import { HighlightTextInterface } from "../component-props";

export const HighlightText = (props: HighlightTextInterface) => {
  const { url, text } = props;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="font-bold transition-all duration-300 cursor-pointer hover:text-primary"
    >
      {" "}
      {text}{" "}
    </a>
  );
};
