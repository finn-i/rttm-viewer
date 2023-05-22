import React, { useState } from 'react';

const DropArea = ({ setChartData }) => {

	const [hovering, setHovering] = useState(false);

  let colours = ["#7B2D26", "#ef8a62", "#4d5405", "#1a5405", "#67a9cf", "#2166ac"];
  let colourMap = [];

  const getColour = (speaker) => {
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

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    processFiles(files);
  };

  const handleDragEnter = (evt) => {
    evt.preventDefault();
		setHovering(true);
  }
	
	const handleDragOver = (evt) => {
    evt.preventDefault();
  }
	
	const handleDragLeave = (evt) => {
    evt.preventDefault();
		setHovering(false);
  }

  const handleChoose = (evt) => {
    evt.preventDefault();
    let input = document.createElement("input");
    input.type = "file";
    input.setAttribute("multiple", "");
    input.onchange = (evt) => { 
      const newFiles = Array.from(evt.target.files);
      processFiles(newFiles); 
    }
    input.click();
  }

  const processFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rttmData = e.target.result;
        const chartDataEntry = processRTTMData(rttmData, files[i].name);
        setChartData((prevChartData) => [...prevChartData, chartDataEntry]);
      };
      reader.readAsText(files[i]);
    }
  };

  const processRTTMData = (rttmData, filename) => {
    const lines = rttmData.split("\n");
    const regionData = [];

    lines.forEach((line) => {
      const cols = line.split(" ");
      if (cols.length >= 9) {
        const start = parseFloat(cols[3]);
        const duration = parseFloat(cols[4]);
        const speaker = cols[7];
        const dur_lock = cols[9];
        const spkr_lock = cols[10];
        regionData.push({ start: start, end: start + duration, speaker: speaker, dur_lock: dur_lock, spkr_lock: spkr_lock });
      }
    });

    let width, height, gradient;
    const getGradient = (ctx, chartArea) => {
      const chartWidth = chartArea.right - chartArea.left;
      const chartHeight = chartArea.bottom - chartArea.top;
      if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0.45, "yellow");
        gradient.addColorStop(0.65, "red");
      }
      return gradient;
    }

    const chartDataEntry = {
      labels: [filename],
      datasets: regionData.map(elem => 
        ({
          label: elem.speaker,
          data: [[elem.start, elem.end]],
          backgroundColor: getColour(elem.speaker),
          barThickness: 50,
          borderWidth: 2,
          borderColor: "#eee",
          hoverBorderColor: "#eee",
          hoverBorderWidth: 3,
          ... (elem.dur_lock === "1" && { // decorates duration_locked regions
            borderColor: "red",
            borderWidth: 4
          }),
          ... (elem.spkr_lock === "1" && { // decorates speaker_locked regions
            borderColor: "yellow",
            borderWidth: 4
          }),
          ... (elem.spkr_lock === "1" && elem.dur_lock === "1" && { // decorates speaker_locked regions
            borderColor: (context) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) return;
            return getGradient(ctx, chartArea);
          },
          }),
          // locked: elem.locked,
        })
      ),
    };
    return chartDataEntry;
  }

  return (
    <div 
      id="drag-drop" 
      className={ hovering ? "drag-over" : null } 
      onDrop={ handleDrop }
      onDragOver = { handleDragOver}
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave } 
      ><span><a onClick={ handleChoose }>Choose</a> a file or drag it here</span>
    </div>
  );
};

export default DropArea;
