/**
 * 格式化工具函数
 */

/**
 * 格式化字节数为可读的文件大小
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * 格式化秒数为 xxHxxMxxS 格式
 * 为0的项不展示
 */
export function formatDuration(
  seconds?: number | null,
  keepDecimal = false
): string {
  if (seconds == null || !Number.isFinite(seconds)) return "--";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = keepDecimal ? seconds % 60 : Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);

  if (s > 0 || parts.length === 0) {
    parts.push(`${keepDecimal ? s.toFixed(2) : s}s`);
  }

  return parts.join("");
}
