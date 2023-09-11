import React from "react";

import MoaTypography from "@midasit-dev/moaui/Typography";
import MoaButton from "@midasit-dev/moaui/Button";
import IconButton from "@mui/material/IconButton";
import MoaStack from "@midasit-dev/moaui/Stack";
import Scrollbars from "rc-scrollbars";
import List from "./List";

import HelpIcon from '@mui/icons-material/Help';
import HelpDlg from "./Help";
import { loadData } from "../utils";
import ListEmpty from "./ListEmpty";

export default function Contents() {
	const [selected, setSelected] = React.useState({});
	const [state, setState] = React.useState("");
	const [showHelp, setShowHelp] = React.useState(false);
	const [items, setItems] = React.useState({});

	const isSelectedEmpty = React.useCallback(() => Object.values(selected).length === 0, [selected]);
	const isItemsEmpty = React.useCallback(() => Object.values(items).length === 0, [items]);

	const handleSelectAll = React.useCallback(() => {
		if (isSelectedEmpty()) {
			setState("select-all");
		} else {
			setState("deselect-all");
		}
	}, [isSelectedEmpty]);

	const handleImportData = React.useCallback(() => {
		const callback = async() => {
			const result = await loadData("/db/tdna");
			let tdnaData = {};
			if (result) {
				tdnaData = result["TDNA"];
				let listData = {};
				Object.entries(tdnaData).forEach(([key, value]) => {
					if (value["CURVE"] === "SPLINE" && value["SHAPE"] === "ELEMENT" && value["INPUT"] === "3D") {
						listData[key] = value;
					}
				});
				setItems(listData);
			}

		};
		callback();
	}, []);

	return (
		<React.Fragment>
			<HelpDlg open={showHelp} setOpen={setShowHelp} />
			<MoaStack direction="column" justifyContent="center" margin={2} spacing={1}>
				<MoaButton onClick={handleImportData}>Import Tendon Profile List</MoaButton>
				<MoaStack border={"solid 1px #E6E6E6"} borderRadius="4px">
					<MoaStack padding={1.5}>
						<MoaTypography variant="body2" color="disable">Convertable Tendon Profile List</MoaTypography>
					</MoaStack>
					<Scrollbars autoHeight autoHeightMin="287px" autoHeightMax="287px">
						{isItemsEmpty() && <ListEmpty height="287px" />}
						{!isItemsEmpty() && <List
							items={items}
							state={state}
							setState={setState}
							selected={selected}
							setSelected={setSelected}
						/>}
					</Scrollbars>
				</MoaStack>
				<MoaButton variant="text" onClick={handleSelectAll} disabled={isItemsEmpty()}>
					{isSelectedEmpty() ? "Select All" : "Deselect All"}
				</MoaButton>
				<MoaStack direction="row" justifyContent="space-between">
					<IconButton onClick={() => setShowHelp(true)}>
						<HelpIcon />
					</IconButton>
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