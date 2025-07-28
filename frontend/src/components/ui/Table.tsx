import { ReactNode } from "react";

interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

interface TableProps<T = unknown> {
  columns: TableColumn[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  className?: string;
}

export default function Table<T = unknown>({ columns, data, renderRow, className = "" }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-[#E75234]">
            {columns.map((column) => (
              <th key={column.key} className={`py-3 px-4 text-lg font-bold ${column.className || ""}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
}
