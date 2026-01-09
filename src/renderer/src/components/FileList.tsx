import { Button } from "^/components/ui/button";
import { Card, CardContent } from "^/components/ui/card";
import { ScrollArea } from "^/components/ui/scroll-area";
import { AudioItem, FileTypeTag } from "../types/audio";
import { formatBytes, formatDuration } from "../lib/formatters";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "^/components/ui/dialog";
import { AnalysisChart } from "./AnalysisChart";
import { analyzeAudio } from "../lib/audioAnalyzer";
import { toast } from "sonner";
import { Loader2, Activity, Maximize2 } from "lucide-react";
import { AudioAnalysisResult } from "../types/audio";

interface FileListProps {
  items: AudioItem[];
  onRemove: (id: string) => void;
  onUpdateAnalysis: (id: string, data: AudioAnalysisResult) => void;
  onClearAll: () => void;
  onAddFiles: () => void;
  getFileTypeTag: (file: File) => FileTypeTag;
}

/**
 * 文件列表组件
 * 显示已导入的音频/视频文件
 */
export function FileList({
  items,
  onRemove,
  onUpdateAnalysis,
  onClearAll,
  onAddFiles,
  getFileTypeTag,
}: FileListProps) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [zoomItem, setZoomItem] = useState<AudioItem | null>(null);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);

  const handleZoom = (item: AudioItem) => {
    // 估算渲染耗时：如果点数超过一定阈值（例如 30000点，约25分钟音频），预先提示
    const pointsCount = item.analysisData?.points.length || 0;
    if (pointsCount > 30000) {
      toast.warning("文件较大，正在生成详细图表，请稍候...");
      // 使用 setTimeout 让 React 有机会先渲染 Toast，再执行耗时的图表渲染
      setTimeout(() => {
        setZoomItem(item);
      }, 100);
    } else {
      setZoomItem(item);
    }
  };

  const handleAnalyze = async (item: AudioItem) => {
    if (analyzingId || isBatchAnalyzing) return;

    setAnalyzingId(item.id);
    const toastId = toast.loading(`正在分析 ${item.file.name}...`);

    try {
      // 使用更精细的采样，每秒 20 个点
      const result = await analyzeAudio(item.url, 20);
      onUpdateAnalysis(item.id, result);
      toast.dismiss(toastId);
      toast.success("分析完成");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.dismiss(toastId);
      toast.error("分析失败: " + String(error));
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleAnalyzeAll = async () => {
    if (isBatchAnalyzing || analyzingId) return;

    let itemsToAnalyze = items.filter((item) => !item.analysisData);

    if (itemsToAnalyze.length === 0) {
      if (items.length === 0) return;
      // 如果所有文件都已分析，则重新分析所有文件
      itemsToAnalyze = items;
    }

    setIsBatchAnalyzing(true);
    const toastId = toast.loading(`准备分析 ${itemsToAnalyze.length} 个文件...`);

    try {
      for (let i = 0; i < itemsToAnalyze.length; i++) {
        const item = itemsToAnalyze[i];

        // 更新进度提示
        toast.loading(`正在分析 (${i + 1}/${itemsToAnalyze.length}): ${item.file.name}`, {
          id: toastId
        });

        setAnalyzingId(item.id);

        try {
          const result = await analyzeAudio(item.url, 20);
          onUpdateAnalysis(item.id, result);
        } catch (error) {
          console.error(`Failed to analyze ${item.file.name}:`, error);
          // 单个失败不中断整体流程
        }
      }
      toast.success("批量分析完成", { id: toastId });
    } catch (error) {
      console.error("Batch analysis error:", error);
      toast.error("批量分析意外中断", { id: toastId });
    } finally {
      setAnalyzingId(null);
      setIsBatchAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-2xl">媒体文件列表</h1>
          <p className="text-slate-600 text-sm">共 {items.length} 个文件</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleAnalyzeAll}
            disabled={isBatchAnalyzing || analyzingId !== null}
            className="cursor-pointer"
          >
            {isBatchAnalyzing ? <Loader2 className="mr-2 size-3 animate-spin" /> : <Activity className="mr-2 size-3" />}
            一键分析
          </Button>
          <Button onClick={onAddFiles} className="cursor-pointer">+ 添加文件</Button>
          <Button
            variant="outline"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 cursor-pointer"
          >
            清空全部
          </Button>
        </div>
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pr-4 divide-y">
              {items.map((it, index) => (
                <div key={it.id} className="flex flex-col gap-2 py-3">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="min-w-max font-bold text-slate-500 text-sm">
                          {index + 1}.
                        </span>
                        <p
                          className="font-medium text-sm truncate"
                          title={it.file.name}
                        >
                          {it.file.name}
                        </p>
                        <span className="bg-slate-50 px-2 py-0.5 border rounded-full text-slate-600 text-xs shrink-0">
                          {getFileTypeTag(it.file)}
                        </span>
                        {it.error && (
                          <span className="text-red-600 text-xs">
                            {it.error}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-slate-500 text-xs">
                        {formatBytes(it.file.size)} · 时长{" "}
                        {formatDuration(it.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={it.analysisData ? "ghost" : "outline"}
                        size="sm"
                        className="gap-1 cursor-pointer"
                        onClick={() => handleAnalyze(it)}
                        disabled={(analyzingId !== null && analyzingId !== it.id) || isBatchAnalyzing}
                      >
                        {analyzingId === it.id ? <Loader2 className="size-3 animate-spin" /> : <Activity className="size-3" />}
                        {analyzingId === it.id ? "分析中" : (it.analysisData ? "重新分析" : "分析")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(it.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        移除
                      </Button>
                      <audio src={it.url} controls className="max-w-60 h-9" />
                    </div>
                  </div>

                  {it.analysisData && (
                    <div className="flex items-center gap-2 mt-1 p-1 rounded">
                      <div className="flex-1 min-w-0">
                        <AnalysisChart
                          data={it.analysisData.points}
                          height={40}
                          variant="simple"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="shadow-sm w-6 h-6 cursor-pointer shrink-0"
                        onClick={() => handleZoom(it)}
                        title="查看大图"
                      >
                        <Maximize2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!zoomItem} onOpenChange={(open) => !open && setZoomItem(null)}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>{zoomItem?.file.name} - 分贝分析</DialogTitle>
            <DialogDescription>
              {zoomItem?.analysisData && (
                <span>
                  平均分贝: {zoomItem.analysisData.averageDb.toFixed(2)} dB ·
                  最大分贝: {zoomItem.analysisData.maxDb.toFixed(2)} dB ·
                  时长: {formatDuration(zoomItem.analysisData.duration)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 h-96">
            {zoomItem?.analysisData && <AnalysisChart data={zoomItem.analysisData.points} height={380} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
