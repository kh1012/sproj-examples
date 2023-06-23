import './App.css';
import * as React from 'react';
// Material UI import data
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
// UserDefined Components
import RadioButtonsGroup from './Components/RadioGroup';
import TextFieldInput from './Components/TextField'
import * as Buttons from './Components/Buttons'
import * as Charts from './Components/Chart';
import * as Modals from './Components/Modal'
import * as Common from './Function/Common';
import * as Spline from './Function/Logic';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: "1px",
  textAlign: 'left',
  color: theme.palette.text.secondary,
  display:"flex",
  flexDirection: "column",
  justifyContent: "center"
}));

function App() {

  //Variable for UI
  const [radioOp, setRadioOp] = React.useState("MCS");
  const [disText, setDisText] = React.useState(true);
  const [startPt, setStartPt] = React.useState("1");
  const [endPt, setEndPt] = React.useState("1");
  const [node, setNode] = React.useState();
  
  //Nodes Modal Actions
  const [openModal, setOpenModal] = React.useState(false);
  const ModalOpen = () => setOpenModal(true);
  const ModalClose = () => setOpenModal(false);

  //Help Modal Actions
  const [HopenModal, setHopenModal] = React.useState(false);
  const HmodalOpen = () => setHopenModal(true);
  const HmodalClose = () => setHopenModal(false);

  //Chart Variable
  const [chartNodeData, setChartNodeData] = React.useState([{"id": "Line","data": [{"x": 0,"y": 0}]}])
  const [chartSplineData, setChartSplineData] = React.useState([{"id": "Line","data": [{"x": 0,"y": 0}]}])
  const [chartScale, setChartScale] = React.useState(['auto', 'auto', 'auto', 'auto'])

  //Node vertices
  const [nodeVertix, setNodeVertix] = React.useState()

  //Key Results
  const [splineAngle, setSplineAngle] = React.useState()

  //Button Actions for Node import
  async function showNode() {
    let nodeParsing = Common.NEParser(node);
    let nodelist = Common.stringTolist(nodeParsing);
    if (isNaN(nodelist[0])) {
      //if String
    } else {
      let nodeCoor = await Common.listTochartData(nodelist);
      if (nodeCoor[0]===false) {
        //if no Node
      } else {
        setChartNodeData([{
          "id":"Line",
          "data":nodeCoor[0]
        }])
        ModalClose();
        let chartMaxMin = Common.chartScale(nodeCoor[0]);
        setChartScale(chartMaxMin);
        setNodeVertix(()=>{
          let importNb = new Array(3);
          importNb = [nodeCoor[1], nodeCoor[2], nodeCoor[3]]
          return importNb
        });
      }
    }
  }

  //Show the Chart by Spline
  React.useEffect(()=>{
    try {
			if (nodeVertix !== undefined) {
				let div = 10;
				if (radioOp==="MCS") {
					setSplineAngle(Spline.MonotoneCubicSpline(nodeVertix[1],nodeVertix[2],div));
				} else if (radioOp==="NCS"){
					setSplineAngle(Spline.NaturalCubicSpline(nodeVertix[1],nodeVertix[2],div));
				} else if (radioOp==="CCS") {
					setSplineAngle(Spline.ClampedCubicSpline(nodeVertix[1],nodeVertix[2],div,startPt,endPt));
				}
				let dviSplineChart = new Array(splineAngle.length);
				for (let i = 0; i < splineAngle.length; i++) {
					dviSplineChart[i] = {
						"x":splineAngle[i][0],
						"y":splineAngle[i][1],
					}
				}
				setChartSplineData([{
					"id":"Line",
					"data":dviSplineChart
				}])
			}
    } catch (error) {
      console.log(error);
    }
  },[chartNodeData,splineAngle,nodeVertix,radioOp,startPt,endPt])

  async function LocalAxis() {
    try {
			if (nodeVertix === undefined) {
				alert("nodeVertix is undefined");
				return;
			}

			let LocalAxisResult;
			let div = 1;
			if (radioOp==="MCS") {
				LocalAxisResult = Spline.MonotoneCubicSpline(nodeVertix[1],nodeVertix[2],div); 
			} else if (radioOp==="NCS"){
				LocalAxisResult = Spline.NaturalCubicSpline(nodeVertix[1],nodeVertix[2],div);
			} else if (radioOp==="CCS") {
				LocalAxisResult = Spline.ClampedCubicSpline(nodeVertix[1],nodeVertix[2],div,startPt,endPt);
			}
			let jsonbody = {};
			for (let i = 0 ; i < LocalAxisResult.length; i++) {
				jsonbody[nodeVertix[0][i]] = {
					"iMETHOD" : 1,
					"ANGLE_X" : 0,
					"ANGLE_Y" : 0,
					"ANGLE_Z" : Math.atan(LocalAxisResult[i][2])*(180/Math.PI)
				}
			}
			jsonbody = {"Assign":jsonbody}
			const resSkew = await Common.midasAPI("PUT","/db/skew",jsonbody);
			console.log(resSkew);
    } catch (error) {
      console.log(error);
    }
  }

  //Disable or Able Textfield denpend on the Radio Button
  React.useEffect(()=>{
    if (radioOp==="MCS") {
      setDisText(true);
    } else if (radioOp==="NCS"){
      setDisText(true);
    } else if (radioOp==="CCS") {
      setDisText(false);
    }
  },[radioOp]);

  return (
		<div className="App">
		<div className = "MainApp">
			<Box sx={{ flexGrow: 1 }}>
			<h4 className="titleStyle">Cubic Spline</h4>
				<Grid container spacing={1} paddingBottom={1}>
					<Grid xs={8}>
						<Item sx={{height:180}}>
							{RadioButtonsGroup(radioOp,setRadioOp)}
						<Stack spacing={2} direction="row" justifyContent="right" alignItems="center">
							{TextFieldInput("Start Point", startPt, setStartPt, disText)}
							{TextFieldInput("End Point", endPt, setEndPt, disText)}
						</Stack>
						</Item>
					</Grid>
					<Grid xs={4}>
						<Item sx={{height:180}}> <Stack spacing={1} direction="column" alignItems="center">
								{Buttons.SubButton("contained", "spline?", HmodalOpen)}
								{Buttons.MainButton("contained", "Import Node", ModalOpen)}
								{Buttons.MainButton("contained", "Apply Local Axis", LocalAxis)}
						</Stack> </Item>
					</Grid>
				</Grid>
			<h4 className="titleStyle">Preview</h4>
				<Grid container spacing={1} paddingBottom={1}>
					<Grid xs={12}>
						<Item sx={{height:350, padding:0}}>
							<div className='userWrap'>
								<div className='chartStyle'>{Charts.ChartScatter(chartNodeData, chartScale)}</div>
								<div className='chartStyle'>{Charts.ChartLine(chartSplineData, chartScale)}</div>
							</div>
						</Item>
					</Grid>
				</Grid>
				{Modals.NodeImport(openModal, ModalClose, setNode, showNode)}
				{Modals.HelpModal(HopenModal, HmodalClose)}
			</Box>
		</div>
	</div>
  );
}

export default App;