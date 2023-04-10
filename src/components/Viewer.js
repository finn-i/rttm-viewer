import React, { useEffect, useState } from 'react';
import "chart.js/auto";

import { Bar } from 'react-chartjs-2';
import rttm from './test.rttm';
import { computeHeadingLevel } from '@testing-library/react';

const Viewer = ({ file }) => {

  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState({ datasets: [] });

  const colours = ["#7B2D26", "#0B7A75", "#19535F", "#5E4C5A"]

  const getColour = (speaker, labels) => {
    return colours[labels.indexOf(speaker) % colours.length] + "E6  ";
  }

  useEffect(() => {
		if (file) {
			console.log("INNN")
			let reader = new FileReader();
			reader.onload = (e) => {
				const arr = e.target.result.split("\n");
				let filename = undefined;
				let out = [] || undefined;
				for (const idx in arr) {
					const line = arr[idx].split(" ");
					filename = line[1];
					out.push({
						speaker: line[7],
						start: parseFloat(line[3]),
						end: parseFloat(line[3]) + parseFloat(line[4])
					});
				}
				setData(out);
				const labels = [... new Set(out.map(x => x.speaker))];
				const outobj = {
					labels: [filename],
					datasets: out.map(elem => 
						({
							label: elem.speaker,
							data: [[elem.start, elem.end]],
							backgroundColor: getColour(elem.speaker, labels),
							barThickness: 50,
						})
					)
				}
				setGraphData(outobj);
			}
			reader.readAsText(file);
		}
  }, [file]);

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
   }
  };
  

  return (
    <div id="viewer-container">
      <Bar type="bar" options = { options } data = { graphData } />;
    </div>
  );
}

export default Viewer