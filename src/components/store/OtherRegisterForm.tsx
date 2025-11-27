import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import ReactSwitch from "react-switch";
import { RegisterStoreRequest } from "@/api/models";
import { colors } from "@/styles";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Props {
  store?: RegisterStoreRequest;
  setStore: Dispatch<SetStateAction<RegisterStoreRequest>>;
}

export const OtherRegisterForm = ({ store, setStore }: Props) => {
  const handleChange = (key: keyof RegisterStoreRequest, value: any) => {
    setStore((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <>
      <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] px-[12px]">
        <p className="text-gray5 text-[14px] font-semibold">매장소개</p>
        <ReactQuill
          theme="snow"
          value={store?.description ?? ""}
          onChange={(value) => handleChange("description", value)}
          style={{
            maxWidth: "448px",
            height: "180px",
          }}
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] w-auto mt-[60px] px-[12px]">
        <p className="text-gray5 text-[14px] font-semibold">유의사항</p>
        <ReactQuill
          theme="snow"
          value={store?.policy ?? ""}
          onChange={(value) => handleChange("policy", value)}
          style={{
            maxWidth: "448px",
            height: "180px",
          }}
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] w-auto mt-[60px] px-[12px]">
        <p className="text-gray5 text-[14px] font-semibold">앱 노출</p>
        <ReactSwitch
          checked={store?.isHidden === false}
          onChange={(checked) => handleChange("isHidden", !checked)}
          onColor={colors.main}
          checkedIcon={false}
          offColor={colors.gray2}
          uncheckedIcon={false}
        />
      </div>
    </>
  );
};
