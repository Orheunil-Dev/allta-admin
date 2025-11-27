import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { createIcon, downloadIcon } from "../../../../public/images";
import { useResizeHandler } from "@/hooks";

const positiveStatus = ["ACTIVE", "APPROVED"];
const neutralityStatus = ["STOPPED", "REFUNDED", "USED", "DELETED"];
const negativeStatus = ["DISCONTINUED", "PARTIAL_REFUNDED", "REFUNDED"];

interface Props<TData> {
  basePath: string;
  data: TData[];
  totalCount: number;
  page: number;
  columns: ColumnDef<TData>[];
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  onDownload?: () => void;
  registrable?: boolean;
  clickable?: boolean;
}

export const Table = <TData,>({
  basePath,
  data,
  totalCount,
  page,
  columns,
  sorting,
  setSorting,
  onDownload,
  registrable,
  clickable,
}: Props<TData>) => {
  const router = useRouter();

  const tableRef = useRef<HTMLTableSectionElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const { isMobile } = useResizeHandler();

  // 정렬
  const handleSortToggle = (columnId: string) => {
    const currentSort = sorting.find((s) => s.id === columnId);

    if (!currentSort) {
      setSorting([{ id: columnId, desc: true }]);
    } else if (currentSort.desc) {
      setSorting([{ id: columnId, desc: false }]);
    } else {
      setSorting([]);
    }
  };

  // 등록 페이지 이동
  const handleRegister = () => {
    router.push(`${basePath}/register`);
  };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  }, [page, sorting]);

  return (
    <div className="flex flex-col mt-[16px] z-[1]">
      <div className="flex justify-between mt-[16px] md:mt-[36px]">
        <p className="text-[20px] md:text-[24px] font-semibold">
          총 <strong className="text-main">{totalCount}</strong>건
        </p>

        <div className="flex gap-x-[10px]">
          {onDownload && (
            <button
              onClick={onDownload}
              style={{ boxShadow: "0 4px 10px 2px rgba(38, 38, 39, 0.04)" }}
              className="flex justify-center items-center w-[88px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] cursor-pointer"
            >
              <Image
                src={downloadIcon}
                alt="다운로드"
                className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[6px]"
              />
              <p className="text-[12px] md:text-[14px]">다운로드</p>
            </button>
          )}

          {registrable && (
            <div
              onClick={handleRegister}
              style={{ boxShadow: "0 4px 10px 2px rgba(38, 38, 39, 0.04)" }}
              className="flex justify-center items-center w-[88px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] cursor-pointer"
            >
              <Image
                src={createIcon}
                alt="등록"
                className="w-[16px] h-[16px] mr-[6px]"
              />
              <p>등록</p>
            </div>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div
        ref={tableRef}
        style={{ boxShadow: "0 4px 10px 2px rgba(38, 38, 39, 0.04)" }}
        className="flex-1 mt-[12px] md:mt-[16px] bg-white rounded-[20px] overflow-x-auto"
      >
        <table className="min-w-full text-sm text-left table-fixed">
          <thead className="text-black text-[13px] md:text-[15px] font-medium bg-white whitespace-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = table
                    .getState()
                    .sorting.find((s) => s.id === header.column.id);

                  const sortDirection = isSorted
                    ? isSorted.desc
                      ? "desc"
                      : "asc"
                    : null;

                  return (
                    <th
                      key={header.id}
                      className="px-[32px] h-[56px] cursor-pointer select-none bg-white z-10"
                      onClick={() =>
                        canSort && handleSortToggle(header.column.id)
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {sortDirection ? (
                        <span> {sortDirection === "desc" ? "↓" : "↑"}</span>
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="text-black text-[12px] md:text-[14px]">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  clickable
                    ? router.push(
                        `/${basePath}/${(row.original as { id: string }).id}`
                      )
                    : {};
                }}
                className="hover:bg-[#F2F2FD] cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => {
                  const value = cell.getValue() as string;

                  let textColor = "text-black";

                  if (positiveStatus.includes(value)) {
                    textColor = "text-green";
                  } else if (neutralityStatus.includes(value)) {
                    textColor = "text-gray5";
                  } else if (negativeStatus.includes(value)) {
                    textColor = "text-red";
                  }

                  const fontWeight =
                    cell.column.id === "status"
                      ? "font-semibold"
                      : "font-normal";

                  return (
                    <td
                      key={cell.id}
                      className={`px-[32px] h-[56px] whitespace-nowrap ${textColor} ${fontWeight}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
