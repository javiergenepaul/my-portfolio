import { cn } from "@/lib";
import { SettingsItemInterface } from "../settings";
import { buttonVariants } from "@/components";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { PATH } from "@/config";

interface SettingsSidenavInterface {
  items: SettingsItemInterface[];
  className?: string;
}

export const SettingsSidenav = (props: SettingsSidenavInterface) => {
  const { items, className } = props;
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ||
              (pathname.endsWith("/") && item.href === PATH.SETTINGS.path)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
