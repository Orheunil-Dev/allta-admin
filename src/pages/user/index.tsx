import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { RangeKey, SearchKey, SelectKey } from "@/types";
import { useUserControllerGetUserList } from "@/api/user/user";
import { Table } from "@/components/ui/Table";
import { UserListItem } from "@/api/models";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import {
  userBannedOptions,
  userDeletedOptions,
  userMarketingOptions,
} from "@/constants";

type SearchTerms = {
  name?: string;
  phoneNumber?: string;
  carNumber?: string;
  address?: string;
  isDeleted?: boolean;
  isMarketing?: boolean;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function UserList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    name: undefined,
    phoneNumber: undefined,
    carNumber: undefined,
    address: undefined,
    isDeleted: undefined,
    isMarketing: undefined,
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

  // 회원 목록 조회 API
  const { data, isLoading, isError, refetch } = useUserControllerGetUserList({
    take: 20,
    skip: 20 * page,
    name: searchTerms.name,
    phoneNumber: searchTerms.phoneNumber,
    carNumber: searchTerms.carNumber,
    address: searchTerms.address,
    ...(searchTerms.isDeleted !== undefined
      ? { isDeleted: searchTerms.isDeleted }
      : {}),
    ...(searchTerms.isMarketing !== undefined
      ? { isMarketing: searchTerms.isMarketing }
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
        key: "carNumber",
        label: "차량번호",
        width: "120px",
        maxLength: 10,
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
        label: "가입일",
      },
    ],
    []
  );

  const selectKeys = useMemo<SelectKey[]>(
    () => [
      {
        key: "isDeleted",
        label: "탈퇴 여부",
        options: userDeletedOptions,
      },
      {
        key: "isBanned",
        label: "정지 여부",
        options: userBannedOptions,
      },
      {
        key: "isMarketing",
        label: "마케팅 수신 여부",
        options: userMarketingOptions,
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        id: "name",
        header: "이름",
        accessorFn: (row) => row.name,
      },
      {
        id: "phoneNumber",
        header: "전화번호",
        accessorFn: (row) => row.phoneNumber,
        enableSorting: false,
      },
      {
        id: "mainCarNumber",
        header: "대표차량번호",
        accessorFn: (row) => row.mainCarNumber,
        enableSorting: false,
      },
      {
        id: "email",
        header: "이메일",
        accessorFn: (row) => row.email,
        enableSorting: false,
      },
      {
        id: "address",
        header: "주소",
        accessorFn: (row) => row.address,
        enableSorting: false,
      },
      {
        id: "referralCode",
        header: "추천코드",
        accessorFn: (row) => row.referralCode,
        enableSorting: false,
      },
      {
        id: "referrerCode",
        header: "등록코드",
        accessorFn: (row) => row.referrerCode,
        cell: (info: CellContext<UserListItem, unknown>) =>
          info.getValue() ?? "-",
        enableSorting: false,
      },
      {
        id: "status",
        header: "계정 상태",
        cell: ({ row }) => (
          <p
            className={`text-center text-[13px] font-semibold rounded-[6px] cursor-pointer
              ${
                row.original.isBanned
                  ? `text-red`
                  : row.original.isDeleted
                  ? `text-gray5`
                  : `text-green`
              }`}
          >
            {row.original.isBanned
              ? "정지"
              : row.original.isDeleted
              ? "탈퇴"
              : "가입"}
          </p>
        ),
        enableSorting: false,
      },
      {
        id: "createdAt",
        header: "가입일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<UserListItem, unknown>) =>
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

  // 엑셀 파일 추출
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: searchTerms.name,
            phoneNumber: searchTerms.phoneNumber,
            carNumber: searchTerms.carNumber,
            address: searchTerms.address,
            ...(searchTerms.isDeleted !== undefined
              ? { isDeleted: searchTerms.isDeleted }
              : {}),
            ...(searchTerms.isMarketing !== undefined
              ? { isMarketing: searchTerms.isMarketing }
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
      a.download = `회원목록_${dayjs().format("YYYYMMDD")}.xlsx`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
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
        basePath="user"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
        onDownload={handleDownload}
        clickable
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
