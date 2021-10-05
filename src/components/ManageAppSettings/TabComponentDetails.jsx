import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import MaterialTextField from '../MaterialUi/MatTextField';
import MatFormControl from '../MaterialUi/MatFormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MatSelect from '../MaterialUi/MatSelect';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles, FormHelperText } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MatButton from "../MaterialUi/MatButton";
import TextField from '@material-ui/core/TextField';
import Tooltip from "../MaterialUi/MatTooltip";
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import ControlProps from './ControlProps';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { NAME_PATTERN, RESET_UPDATE_ERROR,SHOW_SNACKBAR_ACTION } from '../../utils/AppConstants';
//import { resetAddError } from '../../actions/ClientActions';
import {
    COMPONENT_NAME_MANDATORY_MSG, MODULE_ASSI_MAND, handleMasterSubmoduleError,
    MAXIMUN_CHARACTER_ALLOWED_MSG, VALID_NAME_MSG, COMPONENT_ALREADY_EXIST
} from '../../utils/Messages';
import { updateFieldData, fetchFieldType } from "../../actions/MasterComponentActions";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";


const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
    },
    grow: {
        flexGrow: 1
    },
    chip: {
        margin: theme.spacing(0.5),
    },   
    table:
    {
        maxHeight: "280px",
        fontSize:"0.2rem", 
        '& td':{
          // fontSize:"0.2rem",
           paddingTop:"0px",
           paddingBottom:"0px",
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
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: '14px'
    },
    pad0: {
        padding: "0"
    }
}));

let FEILD_TYPE = ['Text Field','Drop Down', 'Integer Field', 'Calendar Field', 'Phone Field', 'Zip Field', 'Check Box', 'Search Field', 'System Generated'];
let ADD_FEILD_TYPE = ['Text Field', 'Integer Field', 'Calendar Field', 'Phone Field', 'Zip Field', 'Check Box', 'Search Field', 'System Generated'];

const LIMIT_TYPE = ['Text Field', 'Integer Field', 'Calendar Field'];

