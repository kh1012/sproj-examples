import React from "react";
import { Scrollbars } from "rc-scrollbars";
import { updateCheckState } from "../utils";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const baseWidth = 6;
const innerWidth = baseWidth + "rem";
const outerWidth = (baseWidth + 5) + "rem";

ListComponent.defaultProps = {
    checkList: [],
    loader: () => {},
    userData: {user: []},
};

const isEmpty = (array) => {
    return array && array.length !== 0;
}

const ColoredContainer = (props) => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{height: '100%', backgroundColor: "#F5F4FF"}}>
        {props.children}
    </Box>
);

const awaiter = async (setPending, setListData, func, userData) => {
    try {
        setPending(true);
        setListData(await func(userData));
        setPending(false);
    } catch (_) { console.log(_); }
};

export function ListComponent(props) {
    const {checkList, setCheckList, doUpdate, setDoUpdate, Loader, label, userData} = props;
    const [listData, setListData] = React.useState([]);
    const [isPending, setPending] = React.useState(false);

    React.useEffect(() => {
        awaiter(setPending, setListData, Loader, userData);
// eslint-disable-next-line
    }, []);

    const changeCheckedList = (data) => {
        const newCheckList = [...checkList];
        if (newCheckList.includes(data)) newCheckList.splice(newCheckList.indexOf(data), 1);
        else newCheckList.push(data);
        setCheckList(newCheckList);
    }

    React.useEffect(() => {
        if (doUpdate === "SELECT") {
            updateCheckState(setCheckList, listData);
        } else if (doUpdate === "DESELECT") {
            updateCheckState(setCheckList, []);
        } else if (doUpdate === "INIT") {
            updateCheckState(setCheckList, []);
            awaiter(setPending, setListData, Loader, userData);
        }
        setDoUpdate("");
    }, [doUpdate, setDoUpdate, setCheckList, listData, Loader, userData]);

    const isExistInCheckList = (data) => (checkList.includes(data));

    const isFullyChecked = Boolean(listData === checkList);

    const handleOnClick = () => { updateCheckState(setCheckList, isFullyChecked ? [] : listData) };

    return (
        <Box sx={{border: '1px solid #edf0f2', width: '100%'}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" height="3rem">
                <ListItem
                    key={label}
                    disableGutters
                    disablePadding
                    dense
                    secondaryAction={
                        isEmpty(listData) && (<Checkbox checked={isFullyChecked} onClick={handleOnClick} />)
                    }
                >
                    <ListItemButton onClick={handleOnClick}>
                        <ListItemText primary={label} primaryTypographyProps={{sx:{textAlign: "center"}}} />
                    </ListItemButton>
                </ListItem>
            </Stack>
            <div style={{height: innerWidth}}>
                {isPending && (
                    <ColoredContainer>
                        <CircularProgress />
                    </ColoredContainer>
                )}
                {!isPending && !isEmpty(listData) && (
                    <ColoredContainer>
                        <Typography>No Items.</Typography>
                    </ColoredContainer>
                )}
                {!isPending && isEmpty(listData) && (
                    <Scrollbars autoHeight autoHeightMax={innerWidth} autoHeightMin={innerWidth}>
                        <List sx={{height: innerWidth}}>
                            {
                                listData.map((value) => (
                                    <ListItem
                                        key={value}
                                        disableGutters
                                        disablePadding
                                        dense
                                        secondaryAction={
                                            <Checkbox checked={isExistInCheckList(value)} onClick={() => changeCheckedList(value)} />
                                        }
                                        >
                                        <ListItemButton onClick={() => changeCheckedList(value)}>
                                            <ListItemText primary={value} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Scrollbars>
                ) }
            </div>
        </Box>
    );
}