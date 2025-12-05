import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCouponControllerGetCouponInfoList } from "@/api/coupon/coupon";
import { CouponInfoListItem } from "@/api/models";
import {
  formatCouponType,
  formatDiscountValue,
  formatPassType,
  formatServiceType,
} from "@/utils";
import { RangeKey, SearchKey, SelectKey } from "@/types";
import { Table } from "@/components/ui/Table";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import {
  couponTypeOptions,
  passTypeOptions,
  serviceTypeOptions,
} from "@/constants";

type SearchTerms = {
  name?: string;
  type?: string;
  passType?: string | null;
  serviceType?: string | null;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function CouponInfoList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    name: undefined,
    type: undefined,
    passType: undefined,
    serviceType: undefined,
  });
  const [draftSearchTerms, setDraftSearchTerms] =
    useState<SearchTerms>(searchTerms);
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>({
    key: "usableAt",
    gte: undefined,
    lte: undefined,
  });
  const [draftRangeFilter, setDraftRangeFilter] =
    useState<RangeFilter>(rangeFilter);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // 등록 쿠폰 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useCouponControllerGetCouponInfoList({
      take: 20,
      skip: 20 * page,
      ...(searchTerms.name !== undefined ? { name: searchTerms.name } : {}),
      ...(searchTerms.type !== undefined ? { type: searchTerms.type } : {}),
      ...(searchTerms.passType !== undefined
        ? {
            passType:
              searchTerms.passType === null ? "null" : searchTerms.passType,
          }
        : {}),
      ...(searchTerms.serviceType !== undefined
        ? {
            serviceType:
              searchTerms.serviceType === null
                ? "null"
                : searchTerms.serviceType,
          }
        : {}),
      ...(rangeFilter.gte && { startDate: rangeFilter.gte }),
      ...(rangeFilter.lte && { endDate: rangeFilter.lte }),
      sortBy: sorting[0]?.id ?? undefined,
      sortOrder: sorting[0]?.desc
        ? "desc"
        : !sorting[0]?.desc
        ? "asc"
        : undefined,
    });

  const searchKeys = useMemo<SearchKey[]>(
    () => [
      {
        key: "name",
        label: "쿠폰명",
        width: "240px",
      },
    ],
    []
  );

  const rangeKeys = useMemo<RangeKey[]>(
    () => [
      {
        key: "createdAt",
        label: "등록일",
      },
    ],
    []
  );

  const selectKeys = useMemo<SelectKey[]>(
    () => [
      {
        key: "type",
        label: "쿠폰 종류",
        options: couponTypeOptions,
      },
      {
        key: "passType",
        label: "이용권 종류",
        options: passTypeOptions,
      },
      {
        key: "serviceType",
        label: "서비스 종류",
        options: serviceTypeOptions,
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<CouponInfoListItem>[]>(
    () => [
      { id: "name", header: "쿠폰명", accessorFn: (row) => row.name },
      {
        id: "type",
        header: "쿠폰 종류",
        accessorFn: (row) => row.type,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          formatCouponType(info.getValue() as string),
        enableSorting: false,
      },
      { id: "code", header: "등록코드", accessorFn: (row) => row.code ?? "-" },
      {
        id: "passType",
        header: "적용 이용권",
        accessorFn: (row) => row.passType,
        cell: (info: CellContext<CouponInfoListItem, unknown>) => {
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
        cell: (info: CellContext<CouponInfoListItem, unknown>) => {
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
        id: "validDays",
        header: "사용기간",
        accessorFn: (row) => row.validDays,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          (info.getValue() as string) ? info.getValue() + "일" : "-",
        enableSorting: false,
      },
      {
        id: "maxQuantity",
        header: "발급수량",
        accessorFn: (row) => row.maxQuantity,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          (info.getValue() as string) ? info.getValue() + "매" : "-",
        enableSorting: false,
      },
      {
        id: "startDate",
        header: "시작일",
        accessorFn: (row) => row.startDate,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          info.getValue()
            ? dayjs(info.getValue() as string).format("YYYY.MM.DD")
            : "-",
        enableSorting: false,
      },
      {
        id: "endDate",
        header: "종료일",
        accessorFn: (row) => row.endDate,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          info.getValue()
            ? dayjs(info.getValue() as string).format("YYYY.MM.DD")
            : "-",
        enableSorting: false,
      },
      {
        id: "createdAt",
        header: "등록일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<CouponInfoListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
    ],
    []
  );

  // 필터 적용
  const handleSearch = () => {
    setSearchTerms(draftSearchTerms);
    setRangeFilter(draftRangeFilter);
    setPage(0);

    refetch();
  };

  // 필터 초기화
  const handleReset = () => {
    setSearchTerms({});
    setDraftSearchTerms({});
    setRangeFilter({ key: "createdAt", gte: undefined, lte: undefined });
    setDraftRangeFilter({ key: "createdAt", gte: undefined, lte: undefined });
    setSorting([{ id: "createdAt", desc: true }]);
    setPage(0);
  };

  return (
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px]  md:p-[40px] overflow-y-auto">
      {/* 검색 필터 */}
      <Filter
        searchKeys={searchKeys}
        searchTerms={draftSearchTerms}
        setSearchTerms={setDraftSearchTerms}
        rangeKeys={rangeKeys}
        rangeFilter={draftRangeFilter}
        setRangeFilter={setDraftRangeFilter}
        selectKeys={selectKeys}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 테이블 */}
      <Table
        basePath="coupon-info"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
        clickable
        registrable
      />

      {/* 페이지네이션 */}
      <Pagination
        totalCount={data?.meta.totalCount ?? 0}
        take={20}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
