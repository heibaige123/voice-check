import { AudioItem } from "../types/audio";
import { analyzeAudio } from "./audioAnalyzer";
import { AudioAnalysisResult } from "../types/audio";
import { toast } from "sonner";

/**
 * 批量分析音频文件
 */
export async function batchAnalyzeItems(
  items: AudioItem[],
  onUpdateAnalysis: (id: string, data: AudioAnalysisResult) => void,
  onProgressUpdate: (analyzingId: string) => void
): Promise<void> {
  let itemsToAnalyze = items.filter((item) => !item.analysisData);

  if (itemsToAnalyze.length === 0) {
    if (items.length === 0) {
      toast.info("没有文件可分析");
      return;
    }
    toast.info("重新分析所有文件...");
    itemsToAnalyze = items;
  } else {
    toast.info(`开始分析 ${itemsToAnalyze.length} 个文件...`);
  }

  const toastId = toast.loading(`准备分析 ${itemsToAnalyze.length} 个文件...`);

  try {
    for (let i = 0; i < itemsToAnalyze.length; i++) {
      const item = itemsToAnalyze[i];

      toast.loading(`正在分析 (${i + 1}/${itemsToAnalyze.length}): ${item.file.name}`, {
        id: toastId,
      });

      onProgressUpdate(item.id);

      try {
        const result = await analyzeAudio(item.url, 20);
        onUpdateAnalysis(item.id, result);
      } catch (error) {
        console.error(`Failed to analyze ${item.file.name}:`, error);
      }
    }
    toast.success("批量分析完成", { id: toastId });
  } catch (error) {
    console.error("Batch analysis error:", error);
    toast.error("批量分析意外中断", { id: toastId });
  }
}
