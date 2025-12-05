import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  useInquiryControllerAnswerInquiry,
  useInquiryControllerGetInquiryDetail,
} from "@/api/inquiry/inquiry";
import { Callout } from "@/components/ui/Callout";

export default function InquiryDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [answer, setAnswer] = useState<string>("");

  // 문의 상세 조회 API
  const {
    data: inquiryData,
    isLoading: inquiryLoading,
    isError: inquiryError,
    refetch: inquiryRefetch,
  } = useInquiryControllerGetInquiryDetail(id as string, {
    query: {
      enabled: !!id,
    },
  });

  // 문의 답변 API
  const {
    mutate: answerInquiry,
    isPending: answerInquiryLoading,
    isError: answerInquiryError,
  } = useInquiryControllerAnswerInquiry();

  // 문의 답변 등록
  const handleAnswerInquiry = () => {
    if (!id) return;

    answerInquiry(
      {
        data: {
          id: id as string,
          answer,
        },
      },
      {
        onSuccess: () => {
          alert("답변이 등록되었습니다.");

          return inquiryRefetch();
        },
        onError: (error: any) => {
          console.error(error);

          return alert(error.message ?? "답변 등록 중 오류가 발생했습니다.");
        },
      }
    );
  };

  if (inquiryError) {
    return (
      <div>
        <p>유저 조회에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-[40px]">
      {inquiryData && (
        <div className="flex flex-col">
          <Callout>
            <p className="text-[16px] font-semibold">문의 내역</p>

            <div className="grid grid-cols-2 w-full mt-[16px] gap-y-[24px]">
              <div className="grid grid-cols-[120px_1fr] w-auto">
                <p className="text-gray5 text-[14px] font-semibold">작성자</p>
                <p className="text-[14px]">{inquiryData.data.userName}</p>
              </div>

              <div className="grid grid-cols-[120px_1fr] w-auto">
                <p className="text-gray5 text-[14px] font-semibold">전화번호</p>
                <p className="text-[14px]">{inquiryData.data.phoneNumber}</p>
              </div>

              <div className="grid grid-cols-[120px_1fr] w-auto">
                <p className="text-gray5 text-[14px] font-semibold">이메일</p>
                <p className="text-[14px]">{inquiryData.data.email ?? "-"}</p>
              </div>

              <div className="grid grid-cols-[120px_1fr] w-auto">
                <p className="text-gray5 text-[14px] font-semibold">
                  문의 분류
                </p>
                <p className="text-[14px]">{inquiryData.data.type}</p>
              </div>

              <div className="grid grid-cols-[120px_1fr] w-auto">
                <p className="text-gray5 text-[14px] font-semibold">등록일</p>
                <p className="text-[14px]">
                  {dayjs(inquiryData.data.createdAt).format("YYYY.MM.DD hh:mm")}
                </p>
              </div>
            </div>

            <div className="w-full h-[2px] my-[16px] bg-line" />

            <div className="grid grid-cols-[120px_1fr] w-auto gap-y-[24px]">
              <p className="text-gray5 text-[14px] font-semibold">내용</p>
              <p className="text-[14px]">{inquiryData.data.content}</p>
            </div>
          </Callout>

          <Callout marginTop="20px">
            <p className="text-[16px] font-semibold">문의 답변</p>

            <div>
              <textarea value={answer} />

              <button>확인</button>
            </div>
          </Callout>
        </div>
      )}
    </div>
  );
}
