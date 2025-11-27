import { useUserControllerSendMarketingMessage } from "@/api/user/user";
import { useState } from "react";

export default function UserList() {
  const [message, setMessage] = useState<string>("");

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
      sendMarketingMessage({ data: { title: "", message } });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full p-[40px] overflow-y-auto">
      <div className="flex flex-col justify-center items-center w-[90%] max-w-[400px] p-[24px] bg-white rounded-[20px] cursor-default">
        <p>마케팅 문자 전송</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-[300px] mt-[20px] p-[10px] border-1 border-gray5 rounded-[8px] resize-none"
        />

        <button
          onClick={handleSubmit}
          // disabled={!message.trim() || sendMarketingMessageLoading}
          className="justify-center items-center self-center w-fit mt-[32px] px-[28px] py-[10px] text-white text-[16px] font-semibold bg-main rounded-[8px] cursor-pointer"
        >
          완료
        </button>
      </div>
    </div>
  );
}
