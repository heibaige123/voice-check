import { Button } from "^/components/ui/button";
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
      <div className="flex gap-3 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          title="配置分贝阈值"
          className="bg-slate-200 hover:bg-slate-300 border-slate-300 rounded-lg text-slate-950 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <Settings className="size-4" />
        </Button>
        <Button
          onClick={onAnalyzeAll}
          disabled={isBatchAnalyzing || analyzingId !== null}
          size="sm"
          title="重新分析所有文件"
          className="bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 border-0 rounded-lg text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isBatchAnalyzing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Activity className="size-4" />
          )}
        </Button>
        <Button
          onClick={onAddFiles}
          size="sm"
          title="添加文件"
          className="bg-slate-500 hover:bg-slate-600 border-0 rounded-lg text-white transition-all duration-200 cursor-pointer"
        >
          <Plus className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          title="清空所有文件"
          className="bg-red-100 hover:bg-red-200 border-red-300 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200 cursor-pointer"
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  );
}
