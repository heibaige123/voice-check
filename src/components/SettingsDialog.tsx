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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings();
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
      <DialogContent className="bg-white border-slate-200 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bold text-slate-950 text-2xl">
            <SettingsIcon className="w-5 h-5" />
            分贝检测配置
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-base">
            设置分贝阈值以标识异常音频文件
          </DialogDescription>
        </DialogHeader>

        <TooltipProvider>
          <div className="space-y-5 py-4">
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="size-3.5 text-yellow-500 cursor-help shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>平均分贝偏低</TooltipContent>
                  </Tooltip>
                  平均分贝最小阈值 (dB)
                </label>
                <p className="mb-2 text-slate-600 text-xs">
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
                  className="bg-slate-50 border-slate-300 focus:border-slate-400 rounded-lg text-slate-950 placeholder:text-slate-400 transition-all duration-200"
                />
              </div>

              <div className="space-y-2 pl-4 border-slate-300 border-l">
                <label className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="size-3.5 text-red-500 cursor-help shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>最大分贝过高</TooltipContent>
                  </Tooltip>
                  最大分贝最大阈值 (dB)
                </label>
                <p className="mb-2 text-slate-600 text-xs">
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
                  className="bg-slate-50 border-slate-300 focus:border-slate-400 rounded-lg text-slate-950 placeholder:text-slate-400 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="size-3.5 text-orange-500 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>文件体积超过限制</TooltipContent>
                </Tooltip>
                文件体积限制 (MB)
              </label>
              <p className="mb-2 text-slate-600 text-xs">
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
                className="bg-slate-50 border-slate-300 focus:border-slate-400 rounded-lg text-slate-950 placeholder:text-slate-400 transition-all duration-200"
              />
            </div>
          </div>
        </TooltipProvider>

        <DialogFooter className="gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-slate-200 hover:bg-slate-300 border-slate-300 rounded-lg text-slate-950 transition-all duration-200">
            取消
          </Button>
          <Button onClick={handleSave} className="bg-slate-500 hover:bg-slate-600 border-0 rounded-lg text-white transition-all duration-200">
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
