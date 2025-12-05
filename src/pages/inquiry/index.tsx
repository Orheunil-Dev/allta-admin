import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useInquiryControllerGetInquiryList } from "@/api/inquiry/inquiry";
import { InquiryListItem } from "@/api/models";
import { RangeKey, SearchKey, SelectKey } from "@/types";
import { Table } from "@/components/ui/Table";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import { inquiryAnsweredOptions } from "@/constants";

type SearchTerms = {
  content?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  isAnswered?: boolean;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function InquiryList() {
  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    content: undefined,
    userName: undefined,
    phoneNumber: undefined,
    email: undefined,
    isAnswered: undefined,
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

  // 문의 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useInquiryControllerGetInquiryList({
      take: 20,
      skip: 20 * page,
      content: searchTerms.content,
      userName: searchTerms.userName,
      phoneNumber: searchTerms.phoneNumber,
      email: searchTerms.email,
      isAnswered: searchTerms.isAnswered,
      ...(rangeFilter.key &&
        (rangeFilter.gte || rangeFilter.lte) && {
          [rangeFilter.key]:
            rangeFilter.gte && rangeFilter.lte
              ? `${rangeFilter.gte} ~ ${rangeFilter.lte}`
              : rangeFilter.gte
              ? `${rangeFilter.gte} ~`
              : `~ ${rangeFilter.lte}`,
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
        key: "content",
        label: "내용",
        width: "240px",
      },
      {
        key: "userName",
        label: "회원명",
        width: "120px",
      },
      // {
      //   key: "phoneNumber",
      //   label: "전화번호",
      //   width: "140px",
      //   maxLength: 13,
      // },
      {
        key: "email",
        label: "이메일",
        width: "140px",
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
        key: "isAnswered",
        label: "답변 여부",
        options: inquiryAnsweredOptions,
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<InquiryListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "등록일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<InquiryListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "content",
        header: "내용",
        accessorFn: (row) => row.content,
        cell: (info: CellContext<InquiryListItem, unknown>) => {
          const text = info.getValue() as string;
          return text.length > 10 ? text.slice(0, 20) + "..." : text;
        },
        enableSorting: false,
      },
      {
        id: "userName",
        header: "이름",
        accessorFn: (row) => row.userName,
        enableSorting: false,
      },
      {
        id: "phoneNumber",
        header: "전화번호",
        accessorFn: (row) => row.phoneNumber,
        enableSorting: false,
      },
      {
        id: "email",
        header: "이메일",
        accessorFn: (row) => row.email,
        enableSorting: false,
      },
      {
        id: "isAnswered",
        header: "답변 여부",
        cell: ({ row }) => (
          <p
            className={`text-[13px] font-semibold rounded-[6px] cursor-pointer
              ${row.original.isAnswered ? `text-green` : `text-gray5`}`}
          >
            {row.original.isAnswered ? "답변 완료" : "미답변"}
          </p>
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
        basePath="inquiry"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
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
