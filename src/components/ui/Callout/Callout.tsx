import { colors } from "@/styles";
import { CSSProperties, ReactNode } from "react";

interface Props {
  display?: CSSProperties["display"];
  flexDirection?: CSSProperties["flexDirection"];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  margin?: CSSProperties["margin"];
  padding?: CSSProperties["padding"];
  backgroundColor?: CSSProperties["backgroundColor"];
  borderRadius?: CSSProperties["borderRadius"];
  isShadow?: boolean;
  children: ReactNode;
}

export const Callout = ({
  display = "flex",
  flexDirection = "column",
  justifyContent,
  alignItems,
  width = "100%",
  height,
  margin,
  padding = "20px",
  backgroundColor = colors.white,
  borderRadius = "20px",
  isShadow = true,
  children,
}: Props) => {
  return (
    <div
      style={{
        display,
        flexDirection,
        justifyContent,
        alignItems,
        width,
        height,
        margin,
        padding,
        backgroundColor,
        borderRadius,
        boxShadow: isShadow
          ? "0 4px 10px 2px rgba(28, 28, 44, 0.04)"
          : undefined,
      }}
    >
      {children}
    </div>
  );
};
