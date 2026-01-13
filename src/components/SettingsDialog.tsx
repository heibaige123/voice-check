import { useState } from "react";
import { Button } from "^/components/ui/button";
import { Input } from "^/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "^/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "^/components/ui/tooltip";
import { Settings, useSettings } from "../store/settingsStore";
import { Settings as SettingsIcon, AlertTriangle, AlertCircle } from "lucide-react";
import { useTheme } from "../store/themeStore";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings();
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  const handleSave = () => {
    updateSettings(tempSettings);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempSettings(settings);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-lg rounded-2xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-2xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
            <SettingsIcon className="w-5 h-5" />
            分贝检测配置
          </DialogTitle>
          <DialogDescription className={`text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            设置分贝阈值以标识异常音频文件
          </DialogDescription>
        </DialogHeader>

        <TooltipProvider>
          <div className="space-y-5 py-4">
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label className={`font-medium text-sm flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="size-3.5 text-yellow-500 cursor-help shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>平均分贝偏低</TooltipContent>
                  </Tooltip>
                  平均分贝最小阈值 (dB)
                </label>
                <p className={`mb-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  小于此值的文件将显示警告
                </p>
                <Input
                  type="number"
                  value={tempSettings.minDbThreshold}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      minDbThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="例如：-40"
                  step="0.1"
                  className={`rounded-lg transition-all duration-200 ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600" : "bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-slate-400"}`}
                />
              </div>

              <div className={`space-y-2 pl-4 border-l ${isDark ? "border-slate-600" : "border-slate-300"}`}>
                <label className={`font-medium text-sm flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="size-3.5 text-red-500 cursor-help shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>最大分贝过高</TooltipContent>
                  </Tooltip>
                  最大分贝最大阈值 (dB)
                </label>
                <p className={`mb-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  大于此值的文件将显示警告
                </p>
                <Input
                  type="number"
                  value={tempSettings.maxDbThreshold}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      maxDbThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="例如：-6"
                  step="0.1"
                  className={`rounded-lg transition-all duration-200 ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600" : "bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-slate-400"}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium text-sm flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="size-3.5 text-orange-500 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>文件体积超过限制</TooltipContent>
                </Tooltip>
                文件体积限制 (MB)
              </label>
              <p className={`mb-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                超过此大小的文件将显示警告
              </p>
              <Input
                type="number"
                value={tempSettings.maxFileSizeMB}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    maxFileSizeMB: parseFloat(e.target.value) || 500,
                  })
                }
                placeholder="例如：500"
                step="10"
                min="10"
                className={`rounded-lg transition-all duration-200 ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600" : "bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-slate-400"}`}
              />
            </div>
          </div>
        </TooltipProvider>

        <DialogFooter className="gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className={`rounded-lg transition-all duration-200 ${isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-950"}`}>
            取消
          </Button>
          <Button onClick={handleSave} className={`border-0 text-white rounded-lg transition-all duration-200 ${isDark ? "bg-slate-600 hover:bg-slate-700" : "bg-slate-500 hover:bg-slate-600"}`}>
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
