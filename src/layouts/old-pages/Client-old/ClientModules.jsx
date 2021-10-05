import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Chip from '@material-ui/core/Chip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";

import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import {
    //updateClientProfile,
    addClientModules,
    resetClientInfo,
} from "../../actions/ClientActions";
import { CANCEL, handleClientModulesError, EDIT_MODULE_ASSIGNMENT, SAVE_MOD_ASSIGNMENT } from "../../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: "16px",
    },
    cardHeading: {
        paddingTop: "12px",
        paddingBottom: "10px",
    },
    cardHeadingSize: {
        fontSize: "18px",
    },
    cardSubheadingSize: {
        fontSize: "16px",
        paddingTop: "10px",
    },
    row: {
        padding: "10px 0 0",
    },
    col: {
        padding: "5px 10px",
    },
    grow: {
        flexGrow: 1,
    },
    buttonCol: {
        padding: "10px 10px 0px",
        display: "flex",
    },
    cancelBtn: {
        marginRight: "16px",
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
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: "14px",
    },
    warningCard: {
        background: theme.palette.warning.main,
        boxShadow: 'none !important',
        color: '#ffffff',
        padding: '12px 16px',
        marginBottom: '14px'
      },
}));

const ClientModules = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { handleSubmit } = useForm({ mode: "onBlur" });
    const { modulesList, name } = props;
    // const modulesList = useSelector((state) =>
    //   state.MasterModule.moduleDetailsList.list.filter(
    //     (obj) => !obj.deleted && obj.status === "ACTIVE"
    //   )
    // );
    //const modulesList = useSelector(state => state.OOBModule.OOBModuleDetailsList.data);
    const [selectedVersions, setSelectedVersions] = useState(
        modulesList.reduce((prev, module) => {
            let result = module.versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1))[0];
            prev[module.module.id] = result;
            return prev
        }, {}));

    const [selectedDefaultVersions, setSelectedDefaultVersions] = useState(
        props.details.modules.reduce((prev, module) => {
            prev[module.module.id] = module;
            return prev
        }, {}));
    const [copySelectedDefaultVersions] = useState(
        props.details.modules.reduce((prev, module) => {
            prev[module.module.id] = module;
            return prev
        }, {}));
    const isClientUpdated = useSelector((state) => state.Client.isClientUpdated);
    const loggedInUserData = useSelector(
        (state) => state.User.loggedInUser.details
    );
    const [apiError, setApiError] = useState(null);
    const [isEditable, setEditable] = useState(false);
    const [isUpdateCalled, setIsUpdateCalled] = useState(false);
    const [versionList, setVersionList] = useState([]);
    const [chipModuleId, setChipModuleId] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const Error = useSelector((state) => state.Client.updateError);
    const [checked, setChecked] = useState(
        props.details.modules && props.details.modules.map((module) => module.module.id)
    );
    //const [status, setStatus] = useState(props.details.status);
    const [isDirty, setDirty] = useState(false);

    const handleCancel = () => {
        dispatch(resetClientInfo());
        setChecked(props.details.modules.map((module) => module.module.id));
        setSelectedDefaultVersions(props.details.modules.reduce((prev, module) => {
            prev[module.module.id] = module;
            return prev
        }, {}));
        setSelectedVersions(modulesList.reduce((prev, module) => {
            let result = module.versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1))[0];
            prev[module.module.id] = result;
            return prev
        }, {}));
        setEditable(false);
        setIsUpdateCalled(false);
        setDirty(false);
        setApiError(false);
    };

    const handleEdit = () => {
        setEditable(true);
        setIsUpdateCalled(false);
        setApiError(false);
    };

    const handleModuleSelection = (value) => () => {
        setDirty(true);
        setApiError(false);
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        if (newChecked.indexOf(value) !== -1) {
            if (selectedDefaultVersions.hasOwnProperty(value))
                setSelectedDefaultVersions((oldItems) => ({ ...oldItems, [value]: copySelectedDefaultVersions[value] }))
            else {
                var i = modulesList.filter((obj) => obj.module.id === value);
                let result = i[0].versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1))[0];
                setSelectedVersions((oldItems) => ({ ...oldItems, [value]: result }))
            }

        }
        setChecked(newChecked);
    };

    const handleMenuItemClick = (e, id) => {
        setDirty(true);
        if (selectedDefaultVersions.hasOwnProperty(chipModuleId)) {
            setSelectedDefaultVersions((oldItems) => ({ ...oldItems, [chipModuleId]: { moduleVersion: id.version, oobModuleId: id.id } }));
        }
        setSelectedVersions((oldItems) => ({ ...oldItems, [chipModuleId]: id }))
        setAnchorEl(null);
    };

    const handleClick = (e, module) => {
        setChipModuleId(module.module.id);
        let result = module.versions.filter((version) => version.oobModuleStatus === 'LABEL').sort((a, b) => (new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1));
        if (result.length > 1)
            setVersionList(result.filter(e => e.version !== (selectedDefaultVersions[module.module.id].moduleVersion ? selectedDefaultVersions[module.module.id].moduleVersion : selectedVersions[module.module.id].version)));
        else
            setVersionList([]);
        setAnchorEl(e.currentTarget);

    };

    const handleClose = (e) => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (
            isUpdateCalled &&
            Error &&
            !(Error.responseCode === "200" || Error.responseCode === 200)
        ) {
            setDirty(true);
            setApiError(handleClientModulesError(Error));
            //setIsUpdateCalled(false);
        }
        else
            setApiError(false);

        if (isClientUpdated) {
            setDirty(false);
            setEditable(false);
            setIsUpdateCalled(false);
            setApiError(false);
            //dispatch(fetchClientById(props.details.id));
            //dispatch(resetClientInfo())
        }
    }, [dispatch, props, isClientUpdated, Error, isDirty, isUpdateCalled]);

    const handleUpdateClientProfileModules = () => {
        setIsUpdateCalled(true);
        setDirty(false);
        var myAssociativeArr = [];
        for (let i = 0; i < checked.length; i++) {
            let newElement = {};
            newElement['moduleId'] = checked[i];
            newElement['clientId'] = props.details.id;
            newElement['associate'] = true;
            if (selectedDefaultVersions.hasOwnProperty(checked)) {
                newElement['oobModuleId'] = selectedDefaultVersions[checked[i]].oobModuleId;
                newElement['moduleVersion'] = selectedDefaultVersions[checked[i]].moduleVersion;
            }
            else {
                newElement['oobModuleId'] = selectedVersions[checked[i]].id;
                newElement['moduleVersion'] = selectedVersions[checked[i]].version;
            }
            myAssociativeArr.push(newElement);
        }
        const values = Object.values(copySelectedDefaultVersions)
        for (let i = 0; i < values.length; i++) {
            let result = myAssociativeArr.filter((obj) => obj.moduleId === values[i].module.id && obj.moduleVersion === values[i].moduleVersion)
            if (result.length === 0) {
                let newElement = {};
                newElement['moduleId'] = values[i].module.id;
                newElement['clientId'] = props.details.id;
                newElement['associate'] = false;
                newElement['oobModuleId'] = values[i].oobModuleId;
                newElement['moduleVersion'] = values[i].moduleVersion;
                myAssociativeArr.push(newElement);
            }
        }

        dispatch(addClientModules(myAssociativeArr,'update'));
    };

    return (
        <MatCard className={styles.card}>
            <CardHeader
                className={styles.cardHeading}
                title={
                    <Typography variant="h6" className={styles.cardHeadingSize}>
                        name
                    </Typography>
                }
            />
            <Divider />
            <CardContent>
                {apiError && isUpdateCalled ? (
                    <Grid item xs={12} className={styles.col}>
                        <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                            <Typography variant="body2">
                                {apiError.message}
                            </Typography>
                        </Card>
                    </Grid>
                ) : null}
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(handleUpdateClientProfileModules)}
                >
                    <Grid container className={styles.row}>
                        {modulesList.map((module) => (
                            <Grid key={module.module.id} item xs={3} className={styles.col}>
                                <Paper variant="outlined">
                                    <List className={styles.switchList}>
                                        <ListItem
                                            disabled={!isEditable || (selectedVersions && !selectedVersions[module.module.id])}
                                            className={styles.listGutter}
                                            button
                                            onClick={handleModuleSelection(module.module.id)}
                                        >
                                            <ListItemIcon className={styles.switchItem}>
                                                <Switch
                                                    edge="end"
                                                    checked={checked && checked.indexOf(module.module.id) !== -1}
                                                    disableRipple
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
                                            {(selectedVersions[module.module.id] && checked.indexOf(module.module.id) !== -1) && <ListItemSecondaryAction>
                                                <Chip
                                                    className={styles.actionButton}
                                                    aria-controls="customized-menu"
                                                    aria-haspopup="true"
                                                    label={selectedDefaultVersions[module.module.id] ? selectedDefaultVersions[module.module.id].moduleVersion : selectedVersions[module.module.id].version}
                                                    onDelete={isEditable ? (e) => handleClick(e, module) : null}
                                                    deleteIcon={<ArrowDropDownIcon />}
                                                />
                                            </ListItemSecondaryAction>}
                                        </ListItem>
                                    </List>
                                    <Menu
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
                                        {versionList.length > 0 && versionList.map((option, index) => (
                                            <MenuItem key={index} onClick={(event) => handleMenuItemClick(event, option)}>
                                                {option.version}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12} className={styles.buttonCol}>
                        <div className={styles.grow} />
                        {!isEditable && loggedInUserData.user_type !== "CLIENT" && !props.details.isDeleted && (
                            <MatButton onClick={handleEdit}>{EDIT_MODULE_ASSIGNMENT}</MatButton>
                        )}

                        {isEditable && (
                            <div>
                                <MatButton
                                    className={styles.cancelBtn}
                                    color="primary"
                                    onClick={handleCancel}
                                >
                                    {CANCEL}
                                </MatButton>
                                <MatButton type="submit" disabled={!isDirty}>
                                    {SAVE_MOD_ASSIGNMENT}
                                </MatButton>
                            </div>
                        )}
                    </Grid>
                </form>
            </CardContent>
        </MatCard>
    );
};

export default ClientModules;
