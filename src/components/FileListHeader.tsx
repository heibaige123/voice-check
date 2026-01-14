import { Button } from "^/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "^/components/ui/tooltip";
import { Loader2, Activity, Settings, Trash, Plus } from "lucide-react";

interface FileListHeaderProps {
  itemCount: number;
  isBatchAnalyzing: boolean;
  analyzingId: string | null;
  onOpenSettings: () => void;
  onAnalyzeAll: () => void;
  onAddFiles: () => void;
  onClearAll: () => void;
}

export function FileListHeader({
  itemCount,
  isBatchAnalyzing,
  analyzingId,
  onOpenSettings,
  onAnalyzeAll,
  onAddFiles,
  onClearAll,
}: FileListHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="font-bold text-slate-950 text-4xl tracking-tight">
          媒体文件列表
        </h1>
        <p className="mt-2 text-slate-600 text-base">
          共 {itemCount} 个文件
        </p>
      </div>
      <TooltipProvider>
        <div className="flex gap-3 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSettings}
                className="bg-slate-200 hover:bg-slate-300 border-slate-300 rounded-lg text-slate-950 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>配置分贝阈值</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAnalyzeAll}
                disabled={isBatchAnalyzing || analyzingId !== null}
                size="sm"
                className="bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 border-0 rounded-lg text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {isBatchAnalyzing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Activity className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>重新分析所有文件</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddFiles}
                size="sm"
                className="bg-slate-500 hover:bg-slate-600 border-0 rounded-lg text-white transition-all duration-200 cursor-pointer"
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>添加文件</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="bg-red-100 hover:bg-red-200 border-red-300 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200 cursor-pointer"
              >
                <Trash className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>清空所有文件</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
