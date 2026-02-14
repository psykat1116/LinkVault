import React from "react";
import { Switch } from "../ui/switch";

interface ToggleProps {
  label: string;
  value: boolean;
  disabled: boolean;
  description1: string;
  description2: string;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toggle = ({
  label,
  value,
  disabled,
  setValue,
  description1,
  description2,
}: ToggleProps) => {
  return (
    <div className="p-4 border border-border flex justify-between items-center rounded-md bg-card shadow">
      <div className="space-y-4">
        <label className="text-sm font-semibold">{label}</label>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {value ? description1 : description2}
          </p>
        </div>
      </div>
      <Switch disabled={disabled} checked={value} onCheckedChange={setValue} />
    </div>
  );
};

export default Toggle;
