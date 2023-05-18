import * as React from 'react';
import { useLocation } from "react-router-dom";
import './App.css';
//MUI-Material
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
//MUR-DataGird
import { DataGrid } from '@mui/x-data-grid';
import { randomInt } from '@mui/x-data-grid-generator';
//MUI-Icon
import SendIcon from '@mui/icons-material/Send';
import KeyIcon from '@mui/icons-material/Key';
import StartIcon from '@mui/icons-material/PlayArrow';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
//ETC
import { ResponsiveLine } from "@nivo/line";
import { cloneDeep } from "lodash"
import MainSubModule from './CreateLayout';
import CalculationXY from './CalculationXY';

//À±Àç¿õÀÔ´Ï´Ù

//Tab Setting
function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 0 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

//Grid Item
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

//Data Gride Default Value
const columnWidth = 140
const AlignColumns = [
	{ field: "linetype", headerName: "Line Types", width: columnWidth, editable: true, sortable: false, type: 'singleSelect', headerAlign: 'center', valueOptions: ['Straight', 'Arc', 'Clothoid', 'Cubic Parabola'] },
	{ field: "linelength", headerName: "Length", width: columnWidth, editable: true, type: 'number', sortable: false, headerAlign: 'center' },
	{ field: "linerads", headerName: "Radius Start", width: columnWidth, editable: true, type: 'number', sortable: false, headerAlign: 'center' },
	{ field: "linerade", headerName: "Radius End", width: columnWidth, editable: true, type: 'number', sortable: false, headerAlign: 'center' }
];
const SegmtColumns = [
	{ field: "seglength", headerName: "Segments Length", width: columnWidth, editable: true, sortable: false, headerAlign: 'center' },
	{ field: "strgroup", headerName: "Structure Group", width: columnWidth, editable: true, sortable: false, headerAlign: 'center' },
	{ field: "matlid", headerName: "Material ID", width: columnWidth, editable: true, type: 'number', sortable: false, headerAlign: 'center' },
	{ field: "sectid", headerName: "Section ID", width: columnWidth, editable: true, type: 'number', sortable: false, headerAlign: 'center' }
];
//Create Alignement Row
let alignIdCounter = 0;
const createAlignRow = () => {
	alignIdCounter += 1;
	return { id: alignIdCounter, linetype: "Straight", linelength: 100, linerads: 0, linerade: 0 }
}
//Create Segement Row
let segmtIdCounter = 0;
const createSegmtRow = () => {
	segmtIdCounter += 1;
	return { id: segmtIdCounter, seglength: "100@1", strgroup: "STR1", matlid: 101, sectid: 101 }
}

