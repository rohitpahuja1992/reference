import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import MatCard from "../../components/MaterialUi/MatCard";
// import ListTable from "../../components/ListTable";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";
import SetOthers from "./SetOthers";
import { updateOobControlToggle } from "../../actions/MasterMessageActions";

import { useParams } from "react-router-dom";
//import { CONFIRM, termSubmoduleMessage } from "../../utils/Messages";

// const cols = [
//   { id: "submoduleName", label: "Component Name", minWidth: 250 },
//   { id: "controlCount", label: "Number of Fields", minWidth: 200 },
//   // { id: "controlCount", label: "Number of Section", minWidth: 200 },
// ];

const useStyles = makeStyles((theme) => ({
    noneBackground: {
        background: "none"
    },
    col: {
        padding: "5px 10px",
    },
    switchList: {
        padding: "0px",
    },
    switchItem: {
        marginRight: "6px",
    },
    listGutter: {
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "6px",
        "&.Mui-disabled": {
            opacity: "0.8",
        },
    },

}));


const ControlList = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const styles = useStyles();
    //const { openFrom } = props;
    // const { moduleId, oobModuleId, versionId } = useParams();

    // const [checked, setChecked] = useState([]);
    const [others, setOthers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [state, setState] = useState(false);
    
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );
    
    const {GENERAL_CONTROL: controls, FIELD_PROPERTY: fields} = useSelector(
        (state) => state.MasterMessage.controlList
    );

    const handleControlSelection = (value, isControl = false) => () => {
        const currentOthersIndex = others.indexOf(value.id);
        const newOthers = [...others];
        if (value?.propertyValue) {
            if (JSON.parse(value.propertyValue).filter(item => item.label === 'Other').length > 0) {
                if (currentOthersIndex === -1) {
                    newOthers.push(value.id);
                } else {
                    newOthers.splice(currentOthersIndex, 1);
                }
            }
        }

        // const currentIndex = checked.indexOf(value.id);
        // const newChecked = [...checked];

        // if (currentIndex === -1) {
        //     newChecked.push(value.id);
        // } else {
        //     newChecked.splice(currentIndex, 1);
        // }

        //setOthers(newOthers);
        //setChecked(newChecked);

        const stateCopy = [...(isControl ? state.controls : state.fields)];
        stateCopy.forEach(item => {
            if(value.id === item.id) {
                value.toggled =  !item.toggled; 
                              
            }
            if (value?.propertyValue) {
                value.others=[];
                if (JSON.parse(value.propertyValue).filter(item => item.label === 'Other').length > 0) {
                    value.others.push(value.id);
                }
            }
        })

        setState((prevState) => ({
            ...prevState,
            [isControl ? 'controls': 'fields']: stateCopy,
        }))
        const controlsData = 
        {
            "id": value.id,
            "toggled": value.toggled
          }
        dispatch(updateOobControlToggle(controlsData,props.open));
    };

    const handleClick = (data) => {
        setSelectedData(data);
        setOpen(true);
    };

    const closeSetOthersDialog = () => {
        setSelectedData([]);
        setOpen(false);
    };

    useEffect(() => {
        setState({
            controls,
            fields,
        })
        
    },[controls, fields])
    // const handleChange = (event) => {
    //     setState({ ...state, [event.target.name]: event.target.checked });
    //   };

    return (
        <div style={{ marginLeft: '7px' }}>
            <Typography variant="h6">
                General Controls
        </Typography>
            <Grid container className={styles.row}>
                {state?.controls?.length ? state?.controls.map(
                    (item) =>
                        <Grid key={item.id} item xs={6} className={styles.col}>
                            <Paper variant="outlined">
                                <List className={styles.switchList}>
                                    <ListItem
                                        disabled={props.editable}
                                        // disabled={
                                        //     !isEditable ||
                                        //     (selectedVersions &&
                                        //         !selectedVersions[module.module.id])
                                        // }
                                        className={styles.listGutter}
                                        button
                                    >
                                        <ListItemIcon className={styles.switchItem}>
                                            <Switch
                                                edge="end"
                                                //checked={state.checked}
                                                checked={item.toggled}
                                                // checked={
                                                //     checked &&
                                                //     checked.indexOf(item.id) !== -1
                                                // }
                                                disableRipple
                                                onClick={handleControlSelection(item, true)}                                            

                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    style={{ wordBreak: "break-word" }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            }
                                        />
                                        {item.toggled && (JSON.parse(item.propertyValue)!==null && JSON.parse(item.propertyValue).filter(item => item.label === 'Other').length > 0) && item?.others?.indexOf(item.id) !== -1 && (
                                        
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    onClick={() => handleClick(item)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        )}
                                    </ListItem>
                                </List>
                                
                            </Paper>
                        </Grid>
                ) :
                    <Grid item xs={12} className={styles.col}>
                        <Paper variant="outlined">
                            <Typography variant="subtitle1" className={styles.listGutter}>
                                No General Control available
                        </Typography>
                        </Paper>
                    </Grid>
                }
            </Grid>
            <Typography variant="h6">
                Field Properties
        </Typography>
            <Grid container className={styles.row}>
            {state?.fields?.length ? state?.fields?.map(
                    (item) =>
                        <Grid key={item.id} item xs={6} className={styles.col}>
                            <Paper variant="outlined">
                                <List className={styles.switchList}>
                                    <ListItem
                                        disabled={props.editable}
                                        // disabled={
                                        //     !isEditable ||
                                        //     (selectedVersions &&
                                        //         !selectedVersions[module.module.id])
                                        // }
                                        className={styles.listGutter}
                                        button

                                    >
                                        <ListItemIcon className={styles.switchItem}>
                                            <Switch
                                                edge="end"
                                                checked={item.toggled}
                                                // checked={
                                                //     checked &&
                                                //     checked.indexOf(item.id) !== -1
                                                // }
                                                disableRipple
                                                onClick={handleControlSelection(item)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    style={{ wordBreak: "break-word" }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            }
                                        />
                                        {item.toggled && (JSON.parse(item.propertyValue)!==null && JSON.parse(item.propertyValue).filter(item => item.label === 'Other').length > 0) && item?.others?.indexOf(item.id) !== -1 && (
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    onClick={() => handleClick(item)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        )}
                                        
                                    </ListItem>
                                </List>
                                
                            </Paper>
                        </Grid>
                ) :
                    <Grid item xs={12} className={styles.col}>
                        <Paper variant="outlined">
                            <Typography variant="subtitle1" className={styles.listGutter}>
                                No Field Property available
                    </Typography>
                        </Paper>
                    </Grid>}
            </Grid>
            {open && (
                <SetOthers
                    handleClose={closeSetOthersDialog}
                    data={selectedData}
                    open={open}
                    openFrom={props.open}
                />
            )}
        </div>
    );
};

export default ControlList;
