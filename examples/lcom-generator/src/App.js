//worker
import * as LCOM from './Workers/LoadCombinationWorker';

//library
import * as mui from "@mui/material";
import * as React from "react";
import Scrollbars from 'rc-scrollbars';
import { useSnackbar } from 'notistack';
import { isExistQueryStrings, makeCombData, processToken, sendData } from './utils';

//component
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { ReactComponent as Logo } from "./logo.svg";
import { GridListComponents } from './Components/GridListComponents';
import { CustomPagination } from './Components/CustomFooterComponent';

//icon
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';


const typeValueOptions = [{value: 0, label: 'Add'}, {value: 1, label: 'Envelope'}, {value: 2, label: 'ABS'}, {value: 3, label: "SRSS"}];
const activeValueOptions = ["ACTIVE", "INACTIVE"];

const defaultCombValues = {
  type: 0,
  name: "New Comb",
  number: 0,
  active: "ACTIVE",
  data: [],
}

function FormDialog() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  const [baseUrl, setBaseUrl] = React.useState('');
  const [mapiKey, setMapiKey] = React.useState('');
  const handleOk = () => {
    window.location.search = `?redirectTo=${baseUrl}&mapiKey=${mapiKey}`;
  }

  return (
    <div>
      <mui.Dialog open={open} onClose={handleClose}>
        <mui.DialogTitle>Enter URL and MAPI-Key</mui.DialogTitle>
        <mui.DialogContent>
          <mui.DialogContentText>
            To use the plugin, <br />
            you need a base URL and an MAPI-key
          </mui.DialogContentText>
          <mui.TextField
            autoFocus
            margin="dense"
            id="baseurl"
            label="Base URL"
            placeholder='ex) https://api-beta.midasit.com/civil'
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setBaseUrl(e.target.value)}
          />
          <mui.TextField
            margin="dense"
            id="mapikey"
            label="MAPI-Key"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setMapiKey(e.target.value)}
          />
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={handleOk}>OK</mui.Button>
          <mui.Button onClick={handleClose}>CANCEL</mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    </div>
  );
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

  const loadLcom = React.useCallback(async() => {
    const result = await LCOM.DataRawLoader({user: userLcomList});
    if (!result) return;
    setLcomList(result);
  }, [userLcomList]);

  React.useEffect(() => {
    if (!isExistQueryStrings()) setOpenFormDlg(true);
  }, [])

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
          const lastItemNumber = (lastItem.key * 1) + 1;
          setCombNumber(lastItemNumber);
          setNumberPadLeft((String(lcomListLength)).length);
      }
      }
    } catch (_) {}

  }, [lcomList, userLcomList]);

  const setCombValue = (props) => {
    const {name, type, number, active} = props;
    setCombName(name);
    setCombType(type);
    setCombNumber(number);
    setCombActive(active);
    setCombNameLocked(props.locked);

    if (props.data) setCombData(props.data);
  };

  setCombValue.defaultProps = defaultCombValues;

  const handleEdit = React.useCallback((params) => {
    let combValue = {data: [],};

    try {
      const vComb = params.row.vCOMB;
      combValue.data = vComb.map((value) => (makeCombData(value)));

      let name = params.row.NAME;
      combValue.name = name;
      combValue.type = params.row.iTYPE;
      combValue.number = params.row.key;
      combValue.active = params.row.ACTIVE;
      combValue.locked = true;
    } catch (_) { console.log(_); }

    setCombValue(combValue);
  }, []);

  const handleCopy = React.useCallback((params) => {
    let combValue = {data: [],};

    try {
      const vCombData = params.row.vCOMB;
      combValue.data = vCombData.map((value) => (makeCombData(value)));

      const rawName = params.row.NAME;
      let newCombName = processToken({name: rawName});

      combValue.name = newCombName;
      combValue.type = params.row.iTYPE;
      combValue.number = lcomList.length + 1;
      combValue.active = params.row.ACTIVE;
    } catch (_) { console.log(_); }

    setCombValue(combValue);
  }, [lcomList.length]);

  const handleRemove = React.useCallback((params) => {
    let newUserLcomList = [...userLcomList];
    const findResult = newUserLcomList.findIndex((value) => value.key === params.row.key);
    const newCombData = { ...params.row, markAsRemoved: true };
    if (findResult !== -1)
      newUserLcomList[findResult] = newCombData;
    else
      newUserLcomList.push(newCombData);

    setUserLcomList(newUserLcomList);
  }, [userLcomList]);

  const initializeCombInput = () => {
    setCombValue(defaultCombValues);
  };

  const refreshLocalComponent = () => {
    ref.current.init();
    loadLcom();
    initializeCombInput();
  }

  const handleNew = () => {
    refreshLocalComponent();
    setCombNumber(defaultCombValues.number);
  };

  const handleRefreshData = () => {
    setUserLcomList([]);
    ref.current.init();
    initializeCombInput();
  };
  
  const handleRegisterLcom = () => {
    if (combData.length === 0) {
      enqueueSnackbar("No Load Case(s) in New Combination Panel.", { variant: "error"});
      return;
    }

    const newUserLcomList = [...userLcomList];
    
    let userLcomListItem = {
      "key" : String(combNumber),
      "NAME" : combName,
      "ACTIVE" : combActive,
      "iTYPE" : combType,
    };

    userLcomListItem.vCOMB = combData.map((value) => {
      const name = value.NAME;

      const startIdx = name.lastIndexOf("(");
      const endIdx = name.lastIndexOf(")");

      const analysisType = name.substring(startIdx + 1, endIdx);
      const loadCaseName = name.substring(0, startIdx);

      return {ANAL : analysisType, LCNAME : loadCaseName, FACTOR: value.FACTOR };
    });

    newUserLcomList.push(userLcomListItem);
    setUserLcomList(newUserLcomList);
    refreshLocalComponent();
  };

  const appendCombData = (items) => {
    //test is Array
    let newCombData = [...combData];
    for (const item of items) {
      const findResult = newCombData.findIndex((value) => value.NAME === item.NAME);
      if (findResult === -1) newCombData.push(item);
    }

    setCombData(newCombData);
  };

  const handleReflectDataIntoCivil = () => {
    const awaiter = async () => {
      const dataObject = {
        "Assign": {},
      };
      
      for (const value of lcomList) {
        dataObject["Assign"][value.key] = {...value};
      }

      const bodyString = JSON.stringify(dataObject);
      const targetUrl = "/db/LCOM-GEN";
      await sendData(targetUrl, bodyString, "PUT");
    };

    awaiter();
  };

  const handleOnCellEditCommit = (params, event) => {
    let newCombData = [...combData];
    const findResult = newCombData.findIndex((value) => (value.NAME === params.id));
    
    let value = "";
    if (params.field === "FACTOR") {
      value = Number(event.target.value);
      if (findResult === -1 || isNaN(value)) return
    }

    newCombData[findResult][params.field] = value;
    setCombData(newCombData);
  };

  const LcomListGridDef = React.useMemo(() => [
    {
      field: 'key',
      headerName: 'No.',
      editable: false,
      valueFormatter: ({ value }) => value.padStart(numberPadLeft, "0"),
      flex: 0.1,
    },
    {
      field: 'NAME',
      headerName: 'Name',
      editable: false,
      flex: 1,
    },
    {
      field: 'ACTIVE',
      headerName: 'Active',
      type: 'singleSelect',
      valueOptions: activeValueOptions,
      editable: false,
      sortable: false,
    },
    {
      field: 'TYPE',
      headerName: 'Type',
      type: 'singleSelect',
      editable: false,
      sortable: false,
      valueOptions: typeValueOptions,
      valueGetter: ((params) => typeValueOptions.find((type) => type.value === params.row.iTYPE).label)
    },
    {
      field: 'DESC',
      headerName: 'Description',
      editable: false,
      sortable: false,
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      type: 'actions',
      editable: false,
      sortable: false,
      flex: 1,
      getActions: (params) => 
      [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params)}/>,
        <GridActionsCellItem icon={<ContentCopyIcon />} label="Copy" onClick={() => handleCopy(params)}/>,
        <GridActionsCellItem icon={<DeleteIcon />} label="Remove" onClick={() => handleRemove(params)} />
      ]
    },
  ], [handleCopy, handleEdit, handleRemove, numberPadLeft]);

  const AllGridDef = React.useMemo(() => [
    {
      field: 'NAME',
      headerName: 'Load Cases',
      editable: false,
      flex: 1,
    },
    {
      field: 'FACTOR',
      headerName: 'Factor',
      editable: true,
      flex: 0.5,
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      type: 'actions',
      editable: false,
      sortable: false,
      getActions: (params) => 
      [
        <GridActionsCellItem icon={<DeleteIcon />} label="Remove" onClick={() => {
          let newCombData = [...combData];
          const targetIdx = newCombData.findIndex((value) => (value.NAME === params.id));
          newCombData.splice(targetIdx, 1);
          setCombData(newCombData);
        }} />
      ]
    },
  ], [combData]);

  return (
    <>
    {openFormDlg === true ? (
      <FormDialog />
      ) : (
        <mui.Container>
        <mui.Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-start" sx={{height: '3rem', my: 1}}>
          <Logo width={100} />
          <mui.Typography>Load Combination Generator</mui.Typography>
        </mui.Stack>
        <mui.Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" maxWidth="xl">
          <GridListComponents
            dataRequested={requestData}
            setDataRequested={setRequestData}
            updateCombData={appendCombData}
            additionalData={{LCOM: userLcomList}}
            ref={ref}
          />
          <mui.Divider sx={{my: 2}} flexItem>
            <mui.Button variant="outlined" onClick={() => setRequestData(true)} startIcon={<AddIcon />}>Add Items from List</mui.Button>
          </mui.Divider>
          <mui.Stack direction="row" width="100%" spacing={2}>
            <mui.Box width="60%">
              <Scrollbars autoHide autoHeightMax="636px" autoHeight style={{width: '100%'}}>
                <DataGrid
                  initialState={{
                    filter: {
                      filterModel: {
                        items: [{ columnField: 'KIND', operatorValue: 'equals', value: 'GEN' }],
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
                  density='compact'
                  disableColumnMenu
                  sx={{minWidth: '606px', height: '636px'}}
                  experimentalFeatures={{ newEditingApi: true }}
                  components={{
                    Pagination: CustomPagination,
                  }}
                />
              </Scrollbars>
              <div style={{display: "flex", justifyContent: "center"}}>
                <mui.Button onClick={handleReflectDataIntoCivil}>Send data to civil</mui.Button>
                <mui.Button onClick={handleRefreshData}>Refresh All Data</mui.Button>
              </div>
            </mui.Box>
            <mui.Box width="40%">
              <mui.Grid container sx={{p: 1, width: '100%'}}>
                <mui.Grid item xs={4}>
                  <mui.TextField
                    id="NumberField"
                    label="No."
                    variant="standard"
                    fullWidth
                    disabled
                    value={combNumber}
                     />
                </mui.Grid>
                <mui.Grid item xs>
                  <mui.TextField
                    id="NameField"
                    label="Name"
                    variant="standard"
                    fullWidth
                    value={combName}
                    disabled={combNameLocked}
                    onChange={(e) => setCombName(e.target.value)} />
                </mui.Grid>
              </mui.Grid>
              <mui.Stack direction="row" spacing={1}>
                <mui.Box width="50%" alignItems="center" justifyContent="space-around">
                  <mui.Select fullWidth value={combActive} onChange={(e) => setCombActive(e.target.value)}>
                    {activeValueOptions.map((value) => (
                      <mui.MenuItem key={value} value={value}>{value}</mui.MenuItem>
                    ))}
                  </mui.Select>
                </mui.Box>
                <mui.Stack direction="row" alignItems="center" justifyContent="space-around" width="50%">
                  <mui.Typography width="40%">Type</mui.Typography>
                  <mui.Select
                    fullWidth
                    value={combType}
                    onChange={(e) => setCombType(e.target.value)}
                    sx={{width: '100%'}}
                  >
                    {typeValueOptions.map((value) => (
                      <mui.MenuItem key={value.value} value={value.value}>{value.label}</mui.MenuItem>
                    ))}
                  </mui.Select>
                </mui.Stack>
              </mui.Stack>
              <Scrollbars autoHide autoHeight autoHeightMax={'516px'} style={{width: '100%'}}>
                <DataGrid
                  rows={combData}
                  columns={AllGridDef}
                  getRowId={(row) =>row.NAME}
                  density="compact"
                  disableColumnMenu
                  sx={{minWidth: '40%',height: '516px'}}
                  onCellEditStop={handleOnCellEditCommit}
                  experimentalFeatures={{ newEditingApi: true }}
                  components={{
                    Pagination: CustomPagination,
                  }}
                  />
              </Scrollbars>
              <div style={{display: "flex", justifyContent: "center"}}>
                <mui.Button onClick={handleNew}>New</mui.Button>
                <mui.Button onClick={handleRegisterLcom}>Registration</mui.Button>
              </div>
            </mui.Box>
          </mui.Stack>
        </mui.Box>
      </mui.Container>
      )
    }
    </>
  )
}

export default Main;
