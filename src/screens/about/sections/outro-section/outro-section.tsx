import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components";
import { Banner } from "../../components";
import { AvatarProfile } from "@/assets";
import { translate } from "@/i18n";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/config";

export const OutroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pb-16">
      <Banner />
      <div className="flex justify-center py-16 pb-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-[250px] w-[250px]">
            <AvatarImage
              className="rounded-full border-primary border-4"
              src={AvatarProfile}
            />
            <AvatarFallback>{translate("header.shortName")}</AvatarFallback>
          </Avatar>
          <h1 className="text-5xl font-semibold">
            {translate("outro.workTogether")}
          </h1>
          <p className="text-muted-foreground text-sm max-w-[700px] text-center">
            {translate("outro.sub")}
          </p>
          <Button
            className="w-fit"
            onClick={() => {
              navigate(PATH.CONTACTS.path);
            }}
          >
            {translate("outro.getInTouch")}
          </Button>
        </div>
      </div>
    </section>
  );
};
