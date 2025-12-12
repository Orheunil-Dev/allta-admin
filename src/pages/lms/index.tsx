import { useState } from "react";
import Image from "next/image";
import { SendMarketingMessageRequest } from "@/api/models";
import { useUserControllerSendMarketingMessage } from "@/api/user/user";
import { Callout } from "@/components/ui/Callout";
import {
  activeRadioButton,
  inactiveRadioButton,
  leftTriangleIcon,
} from "../../../public/images";

export default function Lms() {
  const [isTargetMessage, setIsTargetMessage] = useState<boolean>(false);
  const [draftedPhoneNumbers, setDraftedPhoneNumbers] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [messageForm, setMessageForm] = useState<SendMarketingMessageRequest>({
    title: "",
    message: "",
  });

  // 마케팅 문자 전송 API
  const {
    mutate: sendMarketingMessage,
    isPending: sendMarketingMessageLoading,
    isError: sendMarketingMessageError,
  } = useUserControllerSendMarketingMessage();

  // 전체문자 여부 선택
  const handleIsTargetMessage = (value: boolean) => () => {
    if (value === isTargetMessage) return;

    setIsTargetMessage(value);
    setDraftedPhoneNumbers("");
    setPhoneNumbers([]);
  };

  // 전화번호 추가
  const handleSetPhoneNumbers = () => {
    const newNumbers = draftedPhoneNumbers
      .split(/\r?\n/) // 줄바꿈 기준 분리
      .map((n) => n.trim()) // 공백 제거
      .filter((n) => n !== ""); // 빈 줄 제거

    const merged = [...phoneNumbers, ...newNumbers];

    // 중복 제거
    const unique = merged.filter((n, i, arr) => arr.indexOf(n) === i);

    setPhoneNumbers(unique);
    setDraftedPhoneNumbers("");
  };

  // 전화번호 제거
  const handleDeletePhoneNumber = (phoneNumber: string) => () => {
    setPhoneNumbers((prev) => prev.filter((n) => n !== phoneNumber));
  };

  // 문자 전송
  const handleSubmit = () => {
    if (sendMarketingMessageLoading) return;

    const result = window.confirm(
      isTargetMessage
        ? `${phoneNumbers.length}명을 대상으로 마케팅 문자를 전송하시겠습니까?`
        : "전체 회원을 대상으로 마케팅 문자를 전송하시겠습니까?"
    );

    if (result) {
      // 확인 눌렀을 때
      sendMarketingMessage(
        {
          data: {
            title: messageForm.title,
            message: messageForm.message,
            ...(isTargetMessage && phoneNumbers),
          },
        },
        {
          onSuccess: () => {
            setMessageForm({ title: "", message: "" });
            setDraftedPhoneNumbers("");
            setPhoneNumbers([]);

            return alert("문자가 전송되었습니다.");
          },
          onError: (error: any) => {
            return alert(error.message ?? "문자 전송 중 오류가 발생했습니다");
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-full p-[40px] overflow-y-auto">
      <Callout>
        <p className="text-[16px] font-semibold">문자 작성</p>

        <div className="flex w-full mt-[16px] overflow-x-auto">
          <div className="flex flex-col flex-shrink-0 items-center w-[332px] h-[556px] mr-[40px] pt-[10px] pb-[32px] px-[10px] border border-gray2 rounded-[20px]">
            <div className="flex items-center">
              <div className="w-[32px] h-[3px] bg-gray2 rounded-[40px]" />
              <div className="w-[4px] h-[4px] ml-[8px] bg-gray2 rounded-[50px]" />
            </div>

            <div className="flex flex-col w-full h-full mt-[12px] pt-[24px] px-[12px] pb-[10px] bg-gray8 rounded-[12px]">
              <div className="w-[240px] min-h-[120px] p-[10px] text-[12px] bg-gray2 rounded-[8px] break-words whitespace-pre-line">
                <p className="font-semibold">{messageForm.title}</p>
                <p>
                  {messageForm.message.trim()
                    ? `(광고)[올타] ${messageForm.message}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center w-full gap-x-[20px]">
              <button
                onClick={handleIsTargetMessage(false)}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src={
                    isTargetMessage ? inactiveRadioButton : activeRadioButton
                  }
                  alt="전체 문자"
                  className="w-[20px] h-[20px] mr-[6px]"
                />
                <p className="text-[14px]">전체 문자</p>
              </button>

              <button
                onClick={handleIsTargetMessage(true)}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src={
                    isTargetMessage ? activeRadioButton : inactiveRadioButton
                  }
                  alt="전체 문자"
                  className="w-[20px] h-[20px] mr-[6px]"
                />
                <p className="text-[14px]">개인 문자</p>
              </button>
            </div>

            <div className="flex h-full mt-[20px]">
              <div className="flex flex-col flex-shrink-0 items-center w-[342px] mr-[40px]">
                <input
                  value={messageForm.title}
                  onChange={(e) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="문자 제목을 입력해주세요."
                  className="w-full h-[36px] px-[12px] text-[14px] border border-gray2 rounded-[8px] resize-none"
                />

                <textarea
                  value={messageForm.message}
                  onChange={(e) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder={
                    "문자 내용을 입력하세요.\n* 90byte 초과시 장문문자로 자동전환됩니다."
                  }
                  className="flex-1 w-full mt-[6px] px-[12px] py-[8px] text-[14px] border border-gray2 rounded-[8px] resize-none"
                />

                <div className="w-full mt-[12px] px-[10px] py-[12px] text-[12px] bg-gray1 border border-gray2 rounded-[6px]">
                  <p>
                    • 가로 기준 최대 640px (640보다 크면 자동 조정되어 발송)
                  </p>
                  <p>• 용량 : 900KB 이하</p>
                  <p>• JPG, PNG 형식</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={
                    !messageForm.title.trim() ||
                    !messageForm.message.trim() ||
                    sendMarketingMessageLoading
                  }
                  className={`justify-center items-center w-full mt-[12px] px-[28px] py-[10px] text-[16px] font-semibold rounded-[8px]
                  ${
                    messageForm.message.trim() && messageForm.title.trim()
                      ? "text-white bg-main cursor-pointer"
                      : "text-gray5 bg-gray2 cursor-default"
                  }
                `}
                >
                  전송하기
                </button>
              </div>

              {isTargetMessage && (
                <>
                  <div className="flex flex-col flex-shrink-0 items-center w-[306px]">
                    <div className="flex justify-center items-center w-full h-[36px] px-[12px] border border-gray2 rounded-[8px] resize-none">
                      <p className="text-[14px]">
                        전체 발송 수 :{" "}
                        <strong className="text-main">
                          {phoneNumbers.length}
                        </strong>{" "}
                        명
                      </p>
                    </div>

                    <div className="flex flex-col flex-1 w-full mt-[6px] px-[12px] py-[8px] border border-gray2 rounded-[8px] overflow-y-auto">
                      {phoneNumbers.map((value, index) => (
                        <div key={index} className="flex">
                          <p className="text-[14px]">{value}</p>
                          <button
                            onClick={handleDeletePhoneNumber(value)}
                            className="ml-[8px] text-[14px] cursor-pointer"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setPhoneNumbers([])}
                      className="self-end mt-[12px] px-[10px] py-[6px] text-gray5 text-[14px] font-semibold border border-gray2 rounded-[6px] cursor-pointer"
                    >
                      전체삭제
                    </button>
                  </div>

                  <button
                    onClick={handleSetPhoneNumbers}
                    className="flex flex-col justify-center items-center self-center px-[10px] py-[4px] mx-[20px] bg-main rounded-[6px] cursor-pointer"
                  >
                    <Image
                      src={leftTriangleIcon}
                      alt="추가"
                      className="w-[16px] h-[16px]"
                    />
                    <p className="text-white text-[14px] font-semibold">추가</p>
                  </button>

                  <div className="flex flex-col flex-shrink-0 items-center w-[306px]">
                    <textarea
                      value={draftedPhoneNumbers}
                      onChange={(e) => setDraftedPhoneNumbers(e.target.value)}
                      placeholder={
                        "휴대폰 번호를 입력하거나 복사/붙여넣어주세요.\n* 중복된 휴대폰 번호는 1건만 전송됩니다."
                      }
                      className="flex-1 w-full px-[12px] py-[8px] text-[14px] border border-gray2 rounded-[8px] whitespace-pre-line resize-none"
                    />

                    <button
                      onClick={() => setDraftedPhoneNumbers("")}
                      className="self-end mt-[12px] px-[10px] py-[6px] text-gray5 text-[14px] font-semibold border border-gray2 rounded-[6px] cursor-pointer"
                    >
                      전체삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Callout>
    </div>
  );
}
