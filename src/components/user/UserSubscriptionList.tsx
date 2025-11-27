import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSubscriptionControllerGetSubscriptionSnapshotList } from "@/api/subscription/subscription";
import { SubscriptionSnapshotListItem } from "@/api/models";
import {
  formatPassType,
  formatServiceType,
  formatSubscriptionStatus,
} from "@/utils";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { SubscriptionRefundModal } from "../subscription";

interface Props {
  userId: string;
}

export const UserSubscriptionList = ({ userId }: Props) => {
  const [page, setPage] = useState<number>(0);
  const [selectedSubscriptionSnapshot, setSelectedSubscriptionSnapshot] =
    useState<SubscriptionSnapshotListItem | null>(null);

  // 구독권 스냅샷 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useSubscriptionControllerGetSubscriptionSnapshotList({
      take: 10,
      skip: 10 * page,
      userId,
    });

  const columns = useMemo<ColumnDef<SubscriptionSnapshotListItem>[]>(
    () => [
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
        header: "구매일",
        cell: (info: CellContext<SubscriptionSnapshotListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "type",
        header: "구독권",
        accessorFn: (row) => row.type,
        cell: (info: CellContext<SubscriptionSnapshotListItem, unknown>) =>
          formatPassType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.subscription.store.name,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.subscription.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
          >
            {row.original.subscription.store.name}
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
        cell: (info: CellContext<SubscriptionSnapshotListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "usage",
        header: "이용 횟수",
        accessorFn: (row) => row.usage,
        cell: (info: CellContext<SubscriptionSnapshotListItem, unknown>) => {
          const row = info.row.original;
          const usage = info.getValue() as number;

          if (row.maxUsage) {
            return `${usage}/${row.maxUsage}회`;
          } else {
            return `${usage}회`;
          }
        },
        enableSorting: false,
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: "구독권 상태",
        cell: (info: CellContext<SubscriptionSnapshotListItem, unknown>) =>
          formatSubscriptionStatus(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "refund",
        header: "",
        cell: ({ row }) => (
          <button
            disabled={
              !(
                row.original.status === "ACTIVE" ||
                row.original.status === "DISCONTINUED"
              )
            }
            onClick={handleOpenRefundModal(row.original)}
            className={`px-[8px] py-[5px] bg-[#FEF1F1] text-red text-[13px] font-semibold rounded-[6px] cursor-pointer
                ${
                  row.original.status === "ACTIVE" ||
                  row.original.status === "DISCONTINUED"
                    ? "text-red"
                    : "text-red/30"
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

  const handleOpenRefundModal =
    (subscriptionSnapshot: SubscriptionSnapshotListItem) => () => {
      setSelectedSubscriptionSnapshot(subscriptionSnapshot);
    };

  const handleCloseRefundModal = () => {
    setSelectedSubscriptionSnapshot(null);
  };

  return (
    <>
      {/* 환불 모달 */}
      <SubscriptionRefundModal
        visible={!!selectedSubscriptionSnapshot}
        subscriptionSnapshot={selectedSubscriptionSnapshot}
        onClose={handleCloseRefundModal}
        refetch={refetch}
      />

      {/* 구독권 목록 */}
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
