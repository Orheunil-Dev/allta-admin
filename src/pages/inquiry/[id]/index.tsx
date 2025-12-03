import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useUserControllerGetUserDetail } from "@/api/user/user";
import { useInquiryControllerGetInquiryDetail } from "@/api/inquiry/inquiry";

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;

  // 문의 상세 조회 API
  const {
    data: inquiryData,
    isLoading: userLoading,
    isError: userError,
  } = useInquiryControllerGetInquiryDetail(id as string, {
    query: {
      enabled: !!id,
    },
  });

  if (userError) {
    return (
      <div>
        <p>유저 조회에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-[40px]">
      {inquiryData && (
        <div
          className="w-full p-[20px] bg-white rounded-[20px]"
          style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
        >
          <p className="text-[16px] font-semibold">문의 내역</p>

          <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] gap-y-[24px]">
            <p className="text-gray5 text-[14px] font-semibold">문의자명</p>
            <p className="text-[14px]">{inquiryData.data.userName}</p>

            <p className="text-gray5 text-[14px] font-semibold">등록일</p>
            <p className="text-[14px]">
              {dayjs(inquiryData.data.createdAt).format("YYYY.MM.DD hh:mm")}
            </p>
          </div>

          <div className="w-full h-[2px] my-[16px] bg-line" />

          <div className="grid grid-cols-[120px_1fr] w-auto gap-y-[24px]">
            <p className="text-gray5 text-[14px] font-semibold">제목</p>
            <p className="text-[14px]">{inquiryData.data.title}</p>

            <p className="text-gray5 text-[14px] font-semibold">내용</p>
            <p className="text-[14px]">{inquiryData.data.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
