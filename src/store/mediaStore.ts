import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { AudioItem, AudioAnalysisResult } from "../types/audio";
import { useSettings } from "./settingsStore";
import {
  isValidMediaFile,
  getFileTypeTag,
  getFileKey,
  generateFileId,
  checkFileSizeExceed
} from "../lib/mediaUtils";

// Atoms
const itemsAtom = atom<AudioItem[]>([]);
const importDialogOpenAtom = atom<boolean>(false);

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

  const cleanup = () => {
    media.removeEventListener("loadedmetadata", onLoaded as EventListener);
    media.removeEventListener("error", onError as EventListener);
  };

  const onLoaded = () => {
    onUpdate(item.id, media.duration);
    cleanup();
  };

  const onError = () => {
    onUpdate(item.id, null, "无法读取媒体元数据");
    cleanup();
  };

  media.addEventListener("loadedmetadata", onLoaded as EventListener, { once: true } as AddEventListenerOptions);
  media.addEventListener("error", onError as EventListener, { once: true } as AddEventListenerOptions);
}

export const useMediaStore = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const [importDialogOpen, setImportDialogOpen] = useAtom(importDialogOpenAtom);
  const { settings } = useSettings();

  const addFromUrl = async (url: string) => {
    // 验证 URL 格式
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error("请输入有效的网址（http:// 或 https://）");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error(`无法加载网址：${response.statusText}`);
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      const blob = await response.blob();

      // 检查文件体积
      const fileSizeExceed = checkFileSizeExceed(blob.size, settings.maxFileSizeMB);
      if (fileSizeExceed) {
        const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        toast.warning(`文件体积较大 (${fileSizeMB} MB)，已上传，但将显示警告`);
      }

      // 从 URL 中提取文件名
      const urlPath = new URL(url).pathname;
      const fileName = urlPath.split("/").pop() || "media-file";
      const file = new File([blob], fileName, { type: contentType });

      if (!isValidMediaFile(file)) {
        toast.error("该网址不是支持的音频或视频格式");
        return;
      }

      const newItem: AudioItem = {
        id: generateFileId(file),
        file,
        url: URL.createObjectURL(file),
        duration: undefined,
        fileSizeExceed,
      };

      setItems((prev) => [...prev, newItem]);
      loadMediaDuration(newItem, updateItemDuration);

      toast.success("已成功从网址添加媒体文件");
      setImportDialogOpen(false);
    } catch (error) {
      console.error("Failed to load media from URL:", error);
      toast.error("加载网址失败，请检查网址是否正确");
    }
  };

  const updateItemDuration = (id: string, duration: number | null, error?: string) => {
    setItems((currentItems) =>
      currentItems.map((it) =>
        it.id === id ? { ...it, duration, error: error || it.error } : it
      )
    );
  };

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(isValidMediaFile);

    const newItems: AudioItem[] = files.map((file) => ({
      id: generateFileId(file),
      file,
      url: URL.createObjectURL(file),
      duration: undefined,
      fileSizeExceed: checkFileSizeExceed(file.size, settings.maxFileSizeMB),
    }));

    // 去重
    const existingKeys = new Set(items.map((item) => getFileKey(item.file)));
    const uniqueNew = newItems.filter(
      (item) => !existingKeys.has(getFileKey(item.file))
    );

    if (uniqueNew.length < newItems.length) {
      toast.warning("检测到重复文件，已自动过滤");
    }

    if (uniqueNew.length === 0) {
      setImportDialogOpen(false);
      return;
    }

    setItems((prev) => [...prev, ...uniqueNew]);
    uniqueNew.forEach((item) => loadMediaDuration(item, updateItemDuration));

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
    addFromUrl,
    removeItem,
    clearAll,
    setImportDialogOpen,
    getFileTypeTag,
    setAnalysisData,
  };
};
