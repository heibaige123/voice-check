import { Button } from "^/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "^/components/ui/tooltip";
import { Loader2, Activity, Settings, Moon, Sun, Trash, Plus } from "lucide-react";

interface FileListHeaderProps {
  itemCount: number;
  isDark: boolean;
  isBatchAnalyzing: boolean;
  analyzingId: string | null;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onAnalyzeAll: () => void;
  onAddFiles: () => void;
  onClearAll: () => void;
}

export function FileListHeader({
  itemCount,
  isDark,
  isBatchAnalyzing,
  analyzingId,
  onToggleTheme,
  onOpenSettings,
  onAnalyzeAll,
  onAddFiles,
  onClearAll,
}: FileListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`font-bold text-4xl tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
          媒体文件列表
        </h1>
        <p className={`mt-2 text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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
                onClick={onToggleTheme}
                className={`cursor-pointer transition-all duration-200 rounded-lg ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:scale-105"
                    : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-950 hover:scale-105"
                }`}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>切换主题</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSettings}
                className={`cursor-pointer transition-all duration-200 rounded-lg ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:scale-105"
                    : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-950 hover:scale-105"
                }`}
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
                className={`border-0 text-white cursor-pointer transition-all duration-200 rounded-lg ${
                  isDark
                    ? "bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700"
                    : "bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300"
                } disabled:cursor-not-allowed`}
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
                className={`border-0 text-white cursor-pointer transition-all duration-200 rounded-lg ${
                  isDark ? "bg-slate-600 hover:bg-slate-700" : "bg-slate-500 hover:bg-slate-600"
                }`}
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
                className={`cursor-pointer transition-all duration-200 rounded-lg ${
                  isDark
                    ? "bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400 hover:text-red-300"
                    : "bg-red-100 hover:bg-red-200 border-red-300 text-red-600 hover:text-red-700"
                }`}
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
