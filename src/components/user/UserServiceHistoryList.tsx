import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import { formatPassType, formatServiceType } from "@/utils";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { ServiceCancelModal } from "../service-history";

interface Props {
  userId: string;
}

export const UserServiceHistoryList = ({ userId }: Props) => {
  const [page, setPage] = useState<number>(0);
  const [selectedServiceHistory, SetselectedServiceHistory] =
    useState<ServiceHistoryListItem | null>(null);

  // 이용내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useServiceHistoryControllerGetServiceHistoryList({
      take: 10,
      skip: 10 * page,
      userId,
    });

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

      <div className="bg-white overflow-x-auto overflow-y-hidden">
        <SmallTable data={data?.data ?? []} columns={columns} />

        <Pagination
          page={page}
          setPage={setPage}
          take={10}
          totalCount={data?.meta.totalCount ?? 0}
        />
      </div>
    </>
  );
};