function App() {
	//Modal for Error
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	//Tap Setting
	const [value, setValue] = React.useState(0);

  const location = useLocation();
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	//Value for Design
	const [baseURL, setBaseURL] = React.useState("");
	const [mapiKey, setMapiKey] = React.useState("");
	const [snodeValue, setSnodeValue] = React.useState(1001);
	const [selemValue, setSelemValue] = React.useState(1001);

	//Alignment Data Grid
	const [alignRows, setAlignRows] = React.useState([])
	function addAlignRow() {
		setAlignRows((prevRows) => [...prevRows, createAlignRow()]);
	}
	function removeAlignRow() {
		setAlignRows((prevRows) => {
			const rowToDeleteIndex = randomInt(0, prevRows.length - 1);
			return [
				...alignRows.slice(0, rowToDeleteIndex),
				...alignRows.slice(rowToDeleteIndex + 1),
			]
		});
	}
	function onCellEditCommitAlign({ id, field, value }) {
		setAlignRows((prevRows) =>
			prevRows.map((item) =>
				item.id === id ? { ...item, [field]: value } : item
			)
		);
	};

	//Segment Data Grid
	const [segmtRows, setSegmtRows] = React.useState("")
	function addSegmtRow() {
		setSegmtRows((prevRows) => [...prevRows, createSegmtRow()]);
	}
	function removeSegmtRow() {
		setSegmtRows((prevRows) => {
			const rowToDeleteIndex = randomInt(0, prevRows.length - 1);
			return [
				...segmtRows.slice(0, rowToDeleteIndex),
				...segmtRows.slice(rowToDeleteIndex + 1),
			]
		});
	}
	function onCellEditCommitSegmt({ id, field, value }) {
		setSegmtRows((prevRows) =>
			prevRows.map((item) =>
				item.id === id ? { ...item, [field]: value } : item
			)
		);
	};

	//Graph Data Updates
	const [chartData, setChartData] = React.useState([{
		id:1,
		data:[
			{x:0,y:0}
		]
	}]);


	const getKeyAuthResult = async (key) => {
		const Url = baseURL + "/mapikey/verify";
		const response = await fetch(Url,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"MAPI-Key": key,
			},
		});

		if(response.ok){
			const resultAsJson = await response.json();
			return resultAsJson["keyVerified"];
		}
		else{
			return false;
		}
	}

	const urlParamHandler = async (param) => {
    const urlParams = new URLSearchParams(param);
    const mapiKey = urlParams.get("mapiKey")
		console.log(mapiKey);
		const verifyResult = await getKeyAuthResult(mapiKey);
		console.log(verifyResult);
		if (verifyResult) {
			setMapiKey(mapiKey);
		}
  }
	async function setBasicInfo() {
		setBaseURL(window.location.origin);
	}

	React.useEffect(() => {
		setBasicInfo();
	}, [])

	React.useEffect(() => {
		urlParamHandler(location.search);
	}, [baseURL])

	React.useEffect(()=> {
		setChartData(() => {
			let DataSet = DataBuilding();
			if (DataSet === false ) {
				let XYvalue = [{
					id:1,
					data:[
						{x:0,y:0}
					]
				}]
				// console.log(XYvalue);
				return XYvalue
			} else {
				let XYSet = CalculationXY(...DataSet)
				let XSet = XYSet[0];
				let YSet = XYSet[1];
				let XYvalue = [{
					id: 1,
					data: []
				}]
				for (let i = 0; i < XSet.length; i++) {
					XYvalue[0]['data'][i] = { x: XSet[i].toFixed(3), y: YSet[i].toFixed(3) }
				}
				console.log(XYvalue);
				return XYvalue
			}
		})
	},[baseURL, mapiKey, alignRows,segmtRows])

	//API Actions
	function DataBuilding() {
		const M_NODE = Number(snodeValue);
		const M_ELEM = Number(selemValue);
		const AlignData = cloneDeep(alignRows);
		const SegmtData = cloneDeep(segmtRows);
		let M_LINE = [];
		let M_SEGM = [];
		let Temps;
		let checkType;
		for (let i = 0; i < AlignData.length; i++) {
			if (AlignData[i]['linetype'] === 'Straight') {
				checkType = "ST"
			} else if (AlignData[i]['linetype'] === 'Arc') {
				checkType = "AR"
			} else if (AlignData[i]['linetype'] === 'Clothoid') {
				checkType = "CL"
			} else if (AlignData[i]['linetype'] === 'Cubic Parabola') {
				checkType = "CP"
			}
			Temps = {
				"TYPE": checkType,
				"LENS": AlignData[i]['linelength'],
				"RADS": AlignData[i]['linerads'],
				"RADE": AlignData[i]['linerade']
			}
			M_LINE[i] = Temps
		}
		for (let i = 0; i < SegmtData.length; i++) {
			Temps = [
				SegmtData[i]['seglength'],
				SegmtData[i]['strgroup'],
				SegmtData[i]['matlid'],
				SegmtData[i]['sectid']
			]
			M_SEGM[i] = Temps
		}
		
		let valueError = true;
		for (let i = 0; i < M_LINE.length; i++) {
			if (M_LINE[i]["TYPE"] === "AR" && M_LINE[i]["RADS"] === 0) {
				valueError = false;
			} else if (M_LINE[i]["TYPE"] === "CL" && M_LINE[i]["RADS"] === 0 && M_LINE[i]["RADE"] === 0) {
				valueError = false;
			} else if (M_LINE[i]["TYPE"] === "CL" && M_LINE[i]["RADS"] > 0 && M_LINE[i]["RADE"] < 0) {
				valueError = false;
			} else if (M_LINE[i]["TYPE"] === "CL" && M_LINE[i]["RADS"] < 0 && M_LINE[i]["RADE"] > 0) {
				valueError = false;
			} else if (M_LINE[i]["TYPE"] === "CP" && M_LINE[i]["RADS"] === 0 && M_LINE[i]["RADE"] === 0) {
				valueError = false;	
			} else if (M_LINE[i]["TYPE"] === "CP" && M_LINE[i]["RADS"] != 0 && M_LINE[i]["RADE"] != 0) {
				valueError = false;	
			}
		}
		if (M_LINE.length === 0 || M_SEGM.length === 0) {
			valueError = false;	
		}
		
		console.log(baseURL);
		console.log(mapiKey);
		if (valueError === true && baseURL !== "" && mapiKey !== "") {
			return [baseURL, mapiKey, M_NODE, M_ELEM, M_LINE, M_SEGM];
		} else {
			return valueError
		}
	}

	//API Send
	const handleAPI = () => {
		let DataSet = DataBuilding();
		
		if (DataSet === false ) {
			handleOpen();
		} else {
			MainSubModule(...DataSet);
		}
	}

	return (
		<div className="App">
			<header className="App-header">
				<div className="Grid">
					<Box sx={{ flexGrow: 1 }}>
						<Grid container spacing={0.2}>
							{/*Select Base URL*/}
							{/* <Grid xs={6}>
								<Item>
									<Tooltip title="Select URI to Send data to Civil">
										<FormControl sx={{ m: 1, width: '95%' }} size="small">
											<InputLabel variant="standard" htmlFor="uncontrolled-native">
												Base URI
											</InputLabel>
											<NativeSelect
												value={baseURL}
												onChange={(event) => { setBaseURL(event.target.value) }}
												defaultValue={10}
											>
												<option value={10}>http://localhost:10024</option>
												<option value={20}>https://api-beta.rpm.kr-dv-midasit.com/civil</option>
											</NativeSelect>
										</FormControl>
									</Tooltip>
								</Item>
							</Grid> */}
							{/*MAPI-Key*/}
							{/* <Grid xs={6}>
								<Item>
									<Box
										component="form"
										sx={{ '& > :not(style)': { m: 1, width: '95%' }, }}
										noValidate
										autoComplete="off"
									>
										<TextField
											label="MAPI-Key"
											variant="standard"
											value={mapiKey}
											onChange={(event) => { setMapiKey(event.target.value) }}
											size="small"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<KeyIcon />
													</InputAdornment>
												)
											}}
										/>
									</Box>
								</Item>
							</Grid> */}
							{/*Node_Number*/}
							<Grid xs={6}>
								<Item>
									<Box
										component="form"
										sx={{
											'& > :not(style)': { m: 1, width: '95%' },
										}}
										noValidate
										autoComplete="off"
									>
										<TextField
											id="start-node"
											label="Number of Start Node"
											variant="standard"
											size="small"
											type="number"
											value={snodeValue}
											onChange={(event) => { setSnodeValue(event.target.value) }}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<StartIcon />
													</InputAdornment>
												)
											}}
										/>
									</Box>
								</Item>
							</Grid>
							{/*Elemns_Number*/}
							<Grid xs={6}>
								<Item>
									<Box
										component="form"
										sx={{ '& > :not(style)': { m: 1, width: '95%' }, }}
										noValidate
										autoComplete="off"
									>
										<TextField
											id="start-elem"
											label="Number of Start Elements"
											variant="standard"
											size="small"
											type="number"
											value={selemValue}
											onChange={(event) => { setSelemValue(event.target.value) }}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<StartIcon />
													</InputAdornment>
												)
											}}
										/>
									</Box>
								</Item>
							</Grid>
							{/*Tap Setting*/}
							<Grid xs={12}>
								<Item>
								<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
									<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
										<Tab label="Alignmetns" {...a11yProps(0)} />
										<Tab label="Segments" {...a11yProps(1)} />
									</Tabs>
								</Box>
								<TabPanel value={value} index={0}>
									{/*Alignments*/}
									<Box sx={{ width: '100%', height: 260 }}>
										<Stack direction="row" spacing={1} sx={{ mt:0.5, mb: 0.5 }}>
											<IconButton color="primary" size="small" onClick={addAlignRow}>
												<AddCircleTwoToneIcon />
											</IconButton>
											<IconButton size="small" onClick={removeAlignRow}>
												<RemoveCircleTwoToneIcon />
											</IconButton>
										</Stack>
										<div style={{ height: 215, width: '100%' }}>
											<DataGrid
												columns={AlignColumns}
												rows={alignRows}
												disableColumnMenu={true}
												hideFooter={true}
												density="compact"
												onCellEditCommit={onCellEditCommitAlign}
											/>
										</div>
									</Box>
								</TabPanel>
								<TabPanel value={value} index={1}>
									{/*Segments*/}
										<Box sx={{ width: '100%', height: 260 }}>
											<Stack direction="row" spacing={1} sx={{ mt:0.5, mb: 0.5 }}>
												<IconButton color="primary" size="small" onClick={addSegmtRow}>
													<AddCircleTwoToneIcon />
												</IconButton>
												<IconButton size="small" onClick={removeSegmtRow}>
													<RemoveCircleTwoToneIcon />
												</IconButton>
											</Stack>
											<div style={{ height: 215, width: '100%' }}>
												<DataGrid
													columns={SegmtColumns}
													rows={segmtRows}
													disableColumnMenu='true'
													hideFooter='true'
													density="compact"
													onCellEditCommit={onCellEditCommitSegmt}
												/>
											</div>
										</Box>
								</TabPanel>
								</Item>
							</Grid>
							<Grid xs={12}>
								<Item>
								<div style={{ height: 300, widows: 300 }}>
								<ResponsiveLine
											data={chartData}
											margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
											xScale={{
												type: 'linear'
											}}
											xFormat=" >-.3f"
											yScale={{
												type: 'linear',
												min: 'auto',
												max: 'auto',
												stacked: true,
												reverse: false
											}}
											yFormat=" >-.3f"
											curve="basis"
											axisTop={null}
											axisRight={null}
											axisBottom={{
												orient: 'bottom',
												tickSize: 5,
												tickPadding: 5,
												tickRotation: 0,
												legend: 'X [m]',
												legendOffset: 35,
												legendPosition: 'middle'
											}}
											axisLeft={{
												orient: 'left',
												tickSize: 5,
												tickPadding: 5,
												tickRotation: 0,
												legend: 'Y [m]',
												legendOffset: -35,
												legendPosition: 'middle'
											}}
											colors={{ scheme: 'pink_yellowGreen' }}
											lineWidth={3}
											enablePoints={false}
											useMesh={true}
											legends={[]}
								/>
								</div>
							</Item>
							</Grid>
						</Grid>
						{/*Button Actions*/}
						<Stack sx={{ mt: 2 }} direction="row" spacing={2} alignItems="right" justifyContent="right">
							<Button variant="contained" endIcon={<SendIcon />} onClick={handleAPI}>
								Send API
							</Button>
						</Stack>
						{/*Button Actions*/}
						<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
							<Box sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								bgcolor: 'error.main',
								color: 'error.contrastText',
								width: 300,
								border: '0px solid #000',
								borderRadius: '10px',
								boxShadow: 24,
							}}>
							<Stack sx={{ mt: 1, mb:1 }} direction="row" spacing={2} alignItems="center" justifyContent="center">
							<ErrorTwoToneIcon />
							<p> Please Check Alignments Data </p>
							</Stack>
							</Box>
						</Modal>
					</Box>
				</div>
			</header>
		</div>
	);
}

export default App;
