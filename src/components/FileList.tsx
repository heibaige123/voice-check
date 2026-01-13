import { Card, CardContent } from "^/components/ui/card";
import { ScrollArea } from "^/components/ui/scroll-area";
import { AudioItem, FileTypeTag, AudioAnalysisResult } from "../types/audio";
import { formatDuration } from "../lib/formatters";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "^/components/ui/dialog";
import { AnalysisChart } from "./AnalysisChart";
import { toast } from "sonner";
import { SettingsDialog } from "./SettingsDialog";
import { useSettings } from "../store/settingsStore";
import { useTheme } from "../store/themeStore";
import { FileListHeader } from "./FileListHeader";
import { FilterBar, FilterType } from "./FilterBar";
import { FileListItem } from "./FileListItem";
import { filterItems } from "../lib/fileFilters";
import { batchAnalyzeItems } from "../lib/batchAnalysis";

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
  const [filterTypes, setFilterTypes] = useState<FilterType[]>([]);
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.mode === "dark";

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

  const handleToggleFilter = (type: FilterType) => {
    if (filterTypes.includes(type)) {
      setFilterTypes(filterTypes.filter((t) => t !== type));
    } else {
      setFilterTypes([...filterTypes, type]);
    }
  };

  const filteredItems = filterItems(items, filterTypes, settings);

  return (
    <div className={`flex flex-col flex-1 p-8 overflow-hidden ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <FileListHeader
        itemCount={items.length}
        isDark={isDark}
        isBatchAnalyzing={isBatchAnalyzing}
        analyzingId={analyzingId}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
        onAnalyzeAll={handleAnalyzeAll}
        onAddFiles={handleAddFiles}
        onClearAll={onClearAll}
      />

      <FilterBar
        filterTypes={filterTypes}
        isDark={isDark}
        settings={settings}
        onToggleFilter={handleToggleFilter}
      />

      <Card className={`flex flex-col flex-1 shadow-lg overflow-hidden py-0 rounded-2xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pr-4 divide-y">
              {filteredItems.map((item, index) => (
                <FileListItem
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  settings={settings}
                  getFileTypeTag={getFileTypeTag}
                  onRemove={onRemove}
                  onZoom={handleZoom}
                  onVideoClick={setVideoItem}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!zoomItem} onOpenChange={(open) => !open && setZoomItem(null)}>
        <DialogContent className={`sm:max-w-[80vw] ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? "text-slate-100" : "text-slate-900"}>{zoomItem?.file.name} - 分贝分析</DialogTitle>
            <DialogDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
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
        <DialogContent className={`sm:max-w-[80vw] ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? "text-slate-100" : "text-slate-900"}>{videoItem?.file.name}</DialogTitle>
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
