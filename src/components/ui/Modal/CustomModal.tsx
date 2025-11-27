import React from "react";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

export const CustomModal = ({ children, visible, onClose }: Props) => {
  if (!visible) return;

  return (
    <div
      onClick={onClose}
      className="fixed flex top-0 left-0 justify-center items-center w-screen h-screen bg-black/40 z-[99] cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-center items-center p-[24px] bg-white rounded-[20px] cursor-default"
      >
        {children}
      </div>
    </div>
  );
};
