import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

const Viewer = ({ files }) => {

  Chart.defaults.font.family = "Montserrat";
  Chart.defaults.font.size = 16;
  Chart.register(zoomPlugin);

  const [graphData, setGraphData] = useState([{ datasets: [] }]);
  // const [graphData, setGraphData] = useState([]);

  const colours = ["#19535F", "#7B2D26", "#0B7A75", "#5E4C5A"]

  const getColour = (speaker, labels) => {
    return colours[labels.indexOf(speaker) % colours.length] + "E6";
  }

  // const addGraphData = (item) => {
  //   let newGraphData = [...graphData, ...item];
  //   // console.log(newGraphData)
  //   if (!newGraphData[0] || !newGraphData[0].labels) {
  //     newGraphData.shift(); // remove initial placeholder data
  //   }
  //   setGraphData(newGraphData);
  // }

  const removeGraphData = (idx) => {
    if (graphData.length === 1) {
      setGraphData([{ datasets: [] }]);
    } else {
      let newGraphData = [...graphData];
      newGraphData.splice(idx, 1);
      setGraphData(newGraphData);
    }
  }

  const options = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: { ticks: { color: "#eee" }, grid: { color: '#555', drawBorder: false } },
      y: { stacked: true, ticks: { color: "#eee" }, grid: { display: false } },
    },
    plugins: {
      tooltip: {
         callbacks: {
            title : () => null,
            label: (content) => { return content.dataset.label + ": " + content.raw[0] + " - " + content.raw[1] + "s" }
         }
      },
      legend: {
        display: false
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl",
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
        }
      }
    },
    elements: {
      bar: {
        borderSkipped: false // Apply setting to all bar datasets
      }
    },
  };

  useEffect(() => {
    if (!files) return;

    const parseFile = async (file) => {
      const content = await file.text();
      const lines = content.split('\n');
      const data = [];
      const filename = file.name;

      for (const line of lines) {
        const lineArr = line.split(' ');
        const start = parseFloat(lineArr[3]);
        const end = parseFloat(lineArr[4]);
        data.push({ speaker: lineArr[7], start: start, end: start + end });
      }
      const labels = [...new Set(data.map(x => x.speaker))];
      const outobj = {
            labels: [filename],
            datasets: data.map(elem => 
              ({
                label: elem.speaker,
                data: [[elem.start, elem.end]],
                backgroundColor: getColour(elem.speaker, labels),
                barThickness: 50,
                borderWidth: 1,
                borderColor: "#999",
                hoverBorderColor: "#eee",
                hoverBorderWidth: 2,
              })
            )
          }
      // setGraphData(prevData => [...prevData, outobj]);
      setData(outobj);
    }

    for (const file of files) {
      parseFile(file);
    }
  }, [files]);

  const setData = (newData) => {
    setGraphData(prevData => [...prevData, newData]);
  };
  
  return (
    <>
      { 
        graphData.length > 0 && graphData.map((item, idx) => item.labels && (
          <div className="graph" key={ idx }>
            <Bar key={JSON.stringify(item)} type="bar" options={ options } data={ item } />
            <span onClick={() => removeGraphData(idx)} >✕</span>
          </div>
        ))
      }
    </>
  );
}

export default Viewer