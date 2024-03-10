import { Link } from "react-router-dom";
import { RubberAnimation } from "./rubber-animation";
import { BounceTextInterface } from "./animation-props";

export const BounceText = (props: BounceTextInterface) => {
  const { text, path, openInNewTab, className } = props;
  const textSplit = text.split("");

  return (
    <>
      {text}
      {/* {path ? (
        <Link
          to={path ? path : ""}
          {...(openInNewTab ? { target: "_blank" } : {})}
          rel="noreferrer"
        >
          {textSplit.map((letter, index) => {
            return (
              <RubberAnimation className={className} key={index}>
                {letter === " " ? "\u00A0" : letter}
              </RubberAnimation>
            );
          })}
        </Link>
      ) : (
        textSplit.map((letter, index) => {
          return (
            <RubberAnimation className={className} key={index}>
              {letter === " " ? "\u00A0" : letter}
            </RubberAnimation>
          );
        })
      )} */}
    </>
  );
};
