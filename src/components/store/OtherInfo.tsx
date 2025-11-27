import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import ReactSwitch from "react-switch";
import { UpdateStoreRequest } from "@/api/models";
import { colors } from "@/styles";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Props {
  store?: UpdateStoreRequest;
  setStore: Dispatch<SetStateAction<UpdateStoreRequest | undefined>>;
}

export const OtherInfo = ({ store, setStore }: Props) => {
  const handleChange = (key: keyof UpdateStoreRequest, value: any) => {
    setStore((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <>
      <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] px-[12px]">
        <p className="text-gray5 text-[14px] font-semibold">공지사항</p>
        <textarea
          value={store?.notice ?? ""}
          onChange={(e) => handleChange("notice", e.target.value)}
          placeholder="공지사항 입력"
          className="max-w-[448px] h-[80px] px-[8px] py-[6px] text-[14px] border border-gray2 rounded-[6px] resize-none"
        />
      </div>

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
