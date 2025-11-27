import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCouponControllerGetCouponList } from "@/api/coupon/coupon";
import { CouponListItem } from "@/api/models";
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
  serviceType?: string;
  passType?: string;
  userName?: string;
  phoneNumber?: string;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function CouponList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    name: undefined,
    type: undefined,
    serviceType: undefined,
    passType: undefined,
    userName: undefined,
    phoneNumber: undefined,
  });
  const [draftSearchTerms, setDraftSearchTerms] =
    useState<SearchTerms>(searchTerms);
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>({
    key: "createdAt",
    gte: undefined,
    lte: undefined,
  });
  const [draftRangeFilter, setDraftRangeFilter] =
    useState<RangeFilter>(rangeFilter);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // 발급된 쿠폰 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useCouponControllerGetCouponList({
      take: 20,
      skip: 20 * page,
      name: searchTerms.name,
      userName: searchTerms.userName,
      phoneNumber: searchTerms.phoneNumber,
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
      ...(rangeFilter.key &&
        rangeFilter.gte &&
        rangeFilter.lte && {
          [rangeFilter.key]: `${rangeFilter.gte} ~ ${rangeFilter.lte}`,
        }),
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
      {
        key: "userName",
        label: "회원명",
        width: "120px",
      },
      {
        key: "phoneNumber",
        label: "전화번호",
        width: "140px",
        maxLength: 13,
      },
    ],
    []
  );

  const rangeKeys = useMemo<RangeKey[]>(
    () => [
      {
        key: "createdAt",
        label: "발급일",
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
        label: "적용 이용권",
        options: passTypeOptions,
      },
      {
        key: "serviceType",
        label: "적용 서비스",
        options: serviceTypeOptions,
      },
    ],
    []
  );

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
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.user?.name,
        cell: ({ row }) => (
          <a
            href={`/user/${row.original.user.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
          >
            {row.original.user.name}
          </a>
        ),
        enableSorting: false,
      },
      {
        id: "userPhoneNumber",
        header: "회원 전화번호",
        accessorFn: (row) => row.user?.phoneNumber,
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

  // 필터 적용
  const handleSearch = () => {
    setSearchTerms(draftSearchTerms);
    setRangeFilter(draftRangeFilter);
    setPage(0);
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
        basePath="coupon"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
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
