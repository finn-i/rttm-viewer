import React, { useState } from 'react';

const DropArea = ({ setChartData }) => {

	const [hovering, setHovering] = useState(false);

  let colours = ["#7B2D26", "#ef8a62", "#543005", "#8c510a", "#67a9cf", "#2166ac"];
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
        console.log(files[i].name)
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
        const locked = cols[9];
        regionData.push({ start: start, end: start + duration, speaker: speaker, locked: locked });
      }
    });

    const chartDataEntry = {
      labels: [filename],
      datasets: regionData.map(elem => 
        ({
          label: elem.speaker,
          data: [[elem.start, elem.end]],
          backgroundColor: getColour(elem.speaker),
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
