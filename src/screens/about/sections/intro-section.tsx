import { AboutMe, ResumeDark } from "@/assets";
import { Button } from "@/components";
import { SubTitleAnimation } from "@/screens";
import { DownloadIcon } from "@radix-ui/react-icons";

export const IntroSection = () => {
  const DownloadResumeHandler = () => {
    console.log("download resume here");
    window.open(ResumeDark, "_blank");
  };

  return (
    <div className="h-screen flex">
      <div className="basis-1/2 flex items-end pl-24">
        <img
          width={"400px"}
          height={"400px"}
          src={AboutMe}
          alt="Gene Paul Mar Javier"
        />
      </div>
      <div className="basis-1/2 flex">
        <div className="flex flex-col justify-center">
          <h3 className="font-medium text-2xl">Hello I'm</h3>
          <h1 className="text-primary text-5xl font-bold">
            Gene Paul Mar Javier
          </h1>
          <SubTitleAnimation />
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo
            pellentesque donec pretium facilisis. Adipiscing neque enim, lacus
            pretium scelerisque proin. Ultrices non gravida vitae, sed sagittis
            arcu. In quisque nulla viverra interdum ac urna auctor. Auctor enim
            leo a nisl massa. Amet cursus odio dolor congue. Eu, bibendum sed
            duis ornare id ut cras. Luctus eget mattis pharetra amet interdum
            commodo.
          </p>
          <Button
            onClick={DownloadResumeHandler}
            className="space-x-2 w-fit px-8 mt-4"
          >
            <span>Download My Resume</span>
            <DownloadIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
