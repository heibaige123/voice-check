import { AudioAnalysisResult } from "../types/audio";

/**
 * 分析音频文件的分贝数据
 * @param url 音频文件 URL
 * @param samplesPerSecond 每秒采样点数（默认 10 个点，即 100ms 一个点）
 */
export async function analyzeAudio(
  url: string,
  samplesPerSecond: number = 10
): Promise<AudioAnalysisResult> {
  // 1. 获取音频数据
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // 2. 解码音频
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // 3. 获取 PCM 数据（通常取第一个声道）
  const rawData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;

  // 计算相关参数
  const duration = audioBuffer.duration;
  const blockSize = Math.floor(sampleRate / samplesPerSecond); // 每个点对应的数据块大小
  const totalPoints = Math.floor(rawData.length / blockSize);

  const points: { time: number; db: number }[] = [];
  let totalDb = 0;
  let maxDb = -Infinity;

  // 4. 分块计算 RMS 和 dB
  for (let i = 0; i < totalPoints; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, rawData.length);
    let sum = 0;

    for (let j = start; j < end; j++) {
      sum += rawData[j] * rawData[j];
    }

    const rms = Math.sqrt(sum / (end - start));
    // 防止 rms 为 0 导致 -Infinity，设置最小底噪为 -100dB
    // 原始计算为 dBFS (通常为负数)，为了直观展示，增加 +100 偏移量，使其变为 0-100 的正数区间
    const dbFS = rms > 0 ? 20 * Math.log10(rms) : -100;
    const db = dbFS + 100;

    // 简单的噪音门限，让图表更好看，小于 40 (即原 -60dB) 只有非常微弱的声音
    const normalizedDb = Math.max(db, 40);

    points.push({
      time: parseFloat((i / samplesPerSecond).toFixed(2)),
      db: parseFloat(normalizedDb.toFixed(2)),
    });

    totalDb += normalizedDb;
    if (normalizedDb > maxDb) maxDb = normalizedDb;
  }

  // 关闭 AudioContext 释放资源
  await audioContext.close();

  return {
    duration,
    sampleRate,
    points,
    averageDb: totalDb / totalPoints,
    maxDb,
  };
}
