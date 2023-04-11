import React, { useEffect, useState } from 'react';
import Viewer from './components/Viewer.js';
import DropArea from './components/DropArea.js';

const App = () => {
	
  const [file, setFile] = useState(0);

	return (
		<>
			{file && <div id="viewer-container"> <Viewer file={file} /> </div> }
			<DropArea setFile={setFile} />
		</>
	);  
}

export default App;