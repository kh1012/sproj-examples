import * as React from 'react';
import * as mui from "@mui/material";
import { ListComponent } from './ListComponent';
import { useSnackbar } from 'notistack';
import { makeObject, setStateUpdate } from '../utils';

import * as LCOM from '../Workers/LoadCombinationWorker';
import * as THIS from '../Workers/TimeHistoryWorker';
import * as STLD from '../Workers/StaticLoadWorker';
import * as CSCS from '../Workers/ConstructStageWorker';
import * as SPLC from '../Workers/ResponseSpectrumWorker';
import * as SMLC from '../Workers/SettlementWorker';
import * as MVLD from '../Workers/MovingLoadWorker';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


export const GridListComponents  = React.forwardRef((props, ref) => {
    const [stldList, setStldList] = React.useState([]);
    const [cscsList, setCscsList] = React.useState([]);
    const [mvldList, setMvldList] = React.useState([]);
    const [lcomList, setLcomList] = React.useState([]);
    const [smlcList, setSmlcList] = React.useState([]);
    const [splcList, setSplcList] = React.useState([]);
    const [thisList, setThisList] = React.useState([]);
    const [doUpdate, setDoUpdate] = React.useState("");
    const {dataRequested, setDataRequested, updateCombData, additionalData} = props;
    const updateKit = {doUpdate: doUpdate, setDoUpdate: setDoUpdate};
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
          enqueueSnackbar("No Load Cases selected.", { variant: "error"});
        } else {
          updateCombData(newAllItems);
        }
          
        setDataRequested(false);
      }
    }, [dataRequested, stldList, cscsList, mvldList, lcomList, smlcList, splcList, thisList, updateCombData, setDataRequested, enqueueSnackbar]);
  
    const init = () => {
      setDoUpdate("INIT");
    };
  
    React.useImperativeHandle(ref, () => ({init}));

    React.useEffect(() => {

    }, []);
  
    return (
      <React.Fragment>
        <mui.Typography sx={{my: 2}}>Presetted Load Cases</mui.Typography>
        <mui.Grid container spacing={1} direction="row" alignItems="center" justifyContent="space-between">
          <mui.Grid item>
            <ListComponent
              label={"Static Load"}
              Loader={STLD.DataLoader}
              checkList={stldList}
              setCheckList={(l) => setStateUpdate(setStldList, l)}
              {...updateKit}
            />
          </mui.Grid>
          <mui.Grid item>
            <ListComponent
              label={"Construction Stage"}
              Loader={CSCS.DataLoader}
              checkList={cscsList}
              setCheckList={(l) => setStateUpdate(setCscsList, l)}
              {...updateKit}
            />
          </mui.Grid>
          <mui.Grid item>
            <ListComponent
              label={"Moving Load"}
              Loader={MVLD.DataLoader}
              checkList={mvldList}
              setCheckList={(l) => setStateUpdate(setMvldList, l)}
              {...updateKit}
            />
          </mui.Grid>
          <mui.Grid item>
            <ListComponent
              label={"Settlement Load"}
              Loader={SMLC.DataLoader}
              checkList={smlcList}
              setCheckList={(l) => setStateUpdate(setSmlcList, l)}
              {...updateKit}
            />
          </mui.Grid>
          <mui.Grid item>
            <ListComponent
              label={"Response Spectrum"}
              Loader={SPLC.DataLoader}
              checkList={splcList}
              setCheckList={(l) => setStateUpdate(setSplcList, l)}
              {...updateKit}
            />
          </mui.Grid>
          <mui.Grid item>
            <ListComponent
              label={"Time History"}
              Loader={THIS.DataLoader}
              checkList={thisList}
              setCheckList={(l) => setStateUpdate(setThisList, l)}
              {...updateKit} />
          </mui.Grid>
        </mui.Grid>
        <mui.Typography sx={{my: 2}}>Combined Load Cases</mui.Typography>
        <ListComponent
          fullWidth
          label={"Load Combinations"}
          userData={{user: additionalData.LCOM}}
          Loader={LCOM.DataLoader}
          checkList={lcomList}
          setCheckList={(l) => setStateUpdate(setLcomList, l)}
          {...updateKit}
        />
        <mui.ButtonGroup variant="outlined" sx={{mt: 2}}>
          <mui.Button onClick={() => {setDoUpdate("DESELECT")}} startIcon={<CheckBoxOutlineBlankIcon />}>DESELECT ALL</mui.Button>
          <mui.Button onClick={() => {setDoUpdate("SELECT")}} startIcon={<CheckBoxIcon />}>SELECT ALL</mui.Button>
        </mui.ButtonGroup>
      </React.Fragment>
    )
  });
  