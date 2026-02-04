import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "echarts-liquidfill";

interface TankGaugeProps {
  percent: number;
  displayValue?: number; // Optional: value to display (e.g., liters)
  unit?: string; // Optional: unit to show (default: "%")
  width?: number;
  height?: number;
  label?: string;
  showLabel?: boolean;
}

export function TankGauge({ percent, displayValue, unit = "%", width = 160, height = 300, label = "Tank", showLabel = false }: TankGaugeProps) {
  const chartRef = useRef<any>(null);

  // Display value: Use displayValue if provided, otherwise use percent
  const displayTargetValue = displayValue !== undefined ? displayValue : percent;

  // Chart value: Clamped 0-100 just for the visual
  const chartTargetValue = Math.min(Math.max(percent, 0), 100);

  const [animatedValue, setAnimatedValue] = useRefState(0);

  // use a ref to track the animation frame to clear it properly
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(0);

  // Need to detect changes to displayTargetValue to trigger animation
  useEffect(() => {
    startValueRef.current = animatedValue;
    startTimeRef.current = null;

    // On Mount, if we want to start from 0 explicitly even if animatedValue was persisted (it isn't here),
    // we can check if it's the very first run. But here startValueRef.current defaults to 0 which is correct for mount.

    const duration = 2000;

    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }
      const timeElapsed = time - startTimeRef.current;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease out cubic to match ECharts default
      const ease = 1 - Math.pow(1 - progress, 3);

      const nextValue = startValueRef.current + (displayTargetValue - startValueRef.current) * ease;
      setAnimatedValue(nextValue);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [displayTargetValue]);

  // ECharts logic
  const chartValue = chartTargetValue / 100; // Liquid fill uses 0-1
  const chartSize = Math.max(width, height);
  const aspectRatio = width / height;

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.setOption({
        series: [
          {
            data: [chartValue],
          },
        ],
      });
      chartInstance.resize({ width: chartSize, height: chartSize });
    }
  }, [chartValue, chartSize]);

  const pathWidth = 1000;
  const pathHeight = 1000 / aspectRatio;
  const r = 40;
  const w = pathWidth;
  const h = pathHeight;

  const tankPath = `path://M ${r},0 L ${w - r},0 Q ${w},0 ${w},${r} L ${w},${h - r} Q ${w},${h} ${w - r},${h} L ${r},${h} Q 0,${h} 0,${h - r} L 0,${r} Q 0,0 ${r},0 Z`;

  const option = {
    series: [
      {
        type: "liquidFill",
        data: [chartValue],
        shape: tankPath,
        radius: "95%",
        center: ["50%", "50%"],
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#38bdf8" },
              { offset: 0.5, color: "#0ea5e9" },
              { offset: 1, color: "#0284c7" },
            ],
          },
        ],
        backgroundStyle: {
          color: "#f0f9ff",
          borderWidth: 2,
          borderColor: "#e0f2fe",
          shadowColor: "rgba(14, 165, 233, 0.1)",
          shadowBlur: 5,
        },
        label: {
          show: false, // Hide default label to use custom overlay
        },
        outline: {
          show: true,
          borderDistance: 0,
          itemStyle: {
            borderWidth: 4,
            borderColor: "#0ea5e9",
            shadowBlur: 10,
            shadowColor: "rgba(14, 165, 233, 0.5)",
          },
        },
        itemStyle: {
          opacity: 0.85,
          shadowBlur: 0,
        },
        emphasis: {
          itemStyle: {
            opacity: 0.95,
          },
        },
        amplitude: 8,
        waveLength: "80%",
        phase: 0,
        period: 3000,
        direction: "right",
        waveAnimation: true,
        animationDuration: 2000,
        animationEasing: "cubicOut",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Container with exact target dimensions that clips the overflowing chart */}
      <div
        className="relative overflow-hidden"
        style={{
          width,
          height,
        }}
      >
        {/* Chart Container */}
        <div
          style={{
            width: chartSize,
            height: chartSize,
            marginLeft: -(chartSize - width) / 2,
            marginTop: 0,
          }}
        >
          <ReactECharts
            ref={chartRef}
            echarts={echarts}
            option={option}
            style={{ height: chartSize, width: chartSize }}
            opts={{ renderer: "svg" }}
            notMerge={false}
            lazyUpdate={true}
          />
        </div>

        {/* Custom Number Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <span
            className="font-bold text-ink drop-shadow-md"
            style={{
              fontSize: Math.min(width, height) / 5,
              color: "#ffffff",
            }}
          >
            {animatedValue.toFixed(2)} {unit}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span className="text-lg font-bold text-ink">{label}</span>
        </div>
      )}
    </div>
  );
}

// Helper hook for state that is readable in callbacks if needed, or just standard useState
function useRefState<T>(initialValue: T): [T, (val: T) => void] {
  const [state, setState] = useState(initialValue);
  return [state, setState];
}
