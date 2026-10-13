import React from "react";
import { DhurandharLogo } from "./DhurandharLogo";

interface DhurandharWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DhurandharWordmark({
  className = "",
  size = "md",
}: DhurandharWordmarkProps) {
  return (
    <DhurandharLogo
      className={className}
      size={size}
    />
  );
}
