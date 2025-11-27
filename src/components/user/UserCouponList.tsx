import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCouponControllerGetCouponList } from "@/api/coupon/coupon";
import { CouponListItem } from "@/api/models";
import {
  formatCouponType,
  formatDiscountValue,
  formatPassType,
  formatServiceType,
} from "@/utils";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import Image from "next/image";
import { plusIcon } from "../../../public/images";

interface Props {
  userId: string;
}

export const UserCouponList = ({ userId }: Props) => {
  const [page, setPage] = useState<number>(0);

  // 쿠폰 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useCouponControllerGetCouponList({
      take: 10,
      skip: 10 * page,
      userId,
    });

  const columns = useMemo<ColumnDef<CouponListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "발급일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<CouponListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "name",
        header: "쿠폰명",
        accessorFn: (row) => row.name,
        enableSorting: false,
      },
      {
        id: "type",
        header: "쿠폰 종류",
        accessorFn: (row) => row.type,
        cell: (info: CellContext<CouponListItem, unknown>) =>
          formatCouponType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "discountValue",
        header: "할인 금액",
        cell: ({ row }) => (
          <p>
            {formatDiscountValue(
              row.original.discountType,
              row.original.discountValue
            )}
          </p>
        ),
        enableSorting: false,
      },
      {
        id: "passType",
        header: "적용 이용권",
        accessorFn: (row) => row.passType,
        cell: (info: CellContext<CouponListItem, unknown>) => {
          const value = info.getValue() as string | null;

          if (!value) return "-";

          return value
            .split(",")
            .map((v) => formatPassType(v.trim()))
            .join(", ");
        },
        enableSorting: false,
      },
      {
        id: "serviceType",
        header: "적용 서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<CouponListItem, unknown>) => {
          const value = info.getValue() as string | null;

          if (!value) return "-";

          return value
            .split(",")
            .map((v) => formatServiceType(v.trim()))
            .join(", ");
        },
        enableSorting: false,
      },
      {
        id: "status",
        header: "쿠폰 상태",
        cell: ({ row }) => {
          const { isUsed, expiredAt } = row.original;
          const now = dayjs();

          if (isUsed) {
            return <p className="text-gray5">사용 완료</p>;
          } else if (expiredAt && dayjs(expiredAt).isBefore(now)) {
            return <p className="text-gray">기간 만료</p>;
          } else {
            return <p className="text-green">사용 가능</p>;
          }
        },
        enableSorting: false,
      },
      {
        id: "expiredAt",
        header: "만료일",
        accessorFn: (row) => row.expiredAt,
        cell: (info: CellContext<CouponListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "usedAt",
        header: "사용일",
        accessorFn: (row) => row.usedAt,
        cell: (info: CellContext<CouponListItem, unknown>) =>
          info.getValue()
            ? dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm")
            : "-",
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <div
      style={{
        boxShadow:
          "0 4px 10px 2px hsla(240, 1.2987012987013031%, 15.098039215686276%, 0.04)",
      }}
      className="flex flex-col w-full mt-[32px] px-[32px] py-[20px] bg-white rounded-[20px] z-[2]"
    >
      <div className="bg-white overflow-x-auto overflow-y-hidden">
        <div className="flex justify-between mb-[16px]">
          <p className="text-[18px] font-semibold">보유 쿠폰</p>

          <button className="flex items-center px-[10px] py-[6px] text-gray7 text-[14px] bg-gray1 rounded-[6px] cursor-pointer">
            <Image
              src={plusIcon}
              alt="발급하기"
              className="w-[16px] h-[16px] mr-[4px]"
            />
            발급하기
          </button>
        </div>

        <SmallTable data={data?.data ?? []} columns={columns} />

        <Pagination
          page={page}
          setPage={setPage}
          take={10}
          totalCount={data?.meta.totalCount ?? 0}
        />
      </div>
    </div>
  );
};
