import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  useInquiryControllerGetInquiryDetail,
  useInquiryControllerRegisterInquiryAnswer,
  useInquiryControllerUpdateInquiryAnswer,
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

  // 문의 답변 등록 API
  const {
    mutate: registerInquiryAnswer,
    isPending: registerInquiryAnswerLoading,
    isError: registerInquiryAnswerError,
  } = useInquiryControllerRegisterInquiryAnswer();

  // 문의 답변 수정 API
  const {
    mutate: updateInquiryAnswer,
    isPending: updateInquiryAnswerLoading,
    isError: updateInquiryAnswerError,
  } = useInquiryControllerUpdateInquiryAnswer();

  // 문의 답변 등록
  const handleAnswerInquiry = () => {
    if (!id) return;

    registerInquiryAnswer(
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

  // 문의 답변 수정
  const handleUpdateAnswer = () => {
    if (!id) return;

    if (answer === inquiryData?.data.answer) {
      return alert("이전 답변과 동일한 내용입니다.");
    }

    updateInquiryAnswer(
      {
        data: {
          id: id as string,
          answer,
        },
      },
      {
        onSuccess: () => {
          alert("답변이 수정되었습니다.");

          return inquiryRefetch();
        },
        onError: (error: any) => {
          console.error(error);

          return alert(error.message ?? "답변 수정 중 오류가 발생했습니다.");
        },
      }
    );
  };

  useEffect(() => {
    if (inquiryData?.data.answer) {
      setAnswer(inquiryData?.data.answer);
    }
  }, [inquiryData]);

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
            <div className="px-[12px]">
              <p className="text-[16px] font-semibold">문의 내역</p>

              <div className="grid grid-cols-2 w-full mt-[16px] py-[16px] gap-x-[20px] border-b border-b-line">
                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">작성자</p>
                  <p className="text-[14px]">{inquiryData.data.userName}</p>
                </div>

                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">이메일</p>
                  <p className="text-[14px]">{inquiryData.data.email ?? "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full py-[16px] gap-x-[20px] border-b border-b-line">
                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">
                    전화번호
                  </p>
                  <p className="text-[14px]">{inquiryData.data.phoneNumber}</p>
                </div>

                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">등록일</p>
                  <p className="text-[14px]">
                    {dayjs(inquiryData.data.createdAt).format(
                      "YYYY.MM.DD hh:mm"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full py-[16px] gap-x-[20px] border-b border-b-line">
                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">
                    문의 분류
                  </p>
                  <p className="text-[14px]">{inquiryData.data.type}</p>
                </div>

                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">
                    처리 상태
                  </p>
                  <p className="text-[14px]">
                    {inquiryData.data.isAnswered ? "답변 완료" : "미답변"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full py-[16px] gap-x-[20px] border-b border-b-line">
                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">
                    문의 내용
                  </p>
                  <p className="text-[14px]">{inquiryData.data.content}</p>
                </div>

                <div />
              </div>

              <div className="grid grid-cols-2 w-full mt-[32px] py-[8px] gap-x-[20px]">
                <div className="grid grid-cols-[120px_1fr] w-auto">
                  <p className="text-gray5 text-[14px] font-semibold">
                    문의 답변
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="h-[220px] px-[8px] py-[6px] text-[14px] border border-gray2 rounded-[6px] resize-none"
                  />
                </div>

                <div />
              </div>

              {inquiryData.data.answeredAt && (
                <div className="grid grid-cols-2 w-full py-[14px] gap-x-[20px]">
                  <div className="grid grid-cols-[120px_1fr] w-auto">
                    <p className="text-gray5 text-[14px] font-semibold">
                      답변일
                    </p>
                    <p className="text-[14px]">
                      {dayjs(inquiryData.data.answeredAt).format(
                        "YYYY.MM.DD hh:mm"
                      )}
                    </p>
                  </div>

                  <div />
                </div>
              )}
            </div>
          </Callout>

          <div className="flex justify-center mt-[32px] gap-x-[20px]">
            <button
              onClick={() => router.push("/inquiry")}
              className="w-[84px] h-[44px] bg-white text-gray5 font-semibold border border-gray2 rounded-[8px] cursor-pointer"
            >
              취소
            </button>

            {inquiryData.data.isAnswered ? (
              <button
                onClick={handleUpdateAnswer}
                className="w-[84px] h-[44px] bg-main text-white font-semibold rounded-[8px] cursor-pointer"
              >
                수정
              </button>
            ) : (
              <button
                onClick={handleAnswerInquiry}
                className="w-[84px] h-[44px] bg-main text-white font-semibold rounded-[8px] cursor-pointer"
              >
                등록
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
