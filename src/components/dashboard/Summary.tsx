import Image from "next/image";
import { useStatControllerGetSummaryStat } from "@/api/stat/stat";
import {
  salesStatIcon,
  serviceStatIcon,
  subscriptionStatIcon,
  userStatIcon,
} from "../../../public/images";

export const Summary = () => {
  // 요약 통계 조회 API
  const {
    data: summaryStatData,
    isLoading: summaryStatLoading,
    isError: summaryStatError,
    refetch: summaryStatRefetch,
  } = useStatControllerGetSummaryStat();

  return (
    <div className="flex justify-between items-center gap-x-[24px] overflow-x-auto">
      <div className="flex flex-1 items-center min-w-[356px] h-[168px] px-[32px] bg-white rounded-[20px]">
        <div className="flex justify-center items-center w-[80px] h-[80px] bg-back4 rounded-full">
          <Image
            src={userStatIcon}
            alt="전체 가입자 수"
            className="w-[32px] h-[32px]"
          />
        </div>

        <div className="flex flex-col ml-[28px]">
          <p className="text-gray7 text-[20px] font-semibold">전체 가입자 수</p>
          <p className="text-[28px] font-semibold">
            {summaryStatData?.data.userStat.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center w- min-w-[356px] h-[168px] px-[32px] bg-white rounded-[20px]">
        <div className="flex justify-center items-center w-[80px] h-[80px] bg-back4 rounded-full">
          <Image
            src={subscriptionStatIcon}
            alt="전체 구독자 수"
            className="w-[32px] h-[32px]"
          />
        </div>

        <div className="flex flex-col ml-[28px]">
          <p className="text-gray7 text-[20px] font-semibold">전체 구독자 수</p>
          <p className="text-[28px] font-semibold">
            {summaryStatData?.data.subscriptionStat.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center w- min-w-[356px] h-[168px] px-[32px] bg-white rounded-[20px]">
        <div className="flex justify-center items-center w-[80px] h-[80px] bg-back4 rounded-full">
          <Image
            src={salesStatIcon}
            alt="누적 매출"
            className="w-[32px] h-[32px]"
          />
        </div>

        <div className="flex flex-col ml-[28px]">
          <p className="text-gray7 text-[20px] font-semibold">누적 매출</p>
          <p className="text-[28px] font-semibold">
            {summaryStatData?.data.salesStat.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center w- min-w-[356px] h-[168px] px-[32px] bg-white rounded-[20px]">
        <div className="flex justify-center items-center w-[80px] h-[80px] bg-back4 rounded-full">
          <Image
            src={serviceStatIcon}
            alt="누적 이용횟수"
            className="w-[32px] h-[32px]"
          />
        </div>

        <div className="flex flex-col ml-[28px]">
          <p className="text-gray7 text-[20px] font-semibold">누적 이용횟수</p>
          <p className="text-[28px] font-semibold">
            {summaryStatData?.data.serviceStat.toLocaleString() ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};
