//worker
import * as LCOM from "./Workers/LoadCombinationWorker";

//library
import MoaButton from "@midasit-dev/moaui/dist/Button";
import MoaDroplist from "@midasit-dev/moaui/dist/DropList";
import MoaStack from "@midasit-dev/moaui/dist/Stack";
import MoaTextField from "@midasit-dev/moaui/dist/TextField";
import MoaGrid from "@midasit-dev/moaui/dist/Grid";
// import MoaTextField from "@mui/material/TextField";
import MoaTypography from "@midasit-dev/moaui/dist/Typography";
import MoaPanel from "@midasit-dev/moaui/dist/Panel";
import * as mui from "@mui/material";
import * as React from "react";
import Scrollbars from "rc-scrollbars";
import { useSnackbar } from "notistack";
import {
	isExistQueryStrings,
	makeCombData,
	processToken,
	sendData,
} from "./utils";

//component
import MoaDataGrid from "@midasit-dev/moaui/dist/DataGrid";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { GridListComponents } from "./Components/GridListComponents";
import { CustomPagination } from "./Components/CustomFooterComponent";

//icon
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import TitleArea from "./Components/Titlebar";

const typeValueOptions = [
	{ value: 0, label: "Add" },
	{ value: 1, label: "Envelope" },
	{ value: 2, label: "ABS" },
	{ value: 3, label: "SRSS" },
];
const activeValueOptions = ["ACTIVE", "INACTIVE"];

const defaultCombValues = {
	type: 0,
	name: "New Comb",
	number: 0,
	active: "ACTIVE",
	data: [],
};

function FormDialog() {
	const [open, setOpen] = React.useState(true);
	const handleClose = () => setOpen(false);

	const [baseUrl, setBaseUrl] = React.useState("");
	const [mapiKey, setMapiKey] = React.useState("");
	const handleOk = () => {
		window.location.search = `?redirectTo=${baseUrl}&mapiKey=${mapiKey}`;
	};

	const handleBaseUrlChange = (e) => {
		console.log(e);
		setBaseUrl(e.target.value)
	};

	const handleMapiKeyChange = (e) => {
		console.log(e);
		setMapiKey(e.target.value)
	};

	return (
		<div>
			<mui.Dialog open={open} onClose={handleClose}>
				<mui.DialogTitle>Enter URL and MAPI-Key</mui.DialogTitle>
				<mui.DialogContent>
					<MoaTypography>
						To use the plugin, <br />
						you need a base URL and an MAPI-key
					</MoaTypography>
					<br />
					<MoaTypography variant="h1">Base URL</MoaTypography>
					<MoaTextField
						autoFocus
						margin="dense"
						id="baseurl"
						placeholder="ex) https://api-beta.midasit.com"
						type="email"
						fullWidth
						variant="standard"
						onChange={(e) => {
							console.log(e);
							setBaseUrl(e.target.value);
						}}
					/>
					<div style={{ height: "1rem" }} />
					<MoaTypography variant="h1">MAPI-Key</MoaTypography>
					<MoaTextField
						id="mapikey"
						type="email"
						fullWidth
						variant="standard"
						onChange={handleMapiKeyChange}
					/>
				</mui.DialogContent>
				<mui.DialogActions>
					<MoaButton onClick={handleOk}>OK</MoaButton>
					<MoaButton onClick={handleClose}>CANCEL</MoaButton>
				</mui.DialogActions>
			</mui.Dialog>
		</div>
	);
}

function App() {
	return <Main />;
}

