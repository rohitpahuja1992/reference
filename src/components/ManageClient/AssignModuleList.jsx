import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Chip from '@material-ui/core/Chip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { RESET_ASSIGN_MODULE_ERROR, SELECTED_OOB_MODULE } from '../../utils/AppConstants';
import { moduleWarningMessage, NO_MODULE_AVAILABLE } from '../../utils/Messages';
import TurnOnModule from '../ClientProfileDetails/TurnOnModule';
import { addClientModules } from "../../actions/ClientActions";
const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
    },
    switchList: {
        padding: "0px",
    },
    listGutter: {
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "6px",
        "&.Mui-disabled": {
            opacity: "0.8",
        },
    },
    switchItem: {
        marginRight: "6px",
    },
    noLabelModule: {
        padding: '10px'
    },
    actionButton: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

function AssignModuleList(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [openTurnOnModuleStatus, setOpenTurnOnModule] = useState(false);
  const closeTurnOnModule = () => {
    setOpenTurnOnModule(false);
};
const openTurnOnModule = () => {
  setOpenTurnOnModule(true);
};
const [currentModuleId, setCurrentModuleId] = useState("");
const [currentModuleVersion, setCurrentModuleVersion] = useState("");
const [selectedClientName, setSelectedClientName] = useState("");
    const { ModuleDetailsList, handleDisabled } = props;
    const [selectedVersions, setSelectedVersions] = useState(ModuleDetailsList.reduce((prev, module) => {
        let result = module.versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1))[0];
        prev[module.module.id] = result;
        return prev
    }, {}));
    const addedClientId = useSelector((state) => state.Client.addedClientId);
    const [versionList, setVersionList] = useState(ModuleDetailsList.reduce((prev, module) => {
        let result = module.versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1));
        if (result.length > 1)
            prev[module.module.id] = result.filter(e => e?.version !== selectedVersions[module.module.id]?.version);
        else
            prev[module.module.id] = {}
        return prev
    }, {}));
    const [chipModuleId, setChipModuleId] = useState('');
    let module = ModuleDetailsList.filter((obj) => obj.module.global && selectedVersions[obj.module.id]);
    let data = module.map(item => item.module.id);
    const [checked, setChecked] = useState(data);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleModuleSelection = (value,currentModuleName) => () => {
        setCurrentModuleId(value)
        dispatch({ type: RESET_ASSIGN_MODULE_ERROR });
        setCurrentModuleVersion(selectedVersions[value].version)
        setSelectedClientName(currentModuleName)
        openTurnOnModule();
    };


    const handleMenuItemClick = (e, id) => {
        setSelectedVersions((oldItems) => ({ ...oldItems, [chipModuleId]: id }));
        let module = ModuleDetailsList.filter((obj) => obj.module.id === chipModuleId);
        let result = module[0].versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1));
        let items = result.filter(e => e.version !== id.version);
        if (result.length > 1)
            setVersionList((oldItems) => ({ ...oldItems, [chipModuleId]: items }));
        else
            setVersionList({});
        setAnchorEl(null);
    };

    const handleClick = (e, module) => {
        setChipModuleId(module.module.id);
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
    };
    const handleSave = (payloadval) => {
        const currentIndex = checked.indexOf(payloadval.moduleId);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(payloadval.moduleId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        var myAssociativeArr = [];
        // for (let i = 0; i < checked.length; i++) {
            var newElement = {};
            newElement['moduleId'] = payloadval.moduleId;
            newElement['oobModuleId'] = selectedVersions[payloadval.moduleId].id;
            newElement['clientId'] = addedClientId;
            newElement['moduleVersion'] = selectedVersions[payloadval.moduleId].version;
            newElement['associate'] = true;
            myAssociativeArr.push(newElement);
        // }
        
        dispatch(addClientModules(myAssociativeArr,'',payloadval,''));
       // dispatch({ type: SELECTED_OOB_MODULE, payload: myAssociativeArr });
        closeTurnOnModule();
      };
   

    // useEffect(() => {
    //     let module = ModuleDetailsList.filter((obj) => obj.module.global && selectedVersions[obj.module.id]);
    //     let data = module.map(item => item.module.id);
    //     setChecked(data);
    // }, []);


    return (
        <>
            {
                (Object.keys(selectedVersions).every((k) => !selectedVersions[k])) ?
                    <Grid container className={styles.row}>
                        <Grid item xs={12} className={styles.col}>
                            <Paper variant="outlined" className={styles.noLabelModule}>
                                <Typography variant="subtitle2" style={{ wordBreak: "break-word" }}>
                                    {NO_MODULE_AVAILABLE}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    :
                    ModuleDetailsList.map((module) => (
                        selectedVersions[module.module.id] &&
                        <Grid key={module.module.id} item xs={4} className={styles.col}>
                            <Paper variant="outlined">
                                <List className={styles.switchList}>
                                    <ListItem
                                        disabled={!selectedVersions[module.module.id]}
                                        className={styles.listGutter}
                                        button
                                    >
                                        <ListItemIcon className={styles.switchItem}>
                                            <Switch
                                                edge="end"
                                                checked={checked.indexOf(module.module.id) !== -1}
                                                disabled={module.module.global}
                                                disableRipple
                                                onClick={handleModuleSelection(module.module.id,module.module.moduleName)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    style={{ wordBreak: "break-word" }}
                                                >
                                                    {module.module.moduleName}
                                                </Typography>
                                            }
                                        />
                                        {selectedVersions[module.module.id] && versionList[module.module.id] && <ListItemSecondaryAction>
                                            <Chip
                                                className={styles.actionButton}
                                                aria-controls="customized-menu"
                                                aria-haspopup="true"
                                                label={selectedVersions[module.module.id].version}
                                                onClick={(checked.indexOf(module.module.id) !== -1 && versionList[module.module.id].length > 0) ? (e) => handleClick(e, module) : null}
                                                onDelete={(checked.indexOf(module.module.id) !== -1 && versionList[module.module.id].length > 0) ? (e) => handleClick(e, module) : null}
                                                deleteIcon={<ArrowDropDownIcon />}
                                            />
                                        </ListItemSecondaryAction>}
                                    </ListItem>
                                </List>
                                {anchorEl && <Menu
                                    id="customized-menu"
                                    anchorEl={anchorEl}
                                    elevation={0}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}

                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={(e) => handleClose(e)}
                                >
                                    {/* <MenuItem>5</MenuItem>
                        <MenuItem>6</MenuItem> */}
                                    {versionList[chipModuleId].length > 0 && versionList[chipModuleId].map((option, index) => (
                                        <MenuItem key={index} onClick={(event) => handleMenuItemClick(event, option)}>
                                            {option.version}
                                        </MenuItem>
                                    ))}
                                </Menu>}
                            </Paper>
                        </Grid>
                    ))
            }
            { openTurnOnModuleStatus && <TurnOnModule
            moduleId={currentModuleId}
            clientId={addedClientId}
            moduleVersion={currentModuleVersion}
            handleSave={handleSave}
            selectedClientName={selectedClientName}
            handleClose={closeTurnOnModule}
            open={openTurnOnModuleStatus} /> }
        </>
    );
}
export default AssignModuleList;