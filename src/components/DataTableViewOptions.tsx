"use client"

import { type Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "^/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

const columnLabels: Record<string, string> = {
  "file_name": "文件名",
  "file_type": "类型",
  "file_size": "文件大小",
  "duration": "时长",
  "analysisData_averageDb": "平均分贝",
  "analysisData_maxDb": "最大分贝",
  "warnings": "警告",
  "preview": "预览",
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const getColumnLabel = (columnId: string): string => {
    return columnLabels[columnId] || columnId
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hidden lg:flex justify-center items-center gap-2 bg-background hover:bg-accent disabled:opacity-50 mr-3 ml-auto px-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-8 font-medium text-sm transition-colors hover:text-accent-foreground disabled:pointer-events-none"
      >
        <Settings2 className="w-4 h-4" />
        <span>显示列</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto max-w-xs">
        <DropdownMenuGroup>
          <DropdownMenuLabel>切换列显示</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="truncate capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                >
                  {getColumnLabel(column.id)}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
