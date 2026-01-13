import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export type ThemeMode = "light" | "dark";

export interface ThemeSettings {
  mode: ThemeMode;
  autoPlay: boolean; // 是否自动播放视频
}

const defaultThemeSettings: ThemeSettings = {
  mode: "light", // 默认亮色
  autoPlay: false,
};

const themeAtom = atomWithStorage<ThemeSettings>("voice-check-theme", defaultThemeSettings);

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme({
      ...theme,
      mode: theme.mode === "light" ? "dark" : "light",
    });
  };

  const updateTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    updateTheme,
  };
};
