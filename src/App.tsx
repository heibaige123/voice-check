import { Card, CardContent, CardHeader, CardTitle } from "^/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "^/components/ui/dialog";
import { Toaster } from "^/components/ui/sonner";
import { ImportZone } from "./components/ImportZone";
import { FileList } from "./components/FileList";
import { useMediaStore } from "./store/mediaStore";
import { useTheme } from "./store/themeStore";
import { useEffect, useRef } from "react";
import { analyzeAudio } from "./lib/audioAnalyzer";

/**
 * 主应用组件
 * 管理媒体文件导入和展示
 */
function App() {
  const {
    items,
    importDialogOpen,
    addFiles,
    addFromUrl,
    removeItem,
    clearAll,
    setImportDialogOpen,
    getFileTypeTag,
    setAnalysisData,
  } = useMediaStore();

  const hasItems = items.length > 0;
  const previousItemsCountRef = useRef(0);

  const handleFilesSelected = (files: FileList) => {
    addFiles(files);
  };

  const handleDirSelected = (files: FileList) => {
    addFiles(files);
  };

  const handleUrlSelected = (urls: string[]) => {
    urls.forEach(url => addFromUrl(url));
  };

  // 自动分析新导入的文件
  useEffect(() => {
    // 检测新添加的文件
    if (items.length > previousItemsCountRef.current) {
      const newItemsCount = items.length - previousItemsCountRef.current;
      const newItems = items.slice(-newItemsCount);
      
      // 自动分析新文件
      newItems.forEach(async (item) => {
        if (!item.analysisData) {
          try {
            const result = await analyzeAudio(item.url, 20);
            setAnalysisData(item.id, result);
          } catch (error) {
            console.error(`Auto-analysis failed for ${item.file.name}:`, error);
          }
        }
      });
    }
    
    previousItemsCountRef.current = items.length;
  }, [items, setAnalysisData]);

  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const bgClass = isDark ? "bg-slate-950" : "bg-white";
  const textClass = isDark ? "text-white" : "text-slate-950";

  return (
    <main className={`flex flex-col h-screen overflow-hidden ${bgClass} ${textClass}`}>
      {hasItems ? (
        <FileList
          items={items}
          onRemove={removeItem}
          onUpdateAnalysis={setAnalysisData}
          onClearAll={clearAll}
          onAddFiles={() => setImportDialogOpen(true)}
          getFileTypeTag={getFileTypeTag}
        />
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center p-8">
          <div className="w-full max-w-3xl">
            <Card className={`shadow-xl border-0 rounded-3xl ${isDark ? "bg-slate-900 text-slate-50" : "bg-white text-slate-950"}`}>
              <CardHeader className="pb-6">
                <CardTitle className={`font-bold text-4xl tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>音频分析工具</CardTitle>
                <p className={`mt-3 text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  导入音频/视频文件，自动分析分贝等级，一键识别音质问题
                </p>
              </CardHeader>
              <CardContent>
                <ImportZone
                  onFilesSelected={handleFilesSelected}
                  onDirSelected={handleDirSelected}
                  onUrlSelected={handleUrlSelected}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加媒体文件</DialogTitle>
            <DialogDescription>请选择或拖拽文件到下方区域进行导入</DialogDescription>
          </DialogHeader>
          <ImportZone
            onFilesSelected={handleFilesSelected}
            onDirSelected={handleDirSelected}
            onUrlSelected={handleUrlSelected}
          />
        </DialogContent>
      </Dialog>
      <Toaster />
    </main>
  );
}

export default App;
