import React, { useEffect, useState } from 'react';
import Viewer from './components/Viewer.js';
import DropArea from './components/DropArea.js';

const App = () => {
	
  const [files, setFiles] = useState([]);

	return (
		<>
			<h1>RTTM Viewer</h1>
			{ files ? <div id="viewer-container"> <Viewer files={ files } /> </div> : null }
			<DropArea files={ files } setFiles={ setFiles } />
		</>
	);  
}

export default App;