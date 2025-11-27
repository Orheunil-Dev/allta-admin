import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTicketControllerGetTicketList } from "@/api/ticket/ticket";
import { TicketListItem } from "@/api/models";
import { formatServiceType, formatTicketStatus } from "@/utils";
import { TicketRefundModal } from "../ticket";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";

interface Props {
  userId: string;
}

export const UserTicketList = ({ userId }: Props) => {
  const [page, setPage] = useState<number>(0);
  const [selectedTicket, setSelectedTicket] = useState<TicketListItem | null>(
    null
  );

  // 이용권 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useTicketControllerGetTicketList({
      take: 10,
      skip: 10 * page,
      userId,
    });

  const columns = useMemo<ColumnDef<TicketListItem>[]>(
    () => [
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
        header: "구매일",
        cell: (info: CellContext<TicketListItem, unknown>) =>
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
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },

      {
        id: "serviceType",
        header: "서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<TicketListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },

      {
        id: "status",
        accessorFn: (row) => row.status,
        header: "일회권 상태",
        cell: (info: CellContext<TicketListItem, unknown>) =>
          formatTicketStatus(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "refund",
        header: "",
        cell: ({ row }) => (
          <button
            disabled={row.original.status !== "ACTIVE"}
            onClick={handleOpenRefundModal(row.original)}
            className={`px-[8px] py-[5px] bg-[#FEF1F1] text-red text-[13px] font-semibold rounded-[6px] cursor-pointer
                ${
                  row.original.status === "ACTIVE" ? "text-red" : "text-red/30"
                }`}
          >
            환불하기
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const handleOpenRefundModal = (ticket: TicketListItem) => () => {
    setSelectedTicket(ticket);
  };

  const handleCloseRefundModal = () => {
    setSelectedTicket(null);
  };

  return (
    <>
      {/* 환불 모달 */}
      <TicketRefundModal
        visible={!!selectedTicket}
        ticket={selectedTicket}
        onClose={handleCloseRefundModal}
        refetch={refetch}
      />

      {/* 일회권 목록 */}
      <div className="bg-white overflow-x-auto overflow-y-hidden">
        <SmallTable data={data?.data ?? []} columns={columns} />
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        take={10}
        totalCount={data?.meta.totalCount ?? 0}
      />
    </>
  );
};
