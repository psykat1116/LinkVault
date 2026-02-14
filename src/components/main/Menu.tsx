import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MenuProps {
  label: string;
  value: string;
  deafultvalue: string;
  disabled: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  data: {
    value: string;
    label: string;
  }[];
}

const Menu = ({ label, value, onChange, disabled , data, deafultvalue }: MenuProps) => {
  return (
    <div className="p-4 border border-border flex items-center justify-between rounded-md bg-card shadow">
      <label className="text-sm font-semibold block">{label}</label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        defaultValue={deafultvalue}
      >
        <SelectTrigger className="bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {data.map((option) => (
            <SelectItem
              key={option.value}
              className="font-poppins"
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Menu;
