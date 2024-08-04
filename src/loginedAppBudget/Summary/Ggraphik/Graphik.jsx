import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./Graphik.module.scss";

const Graphik = ({ graphickData, text }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!graphickData || typeof graphickData !== "object") {
      console.error("Invalid graphickData:", graphickData);
      return;
    }

    const months = Object.keys(graphickData).sort();
    const datasets = [];

    // Собираем данные для каждого типа трат
    const types = [
      ...new Set(months.flatMap((month) => Object.keys(graphickData[month]))),
    ];

    types.forEach((type) => {
      const data = months.map((month) => graphickData[month][type]?.total || 0);
      const color =
        graphickData[months.find((month) => graphickData[month][type])]?.[type]
          ?.color || "#000000";

      datasets.push({
        label: type,
        data,
        backgroundColor: color + "33", // Цвет фона с прозрачностью
        borderColor: color, // Цвет границы
        fill: false,
        tension: 0.1, // Лёгкая кривизна линии
      });
    });

    setChartData({
      labels: months,
      datasets,
    });
  }, [graphickData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: text.expence_by_month,
      },
    },
    elements: {
      line: {
        borderWidth: 2, // Толщина линии
      },
      point: {
        radius: 3, // Радиус точек на линии
        backgroundColor: "#ffffff", // Цвет точки
        borderColor: "#000000", // Цвет границы точки
        borderWidth: 1, // Толщина границы точки
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Цвет сетки по оси X
        },
        ticks: {
          color: "#000000", // Цвет подписей оси X
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Цвет сетки по оси Y
        },
        ticks: {
          color: "#000000", // Цвет подписей оси Y
        },
      },
    },
  };

  return (
    <div className={styles.graphik}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Graphik;
