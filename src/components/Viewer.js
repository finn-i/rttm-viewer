import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

import { Bar } from 'react-chartjs-2';

const Viewer = ({ files }) => {

  Chart.defaults.font.family = "Montserrat";
  Chart.defaults.font.size = 16;

  const [graphData, setGraphData] = useState([{ datasets: [] }]);

  const colours = ["#19535F", "#7B2D26", "#0B7A75", "#5E4C5A"]

  const getColour = (speaker, labels) => {
    return colours[labels.indexOf(speaker) % colours.length] + "E6";
  }

  const addGraphData = (item) => {
    let newGraphData = [...graphData, item];

    if (!newGraphData[0] || !newGraphData[0].labels) {
      newGraphData.shift(); // remove initial placeholder data
    }
    setGraphData(newGraphData);
  }

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
      }
    },
    elements: {
      bar: {
        borderSkipped: false // Apply setting to all bar datasets
      }
    }
  };

  useEffect(() => {
		if (files) {
      for (const file of files) { 
			  let reader = new FileReader();
			  reader.onload = (e) => {
          const arr = e.target.result.split("\n");
          let filename = file.name;
          let out = [] || undefined;
          for (const idx in arr) {
            const line = arr[idx].split(" ");
            out.push({
              speaker: line[7],
              start: parseFloat(line[3]),
              end: parseFloat(line[3]) + parseFloat(line[4])
            });
          }
          const labels = [...new Set(out.map(x => x.speaker))];
          const outobj = {
            labels: [filename],
            datasets: out.map(elem => 
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
          addGraphData(outobj);
        }
        reader.readAsText(file);
			}
		}
  }, [files]);
  
  return (
    <>
      {
        graphData[0] && graphData[0].labels && graphData.map((item, idx) => (
          <div className="graph" key={ idx }>
            <Bar type="bar" options={ options } data={ item } />
            <span onClick={() => removeGraphData(idx)} >✕</span>
          </div>
        ))
      }
    </>
  );
}

export default Viewer