import React, { useEffect, useState } from 'react';
import Viewer from './components/Viewer.js';
import DropArea from './components/DropArea.js';

const App = () => {
	
  const [file, setFile] = useState(0);

	return (
		<>
			{file && <Viewer file={file} /> }
			<DropArea setFile={setFile} />
		</>
	);  
}

export default App;