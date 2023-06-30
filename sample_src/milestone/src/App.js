import React from 'react';
import { VerifyDialog, VerifyUtil } from 'midas-components';

function App(props) {
	return (
		<div>
			<VerifyDialog />
			<button 
				style={{
					width: '200px',
					height: '200px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					marginTop: '-100px',
					marginLeft: '-100px'
				}}
				onClick={() => alert(VerifyUtil.getMapiKey())}
			>
				GET MAPIKEY
			</button>
		</div>
	);
}

export default App;