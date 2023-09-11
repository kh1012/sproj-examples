import React from "react";
import MKeyDialog from "./Components/MKeyDialog";
import Contents from "./Components/Content";
import Help from "./Components/Help";
import { VerifyUtil } from "midas-components";

function App() {
	const [showDialog, setDialogShowState] = React.useState(false);
	React.useEffect(() => {
		if (
			!VerifyUtil.isExistQueryStrings("redirectTo") &&
			!VerifyUtil.isExistQueryStrings("mapiKey")
		) {
			setDialogShowState(true);
		}
	}, []);

	return (
		<React.Fragment>
			{showDialog && <MKeyDialog />}
			<Contents />
			<py-script src="./Runtime/pyruntime.py"></py-script>
		</React.Fragment>
	);
}

export default App;
