import { Card, CardContent, CardHeader, CardTitle } from "^/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "^/components/ui/dialog";
import { Toaster } from "^/components/ui/sonner";
import { ImportZone } from "./components/ImportZone";
import { FileList } from "./components/FileList";
import { useMediaStore } from "./store/mediaStore";

/**
 * 主应用组件
 * 管理媒体文件导入和展示
 */
function App() {
  const {
    items,
    importDialogOpen,
    addFiles,
    removeItem,
    clearAll,
    setImportDialogOpen,
    getFileTypeTag,
  } = useMediaStore();

  const hasItems = items.length > 0;

  const handleFilesSelected = (files: FileList) => {
    addFiles(files);
  };

  const handleDirSelected = (files: FileList) => {
    addFiles(files);
  };

  return (
    <main className="flex flex-col bg-slate-50 h-screen text-slate-900">
      {hasItems ? (
        <FileList
          items={items}
          onRemove={removeItem}
          onClearAll={clearAll}
          onAddFiles={() => setImportDialogOpen(true)}
          getFileTypeTag={getFileTypeTag}
        />
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center p-6">
          <div className="w-full max-w-3xl">
            <Card>
              <CardHeader className="sm:flex sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                <div>
                  <CardTitle className="text-2xl">导入媒体文件</CardTitle>
                  <p className="text-slate-600 text-sm">
                    支持单个或多个音频/视频文件，拖拽或点击选择。
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ImportZone
                  onFilesSelected={handleFilesSelected}
                  onDirSelected={handleDirSelected}
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
          />
        </DialogContent>
      </Dialog>
      <Toaster />
    </main>
  );
}

export default App;
