import React, { useState } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import DropArea from "./DropArea.js";

const ChartViewer = () => {

  Chart.defaults.font.family = "Montserrat";
  Chart.defaults.font.size = 16;
  
  const [chartData, setChartData] = useState([]);

  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: (ad) => {
          const canvasParent = ad.scale.ctx.canvas.parentElement;
          if (
            Array.from(canvasParent.parentElement.children).indexOf(
              canvasParent
            ) ==
            canvasParent.parentElement.childElementCount - 1
          )
            return { color: "#eee" };
          else return { color: "transparent" };
        },
        grid: { color: "#555", drawBorder: false },
      },
      y: { stacked: true, ticks: { color: "#eee" }, grid: { display: false } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: () => null,
          label: (content) => {
            return (
              content.dataset.label +
              ": " +
              content.raw[0] +
              " - " +
              content.raw[1] +
              "s"
            );
          },
        },
      },
      legend: {
        display: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl",
          },
          mode: "x",
        },
        pan: {
          enabled: true,
        },
      },
    },
    elements: {
      bar: {
        borderSkipped: false, // Apply setting to all bar datasets
      },
    },
  };

  const removeGraphData = (idx) => {
    let newChartData = [...chartData];
    newChartData.splice(idx, 1);
    setChartData(newChartData);
  }

  return (
    <>
      <div className="viewer-container">
        <h1>RTTM Viewer</h1>
        <div id="legend-container">
          Duration Lock:<div id="legend-red" />Speaker Lock:<div id="legend-yellow" />Both Lock:<div id="legend-both" />
        </div>
        {chartData.map((data, index) => (
          <div className="chart-container" key={index}>
            <Bar data={data} options={options} />
            <span className="remove-button" onClick={(idx) => removeGraphData(idx)} >✕</span>
          </div>
        ))}
      </div>
      <DropArea setChartData={setChartData} />
    </>
  );
};

export default ChartViewer;
