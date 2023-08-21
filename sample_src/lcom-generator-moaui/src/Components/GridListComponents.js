import * as React from "react";
import * as mui from "@mui/material";
import MoaButton from "@midasit-dev/moaui/dist/Button";
import Typography from "@midasit-dev/moaui/dist/Typography";
import { ListComponent } from "./ListComponent";
import { useSnackbar } from "notistack";
import { makeObject, setStateUpdate } from "../utils";

import * as LCOM from "../Workers/LoadCombinationWorker";
import * as THIS from "../Workers/TimeHistoryWorker";
import * as STLD from "../Workers/StaticLoadWorker";
import * as CSCS from "../Workers/ConstructStageWorker";
import * as SPLC from "../Workers/ResponseSpectrumWorker";
import * as SMLC from "../Workers/SettlementWorker";
import * as MVLD from "../Workers/MovingLoadWorker";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export const GridListComponents = React.forwardRef((props, ref) => {
	const [stldList, setStldList] = React.useState([]);
	const [cscsList, setCscsList] = React.useState([]);
	const [mvldList, setMvldList] = React.useState([]);
	const [lcomList, setLcomList] = React.useState([]);
	const [smlcList, setSmlcList] = React.useState([]);
	const [splcList, setSplcList] = React.useState([]);
	const [thisList, setThisList] = React.useState([]);
	const [doUpdate, setDoUpdate] = React.useState("");
	const { dataRequested, setDataRequested, updateCombData, additionalData } =
		props;
	const updateKit = { doUpdate: doUpdate, setDoUpdate: setDoUpdate };
	const { enqueueSnackbar } = useSnackbar();

	React.useEffect(() => {
		if (dataRequested) {
			let newAllItems = [
				...makeObject(stldList, "(ST)"),
				...makeObject(cscsList, "(CS)"),
				...makeObject(mvldList, "(MV)"),
				...makeObject(lcomList, "(CB)"),
				...makeObject(smlcList, "(SM)"),
				...makeObject(splcList, "(RS)"),
				...makeObject(thisList, "(TH)"),
			];

			if (newAllItems.length === 0) {
				enqueueSnackbar("No Load Cases selected.", { variant: "error" });
			} else {
				updateCombData(newAllItems);
			}

			setDataRequested(false);
		}
	}, [
		dataRequested,
		stldList,
		cscsList,
		mvldList,
		lcomList,
		smlcList,
		splcList,
		thisList,
		updateCombData,
		setDataRequested,
		enqueueSnackbar,
	]);

	const init = () => {
		setDoUpdate("INIT");
	};

	React.useImperativeHandle(ref, () => ({ init }));

	React.useEffect(() => {}, []);

	return (
		<React.Fragment>
			<Typography sx={{ my: 2 }}>Presetted Load Cases</Typography>
			<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
				<div style={{ display: "flex", flexDirection: "row"}}>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Static Load"}
							Loader={STLD.DataLoader}
							checkList={stldList}
							setCheckList={(l) => setStateUpdate(setStldList, l)}
							{...updateKit}
						/>
					</mui.Grid>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Construction Stage"}
							Loader={CSCS.DataLoader}
							checkList={cscsList}
							setCheckList={(l) => setStateUpdate(setCscsList, l)}
							{...updateKit}
						/>
					</mui.Grid>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Moving Load"}
							Loader={MVLD.DataLoader}
							checkList={mvldList}
							setCheckList={(l) => setStateUpdate(setMvldList, l)}
							{...updateKit}
						/>
					</mui.Grid>
				</div>
				<div style={{ display: "flex", flexDirection: "row"}}>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Settlement Load"}
							Loader={SMLC.DataLoader}
							checkList={smlcList}
							setCheckList={(l) => setStateUpdate(setSmlcList, l)}
							{...updateKit}
						/>
					</mui.Grid>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Response Spectrum"}
							Loader={SPLC.DataLoader}
							checkList={splcList}
							setCheckList={(l) => setStateUpdate(setSplcList, l)}
							{...updateKit}
						/>
					</mui.Grid>
					<mui.Grid item sx={{ height: "146px", width: "100%" }}>
						<ListComponent
							label={"Time History"}
							Loader={THIS.DataLoader}
							checkList={thisList}
							setCheckList={(l) => setStateUpdate(setThisList, l)}
							{...updateKit}
						/>
					</mui.Grid>
				</div>
			</div>
			<br />
			<Typography sx={{ my: 2 }}>Combined Load Cases</Typography>
			<ListComponent
				label={"Load Combinations"}
				userData={{ user: additionalData.LCOM }}
				Loader={LCOM.DataLoader}
				checkList={lcomList}
				setCheckList={(l) => setStateUpdate(setLcomList, l)}
				{...updateKit}
			/>
			<div style={{display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center", alignItems: "center", width: "100%",}}>
				<MoaButton
					onClick={() => {
						setDoUpdate("DESELECT");
					}}
					startIcon={<CheckBoxOutlineBlankIcon />}
				>
					DESELECT ALL
				</MoaButton>
				<MoaButton
					onClick={() => {
						setDoUpdate("SELECT");
					}}
					startIcon={<CheckBoxIcon />}
				>
					SELECT ALL
				</MoaButton>
			</div>
		</React.Fragment>
	);
});
