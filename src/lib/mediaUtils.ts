import { FileTypeTag } from "../types/audio";

/**
 * 支持的媒体文件扩展名
 */
const SUPPORTED_EXTENSIONS = [
  ".mp3", ".wav", ".flac", ".m4a", ".aac",
  ".ogg", ".opus", ".webm", ".mp4"
];

/**
 * 判断文件是否为有效的媒体文件
 */
export function isValidMediaFile(file: File): boolean {
  const name = file.name.toLowerCase();
  
  // 检查文件扩展名
  if (SUPPORTED_EXTENSIONS.some(ext => name.endsWith(ext))) {
    return true;
  }
  
  // 检查 MIME 类型
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
    return true;
  }
  
  return false;
}

/**
 * 获取文件类型标签
 */
export function getFileTypeTag(file: File): FileTypeTag {
  const name = file.name.toLowerCase();
  return file.type.startsWith("video/") || name.endsWith(".mp4")
    ? "视频"
    : "音频";
}

/**
 * 生成文件的唯一标识（用于去重）
 */
export function getFileKey(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}

/**
 * 生成唯一的文件 ID
 */
export function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified || Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * 检查文件大小是否超限
 */
export function checkFileSizeExceed(fileSizeBytes: number, maxSizeMB: number): boolean {
  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  return fileSizeMB > maxSizeMB;
}
