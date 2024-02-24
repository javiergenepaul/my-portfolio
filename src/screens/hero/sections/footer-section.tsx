import { Button } from "@/components";

export const FooterSection = () => {
  return (
    <footer className="py-10 text-center max-w-lg self-center">
      <p className="text-sm p-2 bg-background transition-all duration-300">
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
      className="font-bold cursor-pointer transition-all duration-300"
    >
      {" "}
      {text}{" "}
      <Button variant={"default"}>Test</Button>
    </a>
  );
};
