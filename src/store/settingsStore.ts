import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export interface Settings {
  minDbThreshold: number;  // 平均分贝最小阈值
  maxDbThreshold: number;  // 最大分贝最大阈值
  maxFileSizeMB: number;   // 文件最大的大小 (MB)
}

// 默认配置
const defaultSettings: Settings = {
  minDbThreshold: 80,  
  maxDbThreshold: 94,   
  maxFileSizeMB: 5,   // 默认上限 5 MB
};

// 使用 atomWithStorage 实现持久化到 localStorage
const settingsAtom = atomWithStorage<Settings>("voice-check-settings", defaultSettings);

export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return {
    settings,
    updateSettings,
  };
};
