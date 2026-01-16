"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AudioItem } from "../types/audio"
import { formatBytes, formatDuration } from "../lib/formatters"
import { Badge } from "^/components/ui/badge"
import { Button } from "^/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "^/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { Trash2, TrendingUp, MoreHorizontal, Play } from "lucide-react"
import { Settings as SettingsType } from "../store/settingsStore"

export const createColumns = (
  onRemove: (id: string) => void,
  onZoom: (item: AudioItem) => void,
  onVideoClick: (item: AudioItem) => void,
  getFileTypeTag: (file: File) => "音频" | "视频",
  settings: SettingsType
): ColumnDef<AudioItem>[] => [
    {
      accessorKey: "file_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="文件名" className="ml-2" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div
            className="max-w-full font-medium text-slate-900 text-sm truncate"
            title={item.file.name}
          >
            {item.file.name}
          </div>
        )
      },
    },
    {
      accessorKey: "file_type",
      enableSorting: false,
      enableHiding: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) => {
        const item = row.original
        const fileType = getFileTypeTag(item.file)
        return (
          <Badge
            variant="outline"
            className={
              fileType === "视频"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-green-100 text-green-700 border-green-300"
            }
          >
            {fileType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "file_size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="文件大小" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <span className="text-slate-600">
            {formatBytes(item.file.size)}
          </span>
        )
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="时长" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <span className="text-slate-600">
            {formatDuration(item.duration)}
          </span>
        )
      },
    },
    {
      accessorKey: "analysisData_averageDb",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="平均分贝" />
      ),
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {item.analysisData ? item.analysisData.averageDb.toFixed(2) : "—"}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "analysisData_maxDb",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="最大分贝" />
      ),
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {item.analysisData ? item.analysisData.maxDb.toFixed(2) : "—"}
            </span>
          </div>
        )
      },
    },
    {
      id: "warnings",
      header: "警告",
      cell: ({ row }) => {
        const item = row.original
        const warnings: Array<{ label: string; className: string }> = [];

        if (item.analysisData && item.analysisData.averageDb < settings.minDbThreshold) {
          warnings.push({ label: "平均分贝偏低", className: "bg-yellow-500" });
        }
        if (item.analysisData && item.analysisData.maxDb > settings.maxDbThreshold) {
          warnings.push({ label: "最大分贝过高", className: "bg-red-500" });
        }
        if (item.fileSizeExceed) {
          warnings.push({ label: "体积超限", className: "bg-orange-500" });
        }

        return (
          <div className="flex flex-wrap gap-1">
            {warnings.map((warning, idx) => (
              <Badge key={idx} className={`${warning.className} text-xs`}>
                {warning.label}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "preview",
      header: "预览",
      cell: ({ row }) => {
        const item = row.original
        return (
          <audio
            src={item.url}
            controls
            className="rounded max-w-xs h-8"
          />
        )
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                {getFileTypeTag(item.file) === "视频" && (
                  <>
                    <DropdownMenuItem onClick={() => onVideoClick(item)}>
                      <Play className="mr-2 w-4 h-4" />
                      播放视频
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {item.analysisData && (
                  <>
                    <DropdownMenuItem onClick={() => onZoom(item)}>
                      <TrendingUp className="mr-2 w-4 h-4" />
                      查看分贝折线图
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => onRemove(item.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  移除
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
