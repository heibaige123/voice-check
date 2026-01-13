import { Button } from "^/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "^/components/ui/tooltip";
import { AudioItem, FileTypeTag } from "../types/audio";
import { formatBytes, formatDuration } from "../lib/formatters";
import {
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Settings as SettingsType } from "../store/settingsStore";

interface FileListItemProps {
  item: AudioItem;
  index: number;
  isDark: boolean;
  settings: SettingsType;
  getFileTypeTag: (file: File) => FileTypeTag;
  onRemove: (id: string) => void;
  onZoom: (item: AudioItem) => void;
  onVideoClick: (item: AudioItem) => void;
}

export function FileListItem({
  item,
  index,
  isDark,
  settings,
  getFileTypeTag,
  onRemove,
  onZoom,
  onVideoClick,
}: FileListItemProps) {
  const avgDbLow = item.analysisData && item.analysisData.averageDb < settings.minDbThreshold;
  const maxDbHigh = item.analysisData && item.analysisData.maxDb > settings.maxDbThreshold;
  const isVideo = getFileTypeTag(item.file) === "视频";

  const itemBg = isDark
    ? 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
    : 'bg-slate-100/50 border-slate-200 hover:border-slate-300';

  return (
    <div
      className={`flex flex-col gap-2 py-3 px-4 rounded-lg transition-all duration-200 border ${itemBg} hover:shadow-sm`}
    >
      {/* 文件名和标签行 */}
      <div className="flex items-center gap-2">
        <span className={`min-w-max font-semibold text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
          {index + 1}.
        </span>
        <p
          className={`font-medium text-sm truncate ${isDark ? "text-slate-200" : "text-slate-900"}`}
          title={item.file.name}
        >
          {item.file.name}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => isVideo && onVideoClick(item)}
              className={`px-2 py-0.5 border rounded-full text-xs font-medium shrink-0 transition-all duration-200 ${
                isVideo ? 'cursor-pointer' : ''
              } ${
                isDark
                  ? "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-700/60"
                  : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {getFileTypeTag(item.file)}
            </span>
          </TooltipTrigger>
          {isVideo && <TooltipContent>点击播放视频</TooltipContent>}
        </Tooltip>

        {/* 警告图标 */}
        {item.error && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle
                className="size-3.5 text-red-500 cursor-help shrink-0"
                aria-label={item.error}
              />
            </TooltipTrigger>
            <TooltipContent>{item.error}</TooltipContent>
          </Tooltip>
        )}
        {avgDbLow && maxDbHigh && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertOctagon
                className="size-3.5 text-orange-500 cursor-help shrink-0"
                aria-label="平均分贝偏低且最大分贝过高"
              />
            </TooltipTrigger>
            <TooltipContent>平均分贝偏低且最大分贝过高</TooltipContent>
          </Tooltip>
        )}
        {avgDbLow && !maxDbHigh && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle
                className="size-3.5 text-yellow-500 cursor-help shrink-0"
                aria-label="平均分贝偏低"
              />
            </TooltipTrigger>
            <TooltipContent>平均分贝偏低</TooltipContent>
          </Tooltip>
        )}
        {maxDbHigh && !avgDbLow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle
                className="size-3.5 text-red-500 cursor-help shrink-0"
                aria-label="最大分贝过高"
              />
            </TooltipTrigger>
            <TooltipContent>最大分贝过高</TooltipContent>
          </Tooltip>
        )}
        {item.fileSizeExceed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle
                className="size-3.5 text-orange-500 cursor-help shrink-0"
                aria-label="文件体积超过限制"
              />
            </TooltipTrigger>
            <TooltipContent>文件体积超过限制</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* 文件大小和数据卡片行 */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <p className={`text-xs whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {formatBytes(item.file.size)} · 时长 {formatDuration(item.duration)}
          </p>
          {item.analysisData && (
            <>
              <div
                className={`px-2 py-1 rounded-md transition-all duration-200 ${
                  isDark ? "bg-slate-700/30" : "bg-slate-200/50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    平均dB
                  </p>
                  <p className={`font-semibold text-xs ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                    {item.analysisData.averageDb.toFixed(2)}
                  </p>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-md transition-all duration-200 ${
                  isDark ? "bg-slate-700/30" : "bg-slate-200/50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    最大dB
                  </p>
                  <p className={`font-semibold text-xs ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                    {item.analysisData.maxDb.toFixed(2)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 操作按钮和音频播放器行 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {item.analysisData && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1 px-2 py-0.5 text-xs cursor-pointer transition-all duration-200 rounded-md ${
                    isDark
                      ? "bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/50 text-slate-300 hover:scale-105"
                      : "bg-slate-200/50 hover:bg-slate-300 border-slate-300/50 text-slate-950 hover:scale-105"
                  }`}
                  onClick={() => onZoom(item)}
                >
                  <TrendingUp className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>查看详细图表</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.id)}
                className={`cursor-pointer transition-all duration-200 rounded-md ${
                  isDark
                    ? "bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400 hover:text-red-300 hover:scale-105"
                    : "bg-red-100/50 hover:bg-red-200 border-red-300/50 text-red-600 hover:text-red-700 hover:scale-105"
                }`}
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>移除此文件</TooltipContent>
          </Tooltip>
          <audio
            src={item.url}
            controls
            className={`max-w-sm h-8 rounded ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
          />
        </div>
      </div>
    </div>
  );
}
