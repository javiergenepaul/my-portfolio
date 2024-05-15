import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { translate } from "@/i18n";
import { IndicatorContainer } from "@/screens";
import { PROJECTS } from "@/screens/hero/sections";
import { Code, Eye } from "lucide-react";

export const ProjectTable = () => {
  return (
    <Table>
      <TableCaption>{translate("projects.table.tableHeader")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{translate("projects.table.tableRow.title")}</TableHead>
          <TableHead>{translate("projects.table.tableRow.company")}</TableHead>
          <TableHead>{translate("projects.table.tableRow.category")}</TableHead>
          <TableHead>{translate("projects.table.tableRow.type")}</TableHead>
          <TableHead>{translate("projects.table.tableRow.status")}</TableHead>
          <TableHead>{translate("projects.table.tableRow.action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((project) => (
          <TableRow
            className={
              project.type !== "confidential" && project.previewUrl
                ? "hover:cursor-pointer"
                : "hover:cursor-not-allowed"
            }
            onDoubleClick={() => {
              window.open(project.previewUrl, "_blank");
            }}
            key={project.projectId}
          >
            {/* TITLE */}
            <TableCell className="font-medium">{project.title}</TableCell>
            {/* COMPANY */}
            <TableCell>
              {project.company ? project.company : "Personal"}
            </TableCell>
            {/* CATEGORY */}
            <TableCell className="flex gap-2 flex-wrap">
              {project.category.map((category) => {
                return <Badge>{category}</Badge>;
              })}
            </TableCell>
            {/* TYPE */}
            <TableCell className="capitalize">{project.type}</TableCell>
            {/* STATUS */}
            <TableCell className="capitalize">{project.status}</TableCell>
            {/* ACTION */}
            <TableCell className="flex gap-2 w-fit">
              {project.type !== "confidential" ? (
                <>
                  {project.previewUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <IndicatorContainer>
                            <Button
                              size={"icon"}
                              onClick={() => {
                                window.open(project.previewUrl, "_blank");
                              }}
                            >
                              <Eye width="1.2rem" height="1.2rem" />
                            </Button>
                          </IndicatorContainer>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>
                            {translate("projects.indicator.demoAvailable", {
                              title: project.title,
                            })}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {project.codeUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <IndicatorContainer>
                            <Button
                              size={"icon"}
                              onClick={() => {
                                window.open(project.codeUrl, "_blank");
                              }}
                            >
                              <Code width="1.2rem" height="1.2rem" />
                            </Button>
                          </IndicatorContainer>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>
                            {translate("projects.indicator.codeAvaialble", {
                              title: project.title,
                            })}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </>
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
