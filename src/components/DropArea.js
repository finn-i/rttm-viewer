import React, { useEffect, useState } from 'react';

const DropArea = () => {

  const [data, setData] = useState([]);

  const handleDrop = (evt) => {
    console.log("File(s) dropped.");
    evt.preventDefault();
    let file = evt.dataTransfer.files[0];
    console.log(file);
  }

  const handleDragOver = (evt) => {
    evt.preventDefault();
  }
  

  return (
    <div id="drop-area" onDrop={ handleDrop } onDragOver={ handleDragOver }></div>
  );
}

export default DropArea