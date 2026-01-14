import { AudioItem, FileTypeTag, AudioAnalysisResult } from "../types/audio";
import { formatDuration } from "../lib/formatters";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "^/components/ui/dialog";
import { AnalysisChart } from "./AnalysisChart";
import { toast } from "sonner";
import { SettingsDialog } from "./SettingsDialog";
import { useSettings } from "../store/settingsStore";
import { FileListHeader } from "./FileListHeader";
import { batchAnalyzeItems } from "../lib/batchAnalysis";
import { createColumns } from "./columns";
import { DataTable } from "./dataTable";

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
  const [videoItem, setVideoItem] = useState<AudioItem | null>(null);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();

  const handleZoom = (item: AudioItem) => {
    const pointsCount = item.analysisData?.points.length || 0;
    if (pointsCount > 30000) {
      toast.warning("文件较大，正在生成详细图表，请稍候...");
      setTimeout(() => setZoomItem(item), 100);
    } else {
      setZoomItem(item);
    }
  };

  const handleAnalyzeAll = async () => {
    if (isBatchAnalyzing || analyzingId) return;

    setIsBatchAnalyzing(true);
    await batchAnalyzeItems(items, onUpdateAnalysis, setAnalyzingId);
    setAnalyzingId(null);
    setIsBatchAnalyzing(false);
  };

  const handleAddFiles = () => {
    toast.info("选择要添加的文件...");
    onAddFiles();
  };

  const columns = createColumns(
    onRemove,
    handleZoom,
    setVideoItem,
    getFileTypeTag,
    settings
  );

  return (
    <div className="flex flex-col flex-1 bg-white p-8 overflow-hidden">
      <FileListHeader
        itemCount={items.length}
        isBatchAnalyzing={isBatchAnalyzing}
        analyzingId={analyzingId}
        onOpenSettings={() => setSettingsOpen(true)}
        onAnalyzeAll={handleAnalyzeAll}
        onAddFiles={handleAddFiles}
        onClearAll={onClearAll}
      />

      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={items}
        />
      </div>

      <Dialog open={!!zoomItem} onOpenChange={(open) => !open && setZoomItem(null)}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{zoomItem?.file.name} - 分贝分析</DialogTitle>
            <DialogDescription className="text-slate-600">
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

      <Dialog open={!!videoItem} onOpenChange={(open) => !open && setVideoItem(null)}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{videoItem?.file.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-black rounded w-full aspect-video">
            {videoItem && (
              <video
                src={videoItem.url}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
