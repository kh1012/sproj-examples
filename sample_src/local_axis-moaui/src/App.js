import './App.css';
import * as React from 'react';
// Material UI import data
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
// UserDefined Components
import RadioButtonsGroup from './Components/RadioGroup';
import TextFieldInput from './Components/TextField'
import * as Buttons from './Components/Buttons'
import * as Charts from './Components/Chart';
import * as Modals from './Components/Modal'
import * as Common from './Function/Common';
import * as Spline from './Function/Spline';

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

const enqueueMessage = (func, message, variant = "error") => {
  func(
    message,
      {
        variant: variant,
        autoHideDuration: 3000,
        anchorOrigin:{ vertical: "bottom", horizontal: "center" }
      },
  );
};

function App() {

  //SnackBar
  const { enqueueSnackbar } = useSnackbar();
  //Variable for UI
  const [radioOp, setRadioOp] = React.useState("MCS");
  const [disText, setDisText] = React.useState(true);
  const [startPt, setStartPt] = React.useState(1);
  const [endPt, setEndPt] = React.useState(1);
  const [node, setNode] = React.useState();
  //Nodes Modal Actions
  const [openNodeModal, setOpenNodeModal] = React.useState(false);
  const NodeModalOpen = () => setOpenNodeModal(true);
  const NodeModalClose = () => setOpenNodeModal(false);
  //Help Modal Actions
  const [openHelpModal, setOpenHelpModal] = React.useState(false);
  const modalHelpOpen = () => setOpenHelpModal(true);
  const modalHelpClose = () => setOpenHelpModal(false);
  //Chart Variable
  const [chartNodeData, setChartNodeData] = React.useState([{"id": "Line","data": [{"x": 0,"y": 0}]}])
  const [chartSplineData, setChartSplineData] = React.useState([{"id": "Line","data": [{"x": 0,"y": 0}]}])
  const [chartScale, setChartScale] = React.useState(['auto', 'auto', 'auto', 'auto'])
  //Node vertices
  const [nodeVertix, setNodeVertix] = React.useState()

  //Button Actions for Node import
  async function showNode() {
    if (node === undefined) {
      enqueueMessage(enqueueSnackbar, "Input the node data", "error");
    } else {
      let nodeParsing = Common.NEParser(node);
      let nodelist = Common.stringTolist(nodeParsing);
      if (isNaN(nodelist[0]) || nodelist[0] === 0) {
        enqueueMessage(enqueueSnackbar, "Input the proper data", "error");
      } else if (nodelist.length <= 1) {
        enqueueMessage(enqueueSnackbar, "Input two or more nodes", "error");
      } else {
        let nodeCoor = await Common.listTochartData(nodelist);
        if (nodeCoor===false) {
          enqueueMessage(enqueueSnackbar, "Inputed nodes are not exist", "error");
        } else if (typeof(nodeCoor) === "string") {
          enqueueMessage(enqueueSnackbar, nodeCoor, "error");
        } else {
          setChartNodeData([{
            "id":"Line",
            "data":nodeCoor[0]
          }])
          NodeModalClose();
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
  }

  //Sending API Data
  async function LocalAxis(){
    if (nodeVertix === undefined) {
      enqueueMessage(enqueueSnackbar, "Input the node data", "error");
    } else {
      try {
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
        await Common.midasAPI("PUT","/db/skew",jsonbody);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Show the Chart by Spline
  React.useEffect(()=>{
    try {
      let div = 10;
      let LocalAxisResult;
      if (nodeVertix !== undefined) {
        if (radioOp==="MCS") {
          LocalAxisResult = Spline.MonotoneCubicSpline(nodeVertix[1],nodeVertix[2],div); 
        } else if (radioOp==="NCS"){
          LocalAxisResult = Spline.NaturalCubicSpline(nodeVertix[1],nodeVertix[2],div);
        } else if (radioOp==="CCS") {
          LocalAxisResult = Spline.ClampedCubicSpline(nodeVertix[1],nodeVertix[2],div,startPt,endPt);
        }
        let dviSplineChart=[];
        for (let i = 0; i < LocalAxisResult.length; i++) {
          dviSplineChart.push({
            "x":LocalAxisResult[i][0],
            "y":LocalAxisResult[i][1],
          })
        }
        setChartSplineData([{
          "id":"Line",
          "data":dviSplineChart
        }]);
        let chartMaxMin = Common.chartScale(dviSplineChart);
        setChartScale(chartMaxMin);
      }
    } catch (error) {
      console.log(error);
    }
  },[chartNodeData, nodeVertix, radioOp, startPt, endPt])

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
                  {Buttons.SubButton("contained", "spline?", modalHelpOpen)}
                  {Buttons.MainButton("contained", "Import Node", NodeModalOpen)}
                  {Buttons.MainButton("contained", "Apply Local Axis", LocalAxis)}
              </Stack> </Item>
            </Grid>
          </Grid>
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
          {Modals.NodeImporModal(openNodeModal, NodeModalClose, setNode, showNode)}
          {Modals.HelpModal(openHelpModal, modalHelpClose)}
        </Box>
      </div>
    </div>
  );
}

export default App;