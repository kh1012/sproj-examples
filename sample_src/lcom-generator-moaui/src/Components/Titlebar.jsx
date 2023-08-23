import * as React from "react";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@midasit-dev/moaui/dist/Typography";
import { Divider } from "@mui/material";
import { requestDragStart, requestHideDlg } from "./../Actions/ProductActions";

const Spacer = () => <Box marginRight="0.5rem" />;

export default function TitleArea({title = "Search", leftArrow = false}) {

    return (
        <React.Fragment>
        {true &&
            <React.Fragment>
                <Box height={`40px`} width="100%" alignItems="center" justifyContent="space-between" display="flex" sx={{backgroundColor: "#21272A"}}>
					<Spacer />
					<img src="./icon.svg" alt="icon" style={{width: '20px', height: '20px'}} />
					<Spacer />
					<span onMouseDown={requestDragStart} style={{width: '100%'}}>
						<Typography color="third">{title}</Typography>
					</span>
					<CardActionArea title="Close" size="small" onClick={requestHideDlg} sx={{width: "36px", height: '100%', display: "flex", ":hover" : {backgroundColor: 'red'}}}>
						<ClearIcon htmlColor={'#A2A9B0'} fontSize="16px" />
					</CardActionArea>
                </Box>
                <Divider flexItem />
            </React.Fragment>
        }
        </React.Fragment>
    )
} 