function Main() {
	const ref = React.useRef({});
	const { enqueueSnackbar } = useSnackbar();

	const [lcomList, setLcomList] = React.useState([]);
	const [userLcomList, setUserLcomList] = React.useState([]);
	const [requestData, setRequestData] = React.useState(false);

	const [numberPadLeft, setNumberPadLeft] = React.useState(1);

	//States
	const [combData, setCombData] = React.useState([]);
	const [combActive, setCombActive] = React.useState(defaultCombValues.active);
	const [combType, setCombType] = React.useState(defaultCombValues.type);
	const [combName, setCombName] = React.useState(defaultCombValues.name);
	const [combNameLocked, setCombNameLocked] = React.useState(false);
	const [combNumber, setCombNumber] = React.useState(defaultCombValues.number);
	const [openFormDlg, setOpenFormDlg] = React.useState(false);

	const loadLcom = React.useCallback(async () => {
		const result = await LCOM.DataRawLoader({ user: userLcomList });
		if (!result) return;
		setLcomList(result);
	}, [userLcomList]);

	React.useEffect(() => {
		if (!isExistQueryStrings()) setOpenFormDlg(true);
	}, []);

	React.useEffect(() => {
		if (isExistQueryStrings()) loadLcom();
	}, [loadLcom]);

	React.useEffect(() => {
		try {
			if (isExistQueryStrings()) {
				const newLcomList = [...lcomList];
				if (newLcomList.length > 0) {
					const lcomListLength = newLcomList.length;
					const lastItem = newLcomList[lcomListLength - 1];
					const lastItemNumber = lastItem.key * 1 + 1;
					setCombNumber(lastItemNumber);
					setNumberPadLeft(String(lcomListLength).length);
				}
			}
		} catch (_) {}
	}, [lcomList, userLcomList]);

	const setCombValue = React.useCallback((props) => {
		const { name, type, number, active, locked } = props;
		setCombName(name);
		setCombType(type);
		setCombNumber(number);
		setCombActive(active);
		setCombNameLocked(locked);

		if (props?.data) setCombData(props?.data);
	}, []);

	setCombValue.defaultProps = defaultCombValues;

	const handleEdit = React.useCallback((params) => {
		let combValue = { data: [] };

		try {
			const vComb = params.row.vCOMB;
			combValue.data = vComb.map((value) => makeCombData(value));

			let name = params.row.NAME;
			combValue.name = name;
			combValue.type = params.row.iTYPE;
			combValue.number = params.row.key;
			combValue.active = params.row.ACTIVE;
			combValue.locked = true;
		} catch (_) {
			console.log(_);
		}

		setCombValue(combValue);
	}, []);

	const handleCopy = React.useCallback(
		(params) => {
			let combValue = { data: [] };

			try {
				const vCombData = params.row.vCOMB;
				combValue.data = vCombData.map((value) => makeCombData(value));

				const rawName = params.row.NAME;
				let newCombName = processToken({ name: rawName });

				combValue.name = newCombName;
				combValue.type = params.row.iTYPE;
				combValue.number = lcomList.length + 1;
				combValue.active = params.row.ACTIVE;
			} catch (_) {
				console.log(_);
			}

			setCombValue(combValue);
		},
		[lcomList.length, setCombValue]
	);

	const handleRemove = React.useCallback(
		(params) => {
			let newUserLcomList = [...userLcomList];
			const findResult = newUserLcomList.findIndex(
				(value) => value.key === params.row.key
			);
			const newCombData = { ...params.row, markAsRemoved: true };
			if (findResult !== -1) newUserLcomList[findResult] = newCombData;
			else newUserLcomList.push(newCombData);

			setUserLcomList(newUserLcomList);
		},
		[userLcomList]
	);

	const initializeCombInput = React.useCallback(() => {
		setCombValue(defaultCombValues);
	}, []);

	const refreshLocalComponent = React.useCallback(() => {
		ref.current.init();
		loadLcom();
		initializeCombInput();
	}, [initializeCombInput, loadLcom]);

	const handleNew = React.useCallback(() => {
		refreshLocalComponent();
		setCombNumber(defaultCombValues.number);
	}, [refreshLocalComponent]);

	const handleRefreshData = React.useCallback(() => {
		setUserLcomList([]);
		ref.current.init();
		initializeCombInput();
	}, [initializeCombInput]);

	const handleRegisterLcom = React.useCallback(() => {
		if (combData.length === 0) {
			enqueueSnackbar("No Load Case(s) in New Combination Panel.", {
				variant: "error",
			});
			return;
		}

		const newUserLcomList = [...userLcomList];

		let userLcomListItem = {
			key: String(combNumber),
			NAME: combName,
			ACTIVE: combActive,
			iTYPE: combType,
		};

		userLcomListItem.vCOMB = combData.map((value) => {
			const name = value.NAME;

			const startIdx = name.lastIndexOf("(");
			const endIdx = name.lastIndexOf(")");

			const analysisType = name.substring(startIdx + 1, endIdx);
			const loadCaseName = name.substring(0, startIdx);

			return { ANAL: analysisType, LCNAME: loadCaseName, FACTOR: value.FACTOR };
		});

		newUserLcomList.push(userLcomListItem);
		setUserLcomList(newUserLcomList);
		refreshLocalComponent();
	}, [
		combActive,
		combData,
		combName,
		combNumber,
		combType,
		enqueueSnackbar,
		refreshLocalComponent,
		userLcomList,
	]);

	const appendCombData = React.useCallback(
		(items) => {
			//test is Array
			let newCombData = [...combData];
			for (const item of items) {
				const findResult = newCombData.findIndex(
					(value) => value.NAME === item.NAME
				);
				if (findResult === -1) newCombData.push(item);
			}

			setCombData(newCombData);
		},
		[combData]
	);

	const handleReflectDataIntoCivil = React.useCallback(() => {
		const awaiter = async () => {
			const dataObject = {
				Assign: {},
			};

			for (const value of lcomList) {
				dataObject["Assign"][value.key] = { ...value };
			}

			const bodyString = JSON.stringify(dataObject);
			const targetUrl = "/db/LCOM-GEN";
			await sendData(targetUrl, bodyString, "PUT");
		};

		awaiter();
	}, [lcomList]);

	const handleOnCellEditCommit = (params, event) => {
		let newCombData = [...combData];
		const findResult = newCombData.findIndex(
			(value) => value.NAME === params.id
		);

		let value = "";
		if (params.field === "FACTOR") {
			value = Number(event.target.value);
			if (findResult === -1 || isNaN(value)) return;
		}

		newCombData[findResult][params.field] = value;
		setCombData(newCombData);
	};

	const LcomListGridDef = React.useMemo(
		() => [
			{
				field: "key",
				headerName: "No.",
				editable: false,
				valueFormatter: ({ value }) => value.padStart(numberPadLeft, "0"),
				flex: 0.1,
			},
			{
				field: "NAME",
				headerName: "Name",
				editable: false,
				flex: 1,
			},
			{
				field: "ACTIVE",
				headerName: "Active",
				type: "singleSelect",
				valueOptions: activeValueOptions,
				editable: false,
				sortable: false,
			},
			{
				field: "TYPE",
				headerName: "Type",
				type: "singleSelect",
				editable: false,
				sortable: false,
				valueOptions: typeValueOptions,
				valueGetter: (params) =>
					typeValueOptions.find((type) => type.value === params.row.iTYPE)
						.label,
			},
			{
				field: "DESC",
				headerName: "Description",
				editable: false,
				sortable: false,
			},
			{
				field: "Actions",
				headerName: "Actions",
				type: "actions",
				editable: false,
				sortable: false,
				flex: 1,
				getActions: (params) => [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						onClick={() => handleEdit(params)}
					/>,
					<GridActionsCellItem
						icon={<ContentCopyIcon />}
						label="Copy"
						onClick={() => handleCopy(params)}
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Remove"
						onClick={() => handleRemove(params)}
					/>,
				],
			},
		],
		[handleCopy, handleEdit, handleRemove, numberPadLeft]
	);

	const AllGridDef = React.useMemo(
		() => [
			{
				field: "NAME",
				headerName: "Load Cases",
				editable: false,
				flex: 1,
			},
			{
				field: "FACTOR",
				headerName: "Factor",
				editable: true,
				flex: 0.5,
			},
			{
				field: "Delete",
				headerName: "Delete",
				type: "actions",
				editable: false,
				sortable: false,
				getActions: (params) => [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Remove"
						onClick={() => {
							let newCombData = [...combData];
							const targetIdx = newCombData.findIndex(
								(value) => value.NAME === params.id
							);
							newCombData.splice(targetIdx, 1);
							setCombData(newCombData);
						}}
					/>,
				],
			},
		],
		[combData]
	);

	return (
		<React.Fragment>
			<TitleArea title="Load Combination Generator" />
			{openFormDlg === true ? (
				<FormDialog />
			) : (
				<MoaPanel>
					<GridListComponents
						dataRequested={requestData}
						setDataRequested={setRequestData}
						updateCombData={appendCombData}
						additionalData={{ LCOM: userLcomList }}
						ref={ref}
					/>
					<mui.Divider sx={{ my: 2 }} flexItem>
						<mui.Button
							variant="outlined"
							onClick={() => setRequestData(true)}
							startIcon={<AddIcon />}
						>
							Add Items from List
						</mui.Button>
					</mui.Divider>
					<MoaStack direction="row" width="100%" spacing={2}>
						<div>
							<Scrollbars
								autoHide
								autoHeightMax="636px"
								autoHeight
							>
								<MoaDataGrid
									initialState={{
										filter: {
											filterModel: {
												items: [
													{
														columnField: "KIND",
														operatorValue: "equals",
														value: "GEN",
													},
												],
											},
										},
										columns: {
											columnVisibilityModel: {
												KIND: false,
											},
										},
									}}
									rows={lcomList}
									columns={LcomListGridDef}
									getRowId={(row) => row.key}
									density="compact"
									disableColumnMenu
									sx={{ minWidth: "606px", height: "636px" }}
									experimentalFeatures={{ newEditingApi: true }}
									components={{
										Pagination: CustomPagination,
									}}
								/>
							</Scrollbars>
							<MoaStack display="flex" flexDirection="row" justifyContent="center">
								<MoaButton onClick={handleReflectDataIntoCivil}>
									Send data to civil
								</MoaButton>
								<MoaButton onClick={handleRefreshData}>
									Refresh All Data
								</MoaButton>
							</MoaStack>
						</div>
						<div>
							<MoaGrid container justifyContent="space-between" width="100%" gap={2} paddingBottom={1}>
								<MoaGrid item>
									<MoaTextField
										id="NumberField"
										title="No."
										variant="standard"
										disabled
										value={combNumber}
									/>
								</MoaGrid>
								<MoaGrid item>
									<MoaTextField
										id="NameField"
										title="Name"
										variant="standard"
										fullWidth
										value={combName}
										disabled={combNameLocked}
										onChange={(e) => setCombName(e.target.value)}
									/>
								</MoaGrid>
							</MoaGrid>
							<MoaStack direction="row" spacing={1} paddingBottom={1} width="100%" justifyContent="space-between">
								<MoaDroplist
									title="Active"
									// itemList={() => {
									// 	let map = new Map();
									// 	for (const value in activeValueOptions) {
									// 		map.set(value, value);
									// 	}
									// 	return map;
									// }}
									value={combActive}
									onChange={(e) => setCombActive(e.target.value)}		
								/>
								<MoaDroplist
									title="Type"
									value={combType}
									onChange={(e) => setCombType(e.target.value)}
								/>
							</MoaStack>
							<Scrollbars
								autoHide
								autoHeight
								autoHeightMax={"516px"}
								style={{ width: "100%" }}
							>
								<MoaDataGrid
									rows={combData}
									columns={AllGridDef}
									getRowId={(row) => row.NAME}
									density="compact"
									disableColumnMenu
									sx={{ minWidth: "40%", height: "516px" }}
									onCellEditStop={handleOnCellEditCommit}
									experimentalFeatures={{ newEditingApi: true }}
									components={{
										Pagination: CustomPagination,
									}}
								/>
							</Scrollbars>
							<MoaStack display="flex" flexDirection="row" justifyContent="center">
								<MoaButton onClick={handleNew}>New</MoaButton>
								<MoaButton onClick={handleRegisterLcom}>Registration</MoaButton>
							</MoaStack>
						</div>
					</MoaStack>
				</MoaPanel>
			)}
		</React.Fragment>
	);
}

export default Main;
