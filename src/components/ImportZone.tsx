import { useRef, useMemo, useState } from "react";
import { Button } from "^/components/ui/button";
import { Textarea } from "^/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "^/components/ui/tabs";
import { Upload, FolderOpen, Link2 } from "lucide-react";
import { ACCEPTED_TYPES } from "../lib/constants";

interface ImportZoneProps {
  onFilesSelected: (files: FileList) => void;
  onDirSelected: (files: FileList) => void;
  onUrlSelected?: (urls: string[]) => void;
}

/**
 * 导入区域组件
 * 支持拖拽上传、点击选择文件/文件夹、网址导入
 */
export function ImportZone({ onFilesSelected, onDirSelected, onUrlSelected }: ImportZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dirInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const acceptAttr = useMemo(() => ACCEPTED_TYPES.join(","), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      onFilesSelected(e.currentTarget.files);
      e.currentTarget.value = "";
    }
  };

  const handleDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      onDirSelected(e.currentTarget.files);
      e.currentTarget.value = "";
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handlePickDir = () => {
    const el = dirInputRef.current;
    if (el) {
      el.setAttribute("webkitdirectory", "");
      el.setAttribute("directory", "");
      el.click();
    }
  };

  const handleUrlSubmit = () => {
    const urls = urlInput
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length > 0 && onUrlSelected) {
      onUrlSelected(urls);
      setUrlInput("");
    }
  };

  return (
    <Tabs defaultValue="folder" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8 p-1 w-full">
        <TabsTrigger value="folder" className="flex items-center gap-2 cursor-pointer">
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline font-medium text-sm">文件夹</span>
        </TabsTrigger>
        <TabsTrigger value="drag" className="flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline font-medium text-sm">拖拽/选择</span>
        </TabsTrigger>
        {onUrlSelected && (
          <TabsTrigger value="url" className="flex items-center gap-2 cursor-pointer">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline font-medium text-sm">网址</span>
          </TabsTrigger>
        )}
      </TabsList>

      {/* 选择文件夹标签页 */}
      <TabsContent value="folder" className="min-h-80">
        <div className="flex flex-col justify-center bg-white p-8 border border-slate-200 border-dashed rounded-2xl h-full">
          <div className="space-y-4">
            <div className="flex justify-center">
              <FolderOpen className="w-14 h-14 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 text-lg">选择文件夹</p>
              <p className="mt-1 text-slate-600 text-sm">自动扫描所有子文件夹中的媒体文件</p>
            </div>
            <Button
              onClick={handlePickDir}
              className="w-full cursor-pointer"
              size="lg"
            >
              <FolderOpen className="mr-2 w-5 h-5" />
              选择文件夹
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* 拖拽/选择文件标签页 */}
      <TabsContent value="drag" className="min-h-80">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col justify-center bg-white p-8 border border-slate-200 border-dashed rounded-2xl h-full"
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="w-14 h-14 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 text-lg">拖拽文件到此处</p>
              <p className="mt-1 text-slate-600 text-sm">或点击下方按钮选择文件</p>
            </div>
            <Button
              onClick={handlePickFile}
              className="w-full cursor-pointer"
              size="lg"
            >
              <Upload className="mr-2 w-5 h-5" />
              选择文件
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* 网址导入标签页 */}
      {onUrlSelected && (
        <TabsContent value="url" className="min-h-80">
          <div className="flex flex-col justify-between bg-white p-8 border border-slate-200 border-dashed rounded-2xl h-full">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Link2 className="w-14 h-14 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-900 text-lg">网址导入</p>
                <p className="mt-1 text-slate-600 text-sm">每行一个网址，支持 HTTP/HTTPS</p>
              </div>
              <Textarea
                placeholder="http://example.com/audio1.mp3
http://example.com/audio2.mp3"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="min-h-20 font-mono text-sm resize-y"
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="w-full cursor-pointer"
                size="lg"
              >
                <Link2 className="mr-2 w-5 h-5" />
                添加 {urlInput.split("\n").filter(u => u.trim()).length > 0 ? `${urlInput.split("\n").filter(u => u.trim()).length} 个` : ""}
              </Button>
            </div>
          </div>
        </TabsContent>
      )}

      {/* 支持格式提示 */}
      <div className="mt-6 pt-4 border-slate-300 border-t">
        <p className="mb-2 font-medium text-slate-700 text-sm">支持的格式：</p>
        <p className="text-slate-600 text-xs">
          mp3、wav、flac、m4a、aac、ogg、opus、webm、mp4
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <input
        ref={dirInputRef}
        type="file"
        accept={acceptAttr}
        multiple
        className="hidden"
        onChange={handleDirChange}
      />
    </Tabs>
  );
}
