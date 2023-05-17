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

  let colours = ["#7B2D26", "#ef8a62", "#543005", "#8c510a", "#67a9cf", "#2166ac"];
  // let colours = ["#543005", "#8c510a", "#f5f5f5", "#c7eae5", "#35978f", "#01665e"];
  // let colours = ["#19535F", "#7B2D26", "#0B7A75", "#5E4C5A", "#254441", "#EF3054", "#B2B09B", "#F9DB6D", "#00FFC5"];
  // let colours = ["#19535F", "#7B2D26", "#0B7A75", "#5E4C5A"]; // original
  let colourMap = [];

  const getColour = (speaker, labels) => {
    let colour;
    if (colourMap.some(e => e.speaker == speaker)) {
      for (const item of colourMap) if (item.speaker == speaker) colour = item.colour;
    }
    else {
      colour = colours[(colourMap.length) % colours.length] + "E6";
      colourMap.push({speaker: speaker, colour: colour});
    }
    return colour;
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
      x: { 
        ticks: (ad) => { 
          const canvasParent = ad.scale.ctx.canvas.parentElement;
          if (Array.from(canvasParent.parentElement.children).indexOf(canvasParent) == canvasParent.parentElement.childElementCount-1) return { color: "#eee" }
          else return { color: "transparent" }
          }, 
        grid: { color: '#555', drawBorder: false } 
      },
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
        data.push({ speaker: lineArr[7], start: start, end: start + end, locked: lineArr[9] });
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
                ... (elem.locked === "1" && { // decorates locked regions
                  borderColor: "red",
                  borderWidth: 2
                }),
                locked: elem.locked,
              })
            ),
          }
      // setGraphData(prevData => [...prevData, outobj]);
      setData(outobj);
    }

    for (const file of files) {
      parseFile(file);
    }
  }, [files]);

  const compare = (a, b) => {
    if (a.labels && b.labels) {
      if (a.labels[0] < b.labels[0]) return -1;
      if ( a.labels[0] > b.labels[0]) return 1;
    }
    return 0;
  }

  const setData = (newData) => {
    setGraphData(prevData => {
      let found = false;
      let out;
      for (let i = 1; i < prevData.length; i++) {
        if (prevData[i].labels[0] === newData.labels[0]) {
          found = true;
        }
      }
      if (!found) out = [...prevData, newData];
      else out = [...prevData];
      return out.sort(compare);
    });
  };
  
  return (
    <>
      { 
        graphData && graphData.length > 0 && graphData.map((item, idx) => item.labels && (
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