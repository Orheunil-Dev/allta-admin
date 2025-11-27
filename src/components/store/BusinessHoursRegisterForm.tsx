import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import ReactSwitch from "react-switch";
import { RegisterStoreRequest } from "@/api/models";
import { BusinessHours } from "@/types";
import { days } from "@/constants";
import { checkedBox, uncheckedBox } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  businessHours?: string | BusinessHours | null;
  breakTime?: string | null;
  setStore: Dispatch<SetStateAction<RegisterStoreRequest>>;
}

export const BusinessHoursRegisterForm = ({
  businessHours,
  breakTime,
  setStore,
}: Props) => {
  const [breakStartH, breakStartM, breakEndH, breakEndM] = breakTime
    ? breakTime.split(/[:~]/)
    : ["", "", "", ""];

  // 영업일 토글
  const handleToggleBusinessHours = (day: keyof BusinessHours) => {
    setStore((prev) => {
      if (!prev) return prev;

      const hours: BusinessHours =
        typeof prev.businessHours === "string"
          ? JSON.parse(prev.businessHours)
          : (prev.businessHours as BusinessHours) || {};

      if (hours[day]) {
        delete hours[day];
      } else {
        hours[day] = { open: "09:00", close: "18:00" };
      }

      return { ...prev, businessHours: hours };
    });
  };

  // 영업일 수정
  const handleChangeBusinessHours = (
    day: keyof BusinessHours,
    field: "open" | "close",
    value: string
  ) => {
    setStore((prev) => {
      if (!prev) return prev;

      const hours: BusinessHours =
        typeof prev.businessHours === "string"
          ? JSON.parse(prev.businessHours)
          : (prev.businessHours as BusinessHours) || {};

      if (!hours[day]) hours[day] = { open: "", close: "" };
      hours[day][field] = value;

      return { ...prev, businessHours: hours };
    });
  };

  // 휴게시간 토글
  const handleToggleBreakTime = () => {
    setStore((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        breakTime: prev.breakTime ? null : "13:00~14:00",
      };
    });
  };

  return (
    <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] px-[12px] gap-y-[24px] text-[14px]">
      {/* 영업 시간 */}
      <p className="mt-[4px] text-gray5 text-[14px] font-semibold">영업 시간</p>

      <div className="flex flex-col">
        {days.map(({ value, label }) => {
          const dayKey = value as keyof BusinessHours;

          const currentHours: BusinessHours =
            typeof businessHours === "string"
              ? JSON.parse(businessHours)
              : (businessHours as BusinessHours) || {};

          const hour = currentHours[dayKey] || { open: "", close: "" };
          const isHoliday = !currentHours[dayKey];

          const [openH, openM] = hour?.open.split(":") || ["", ""];
          const [closeH, closeM] = hour?.close.split(":") || ["", ""];

          return (
            <div
              key={value}
              className="flex items-center text-[14px] mb-[12px]"
            >
              <p className="mr-[20px]">{label}</p>

              {/* 오픈 시간 */}
              <input
                value={openH || ""}
                onChange={(e) =>
                  handleChangeBusinessHours(
                    dayKey,
                    "open",
                    `${e.target.value}:${openM || "00"}`
                  )
                }
                maxLength={2}
                disabled={isHoliday}
                className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                  isHoliday && "bg-gray1"
                }`}
              />
              <p className="mx-[10px]">:</p>
              <input
                value={openM || ""}
                onChange={(e) =>
                  handleChangeBusinessHours(
                    dayKey,
                    "open",
                    `${openH || "09"}:${e.target.value}`
                  )
                }
                maxLength={2}
                disabled={isHoliday}
                className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                  isHoliday && "bg-gray1"
                }`}
              />

              <p className="mx-[12px]">~</p>

              {/* 종료 시간 */}
              <input
                value={closeH || ""}
                onChange={(e) =>
                  handleChangeBusinessHours(
                    dayKey,
                    "close",
                    `${e.target.value}:${closeM || "00"}`
                  )
                }
                maxLength={2}
                disabled={isHoliday}
                className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                  isHoliday && "bg-gray1"
                }`}
              />
              <p className="mx-[10px]">:</p>
              <input
                value={closeM || ""}
                onChange={(e) =>
                  handleChangeBusinessHours(
                    dayKey,
                    "close",
                    `${closeH || "18"}:${e.target.value}`
                  )
                }
                maxLength={2}
                disabled={isHoliday}
                className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                  isHoliday && "bg-gray1"
                }`}
              />

              <button
                type="button"
                onClick={() => handleToggleBusinessHours(dayKey)}
              >
                <Image
                  src={isHoliday ? checkedBox : uncheckedBox}
                  alt="휴무"
                  unoptimized
                  className="w-[16px] h-[16px] ml-[20px] cursor-pointer"
                />
              </button>
              <p className="ml-[6px]">휴무</p>
            </div>
          );
        })}
      </div>

      {/* 휴게 시간 */}
      <p className="text-gray5 text-[14px] font-semibold">휴게 시간</p>

      <div className="flex flex-col">
        <ReactSwitch
          onChange={handleToggleBreakTime}
          checked={!!breakTime}
          onColor={colors.main}
          checkedIcon={false}
          offColor={colors.gray2}
          uncheckedIcon={false}
        />

        {breakTime && (
          <div className="flex items-center mt-[12px] text-[14px]">
            {/* 시작 시간 */}
            <input
              value={breakStartH}
              onChange={(e) => {
                const newStartH = e.target.value;
                const [_, startM, endH, endM] = breakTime?.split(/[:~]/) || [
                  "",
                  "",
                  "",
                  "",
                ];
                setStore((prev) =>
                  prev
                    ? {
                        ...prev,
                        breakTime: `${newStartH}:${startM}~${endH}:${endM}`,
                      }
                    : prev
                );
              }}
              disabled={!breakTime}
              maxLength={2}
              className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                !breakTime && "bg-gray1"
              }`}
            />
            <p className="mx-[10px]">:</p>
            <input
              value={breakStartM}
              onChange={(e) => {
                const newStartM = e.target.value;
                const [startH, _, endH, endM] = breakTime?.split(/[:~]/) || [
                  "",
                  "",
                  "",
                  "",
                ];
                setStore((prev) =>
                  prev
                    ? {
                        ...prev,
                        breakTime: `${startH}:${newStartM}~${endH}:${endM}`,
                      }
                    : prev
                );
              }}
              disabled={!breakTime}
              maxLength={2}
              className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                !breakTime && "bg-gray1"
              }`}
            />

            <p className="mx-[12px]">~</p>

            {/* 종료 시간 */}
            <input
              value={breakEndH}
              onChange={(e) => {
                const newEndH = e.target.value;
                const [startH, startM, _, endM] = breakTime?.split(/[:~]/) || [
                  "",
                  "",
                  "",
                  "",
                ];
                setStore((prev) =>
                  prev
                    ? {
                        ...prev,
                        breakTime: `${startH}:${startM}~${newEndH}:${endM}`,
                      }
                    : prev
                );
              }}
              disabled={!breakTime}
              maxLength={2}
              className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                !breakTime && "bg-gray1"
              }`}
            />

            <p className="mx-[10px]">:</p>

            <input
              value={breakEndM}
              onChange={(e) => {
                const newEndM = e.target.value;
                const [startH, startM, endH, _] = breakTime?.split(/[:~]/) || [
                  "",
                  "",
                  "",
                  "",
                ];
                setStore((prev) =>
                  prev
                    ? {
                        ...prev,
                        breakTime: `${startH}:${startM}~${endH}:${newEndM}`,
                      }
                    : prev
                );
              }}
              disabled={!breakTime}
              maxLength={2}
              className={`w-[40px] h-[30px] text-center border border-gray2 rounded-[6px] ${
                !breakTime && "bg-gray1"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
