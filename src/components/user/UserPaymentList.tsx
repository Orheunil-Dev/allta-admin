import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { usePaymentControllerGetPaymentList } from "@/api/payment/payment";
import { PaymentListItem } from "@/api/models";
import {
  formatPaymentStatus,
  formatProductType,
  formatServiceType,
} from "@/utils";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";

interface Props {
  userId: string;
}

export const UserPaymentList = ({ userId }: Props) => {
  const [page, setPage] = useState<number>(0);

  // 결제내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    usePaymentControllerGetPaymentList({
      take: 10,
      skip: 10 * page,
      userId,
    });

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "승인일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "productType",
        header: "상품종류",
        accessorFn: (row) => row.productType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatProductType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "amount",
        header: "승인금액",
        accessorFn: (row) => row.amount,
        cell: (info: CellContext<PaymentListItem, unknown>) => {
          const row = info.row.original;
          const amount = info.getValue() as number;
          const formattedAmount = amount.toLocaleString();

          return row.status !== "APPROVED" && amount > 0
            ? `-${formattedAmount}`
            : `${formattedAmount}`;
        },
        enableSorting: false,
      },
      {
        id: "status",
        header: "결제상태",
        accessorFn: (row) => row.status,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatPaymentStatus(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.storeName,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline cursor-pointer"
          >
            {row.original.storeName}
          </a>
        ),
        enableSorting: false,
      },
      {
        id: "serviceType",
        header: "서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "userPhoneNumber",
        header: "구매자 전화번호",
        accessorFn: (row) => row.user?.phoneNumber,
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.purchase.carNumber,
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <div className="bg-white overflow-x-auto overflow-y-hidden">
      <SmallTable data={data?.data ?? []} columns={columns} />

      <Pagination
        page={page}
        setPage={setPage}
        take={10}
        totalCount={data?.meta.totalCount ?? 0}
      />
    </div>
  );
};
