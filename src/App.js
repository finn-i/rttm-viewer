import React, { useEffect, useState } from 'react';
import Viewer from './components/Viewer.js';
import DropArea from './components/DropArea.js';

const App = () => {
	
  const [file, setFile] = useState(0);

	return (
		<>
			<h1>RTTM Viewer</h1>
			{ file ? <div id="viewer-container"> <Viewer file={file} /> </div> : null }
			<DropArea setFile={setFile} />
		</>
	);  
}

export default App;