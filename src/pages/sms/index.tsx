import { SendMarketingMessageRequest } from "@/api/models";
import { useUserControllerSendMarketingMessage } from "@/api/user/user";
import { Callout } from "@/components/ui/Callout";
import { useState } from "react";

export default function MarketingSmsForm() {
  const [message, setMessage] = useState<SendMarketingMessageRequest>({
    title: "",
    message: "",
  });

  // 마케팅 문자 전송 API
  const {
    mutate: sendMarketingMessage,
    isPending: sendMarketingMessageLoading,
    isError: sendMarketingMessageError,
  } = useUserControllerSendMarketingMessage();

  const handleSubmit = () => {
    const result = window.confirm(
      "전체 회원을 대상으로 마케팅 문자를 전송하시겠습니까?"
    );

    if (result) {
      // 확인 눌렀을 때
      sendMarketingMessage({ data: { title: "", message: "" } });
    }
  };

  return (
    <div className="flex flex-col h-full p-[40px] overflow-y-auto">
      <Callout>
        <p className="text-[16px] font-semibold">문자 작성</p>

        <div className="flex mt-[16px] gap-x-[60px]">
          <div className="flex flex-col items-center w-[256px] h-[452px] pt-[10px] pb-[32px] px-[10px] border border-gray2 rounded-[20px]">
            <div className="flex items-center">
              <div className="w-[32px] h-[3px] bg-gray2 rounded-[40px]" />
              <div className="w-[4px] h-[4px] ml-[8px] bg-gray2 rounded-[50px]" />
            </div>

            <div className="flex flex-col w-full h-full mt-[12px] pt-[24px] px-[12px] pb-[10px] bg-gray8 rounded-[12px]">
              <div className="w-[171px] min-h-[100px] p-[10px] text-[12px] bg-gray2 rounded-[8px] break-words whitespace-pre-line">
                <p className="font-semibold">{message.title}</p>
                <p>
                  {message.message.trim()
                    ? `(광고)[올타] ${message.message}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center w-[288px] rounded-[20px] cursor-default">
            <input
              value={message.title}
              onChange={(e) =>
                setMessage((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="제목을 입력해주세요."
              className="w-full h-[36px] px-[12px] border border-gray2 rounded-[8px] resize-none"
            />

            <textarea
              value={message.message}
              onChange={(e) =>
                setMessage((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              placeholder="문자 내용을 입력하세요."
              className="flex-1 w-full mt-[6px] px-[12px] py-[6px] border border-gray2 rounded-[8px] resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={
                !message.title.trim() ||
                !message.message.trim() ||
                sendMarketingMessageLoading
              }
              className={`justify-center items-center w-full mt-[32px] px-[28px] py-[10px] text-[16px] font-semibold rounded-[8px]
                  ${
                    message.message.trim() && message.title.trim()
                      ? "text-white bg-main cursor-pointer"
                      : "text-gray5 bg-gray2 cursor-default"
                  }
                `}
            >
              전송하기
            </button>
          </div>
        </div>
      </Callout>
    </div>
  );
}
