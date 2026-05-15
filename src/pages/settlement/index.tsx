import { useMemo, useState } from "react";
import Select from "react-select";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  useSettlementControllerCompleteSettlement,
  useSettlementControllerGetSettlementList,
} from "@/api/settlement/settlement";
import { SettlementListItem } from "@/api/models";
import { SelectOption } from "@/types";
import { Table } from "@/components/ui/Table";
import { Callout } from "@/components/ui/Callout";
import { tableSelectStyles } from "@/styles";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export default function Settlement() {
  const availableUntil = useMemo(() => dayjs().subtract(1, "month"), []);
  const [draftYear, setDraftYear] = useState<number>(availableUntil.year());
  const [selectedYear, setSelectedYear] = useState<number>(
    availableUntil.year(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    availableUntil.month() + 1,
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "isSettled", desc: false },
  ]);

  const period = useMemo(
    () =>
      dayjs()
        .year(selectedYear)
        .month(selectedMonth - 1)
        .date(1)
        .format("YYYY-MM"),
    [selectedMonth, selectedYear],
  );

  const yearOptions = useMemo<SelectOption[]>(() => {
    const currentYear = dayjs().year();

    return Array.from({ length: 6 }, (_, index) => {
      const year = currentYear - index;

      return {
        label: `${year}년`,
        value: String(year),
      };
    });
  }, []);

  // 정산 내역 목록 조회 API
  const { data, refetch } = useSettlementControllerGetSettlementList({
    period,
  });

  // 정산 완료 API
  const { mutate: completeSettlement, isPending: completeSettlementLoading } =
    useSettlementControllerCompleteSettlement();

  const handleChangeYear = (option: SelectOption | null) => {
    if (!option) return;

    setDraftYear(Number(option.value));
  };

  const handleClickMonth = (month: number) => () => {
    if (isMonthDisabled(month)) return;

    setSelectedYear(draftYear);
    setSelectedMonth(month);
  };

  const isMonthDisabled = (month: number) => {
    return (
      draftYear > availableUntil.year() ||
      (draftYear === availableUntil.year() &&
        month > availableUntil.month() + 1)
    );
  };

  const handleCompleteSettlement = (settlement: SettlementListItem) => () => {
    if (completeSettlementLoading || settlement.isSettled) return;

    const result = window.confirm(
      `${settlement.store.name}의 ${dayjs(period).format(
        "YYYY년 M월",
      )} 정산을 완료 처리하시겠습니까?`,
    );

    if (!result) return;

    completeSettlement(
      {
        data: {
          id: settlement.id,
        },
      },
      {
        onSuccess: () => {
          refetch();

          return alert("정산 처리가 완료되었습니다.");
        },
        onError: (error: any) => {
          return alert(error.message ?? "정산 처리 중 오류가 발생했습니다.");
        },
      },
    );
  };

  const columns = useMemo<ColumnDef<SettlementListItem>[]>(
    () => [
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.store.name,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline cursor-pointer"
          >
            {row.original.store.name}
          </a>
        ),
        enableSorting: false,
      },
      {
        id: "totalAmount",
        header: "총 금액",
        accessorFn: (row) => row.totalAmount,
        cell: (info: CellContext<SettlementListItem, unknown>) =>
          `${(info.getValue() as number).toLocaleString()}원`,
        enableSorting: false,
      },
      {
        id: "commissionRate",
        header: "수수료율",
        accessorFn: (row) => row.commissionRate,
        cell: (info: CellContext<SettlementListItem, unknown>) =>
          `${info.getValue()}%`,
        enableSorting: false,
      },
      {
        id: "bankName",
        header: "은행",
        accessorFn: (row) => row.bankName,
        enableSorting: false,
      },
      {
        id: "accountNumber",
        header: "계좌번호",
        accessorFn: (row) => row.accountNumber,
        enableSorting: false,
      },
      {
        id: "accountHolder",
        header: "예금주",
        accessorFn: (row) => row.accountHolder,
        enableSorting: false,
      },
      {
        id: "settledAt",
        header: "정산일",
        accessorFn: (row) => row.settledAt,
        cell: (info: CellContext<SettlementListItem, unknown>) => {
          const settledAt = info.getValue() as string | null | undefined;

          return settledAt ? dayjs(settledAt).format("YYYY.MM.DD HH:mm") : "-";
        },
        enableSorting: false,
      },
      {
        id: "isSettled",
        header: "정산 여부",
        accessorFn: (row) => (row.isSettled ? "완료" : "대기"),
        cell: ({ row }) => (
          <span
            className={`font-semibold ${
              row.original.isSettled ? "text-green" : "text-gray5"
            }`}
          >
            {row.original.isSettled ? "완료" : "대기"}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "action",
        header: "정산 처리",
        accessorFn: (row) => row.id,
        cell: ({ row }) => (
          <button
            onClick={handleCompleteSettlement(row.original)}
            disabled={row.original.isSettled || completeSettlementLoading}
            className={`w-[76px] h-[32px] rounded-[8px] text-[13px] font-semibold ${
              row.original.isSettled
                ? "bg-gray1 text-gray5 cursor-default"
                : "bg-main text-white cursor-pointer"
            }`}
          >
            정산
          </button>
        ),
        enableSorting: false,
      },
    ],
    [completeSettlementLoading, period],
  );

  return (
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px] md:p-[40px] overflow-y-auto">
      <Callout>
        <div className="flex flex-col gap-y-[16px]">
          <div className="flex flex-col md:flex-row md:items-center gap-y-[8px] gap-x-[12px]">
            <Select<SelectOption>
              value={{
                label: `${draftYear}년`,
                value: String(draftYear),
              }}
              options={yearOptions}
              onChange={handleChangeYear}
              isSearchable={false}
              styles={tableSelectStyles}
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-[8px]">
            {MONTHS.map((month) => {
              const disabled = isMonthDisabled(month);
              const selected =
                selectedYear === draftYear && selectedMonth === month;

              return (
                <button
                  key={month}
                  type="button"
                  onClick={handleClickMonth(month)}
                  disabled={disabled}
                  className={`h-[42px] rounded-[8px] text-[14px] font-semibold ${
                    selected
                      ? "bg-main text-white"
                      : disabled
                        ? "bg-gray1 text-gray4 cursor-default"
                        : "bg-white border-[1px] border-gray2 text-gray7 cursor-pointer hover:bg-[#F2F2FD]"
                  }`}
                >
                  {month}월
                </button>
              );
            })}
          </div>
        </div>
      </Callout>

      <Table
        basePath="settlement"
        data={data?.data ?? []}
        totalCount={data?.data.length ?? 0}
        page={0}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
