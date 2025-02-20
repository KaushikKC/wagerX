"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const data = {
  labels: ["1d", "2d", "3d", "4d", "5d", "6d", "7d"],
  datasets: [
    {
      label: "Dataset 1",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "#F81DFB",
      backgroundColor: "rgba(232, 121, 249, 0.5)",
      tension: 0.4,
    },
    {
      label: "Dataset 2",
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: "#22c55e",
      backgroundColor: "rgba(34, 197, 94, 0.5)",
      tension: 0.4,
    },
  ],
};

export function MarketChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
              y: {
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="rounded-xl bg-black/20 p-6 backdrop-blur-xl">
      <canvas ref={chartRef} />
    </div>
  );
}
