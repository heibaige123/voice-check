import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { AudioItem, FileTypeTag, AudioAnalysisResult } from "../types/audio";
import { ACCEPTED_TYPES } from "../lib/constants";

// Atoms
const itemsAtom = atom<AudioItem[]>([]);
const importDialogOpenAtom = atom<boolean>(false);

/**
 * 生成文件的唯一标识（用于去重）
 */
function getFileKey(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}

/**
 * 判断文件是否为有效的媒体文件
 */
function isValidMediaFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("audio/")) return true;
  return ACCEPTED_TYPES.some((t) =>
    t.startsWith(".") ? name.endsWith(t) : file.type === t
  );
}

/**
 * 获取文件类型标签
 */
function getFileTypeTag(file: File): FileTypeTag {
  const name = file.name.toLowerCase();
  return file.type.startsWith("video/") || name.endsWith(".mp4")
    ? "视频"
    : "音频";
}

/**
 * 读取媒体文件的元数据（时长）
 */
function loadMediaDuration(
  item: AudioItem,
  onUpdate: (id: string, duration: number | null, error?: string) => void
): void {
  const isVideo =
    item.file.type.startsWith("video/") ||
    item.file.name.toLowerCase().endsWith(".mp4");
  const media: HTMLMediaElement = isVideo
    ? document.createElement("video")
    : new Audio();

  media.preload = "metadata";
  media.src = item.url;

  const onLoaded = () => {
    onUpdate(item.id, media.duration);
    cleanup();
  };

  const onError = () => {
    onUpdate(item.id, null, "无法读取媒体元数据");
    cleanup();
  };

  const cleanup = () => {
    media.removeEventListener("loadedmetadata", onLoaded as EventListener);
    media.removeEventListener("error", onError as EventListener);
  };

  media.addEventListener(
    "loadedmetadata",
    onLoaded as EventListener,
    {
      once: true,
    } as AddEventListenerOptions
  );
  media.addEventListener(
    "error",
    onError as EventListener,
    {
      once: true,
    } as AddEventListenerOptions
  );
}

export const useMediaStore = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const [importDialogOpen, setImportDialogOpen] = useAtom(importDialogOpenAtom);

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);

    // 过滤有效的媒体文件
    const validFiles = files.filter(isValidMediaFile);

    // 创建 AudioItem 对象
    const newItems: AudioItem[] = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
      duration: undefined,
    }));

    // 创建现有文件的 key 集合，用于去重
    const existingKeys = new Set(items.map((item) => getFileKey(item.file)));

    // 过滤出不存在的新文件
    const uniqueNew = newItems.filter(
      (item) => !existingKeys.has(getFileKey(item.file))
    );

    // 如果有重复文件，提示用户
    if (uniqueNew.length < newItems.length) {
      toast.warning("检测到重复文件，已自动过滤");
    }

    if (uniqueNew.length === 0) {
      setImportDialogOpen(false);
      return;
    }

    setItems((prev) => [...prev, ...uniqueNew]);

    // 异步读取时长
    uniqueNew.forEach((item) => {
      loadMediaDuration(
        item,
        (id: string, duration: number | null, error?: string) => {
          setItems((currentItems) =>
            currentItems.map((it) =>
              it.id === id ? { ...it, duration, error: error || it.error } : it
            )
          );
        }
      );
    });

    setImportDialogOpen(false);
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((x) => x.id === id);
      if (item) {
        URL.revokeObjectURL(item.url);
      }
      return currentItems.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    setItems((currentItems) => {
      currentItems.forEach((x) => URL.revokeObjectURL(x.url));
      return [];
    });
  };

  const setAnalysisData = (id: string, data: AudioAnalysisResult) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, analysisData: data } : item
      )
    );
  };

  return {
    items,
    importDialogOpen,
    addFiles,
    removeItem,
    clearAll,
    setImportDialogOpen,
    getFileTypeTag,
    setAnalysisData,
  };
};
