import React from "react";
import MKeyDialog from "./Components/MKeyDialog";
import { VerifyUtil } from "midas-components";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MoaTypography from "@midasit-dev/moaui/Typography";
import MoaCheck from "@midasit-dev/moaui/Check";
import MoaButton from "@midasit-dev/moaui/Button";
import MoaStack from "@midasit-dev/moaui/Stack";
import Scrollbars from "rc-scrollbars";

const items = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function ContentsArea() {
	const [selected, setSelected] = React.useState([]);
	const [state, setState] = React.useState("");

	const handleSelectAll = React.useCallback(() => {
		if (selected.length === 0) {
			setState("select-all");
		} else {
			setState("deselect-all");
		}
	}, [setState, selected]);

	return (
		<React.Fragment>
			<MoaStack direction="column" justifyContent="center" margin={2} spacing={1}>
				<MoaButton>Import Tendon Profile List</MoaButton>
				<MoaStack border={"solid 1px #E6E6E6"} borderRadius="4px">
					<MoaStack padding={1.5}>
						<MoaTypography variant="body2" color="disable">Convertable Tendon Profile List</MoaTypography>
					</MoaStack>
					<Scrollbars autoHeight autoHeightMin="287px" autoHeightMax="287px">
						<TdnaList
							items={items}
							state={state}
							setState={setState}
							selected={selected}
							setSelected={setSelected}
						/>
					</Scrollbars>
				</MoaStack>
				<MoaButton variant="text" onClick={handleSelectAll}>
					{selected.length === 0 ? "Select All" : "Deselect All"}
				</MoaButton>
				<MoaStack direction="row" justifyContent="space-between">
					<MoaButton>
						help
					</MoaButton>
					<MoaStack direction="row" spacing={1} alignItems="center">
						<MoaTypography variant="h1">Convert to</MoaTypography>
						<MoaButton>New</MoaButton>
						<MoaButton>Modify</MoaButton>
					</MoaStack>
				</MoaStack>
			</MoaStack>
		</React.Fragment>
	);
}

TdnaList.defaultProps = {
	items: [],
	selected: [],
	state: "",
	setState: () => {},
	setSelected: () => {},
};

function TdnaList(props) {
	const { items, selected, setSelected, state, setState } = props;

	const handleListItemClick = React.useCallback(
		(value) => {
			const newSelected = [...selected];
			const index = newSelected.indexOf(value);

			if (index === -1) {
				newSelected.push(value);
			} else {
				newSelected.splice(index, 1);
			}
			setSelected(newSelected);
		},
		[selected, setSelected]
	);

	React.useEffect(() => {
		if (state === "select-all") {
			setSelected(items);
		} else if (state === "deselect-all") {
			setSelected([]);
		}

		setState("");
	}, [state, setState, items, setSelected]);

	return (
		<List
			disablePadding
			dense
		>
			{items.map((value) => (
				<ListItem
					disableGutters
					onClick={() => handleListItemClick(value)}
					key={value}
					sx={{padding: 0}}
					secondaryAction={<MoaCheck checked={selected.includes(value)} />}
				>
					<ListItemButton sx={{padding: 0.8}}>
						<MoaTypography marginLeft={1}>{value}</MoaTypography>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}

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
			<ContentsArea />
		</React.Fragment>
	);
}

export default App;
