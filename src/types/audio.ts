/**
 * 音频分析结果类型
 */
export interface AudioAnalysisResult {
  duration: number;
  sampleRate: number;
  points: { time: number; db: number }[];
  averageDb: number;
  maxDb: number;
}

/**
 * 音频/视频项类型定义
 */
export interface AudioItem {
  id: string;
  file: File;
  url: string;
  filePath?: string; // 临时或真实文件路径
  duration?: number | null;
  error?: string;
  analysisData?: AudioAnalysisResult;
  fileSizeExceed?: boolean; // 文件体积超过限制
}

/**
 * 文件类型标签
 */
export type FileTypeTag = "音频" | "视频";
