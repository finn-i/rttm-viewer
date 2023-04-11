import React, { useEffect, useState } from 'react';

const DropArea = ({ setFile }) => {

	const [hovering, setHovering] = useState(false);

  const handleDrop = (evt) => {
    evt.preventDefault();
    let file = evt.dataTransfer.files[0];
		setFile(file);
		setHovering(false);
  }

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
  

  return (
    <div 
			id="drop-area" 
			className={ hovering ? "drag-over" : null } 
			onDrop={ handleDrop } 
			onDragOver = { handleDragOver} 
			onDragEnter={ handleDragEnter } 
			onDragLeave={ handleDragLeave } 
		><span><a>Choose</a> a file or drag it here</span></div>
  );
}

export default DropArea