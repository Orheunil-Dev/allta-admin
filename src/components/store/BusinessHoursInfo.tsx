import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import ReactSwitch from "react-switch";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { UpdateStoreRequest } from "@/api/models";
import { BusinessHours } from "@/types";
import { days } from "@/constants";
import {
  calendarNextIcon,
  calendarPrevIcon,
  checkedBox,
  blackCloseIcon,
  plusIcon,
  uncheckedBox,
} from "../../../public/images";
import { colors } from "@/styles";

dayjs.extend(isSameOrBefore);

interface Props {
  businessHours?: string | BusinessHours | null;
  breakTime?: string | null;
  holidays?: string | null;
  setStore: Dispatch<SetStateAction<UpdateStoreRequest | undefined>>;
}

export const BusinessHoursInfo = ({
  businessHours,
  breakTime,
  holidays,
  setStore,
}: Props) => {
  const [showDaypicker, setShowDaypicker] = useState<boolean>(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

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

  // 선택한 날짜 범위
  const getDateRange = (from: Date, to: Date): string[] => {
    const result: string[] = [];

    let current = dayjs(from);
    const end = dayjs(to);

    while (current.isSameOrBefore(end)) {
      result.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    return result;
  };

  // 인접한 날짜끼리 그룹
  const groupHolidays = (dates: string[]): string[][] => {
    const cleanedDates = dates.map((d) => d.trim()).sort();

    const groups: string[][] = [];
    let currentGroup: string[] = [];

    for (let i = 0; i < cleanedDates.length; i++) {
      const current = dayjs(cleanedDates[i]);
      const prev = i > 0 ? dayjs(cleanedDates[i - 1]) : null;

      if (i === 0 || (prev && current.diff(prev, "day") === 1)) {
        currentGroup.push(cleanedDates[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [cleanedDates[i]];
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  // 휴무일 추가
  const handleAddHolidays = () => {
    if (!range?.from) return;

    const from = range.from;
    const to = range.to ?? range.from;

    setStore((prev) => {
      if (!prev) return prev;

      const existing = (prev.holidays || "")
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
        .flatMap((rangeStr) => {
          const [start, end] = rangeStr.split("~").map((d) => d.trim());
          return getDateRange(new Date(start), new Date(end));
        });

      const newDates = getDateRange(new Date(from), new Date(to));
      const merged = Array.from(new Set([...existing, ...newDates])).sort();
      const grouped = groupHolidays(merged);

      const result = grouped
        .map((g) => `${g[0]} ~ ${g[g.length - 1]}`)
        .join(", ");

      return {
        ...prev,
        holidays: result,
      };
    });

    handleCloseDaypicker();
  };

  // 휴무일 삭제
  const handleDeleteHolidays = (target: string) => () => {
    setStore((prev) => {
      if (!prev) return prev;

      const list = (prev.holidays || "")
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      const updatedList = list.filter((v) => v !== target);

      return {
        ...prev,
        holidays: updatedList.join(", "),
      };
    });
  };

  const handleOpenDayPicker = () => {
    setShowDaypicker(true);
  };
  const handleCloseDaypicker = () => {
    setRange(undefined);
    setShowDaypicker(false);
  };

  return (
    <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] px-[12px] gap-y-[24px]">
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

      {/* 휴무일 */}
      <p className="text-gray5 text-[14px] font-semibold">휴무일</p>

      {/* 캘린더 */}
      <div className="relative flex flex-col">
        {showDaypicker && (
          <div
            className="absolute flex flex-col top-0 px-[16px] py-[12px] bg-white rounded-[12px] z-[4]"
            style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              navLayout="around"
              locale={ko}
              className="custom-daypicker"
              classNames={{
                selected: "text-[14px]",
              }}
              components={{
                CaptionLabel: ({ children }) => {
                  const text = children?.toString() || "";
                  const [month, year] = text.split(" ");

                  return (
                    <p className="text-[16px] font-semibold">
                      {year} {month}
                    </p>
                  );
                },
                Chevron: ({ orientation, ...props }) => {
                  if (orientation === "right") {
                    return (
                      <Image
                        src={calendarNextIcon}
                        alt="다음 달"
                        className="w-[20px] h-[20px]"
                      />
                    );
                  } else if (orientation === "left") {
                    return (
                      <Image
                        src={calendarPrevIcon}
                        alt="다음 달"
                        className="w-[20px] h-[20px]"
                      />
                    );
                  }

                  return <div />;
                },
              }}
            />

            <div className="flex self-end gap-x-[12px]">
              <button
                type="button"
                onClick={handleCloseDaypicker}
                className="w-[84px] h-[44px] bg-white border border-gray2 rounded-[8px] cursor-pointer"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleAddHolidays}
                className="w-[84px] h-[44px] bg-main text-white rounded-[8px] cursor-pointer"
              >
                추가
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleOpenDayPicker}
          className="flex items-center w-fit cursor-pointer"
        >
          <Image
            src={plusIcon}
            alt="휴무일 추가"
            className="w-[20px] h-[20px]"
          />
          <p className="ml-[5px] text-[14px]">휴무일 추가</p>
        </button>

        <div className="flex flex-col mt-[12px] gap-y-[8px]">
          {holidays &&
            holidays.split(",").map((value, index) => (
              <div className="flex items-center w-fit">
                <div className="px-[12px] py-[6px] border border-gray2 rounded-[6px]">
                  {value}
                </div>

                <button
                  onClick={handleDeleteHolidays(value)}
                  className="ml-[10px] cursor-pointer"
                >
                  <Image
                    src={blackCloseIcon}
                    alt="삭제"
                    className="w-[20px] h-[20px]"
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
