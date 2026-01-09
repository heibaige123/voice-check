import { Button } from "^/components/ui/button";
import { Card, CardContent } from "^/components/ui/card";
import { ScrollArea } from "^/components/ui/scroll-area";
import { AudioItem, FileTypeTag } from "../types/audio";
import { formatBytes, formatDuration } from "../lib/formatters";

interface FileListProps {
  items: AudioItem[];
  onRemove: (id: string) => void;
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
  onClearAll,
  onAddFiles,
  getFileTypeTag,
}: FileListProps) {

  return (
    <div className="flex flex-col flex-1 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-2xl">媒体文件列表</h1>
          <p className="text-slate-600 text-sm">共 {items.length} 个文件</p>
        </div>
        <div className="flex gap-2 shrink-0">
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
                      <audio src={it.url} controls className="max-w-60 h-9" />
                      <Button
                        variant="ghost"
                        onClick={() => onRemove(it.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        移除
                      </Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
