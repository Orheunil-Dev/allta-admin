import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import dayjs from "dayjs";
import Select from "react-select";
import { useStatControllerGetUserStat } from "@/api/stat/stat";
import { UserStatItem } from "@/api/models";
import { SelectOption } from "@/types";
import { periodOptions } from "@/constants";
import { downloadIcon } from "../../../public/images";
import { periodSelectStyles } from "@/styles";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const UserChart = () => {
  const [period, setPeriod] = useState<"DAY" | "WEEK" | "MONTH">("DAY");

  // 가입자 통계 조회 API
  const {
    data: userStatData,
    isLoading: userStatLoading,
    isError: userStatError,
  } = useStatControllerGetUserStat({ period });

  // 가입자 통계 추출
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stat/user/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ period }),
        }
      );

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `가입자통계_${dayjs().format("YYYYMMDD")}.xlsx`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const chartData = useMemo(() => {
    const rawData = userStatData?.data ?? [];

    const labels = rawData.map((item: UserStatItem) => {
      const dateObj = dayjs(item.date);
      if (period === "DAY") {
        return dateObj.format("MM.DD");
      } else if (period === "WEEK") {
        const month = dateObj.month() + 1;
        const weekOfMonth = Math.ceil(dateObj.date() / 7);
        return `${month}월 ${weekOfMonth}주`;
      } else {
        return dateObj.format("YYYY-MM");
      }
    });

    const newUsers = rawData.map((item: UserStatItem) => Number(item.newUsers));
    const deletedUsers = rawData.map((item: UserStatItem) =>
      Number(item.deletedUsers)
    );
    const totalUsers = rawData.map((item: UserStatItem) =>
      Number(item.totalUsers)
    );

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "누적 회원 수",
          data: totalUsers,
          borderColor: "#6865e7",
          backgroundColor: "#6865e7",
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          yAxisID: "y",
        },
        {
          type: "bar" as const,
          label: "신규 회원 수",
          data: newUsers,
          backgroundColor: "#5F9DF7",
          borderColor: "#5F9DF7",
          borderWidth: 1,
          yAxisID: "y1",
        },
        {
          type: "bar" as const,
          label: "탈퇴 회원 수",
          data: deletedUsers,
          backgroundColor: "#DD5353",
          borderColor: "#DD5353",
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    };
  }, [userStatData, period]);

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-[540px] px-[24px] pt-[50px] pb-[40px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      {userStatError && (
        <p className="text-gray7 font-semibold">데이터 조회에 실패했습니다.</p>
      )}

      <div className="flex justify-between items-center w-full mb-[20px] gap-x-[12px]">
        <p className="text-[16px] font-semibold">가입자 통계</p>

        <div className="flex items-center gap-x-[12px]">
          <Select<SelectOption>
            options={periodOptions}
            value={periodOptions.find((option) => option.value === period)}
            onChange={(option) => {
              if (option && typeof option.value === "string") {
                setPeriod(option.value as "DAY" | "WEEK" | "MONTH");
              }
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
            isSearchable={false}
            styles={periodSelectStyles}
          />

          <button
            onClick={handleDownload}
            className="flex justify-center items-center w-[88px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
          >
            <Image
              src={downloadIcon}
              alt="다운로드"
              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[6px]"
            />
            <p className="text-[12px] md:text-[14px]">다운로드</p>
          </button>
        </div>
      </div>

      <Chart
        type="bar"
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: {
            mode: "nearest",
            intersect: false,
          },
          scales: {
            y: {
              type: "linear",
              position: "left",
              title: { display: true, text: "누적 회원 수" },
              beginAtZero: true,
            },
            y1: {
              type: "linear",
              position: "right",
              title: { display: true, text: "신규/탈퇴 회원 수" },
              beginAtZero: true,
              grid: { drawOnChartArea: false },
            },
          },
          plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
          },
        }}
      />
    </div>
  );
};
