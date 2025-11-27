import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useStoreControllerGetStoreList } from "@/api/store/store";
import { RangeKey, SearchKey, SelectKey } from "@/types";
import { Table } from "@/components/ui/Table";
import { StoreListItem } from "@/api/models";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import { serviceTypeOptions, userDeletedOptions } from "@/constants";

type SearchTerms = {
  name?: string;
  phoneNumber?: string;
  address?: string;
  serviceType?: string;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function StoreList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    name: undefined,
    phoneNumber: undefined,
    address: undefined,
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
    { id: "name", desc: false },
  ]);

  // 매장 목록 조회 API
  const { data, isLoading, isError, refetch } = useStoreControllerGetStoreList({
    take: 20,
    skip: 20 * page,
    name: searchTerms.name,
    phoneNumber: searchTerms.phoneNumber,
    address: searchTerms.address,
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
        key: "name",
        label: "이름",
        width: "120px",
      },
      {
        key: "phoneNumber",
        label: "전화번호",
        width: "140px",
        maxLength: 13,
      },
      {
        key: "address",
        label: "주소",
        width: "260px",
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
        key: "serviceType",
        label: "서비스 종류",
        options: serviceTypeOptions,
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<StoreListItem>[]>(
    () => [
      {
        id: "name",
        header: "매장명",
        accessorFn: (row) => row.name,
      },
      {
        id: "phoneNumber",
        header: "전화번호",
        accessorFn: (row) => row.phoneNumber,
        enableSorting: false,
      },
      {
        id: "address",
        header: "주소",
        accessorFn: (row) => row.address,
        enableSorting: false,
      },
      {
        id: "createdAt",
        header: "등록일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<StoreListItem, unknown>) =>
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
        basePath="store"
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
