import { useRef, useMemo } from "react";
import { Button } from "^/components/ui/button";
import { ACCEPTED_TYPES } from "../lib/constants";

interface ImportZoneProps {
  onFilesSelected: (files: FileList) => void;
  onDirSelected: (files: FileList) => void;
}

/**
 * 导入区域组件
 * 支持拖拽上传和点击选择文件/文件夹
 */
export function ImportZone({ onFilesSelected, onDirSelected }: ImportZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dirInputRef = useRef<HTMLInputElement | null>(null);
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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="bg-white/60 shadow-sm p-8 border border-slate-300 hover:border-slate-400 border-dashed rounded-lg text-center transition"
    >
      <div className="space-y-3">
        <p className="text-slate-700">将音频/视频文件拖拽到此处</p>
        <p className="text-slate-500 text-xs">或</p>
        <div className="flex justify-center items-center gap-3">
          <Button onClick={handlePickFile} className="cursor-pointer">选择文件</Button>
          <Button variant="outline" onClick={handlePickDir} className="cursor-pointer">选择文件夹</Button>
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
        <p className="text-slate-500 text-xs">
          支持格式：mp3, wav, flac, m4a, aac, ogg, opus, webm, mp4
        </p>
      </div>
    </div>
  );
}
