import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import { formatPassType, formatServiceType } from "@/utils";
import { RangeKey, SearchKey } from "@/types";
import { ServiceCancelModal } from "@/components/service-history";
import { Table } from "@/components/ui/Table";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";

type SearchTerms = {
  userName?: string;
  phoneNumber?: string;
  carNumber?: string;
  storeName?: string;
  productType?: string;
  serviceType?: string;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function ServiceHistory() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    userName: undefined,
    phoneNumber: undefined,
    carNumber: undefined,
    storeName: undefined,
    productType: undefined,
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
  const [selectedServiceHistory, SetselectedServiceHistory] =
    useState<ServiceHistoryListItem | null>(null);

  // 이용내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useServiceHistoryControllerGetServiceHistoryList({
      take: 20,
      skip: 20 * page,
      userName: searchTerms.userName,
      phoneNumber: searchTerms.phoneNumber,
      carNumber: searchTerms.carNumber,
      storeName: searchTerms.storeName,
      ...(searchTerms.productType !== undefined
        ? { productType: searchTerms.productType }
        : {}),
      ...(searchTerms.serviceType !== undefined
        ? { serviceType: searchTerms.serviceType }
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
        label: "가입일",
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<ServiceHistoryListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "이용일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "passType",
        header: "이용권",
        accessorFn: (row) => row.passType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatPassType(info.getValue() as string),
        enableSorting: false,
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
        id: "serviceType",
        header: "서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.user?.name,
        cell: ({ row }) =>
          row.original.user ? (
            <a
              href={`/user/${row.original.user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer"
            >
              {row.original.user.name}
            </a>
          ) : (
            "-"
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
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },
      {
        id: "cancel",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={handleOpenCancelModal(row.original)}
            className={`px-[8px] py-[5px] bg-[#FEF1F1] text-red rounded-[6px] cursor-pointer`}
          >
            취소하기
          </button>
        ),
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

  // 엑셀 파일 추출
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-history/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            storeName: searchTerms.storeName,
            userName: searchTerms.userName,
            phoneNumber: searchTerms.phoneNumber,
            carNumber: searchTerms.carNumber,
            ...(searchTerms.productType !== undefined
              ? { productType: searchTerms.productType }
              : {}),
            ...(searchTerms.serviceType !== undefined
              ? { serviceType: searchTerms.serviceType }
              : {}),
            ...(rangeFilter.key &&
              rangeFilter.gte &&
              rangeFilter.lte && {
                [rangeFilter.key]: `${rangeFilter.gte} ~ ${rangeFilter.lte}`,
              }),
            sortBy: sorting[0]?.id ?? undefined,
            sortOrder: sorting[0]?.desc ? "desc" : "asc",
          }),
        }
      );

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `이용내역목록_${dayjs().format("YYYYMMDD")}.xlsx`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleOpenCancelModal =
    (serviceHistory: ServiceHistoryListItem) => () => {
      SetselectedServiceHistory(serviceHistory);
    };
  const handleCloseCancelModal = () => {
    SetselectedServiceHistory(null);
  };

  return (
    <>
      {/* 취소 모달 */}
      <ServiceCancelModal
        visible={!!selectedServiceHistory}
        serviceHistory={selectedServiceHistory}
        onClose={handleCloseCancelModal}
        refetch={refetch}
      />

      <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px]  md:p-[40px] overflow-y-auto">
        {/* 검색 필터 */}
        <Filter
          searchKeys={searchKeys}
          searchTerms={draftSearchTerms}
          setSearchTerms={setDraftSearchTerms}
          rangeKeys={rangeKeys}
          rangeFilter={draftRangeFilter}
          setRangeFilter={setDraftRangeFilter}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 테이블 */}
        <Table
          basePath="payment"
          data={data?.data ?? []}
          totalCount={data?.meta.totalCount ?? 0}
          page={page}
          columns={columns}
          sorting={sorting}
          setSorting={setSorting}
          onDownload={handleDownload}
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
