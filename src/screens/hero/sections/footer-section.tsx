import { Button } from "@/components";

export const FooterSection = () => {
  return (
    <footer className="self-center max-w-lg py-10 text-center">
      <p className="p-2 text-sm transition-all duration-300 bg-background">
        Designed with inspiration from
        {
          <HighlightText
            text="Brittany Chiang's"
            url="https://brittanychiang.com/"
          />
        }
        layout in {<HighlightText text="Figma" url="https://www.figma.com/" />}
        and crafted with care in
        {
          <HighlightText
            text="Visual Studio Code"
            url="https://code.visualstudio.com/"
          />
        }
        by yours truly. Constructed using Vite React JS and Tailwind CSS,
        ensuring a seamless and efficient development experience.
      </p>
    </footer>
  );
};

const HighlightText = (props: { url: string; text: string }) => {
  const { url, text } = props;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="font-bold transition-all duration-300 cursor-pointer"
    >
      {" "}
      {text}{" "}
      <Button variant={"default"}>Test</Button>
    </a>
  );
};
