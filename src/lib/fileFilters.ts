import { AudioItem } from "../types/audio";
import { Settings as SettingsType } from "../store/settingsStore";
import { FilterType } from "../components/FilterBar";

/**
 * 根据筛选条件过滤文件列表
 * 多个筛选条件需要同时满足（AND 逻辑）
 */
export function filterItems(
  items: AudioItem[],
  filterTypes: FilterType[],
  settings: SettingsType
): AudioItem[] {
  // 如果没有筛选项选中，显示全部
  if (filterTypes.length === 0) {
    return items;
  }

  return items.filter((item) => {
    const avgDbLow = item.analysisData && item.analysisData.averageDb < settings.minDbThreshold;
    const maxDbHigh = item.analysisData && item.analysisData.maxDb > settings.maxDbThreshold;
    const hasSizeExceed = item.fileSizeExceed;

    // 使用 every() 确保所有选中的筛选条件都满足
    return filterTypes.every((type) => {
      switch (type) {
        case 'size':
          return hasSizeExceed;
        case 'avgDb':
          return avgDbLow;
        case 'maxDb':
          return maxDbHigh;
        default:
          return false;
      }
    });
  });
}
