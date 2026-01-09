import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { formatDuration } from "../lib/formatters";

interface AnalysisChartProps {
  data: { time: number; db: number; }[];
  height?: number;
  variant?: "default" | "simple";
}

export function AnalysisChart({
  data,
  height = 300,
  variant = "default",
}: AnalysisChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // 初始化图表实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const isSimple = variant === "simple";

    // 准备数据
    // ECharts 推荐使用二维数据 [[x, y], [x, y], ...] 用于折线图
    const seriesData = data.map((d) => [d.time, d.db]);

    const option: echarts.EChartsOption = {
      animation: !isSimple, // 简略图禁用动画以提升列表性能
      grid: isSimple
        ? { top: 5, bottom: 5, left: 10, right: 10 }
        : { top: 30, bottom: 25, left: 50, right: 30 },
      tooltip: isSimple
        ? { show: false }
        : {
          trigger: "axis",
          axisPointer: { type: "line" },
          formatter: (params: any) => {
            const p = params[0];
            return `Time: ${formatDuration(p.value[0], true)}<br/>Volume: ${p.value[1].toFixed(2)} dB`;
          },
        },
      xAxis: {
        type: "value",
        show: !isSimple,
        min: "dataMin",
        max: "dataMax",
        name: "Time(s)",
        nameLocation: "middle",
        nameGap: 20,
        axisLabel: { color: "#64748b" },
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        show: !isSimple,
        min: 40,
        max: 100,
        name: "dB",
        axisLabel: { color: "#64748b" },
        axisLine: { show: false },
        splitLine: {
          show: !isSimple,
          lineStyle: {
            color: "#e2e8f0",
            type: "dashed",
          },
        },
      },
      series: [
        {
          data: seriesData,
          type: "line",
          smooth: true,
          silent: isSimple,
          showSymbol: false, // 只有 hover 时显示点，或者完全不显示
          symbol: "circle",
          symbolSize: 6,
          itemStyle: {
            color: isSimple ? "#cbd5e1" : "#2563eb",
          },
          lineStyle: {
            width: 1.5,
          },
          // 标记线 (MarkLine) - 原始 -20dB 现对应 80
          markLine: {
            symbol: "none",
            label: {
              show: !isSimple,
              color: "orange",
              formatter: "{b}",
              position: "end",
            },
            lineStyle: {
              color: "orange",
              type: "dashed",
              width: 1,
            },
            data: [
              {
                yAxis: 80,
                name: "80dB",
              },
            ],
            animation: false,
            silent: true,
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data, height, variant]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex justify-center items-center bg-slate-50 border rounded-md text-slate-400"
      >
        暂无数据
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height,
        minWidth: variant === "simple" ? 100 : 300,
        overflow: "hidden",
      }}
    />
  );
}
