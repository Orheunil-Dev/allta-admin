import { ReactNode } from "react";

interface Props {
  marginTop?: string;
  children: ReactNode;
}

export const Callout = ({ marginTop, children }: Props) => {
  return (
    <div
      className="w-full p-[20px] bg-white rounded-[20px]"
      style={{ marginTop, boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      {children}
    </div>
  );
};
