import { Settings as SettingsType } from "../store/settingsStore";

export type FilterType = 'size' | 'avgDb' | 'maxDb';

interface FilterBarProps {
  filterTypes: FilterType[];
  isDark: boolean;
  settings: SettingsType;
  onToggleFilter: (type: FilterType) => void;
}

export function FilterBar({ filterTypes, isDark, settings, onToggleFilter }: FilterBarProps) {
  const getButtonClasses = (isActive: boolean, activeClasses: string) => {
    const baseClasses = "px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm";
    const inactiveClasses = isDark
      ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 border-slate-700"
      : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 border-slate-200";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 mb-3 rounded-2xl shadow ${
      isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-200"
    }`}>
      <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        筛选
      </span>
      <div className={`h-4 w-px ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onToggleFilter('avgDb')}
          className={getButtonClasses(
            filterTypes.includes('avgDb'),
            isDark
              ? "bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-600/20"
              : "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 shadow-yellow-400/30"
          )}
        >
          分贝平均阈值过小 <span className="opacity-75">({settings.minDbThreshold}dB)</span>
        </button>
        <button
          onClick={() => onToggleFilter('maxDb')}
          className={getButtonClasses(
            filterTypes.includes('maxDb'),
            isDark
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
              : "bg-red-400 hover:bg-red-500 text-red-950 shadow-red-400/30"
          )}
        >
          分贝最大阈值过大 <span className="opacity-75">({settings.maxDbThreshold}dB)</span>
        </button>
        <button
          onClick={() => onToggleFilter('size')}
          className={getButtonClasses(
            filterTypes.includes('size'),
            isDark
              ? "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20"
              : "bg-orange-400 hover:bg-orange-500 text-orange-950 shadow-orange-400/30"
          )}
        >
          体积超限 <span className="opacity-75">({settings.maxFileSizeMB}MB)</span>
        </button>
      </div>
    </div>
  );
}
