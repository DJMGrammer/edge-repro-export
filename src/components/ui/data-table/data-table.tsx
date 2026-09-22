"use client"

import type { ReactNode } from "react"
import { useTable, type ColumnDef, type RowData, type Table as TanStackTable, type TableOptions } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { features, type DataTableFeatures } from "./data-table-features"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  atoms?: TableOptions<DataTableFeatures, TData>["atoms"]
  toolbar?: (table: TanStackTable<DataTableFeatures, TData>) => ReactNode
  views?: ReactNode
  onRowClick?: (row: TData) => void
  rowAriaLabel?: (row: TData) => string
  emptyMessage?: string
  className?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  atoms,
  toolbar,
  views,
  onRowClick,
  rowAriaLabel,
  emptyMessage = "No results.",
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    data,
    columns,
    atoms,
    defaultColumn: { enableColumnFilter: false },
  })
  const hasColumnFilters = table.state.columnFilters.length > 0

  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      {views ? <div className="border-b px-2 pt-1">{views}</div> : null}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <div className="flex flex-wrap items-center gap-2">
          {toolbar?.(table)}
          {hasColumnFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters(true)}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={
                  onRowClick
                    ? (rowAriaLabel?.(row.original) ?? "Edit row")
                    : undefined
                }
                className={
                  onRowClick
                    ? "cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                    : undefined
                }
                onClick={(event) => {
                  if (
                    onRowClick &&
                    !(event.target as HTMLElement).closest(
                      "button, a, input, select, textarea, [role=menuitem]"
                    )
                  ) {
                    onRowClick(row.original)
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    onRowClick &&
                    event.target === event.currentTarget &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault()
                    onRowClick(row.original)
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-1 border-t px-2 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}