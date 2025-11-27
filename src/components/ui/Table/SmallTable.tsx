import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  negativeStatus,
  neutralityStatus,
  positiveStatus,
} from "@/constants/status";

interface Props<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

export const SmallTable = <TData,>({ data, columns }: Props<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="min-w-full text-sm text-left table-fixed">
      <thead className="text-black text-[15px] font-medium bg-white whitespace-nowrap">
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

      <tbody className="text-black text-[14px]">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-[#F2F2FD] cursor-pointer">
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
                cell.column.id === "status" ? "font-semibold" : "font-normal";

              return (
                <td
                  key={cell.id}
                  className={`px-[32px] h-[56px] whitespace-nowrap ${textColor} ${fontWeight}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
