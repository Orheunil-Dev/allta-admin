import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useOfflineTicketControllerGetOfflineTicketList } from "@/api/offline-ticket/offline-ticket";
import { OfflineTicketListItem } from "@/api/models";
import {
  formatPaymentMethod,
  formatServiceType,
  formatTicketStatus,
} from "@/utils";
import { RangeKey, SearchKey, SelectKey } from "@/types";
import { Table } from "@/components/ui/Table";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import { serviceTypeOptions, ticketStatusOptions } from "@/constants";

type SearchTerms = {
  userName?: string;
  phoneNumber?: string;
  carNumber?: string;
  storeName?: string;
  serviceType?: string;
  status?: string;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function OfflineTicketList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    userName: undefined,
    phoneNumber: undefined,
    carNumber: undefined,
    storeName: undefined,
    status: undefined,
    serviceType: undefined,
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

  // 현장권 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useOfflineTicketControllerGetOfflineTicketList({
      take: 20,
      skip: 20 * page,
      userName: searchTerms.userName,
      phoneNumber: searchTerms.phoneNumber,
      carNumber: searchTerms.carNumber,
      storeName: searchTerms.storeName,
      ...(searchTerms.serviceType !== undefined
        ? { serviceType: searchTerms.serviceType }
        : {}),
      ...(searchTerms.status !== undefined
        ? { status: searchTerms.status }
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
        key: "storeName",
        label: "매장명",
        width: "260px",
      },
      {
        key: "userName",
        label: "회원명",
        width: "120px",
      },
      {
        key: "phoneNumber",
        label: "회원 전화번호",
        width: "140px",
        maxLength: 13,
      },
      {
        key: "carNumber",
        label: "차량번호",
        width: "120px",
        maxLength: 10,
      },
    ],
    []
  );

  const rangeKeys = useMemo<RangeKey[]>(
    () => [
      {
        key: "createdAt",
        label: "결제일",
      },
    ],
    []
  );

  const selectKeys = useMemo<SelectKey[]>(
    () => [
      {
        key: "serviceType",
        label: "서비스 종류",
        options: serviceTypeOptions,
      },
      {
        key: "status",
        label: "현장권 상태",
        options: ticketStatusOptions,
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<OfflineTicketListItem>[]>(
    () => [
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
        header: "구매일",
        cell: (info: CellContext<OfflineTicketListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.store.name,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
          >
            {row.original.store.name}
          </a>
        ),
        enableSorting: false,
      },
      {
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.user?.name,
        cell: ({ row }) => {
          const user = row.original.user;

          if (!user) return "-";

          return (
            <a
              href={`/user/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer"
            >
              {user.name}
            </a>
          );
        },
        enableSorting: false,
      },
      {
        id: "userPhoneNumber",
        header: "회원 전화번호",
        accessorFn: (row) => row.user?.phoneNumber ?? "-",
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },
      {
        id: "serviceType",
        header: "서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<OfflineTicketListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "serviceOptions",
        header: "서비스 옵션",
        accessorFn: (row) => row.serviceOptions ?? "-",
        enableSorting: false,
      },
      {
        id: "paymentMethod",
        header: "결제 수단",
        accessorFn: (row) => row.paymentMethod,
        cell: (info: CellContext<OfflineTicketListItem, unknown>) =>
          formatPaymentMethod(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "status",
        header: "현장권 상태",
        accessorFn: (row) => row.status,
        cell: (info: CellContext<OfflineTicketListItem, unknown>) =>
          formatTicketStatus(info.getValue() as string),
        enableSorting: false,
      },
      // {
      //   id: "refund",
      //   header: "",
      //   cell: ({ row }) => (
      //     <button
      //       disabled={row.original.status !== "ACTIVE"}
      //       onClick={handleOpenRefundModal(row.original)}
      //       className={`px-[8px] py-[5px] bg-[#FEF1F1] text-red text-[13px] font-semibold rounded-[6px] cursor-pointer
      //         ${row.original.status === "ACTIVE" ? "text-red" : "text-red/30"}`}
      //     >
      //       환불하기
      //     </button>
      //   ),
      //   enableSorting: false,
      // },
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
    <>
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
          basePath="subscription"
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
    </>
  );
}
