import React, { useEffect, useRef, useState, useMemo } from "react";
import { createChart, type Time } from "lightweight-charts";

interface ChartProps {
  title: string;
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }[];
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ title, data, height = 300 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [activeTimeframe, setActiveTimeframe] = useState("ALL");

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    const now = new Date().getTime() / 1000;
    const filterTime = {
      "1D": now - 24 * 60 * 60,
      "5D": now - 5 * 24 * 60 * 60,
      "1M": now - 30 * 24 * 60 * 60,
      "3M": now - 90 * 24 * 60 * 60,
      "1Y": now - 365 * 24 * 60 * 60,
      "ALL": 0,
    } as const;

    return data.filter((item) => item.time >= filterTime[activeTimeframe as keyof typeof filterTime]);
  }, [data, activeTimeframe]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#000000" },
        textColor: "#999999",
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#1a1a1a",
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: "#1a1a1a",
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#555",
          width: 1,
          style: 2,
        },
        horzLine: {
          color: "#555",
          width: 1,
          style: 2,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    // Add area series for the main price chart
    const areaSeries = chart.addAreaSeries({
      lineColor: "#00BCD4",
      topColor: "rgba(0, 188, 212, 0.4)",
      bottomColor: "rgba(0, 188, 212, 0)",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 8,
        minMove: 0.00000001,
      },
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: "#00BCD4",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume"
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      alignLabels: true,
    });

    // Transform data for area series
    const areaData = filteredData.map((d) => ({
      time: d.time as Time,
      value: d.close,
    }));

    // Transform data for volume series
    const volumeData = filteredData.map((d) => ({
      time: d.time as Time,
      value: d.volume || 0,
      color: d.close >= d.open ? "#00BCD4" : "#E91E63",
    }));

    areaSeries.setData(areaData);
    volumeSeries.setData(volumeData);
    chartRef.current = chart;

    // Fit the content after setting data
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [filteredData, height]);

  const latestData = filteredData[filteredData.length - 1] || { open: 0, high: 0, low: 0, close: 0, volume: 0 };

  return (
    <div
      className="w-full bg-black rounded-lg p-4"
      style={{ backgroundColor: "black", zIndex: 1000, border: "1px solid #1a1a1a" }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white uppercase">${title}</span>
            <button className="bg-transparent border border-gray-700 rounded p-1">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18"
                />
              </svg>
            </button>
            <button className="p-1">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-400">
          <div>O {latestData.open.toFixed(8)}</div>
          <div>H {latestData.high.toFixed(8)}</div>
          <div>L {latestData.low.toFixed(8)}</div>
          <div>C {latestData.close.toFixed(8)}</div>
          <div className="col-span-4">Vol {latestData.volume?.toFixed(8)}</div>
        </div>
      </div>
      <div ref={chartContainerRef} className="mt-4" />
      <div className="flex items-center justify-start space-x-4 mt-4">
        {["1D", "5D", "1M", "3M", "1Y", "ALL"].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setActiveTimeframe(timeframe)}
            className={`px-3 py-1 text-sm rounded ${
              activeTimeframe === timeframe 
                ? "bg-[#00BCD4] text-black font-semibold" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;
