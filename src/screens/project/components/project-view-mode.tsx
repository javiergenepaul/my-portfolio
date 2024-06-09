import { ToggleGroup, ToggleGroupItem } from "@/components";
import { useSettingsStore } from "@/stores";
import { Grid2X2, Grid3X3, List } from "lucide-react";

export const ProjectViewMode = () => {
  const { projectViewMode, setProjectViewMode } = useSettingsStore();
  return (
    <ToggleGroup
      className="justify-end"
      type="single"
      value={projectViewMode}
      onValueChange={setProjectViewMode}
    >
      <ToggleGroupItem value="list-mode" aria-label="Toggle List">
        <List />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid-large-mode" aria-label="Toggle Grid Large">
        <Grid2X2 />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid-small-mode" aria-label="Toggle Grid Small">
        <Grid3X3 />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