function TabComponentDetails(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { handleDisabled, handleNext, handleAddComponent, defaultError, openFrom } = props;
    const { register, handleSubmit, setValue, clearError, errors, setError } = useForm();
    //const stateCityList = useSelector(state => state.ManageClient.stateCityList.list);
    const myRef = useRef(null);
    const moduleDetailsList = useSelector((state) =>
        state.MasterModule?.moduleDetailsList?.list?.filter(item => !item.deleted)?.sort((a, b) =>
            a.moduleName > b.moduleName ? 1 : -1
        )
    );
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );
    const submoduleDetailsById = useSelector(
        (state) => state.MasterSubmodule.submoduleDetailsById.data
    );
    const addApiError = useSelector((state) => state.MasterSubmodule.addError);
    const putApiError = useSelector((state) => state.MasterSubmodule.putError);
    const [actionError, setActionError] = useState(null);
    //const [city, setCity] = useState(true);
    const data = useSelector(
        (state) => state.MasterComponent.data
    );
    console.log("dafad",data)
    const [inputs, setInputs] = useState({
      componentName: data.componentName,
      moduleIds: data.moduleIds,
      label: "",
    });
    const { componentName, moduleIds, label } = inputs;
    const [editable, setEditable] = useState(false);
    const [isLabelUpdated, setIsLabelUpdated] = useState(true);
    const [isAssociated, setIsAssociated] = useState(false);
    const [defaultEditable, setDefaultEditable] = useState(false);
    const [limitEditable, setLimitEditable] = useState(false);
    
    // const MasterData = useSelector(
    //     (state) => state.MasterComponent.data
    // );

    const [checked, setChecked] = useState(data.config);
    const configFalseColumn = [
        {
            "id": 1,
            "primary": true,
            "disabledVal": false,
            "visibility": true,
            "label": "",
            "fieldType": "",
            "limit": {},
            "defaultVal": ""
        }
    ];
    const [column, setColumn] = useState(data?.column || []);
    console.log("j",data)
    const configTrueColumn = [
        {
            "id": 1,
            "primary": false,
            "disabledVal": true,
            "visibility": true,
            "label": "View Order",
            "fieldType": "Integer Field",
            "limit": {},
            "defaultVal": ""
        },
        {
            "id": 2,
            "primary": false,
            "disabledVal": true,
            "visibility": true,
            "label": "Section",
            "fieldType": "Text Field",
            "limit": {},
            "defaultVal": ""
        },
        {
            "id": 3,
            "primary": true,
            "disabledVal": true,
            "visibility": true,
            "label": "Field Name",
            "fieldType": "Text Field",
            "limit": {},
            "defaultVal": ""
        },
        {
            "id": 4,
            "primary": false,
            "disabledVal": true,
            "disabledDropDown": true,
            "visibility": true,
            "label": "Type of Field",
            "fieldType": "Drop Down",
            "limit": {},
            "defaultVal": ""
        },
        {
            "id": 5,
            "primary": false,
            "disabledVal": true,
            "disabledDropDown": true,
            "visibility": true,
            "label": "Mandatory",
            "fieldType": "Drop Down",
            "limit": {},
            "defaultVal": ""
        },	
        {
            "id": 6,
            "primary": false,
            "disabledVal": true,
            "disabledDropDown": true,
            "visibility": true,
            "label": "Disabled",
            "fieldType": "Drop Down",
            "limit": {},
            "defaultVal": ""
        },	
        {
            "id": 7,
            "primary": false,
            "disabledVal": true,
            "disabledDropDown": true,
            "visibility": true,
            "label": "Hidden",
            "fieldType": "Drop Down",
            "limit": {},
            "defaultVal": ""
        },
        
    ];
    const handleSelection = (value) => () => {
        setChecked(!value);
        if(!checked) {
            
            setColumn([])
            setColumn(configTrueColumn);
        }
        else {
            //setIsAssociated(false)
            setColumn([])
            setColumn(configFalseColumn)
        }
      };

    let handleChange = (e) => {
        const { name, value } = e.target;
        clearError(name);
        console.log(name);
        if (featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 && name === 'moduleIds')
            setInputs(inputs => ({ ...inputs, [name]: data.moduleIds }));
        else
            setInputs(inputs => ({ ...inputs, [name]: value }));
        // if (name === 'label')
        //     setIsLabelUpdated(false);

    }

    let handleLabelChange = (e, val) => {
        const { name, value } = e.target;
        let label = column.filter(obj => obj.id !== val).map(item => item.label.toLowerCase());
        if (name === 'label') {
            if (label.indexOf(value.toLowerCase()) !== -1)
                setIsLabelUpdated(true);
            else
                setIsLabelUpdated(false);
        }
        setInputs((inputs) => ({ ...inputs, [name]: value }));

    };

    const handleEditLabel = (value) => {
        setEditable(value);
        setIsLabelUpdated(true);
    };

    const handleSetLabel = (value) => {
        let newColumn = column.map(item =>
            item.id === value
                ? { ...item, label: label }
                : item
        );
        setColumn(newColumn);
        setEditable(false);
    };

    const handleVisibilityChange = (value) => {
        let updatedList = column.map((item, index) => {
            if (item.id === value) {
                return { ...item, visibility: !item.visibility };
            }
            if (item.id === value && item.visibility) {
                return { ...item, fieldType: '' };
            }
            return item;
        });

        setColumn(updatedList);
    }

    const handleTitleMsg = (value) => {
        return column.filter((item) => item.id === value).length > 0 &&
            column.filter((item) => item.id === value)[0].label === "" ? 'Set Label' : 'Edit Label';
    };

    const handleSelectValue = (selected, list, type) => {
        return selected.map((id) => (
            <Chip
                key={id}
                label={list.filter((lItem) => lItem.id === id)[0][type]}
                className={styles.chip}
            />
        ));
    };

    const handleFieldSelection = (event, value) => {
        let textFieldValue = event.target.value;
        let updatedList = column.map((item, index) => {
            if (item.id === value) {
                return { ...item, fieldType: textFieldValue, defaultVal: '', limit: {} };
            }
            return item;
        });
        setColumn(updatedList);
    }

    const handleUpdatePayload = (updatedData) => {
        if (Boolean(updatedData.defaultVal)) {
            if (Boolean(updatedData.limit.min) || Boolean(updatedData.limit.max)) {
                if (updatedData.fieldType === 'Calendar Field') {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && new Date(updatedData.defaultVal) >= new Date(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && new Date(updatedData.defaultVal) <= new Date(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            new Date(updatedData.defaultVal) >= new Date(updatedData.limit.min) &&
                            new Date(updatedData.defaultVal) <= new Date(updatedData.limit.max))
                    ) {
                        if (defaultError.indexOf(updatedData.id) !== -1) {
                            let Index = defaultError.indexOf(updatedData.id);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.id) === -1)
                            defaultError.push(updatedData.id)
                    }

                }
                if (updatedData.fieldType === 'Text Field') {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && updatedData.defaultVal.length >= parseInt(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && updatedData.defaultVal.length <= parseInt(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            updatedData.defaultVal.length >= parseInt(updatedData.limit.min) &&
                            updatedData.defaultVal.length <= parseInt(updatedData.limit.max))
                    ) {
                        if (defaultError.indexOf(updatedData.id) !== -1) {
                            let Index = defaultError.indexOf(updatedData.id);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.id) === -1)
                            defaultError.push(updatedData.id)
                    }

                }
                if (updatedData.fieldType === 'Integer Field') {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min) &&
                            parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max))
                    ) {
                        if (defaultError.indexOf(updatedData.id) !== -1) {
                            let Index = defaultError.indexOf(updatedData.id);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.id) === -1)
                            defaultError.push(updatedData.id)
                    }

                }
            }
        }
        let newColumn = column.map((item, index) => {
            if (item.id === updatedData.id) {
                let newItem;
                newItem = { ...item, defaultVal: updatedData.defaultVal, limit: updatedData.limit }
                return newItem;
            } else {
                return { ...item }
            }
        }
        );
        // setSelectionChanged(true);
        // dispatch({ type: RESET_UPDATE_ERROR });
        setColumn(newColumn)
    }

    const handleDefaultChange = (value) => {
        setDefaultEditable(value);
    }

    const handleLimitChange = (value) => {
        console.log("LIMIT CHANGE", value);
        setLimitEditable(value);
    }

    const handleAddField = () => {
        if(!isAssociated) {
        const newColumn = [...column];
        let newId = column[column.length - 1].id + 1;
        let Json = {
            "id": newId,
            "primary": false,
            "disabledVal": false,
            "visibility": false,
            "label": "",
            "fieldType": "",
            "limit": {},
            "defaultVal": "",
            
            // "config": {
            //     "Section": { value: '' },
            //     "Label": { value: '', mapping: { method: 'Message Constant', description: {}, oob: false, property: [], functionLabel: false } },
            //     "Hidden": { value: '', mapping: { method: 'System Variable', description: {}, oob: false, property: [], functionLabel: false } },
            //     "Mandatory": { value: '', mapping: { method: 'System Variable', description: {}, oob: false, property: [], functionLabel: false } },
            //     "Disabled": { value: '', mapping: { method: 'System Variable', description: {}, oob: false, property: [], functionLabel: false } },
            //     "Other": [{
            //         id: 1,
            //         value: "",
            //         mapping: { method: "System Variable", description: {}, property: [], functionLabel: false },
            //     }]
            // }
        }
        newColumn.push(Json);
        setColumn(newColumn);
        setTimeout(() => {
            if (myRef.current) {
                myRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
        }, 100);
        
    }
    else {
        dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "Component is already associated with OOB",
              severity: "warning",
            },
          });
    }
}
    const handleRemoveRows = (index) => {
        const newColumn = [...column];
        newColumn.splice(newColumn.findIndex(v => v.id === index), 1);
        setColumn(newColumn);
    };
   
    useEffect(() => {
        if (moduleIds.length !== 0) {
            setValue("moduleIds", moduleIds);
            clearError("moduleIds");
        } else {
            register(
                { name: "moduleIds" },
                { required: { value: true, message: MODULE_ASSI_MAND } }
            );
        }
    }, [clearError, moduleIds, register, setValue]);

    useEffect(() => {
      dispatch(
        updateFieldData(componentName, checked, moduleIds, column, "", [])
      );
      dispatch({ type: RESET_UPDATE_ERROR });
    }, [dispatch, componentName, checked, moduleIds, column]);

    useEffect(() => {
        if (addApiError && addApiError.responseCode !== "2242") {
            setActionError(handleMasterSubmoduleError(addApiError));
        }
        else if (putApiError && putApiError.responseCode !== "2242") {
            setActionError(handleMasterSubmoduleError(putApiError));
        }
        else
            setActionError(false);

        if ((addApiError.responseCode && addApiError.responseCode === "2242") || (putApiError.responseCode && putApiError.responseCode === "2242")) {
            setError("componentName", "notMatch", COMPONENT_ALREADY_EXIST);
        }
    }, [addApiError, putApiError, setError]);

    // useEffect(() => {
    //     if (myRef.current)
    //         myRef.current.scrollIntoView();
    // }, [column]);

    useEffect(() => {
        dispatch(fetchFieldType());
    }, [dispatch]);
    useEffect(() => {
        if (openFrom === 'Update')
            
            setIsAssociated(submoduleDetailsById.associated);
    }, [openFrom, submoduleDetailsById]);
    
    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(() => handleAddComponent())} id="addComponentInfo">
            {actionError ? (
                <Grid item xs={12} className={styles.col}>
                    <Card className={actionError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                        <Typography variant="body2">
                            {actionError.message}
                        </Typography>
                    </Card>
                </Grid>
            ) : null}
            <Grid container className={styles.row}>
                <Grid item xs={5} className={styles.col}>
                    <MaterialTextField
                        inputRef={register({ required: { value: true, message: COMPONENT_NAME_MANDATORY_MSG },
                            // pattern: { value: NAME_PATTERN, message: VALID_NAME_MSG },
                            maxLength: { value: 50, message: MAXIMUN_CHARACTER_ALLOWED_MSG } })}
                        defaultValue={componentName}
                        error={errors.componentName ? true : false}
                        helperText={errors.componentName ? errors.componentName.message : " "}
                        disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                        required label="Component Name" name="componentName" onChange={handleChange} />
                </Grid>
                <Grid item xs={5} className={styles.col}>
                    <MatFormControl
                        required
                        error={errors.moduleIds ? true : false}
                        disabled={isAssociated}
                        variant="filled"
                        size="small"
                    >
                        <InputLabel>Module(s)</InputLabel>
                        <MatSelect
                            multiple
                            value={moduleIds}
                            name="moduleIds"
                            onChange={handleChange}
                            renderValue={(selected) =>
                                handleSelectValue(selected, moduleDetailsList, "moduleName")
                            }
                        >
                            {moduleDetailsList.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    <Checkbox
                                        checked={moduleIds.some((id) => id === option.id)}
                                        disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                    />
                                    <ListItemText primary={option?.moduleName} />
                                </MenuItem>
                            ))}
                        </MatSelect>
                        {errors.moduleIds && 
                        <FormHelperText>
                            {errors.moduleIds.message}
                        </FormHelperText>
                        }
                    </MatFormControl>
                </Grid>
                <Grid item xs={2} className={styles.col}>
                <List>
                    <ListItem
                        button
                        className={styles.pad0}
                        disabled={isAssociated}
                        name="config"
                        onClick={handleSelection(checked)}
                    >
                        <ListItemIcon>
                            <Switch edge="end"  checked={checked} disableRipple />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle2"
                                >
                                    {"Configuration"}
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
                </Grid>
                <Grid item xs={12} style={{paddingTop: "0px"}} className={styles.col}>
                    <Paper variant="outlined">
                        <TableContainer className={styles.table} >
                            <Table stickyHeader aria-label="simple table" size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Primary</TableCell>
                                        <TableCell>Visibility</TableCell>
                                        <TableCell>Label</TableCell>
                                        <TableCell >Set Label</TableCell>
                                        <TableCell >Field Type</TableCell>
                                        <TableCell align={'center'}>Default</TableCell>
                                        <TableCell align={'center'}>Limitation</TableCell>
                                        {/* <TableCell align={'center'}>Configuration</TableCell> */}
                                        <TableCell ></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {column?.map((option, key) => (
                                        <TableRow key={key} ref={key === column.length - 1 ? myRef : undefined}>
                                            <TableCell>
                                                <Checkbox
                                                    disabled={key > 0 || isAssociated || option.disabledVal || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                                    checked={option.primary}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    disabled={isAssociated || option.disabledVal || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                                    onChange={() => handleVisibilityChange(option.id)}
                                                    checked={option.visibility}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {editable === option.id ?
                                                    <TextField name="label"
                                                    required
                                                        defaultValue={column.filter((item) => item.id === option.id)[0].label}
                                                        onChange={(e) => handleLabelChange(e, option.id)} />
                                                    :
                                                    <Typography>{option.label}</Typography>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {editable === option.id ?
                                                    <>
                                                        <Tooltip placement="left" arrow title="Save">
                                                            <IconButton edge="end" aria-label="save" disabled={isLabelUpdated} onClick={() => handleSetLabel(option.id)}>
                                                                <CheckIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip placement="left" arrow title="Cancel">
                                                            <IconButton edge="end" aria-label="cancel" onClick={() => setEditable(false)}>
                                                                <ClearIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                    :
                                                    <Tooltip placement="left" arrow title={handleTitleMsg(option.id)}>
                                                        <IconButton disabled={option.disabledVal || !option.visibility || Boolean(limitEditable) || Boolean(defaultEditable) || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1} edge="end" aria-label="comments" onClick={() => handleEditLabel(option.id)}>
                                                            <CommentIcon />
                                                        </IconButton>
                                                    </Tooltip>}
                                            </TableCell>
                                            <TableCell>
                                                {option.visibility &&
                                                    <TextField
                                                        id="fields"
                                                        select
                                                        defaultValue={option.fieldType}
                                                        disabled={isAssociated || option.disabledVal || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                                        onChange={(event) => { handleFieldSelection(event, option.id) }}
                                                        fullWidth={true}
                                                    >
                                                        {option.disabledVal ? 
                                                        FEILD_TYPE.map((item, index) => (
                                                            <option key={index} value={item}>
                                                                {item}
                                                            </option>
                                                        ))
                                                        :
                                                        ADD_FEILD_TYPE.map((item, index) => (
                                                            <option key={index} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                        
                                                    </TextField>}
                                            </TableCell>

                                            <TableCell >
                                                {option.visibility ?
                                                    defaultEditable === option.id ?
                                                        <ControlProps
                                                            openFrom='Default'
                                                            updatePayload={handleUpdatePayload}
                                                            data={column.filter(item => item.id === option.id)}
                                                            handleCancel={handleDefaultChange}
                                                        />
                                                        :
                                                        <IconButton style={{ marginLeft: '28%' }}
                                                            disabled={option.disabledDropDown || (column.filter((item) => item.id === option.id).length > 0 &&
                                                                !Boolean(column.filter((item) => item.id === option.id)[0].fieldType)) ||
                                                                Boolean(limitEditable) || Boolean(editable) || isAssociated || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                                            edge="end" aria-label="default"
                                                            onClick={() => handleDefaultChange(option.id)}>
                                                            <SettingsIcon style={{ color: defaultError.indexOf(option.id) !== -1 ? '#f44336' : Boolean(option.defaultVal) ? '#4ADAB3' : '' }} />
                                                        </IconButton>
                                                    :
                                                    null}
                                            </TableCell>
                                            <TableCell>
                                                {option.visibility ?
                                                    limitEditable === option.id ?
                                                        <ControlProps
                                                            openFrom='Limit'
                                                            updatePayload={handleUpdatePayload}
                                                            data={column.filter(item => item.id === option.id)}
                                                            handleCancel={handleLimitChange}
                                                        />
                                                        :
                                                        <IconButton style={{ marginLeft: '28%' }}
                                                            disabled={option.disabledVal || (!Boolean(option.fieldType) ||
                                                                !(LIMIT_TYPE.indexOf(column.filter((item) => item.id === option.id)[0].fieldType) !== -1)) ||
                                                                Boolean(defaultEditable) || Boolean(editable) || isAssociated || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                                            edge="end" aria-label="limit"
                                                            onClick={() => handleLimitChange(option.id)}>
                                                            <SettingsIcon
                                                                style={{
                                                                    color: Object.values(option.limit).length > 0 &&
                                                                        Object.values(option.limit).some(item => Boolean(item)) ? '#4ADAB3' : ''
                                                                }}
                                                            />
                                                        </IconButton>
                                                    :
                                                    null}
                                            </TableCell>

                                            {/* <TableCell>
                                                {option.visibility ?
                                                    <IconButton style={{ marginLeft: '28%' }}
                                                        disabled={!Boolean(option.label) || !Boolean(option.fieldType) || Boolean(limitEditable) || Boolean(defaultEditable) || Boolean(editable) || moduleIds.length === 0}
                                                        edge="end" aria-label="limit"
                                                        onClick={() => handleNext(componentName, moduleIds, column, option.id, column.filter(item => item.id === option.id))}>
                                                        <SettingsIcon
                                                            style={{
                                                                color: Object.values(option.config).some(item => item.value !== '' && item.mapping && Object.keys(item.mapping.description).length > 0) ? '#4ADAB3' : ''
                                                            }}
                                                        />
                                                    </IconButton>
                                                    :
                                                    null}
                                            </TableCell> */}
                                            <TableCell>
                                                {key > 0 ?
                                                    <IconButton style={{ color: (option.disabledVal || Boolean(editable) || Boolean(limitEditable) || Boolean(defaultEditable || isAssociated) ? "" : "#ff9800") }}
                                                        disabled={option.disabledVal || Boolean(editable) || Boolean(limitEditable) || Boolean(defaultEditable) || isAssociated}
                                                        onClick={() => handleRemoveRows(option.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    :
                                                    null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 &&
                    <Grid item xs={3} className={styles.col} style={{paddingTop:"0px",paddingBottom:"0px"}}>
                        <MatButton
                            onClick={handleAddField}
                        >
                            Add New Field
                </MatButton>
                    </Grid>}
            </Grid>
        </form>
    );
}

export default TabComponentDetails;