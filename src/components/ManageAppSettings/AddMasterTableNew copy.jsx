import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles, FormHelperText } from "@material-ui/core";
//import Chip from "@material-ui/core/Chip";
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
import Chip from "@material-ui/core/Chip";
//import Radio from '@material-ui/core/Radio';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Switch from '@material-ui/core/Switch';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Tooltip from "../MaterialUi/MatTooltip";
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CommentIcon from '@material-ui/icons/Comment';
import SettingsIcon from '@material-ui/icons/Settings';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
//import CogWrentchBlackIcon from "../../assets/images/cog-wrench-black.png";
//import CogWrentchBlueIcon from "../../assets/images/cog-wrench-blue.png";
// import defaultCog from "../../assets/images/default-cog.svg";
// import defaultSet from "../../assets/images/default-set.svg";
// import AddInputPopup from './AddInputPopup';
import ControlProps from './ControlProps';
import {isDecimal} from "../../utils/helpers";
import {
    updateMasterTable,
    fetchColumnList,
    // fetchChildTable,
    //resetDuplicateError,
} from "../../actions/MasterTableActions";
import { RESET_UPDATE_ERROR } from "../../utils/AppConstants";
import { MODULE_ASSI_MAND, handleUpdateMasterTableError } from "../../utils/Messages";
import { UPDATE_TABLE, COMMON_ERROR_MESSAGE, ENTER_VALID_TABLE, MAXIMUN_CHARACTER_ALLOWED_MSG, MASTERTABLE_NAME_MANDATORY, ENTER_VALID_LABEL, TABLE_LABEL_MANDATORY } from "../../utils/Messages";
import MatTextField from "../MaterialUi/MatTextField";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
//import { NAME_PATTERN } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    table: {
        maxHeight: "220px",
    },
    switchList: {
        padding: "4px",
    },
    switchItem: {
        marginRight: "6px",
    },
    chip: {
        margin: "2px",
    },
    listGutter: {
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "6px",
        "&.Mui-disabled": {
            opacity: "0.8",
        },
    },
    icon: {
        marginLeft: '10%'
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: '14px'
    },
    warningCard: {
        background: theme.palette.warning.main,
        boxShadow: 'none !important',
        color: '#ffffff',
        padding: '12px 16px',
        marginBottom: '14px'
    },
}));


const FEILD_TYPE = [
{ id: 'STRING', value: 'Text Field' },
{ id: 'STRING', value: 'Search Field' },
{ id: 'TINYTEXT', value: 'Text Field' },
{ id: 'TINYTEXT', value: 'Search Field' },
{ id: 'INTEGER', value: 'Integer Field' },
{ id: 'DOUBLE', value: 'Integer Field' },
{ id: 'BIT', value: 'Check Box' },
// { id: 'BIT', value: 'Radio Button' },
{ id: 'DATE', value: 'Calendar Field' },
{ id: 'LONGTEXT', value: 'Text Field' },
{ id: 'LONGTEXT', value: 'Search Field' },
{ id: 'LONGTEXT', value: 'System Generated' },
{ id: 'parentTableName', value: 'Drop Down' },
{ id: '', value: 'Text Field' },
{ id: '', value: 'Integer Field' },
{ id: '', value: 'Calendar Field' },
{ id: '', value: 'Check Box' },
{ id: '', value: 'Search Field' },
{ id: '', value: 'System Generated' }];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddMasterTableNew = React.memo((props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        //watch,
        setValue,
        setError,
        clearError,
        //formState,
        errors,
    } = useForm({ mode: "onBlur" });
    const [isSubmited, setIsSubmited] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [selectionChanged, setSelectionChanged] = useState(false);
    const [editable, setEditable] = useState(false);
    const [defaultEditable, setDefaultEditable] = useState(false);
    const [limitEditable, setLimitEditable] = useState(false);
    const [isLabelUpdated, setIsLabelUpdated] = useState(true);
    const LIMIT_TYPE = ['Text Field', 'Integer Field', 'Calendar Field'];
    const [defaultError, setDefaultError] = useState([]);
    const tableDetailsListById = useSelector((state) => state.MasterTable.tableDetailsById.data);
    // const childTableList = useSelector((state) => state.MasterTable.childTableList);
    const selectedModuleList = tableDetailsListById.moduleTableConfigModules && tableDetailsListById.moduleTableConfigModules.map(id => id.module.id);
    // const [childList, setChildList] = useState([]);
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );

    const defaultFormData = {
        tableName: tableDetailsListById.tableName,
        moduleIds: selectedModuleList?.length > 0 ? selectedModuleList.filter((value, index) => selectedModuleList.indexOf(value) === index) : [],
        subText: "",
        tableLabel: tableDetailsListById.tableLabel,
        childField: tableDetailsListById.childFieldList?.length > 0 ? tableDetailsListById.childFieldList : [],
    };
    const [inputs, setInputs] = useState(defaultFormData);
    const colName = useSelector((state) =>
        state.MasterTable.columnList
    );
    const newMapField = JSON.parse(tableDetailsListById.mapField) || [];
    
    let newMap = newMapField.filter(item => item.mapObject?.isRequired).map(item => item.mapObject?.fieldName)
    
    let getFields = colName?.filter(item => item.isRequired && newMap.indexOf(item?.fieldName)  === -1) 
    
    
    let setFields = getFields?.map((data) => {
        let blankData = {
            limit: {},
            mapLable: "",
            mapReference: false,
            fieldType: data?.isAutoIncrement === "true" ?'Integer Field':'',
            defaultVal: "",
            
            mapObject: data,
           
        };
        return { ...blankData };
      })

    var defval =[]; 
    var defPayload =[];
    if(setFields.length > 0 || newMapField.length > 0) {
        var mapField = [...newMapField, ...setFields]
        
        defval = mapField && Object.keys(mapField).length !== 0 ? mapField.map(obj => obj.mapObject.fieldName) : [];
        defPayload = mapField && Object.keys(mapField).length !== 0 ? mapField : []
    }

    
    // console.log("colName", colName)
    // console.log("NewMapField", newMapField)
    // console.log("newMap", newMap)
    // console.log("getFields", getFields)
    // console.log("setFields", setFields)
    // console.log("mapField", mapField)
    const {
        tableName,
        moduleIds,
        subText,
        tableLabel,
        childField,
    } = inputs;
    const isTableUpdated = useSelector(
        (state) => state.MasterTable.isTableUpdated
    );
    const putApiError = useSelector((state) => state.MasterTable.putError);
    const [apiError, setApiError] = useState(null);

    // const [filterChild, setFilterChild] = useState([]);
    const [inputValue, setInputValue] = useState('');
    console.log("defval",defval);
    
    const [checked, setChecked] = useState([]);
    const [payload, setPayload] = useState([]);
    let filterObjects = []
    if (mapField && Object.keys(mapField).length !== 0) {
        filterObjects = mapField.filter(object => object.mapReference);;
    };
    console.log("checked",checked);
    
    const [primaryKey, setPrimaryKey] = useState((filterObjects && filterObjects.length > 0 && filterObjects[0].mapObject?.fieldName) ? filterObjects[0].mapObject?.fieldName : '');
    const [autoKey,setAutoKey] = useState('');

    const moduleDetailsList = useSelector((state) =>
        state.MasterModule.moduleDetailsList.list.filter(item => !item.deleted).sort((a, b) =>
            a.moduleName > b.moduleName ? 1 : -1
        )
    );

    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        clearError();
        dispatch({ type: RESET_UPDATE_ERROR });
        props.handleClose();
    }, [props, dispatch, clearError]);

    let handleChange = (e) => {
        const { name, value } = e.target;
        setApiError(false);
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        // console.log("inputs", inputs, payload, val);

        // if (name === 'subText')
        //     setIsLabelUpdated(false);
        setInputs((inputs) => ({ ...inputs, [name]: value }));

    };

    let handleLabelChange = (e, val) => {
        const { name, value } = e.target;
        setApiError(false);
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        let label = payload.filter(obj => obj.mapObject?.fieldName !== val).map(item => item.mapLable.toLowerCase());
        if (name === 'subText') {
            if (label.indexOf(value.toLowerCase()) !== -1)
                setIsLabelUpdated(true);
            else
                setIsLabelUpdated(false);
        }
        setInputs((inputs) => ({ ...inputs, [name]: value }));

    };

    const handleCheckChange = (value) => {
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        const currentIndex = checked?.indexOf(value);
        const newChecked = [...checked];
        const newPayload = [...payload];
        // const newPrimary = [...primaryValue];
        // const primaryIndex = newPrimary.indexOf(value);

        if (currentIndex === -1) {
            newChecked.push(value);
            let obj = colName.filter((e) => e.fieldName === value)[0];
            let Json = {
                limit: {},
                mapLable: "",
                mapReference: false,    
                fieldType: obj?.isAutoIncrement === "true" ?'Integer Field':'',             
                defaultVal: "",               
                mapObject: obj,             
            }
            if (obj?.isAutoIncrement === "true")
                setAutoKey(value);
            newPayload.push(Json);
        } else {
            var removeIndex = newPayload.map((item) => item.mapObject?.fieldName).indexOf(value);
            if (primaryKey === newPayload[removeIndex].mapObject?.fieldName)
                setPrimaryKey('');
            if (editable === newPayload[removeIndex].mapObject?.fieldName)
                setEditable(false);
            if (defaultEditable === newPayload[removeIndex].mapObject?.fieldName)
                setDefaultEditable(false);
            if (limitEditable === newPayload[removeIndex].mapObject?.fieldName)
                setLimitEditable(false);
            newPayload.splice(removeIndex, 1);
            newChecked.splice(currentIndex, 1);
        }
         setPayload(newPayload);
         setChecked(newChecked);
        defval = [...newChecked]
        defPayload = [...newPayload]
    };

    const handleChildChange = (event, value) => {
        if (featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1)
            setInputs((inputs) => ({ ...inputs, childField: defaultFormData.childField }));
        else
            setInputs((inputs) => ({ ...inputs, childField: value }));
    }

    const handleFieldSelection = (event, fieldName) => {
        let textFieldValue = event.target.value;
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        setDefaultEditable(false);
        setLimitEditable(false);
        setNewFieldTypeInPayload(textFieldValue, fieldName);
    }

    const setNewFieldTypeInPayload = (fieldValue, fieldName) => {
        let newPayload = payload.map((item) => {
            if (item.mapObject?.fieldName === fieldName) {
                let newItem;
                newItem = { ...item, fieldType: fieldValue, defaultVal: '', limit: {} }
                return newItem;
            } else {
                return { ...item }
            }
        }
        );
        let Index = defaultError.indexOf(fieldName);
        defaultError.splice(Index, 1);
        setPayload(newPayload)
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
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) !== -1) {
                            let Index = defaultError.indexOf(updatedData.mapObject?.fieldName);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) === -1)
                            defaultError.push(updatedData.mapObject?.fieldName)
                    }

                }
                if (updatedData.fieldType === 'Text Field') {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && updatedData.defaultVal.length >= parseInt(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && updatedData.defaultVal.length <= parseInt(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            updatedData.defaultVal.length >= parseInt(updatedData.limit.min) &&
                            updatedData.defaultVal.length <= parseInt(updatedData.limit.max))
                    ) {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) !== -1) {
                            let Index = defaultError.indexOf(updatedData.mapObject?.fieldName);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) === -1)
                            defaultError.push(updatedData.mapObject?.fieldName)
                    }

                }
                if (updatedData.fieldType === 'Integer Field' && updatedData.mapObject.javaDataType === "DOUBLE") {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min) &&
                            parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max))
                    ) {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) !== -1) {
                            let Index = defaultError.indexOf(updatedData.mapObject?.fieldName);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) === -1)
                            defaultError.push(updatedData.mapObject?.fieldName)
                    }

                }
                if (updatedData.fieldType === 'Integer Field' && updatedData.mapObject.javaDataType === "INTEGER") {
                    if ((Boolean(updatedData.limit.min) && !Boolean(updatedData.limit.max) && parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min)) ||
                        (Boolean(updatedData.limit.max) && !Boolean(updatedData.limit.min) && parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max)) ||
                        (Boolean(updatedData.limit.min) && Boolean(updatedData.limit.max) &&
                            parseInt(updatedData.defaultVal) >= parseInt(updatedData.limit.min) &&
                            parseInt(updatedData.defaultVal) <= parseInt(updatedData.limit.max))
                            && !isDecimal(updatedData.defaultVal)
                    ) {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) !== -1) {
                            let Index = defaultError.indexOf(updatedData.mapObject?.fieldName);
                            defaultError.splice(Index, 1);
                        }
                    }
                    else {
                        if (defaultError.indexOf(updatedData.mapObject?.fieldName) === -1 || isDecimal(updatedData.defaultVal))
                            defaultError.push(updatedData.mapObject?.fieldName)
                    }

                }
                
            }
        }
        let newPayload = payload.map((item) => {
            if (item.mapObject?.fieldName === updatedData.mapObject?.fieldName) {
                let newItem;
                newItem = { ...item, defaultVal: updatedData.defaultVal, limit: updatedData.limit }
                return newItem;
            } else {
                return { ...item }
            }
        }
        );
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        setPayload(newPayload)
    }


    const handleDefaultChange = (value) => {
        setDefaultEditable(value);
    }

    const handleLimitChange = (value) => {
        setLimitEditable(value);
    }

    const handlePrimaryChange = (value) => {
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR }); // why
        let newPayload = payload.map((item) => {
            if (item.mapObject?.fieldName === value) {
                let newItem;
                if (item.mapReference === true) {
                    newItem = { ...item, mapReference: false }
                    setPrimaryKey('');
                } else {
                    newItem = { ...item, mapReference: true }
                    setPrimaryKey(value);

                }
                return newItem;
            } else {
                return { ...item, mapReference: false }
            }

        }

        );
        setPayload(newPayload)

        // commented by ravi,as updation happening at single value

        // if (currentIndex === -1) {
        //   newPrimary.push(value);
        //   let newPayload = payload.map(item =>
        //     item.mapObject?.fieldName === value
        //       ? { ...item, mapReference: true }
        //       : item
        //   );
        //   setPayload(newPayload);
        // } else {
        //   var removeIndex = payload.map((item) => item.mapObject?.fieldName).indexOf(value);
        //   newPrimary.splice(removeIndex, 1);
        //   let newPayload = payload.map(item =>
        //     item.mapObject?.fieldName === value
        //       ? { ...item, mapReference: false }
        //       : item
        //   );
        //   setPayload(newPayload);
        // }
        // setPrimaryValue(newPrimary);
        // setPrimaryKey(value);
    };

    const handleSetSubText = (value) => {
        setSelectionChanged(true);
        dispatch({ type: RESET_UPDATE_ERROR });
        let newPayload = payload.map(item =>
            item.mapObject?.fieldName === value
                ? { ...item, mapLable: subText }
                : item
        );
        setPayload(newPayload);
        setEditable(false);
    };


    const handleSetLabel = (value) => {
        setEditable(value);
        setIsLabelUpdated(true);
    };

    const handleTitleMsg = (value) => {
        return payload.filter((item) => item.mapObject?.fieldName === value).length > 0 &&
            payload.filter((item) => item.mapObject?.fieldName === value)[0].mapLable === "" ? 'Set Label' : 'Edit Label';
    };

    const handleSelectValue = (selected, list, type) => {
        if (type === "") {
            return selected.map((id) => (
                <Chip
                    key={id}
                    label={list.filter((data) => data === id)[0]}
                    className={styles.chip}
                />
            ));

        }
        else {
            return selected.map((id) => (
                <Chip
                    key={id}
                    label={list.filter((data) => data.id === id)[0][type]}
                    className={styles.chip}
                />
            ));
        }
    };

    useEffect(() => {
        if (moduleIds.length !== 0) {
            //dispatch(fetchChildTable(moduleIds));
            setValue("moduleIds", moduleIds);
            clearError("moduleIds");
        } else {
            register(
                { name: "moduleIds" },
                { required: { value: true, message: MODULE_ASSI_MAND } }
            );
        }
    }, [dispatch, clearError, moduleIds, register, setValue]);

    useEffect(() => {
        if (
            putApiError &&
            !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
        ) {
            setSelectionChanged(false);
            setApiError(handleUpdateMasterTableError(putApiError, defaultFormData.tableName));
        }
        else {
            setApiError(false);
            setIsSubmited(false);
        }

        if (isTableUpdated) {
            handleCloseForm();
            //dispatch(resetDuplicateError());
        }
    }, [dispatch, putApiError, setError, isTableUpdated, handleCloseForm, defaultFormData.tableName]);

    const handleUpdateTable = () => {
        setIsSubmited(true);
        let modifiedPayload = payload.filter((a,i) => {
            if(a.fieldType === "Check Box" && a.defaultVal === "") {
                payload[i]["defaultVal"] = 0;
            }
            else if(a.fieldType === "Check Box" && a.defaultVal === "0") {
                payload[i]["defaultVal"] = 0;
            }
            else if(a.fieldType === "Check Box" && a.defaultVal === "1") {
                payload[i]["defaultVal"] = 1;
            }
            return a;
            })
        let payloadJson = {
            id: tableDetailsListById.id,
            //moduleChildFieldMap: temp,
            tableName: inputs.tableName,
            tableLabel: inputs.tableLabel,
            moduleIds: inputs.moduleIds,
            childFields: inputs.childField,
            mapField: JSON.stringify(modifiedPayload)
        }
        dispatch(updateMasterTable(payloadJson));
    };

    useEffect(() => {
        let label = payload.map(item => item.mapLable);
        let fields = payload.map(item => item.fieldType);
        if (payload.length > 0 && (label.indexOf("") !== -1 || fields.indexOf("") !== -1))
            setIsEmpty(true);
        else
            setIsEmpty(false);
    }, [payload]);


    useEffect(() => {
        if (tableName !== '')
            dispatch(fetchColumnList(tableName))
    }, [dispatch, tableName]);

    // useEffect(() => {
    //     dispatch(fetchChildTable(tableDetailsListById.id));
    // }, [dispatch, tableDetailsListById.id]);

    // useEffect(() => {
    //     if (childTableList.length > 0) {
    //         let arrs = childTableList;
    //         let sortedarr = [].concat(...arrs).sort();
    //         //setInputs((inputs) => ({ ...inputs, childField: childField.filter(item => sortedarr.indexOf(item) !== -1) }));
    //         setChildList(sortedarr);
    //     }
    //     else
    //         setChildList([]);
    //     // if (Object.keys(childTableList).length > 0) {
    //     //     let arrs = Object.values(childTableList);
    //     //     let sortedarr = [].concat(...arrs).sort();
    //     //     setInputs((inputs) => ({ ...inputs, childField: childField.filter(item => sortedarr.indexOf(item) !== -1) }));
    //     //     setChildList(sortedarr);
    //     // }
    //     // else
    //     //     setChildList([]);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [childTableList]);
   
    useEffect(() => {
        if (JSON.stringify(defval) !== JSON.stringify(checked)) {
            setChecked(defval);
            setPayload(defPayload);
            console.log("defval", defval)
        }
    }, [JSON.stringify(defval)]);
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle className={styles.dialogTitle}>
                {UPDATE_TABLE}
            </DialogTitle>
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(handleUpdateTable)}
            >
                <DialogContent dividers="true">
                    {apiError ? (
                        <Grid item xs={12} className={styles.col}>
                            <Card className={styles.errorCard}>
                                <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
                            </Card>
                        </Grid>
                    ) : null}
                    <Grid container className={styles.row}>
                        <Grid item xs={6} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: MASTERTABLE_NAME_MANDATORY,
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9-_\s]*$/,
                                        message: ENTER_VALID_TABLE,
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                                    },
                                })}
                                error={errors.tableName ? true : false}
                                helperText={errors.tableName?.message}
                                defaultValue={tableName}
                                disabled={true}
                                onChange={handleChange}
                                required
                                name="tableName"
                                label="Table Name"
                            />
                        </Grid>


                        <Grid item xs={6} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: TABLE_LABEL_MANDATORY,
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9-_\s]*$/,
                                        message: ENTER_VALID_LABEL,
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                                    },
                                })}
                                error={errors.tableLabel ? true : false}
                                helperText={errors.tableLabel?.message}
                                defaultValue={tableLabel}
                                onChange={handleChange}
                                disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                required
                                name="tableLabel"
                                label="Table Label"
                            />
                        </Grid>

                        <Grid item xs={6} className={styles.col}>
                            <MatFormControl
                                required
                                error={errors.moduleIds ? true : false}
                                variant="filled"
                                size="small"
                            >
                                <InputLabel>Module(s)</InputLabel>
                                <MatSelect
                                    multiple
                                    value={moduleIds}
                                    name="moduleIds"
                                    onChange={handleChange}
                                    disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                    renderValue={(selected) =>
                                        handleSelectValue(selected, moduleDetailsList, "moduleName")
                                    }
                                >
                                    {moduleDetailsList.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            <Checkbox
                                                checked={moduleIds.some((id) => id === option.id)}
                                            />
                                            <ListItemText primary={option.moduleName} />
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                                <FormHelperText>
                                    {errors.moduleIds ? errors.moduleIds.message : " "}
                                </FormHelperText>
                            </MatFormControl>
                        </Grid>

                        {/* <Grid item xs={6} className={styles.col}>
                            <Autocomplete
                                name="childField"
                                multiple
                                options={childList}
                                value={childField}
                                limitTags={2}
                                openOnFocus
                                disableCloseOnSelect
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue, reason) => {
                                    if (reason === 'input') {
                                        setInputValue(newInputValue);
                                    }
                                }}
                                onChange={(event, value) => handleChildChange(event, value)}
                                getOptionLabel={(option) => option}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Chip
                                            label={option}
                                            {...getTagProps({ index })}
                                            disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                        />
                                    ))
                                }
                                renderOption={(option, { selected }) => (
                                    <React.Fragment>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            disabled={featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </React.Fragment>
                                )}
                                //style={{ width: 500 }}
                                renderInput={(params) => (
                                    <MatTextField {...params}
                                        label="Child Table" />
                                )}
                            />
                            {/* <MatFormControl
                                disabled={childList.length === 0}
                                variant="filled"
                                size="small"
                            >
                                <InputLabel>Child Table</InputLabel>
                                <MatSelect
                                    multiple
                                    value={childField}
                                    name="childField"
                                    onChange={handleChange}
                                    renderValue={(selected) =>
                                        handleSelectValue(selected, childList, "")
                                    }
                                >
                                    {childList.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            <Checkbox
                                                checked={childField.some((id) => id === option)}
                                            />
                                            <ListItemText primary={option} />
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                            </MatFormControl> */}
                        {/* </Grid> */}

                        <Grid item xs={12} className={styles.col}>
                            <Paper variant="outlined">
                                <TableContainer className={styles.table}>
                                    <Table stickyHeader aria-label="simple table" size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Primary</TableCell>
                                                <TableCell>Checked</TableCell>
                                                <TableCell>Column Name</TableCell>
                                                <TableCell>Label</TableCell>
                                                <TableCell >Set Label</TableCell>
                                                <TableCell >Field Type</TableCell>
                                                <TableCell align={'center'}>Default</TableCell>
                                                <TableCell align={'center'}>Limitation</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {colName.map((option, key) => (
                                                <TableRow key={option.fieldName}>
                                                    <TableCell>
                                                        <Checkbox
                                                            onChange={() => handlePrimaryChange(option.fieldName)}
                                                            disabled={(!checked?.includes(option.fieldName) || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 || autoKey === option.fieldName || (option.fieldName === 'id'))}
                                                            checked={(primaryKey === option.fieldName) && key!==0}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            onChange={() => handleCheckChange(option.fieldName)}
                                                            disabled={(option.fieldName === "version" && option.isRequired && option.hasDefault === false ? false : option.isRequired) || (featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 || (option.fieldName === 'id') ) }
                                                            checked={(checked?.some((id) => id === option.fieldName))}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* {editable === option.fieldName ?
                                                            <TextField name="subText"
                                                                defaultValue={payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].mapLable}
                                                                onChange={handleChange} />
                                                            :
                                                            <> */}
                                                        <Typography>{option.columnName}</Typography>
                                                        {/* {payload.filter((item) => item.mapObject?.fieldName === option.fieldName).length > 0 &&
                                                                    payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].mapLable &&
                                                                    <Typography>{payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].mapLable}</Typography>}
                                                            </>} */}
                                                    </TableCell>
                                                    <TableCell>
                                                        {editable === option?.fieldName ?
                                                            <TextField name="subText"
                                                                defaultValue={payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0]?.mapLable}
                                                                onChange={(e) => handleLabelChange(e, option.fieldName)} />
                                                            :
                                                            payload.filter((item) => item.mapObject?.fieldName === option.fieldName).length > 0 &&
                                                            payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].mapLable ?
                                                            <Typography>{payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].mapLable}</Typography>
                                                            :
                                                            option.fieldName === 'id' && option.isRequired ?
                                                            <Typography>id</Typography>
                                                            : null
                                                            
                                                        }
                                                    </TableCell>
                                                    <TableCell >
                                                        {editable === option.fieldName ?
                                                            <>
                                                                <Tooltip placement="left" arrow title="Save">
                                                                    <IconButton edge="end" aria-label="save" disabled={isLabelUpdated} onClick={() => handleSetSubText(option.fieldName)}>
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
                                                            <Tooltip placement="left" arrow title={handleTitleMsg(option.fieldName)}>
                                                                <IconButton disabled={(option.fieldName === 'id') || !(checked?.some((id) => id === option.fieldName)) || Boolean(limitEditable) || Boolean(defaultEditable) || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1} edge="end" aria-label="comments" onClick={() => handleSetLabel(option.fieldName)}>
                                                                    <CommentIcon />
                                                                </IconButton>
                                                            </Tooltip>}
                                                    </TableCell>
                                                    <TableCell>
                                                        {checked?.includes(option.fieldName) &&
                                                            <TextField
                                                                id="fields"
                                                                select
                                                                defaultValue={option.fieldName === 'id' && option.isRequired ? 'Integer Field' : payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0]?.fieldType}
                                                                disabled={option.fieldName === 'id' || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 || autoKey === option.fieldName || (option.fieldName === 'id' && !option.isRequired)}
                                                                onChange={(event) => { handleFieldSelection(event, option.fieldName) }}
                                                                fullWidth={true}
                                                            >
                                                                {/* 10>9?10>8?1:2 */}
                                                              {FEILD_TYPE.filter(item => item.id === option.javaDataType).length > 0 ?
                                                                FEILD_TYPE.filter(item => item.id === option.dataType).length > 0 ?
                                                                FEILD_TYPE.filter(item => item.id === option.dataType).map((_option, index) => (
                                                                    <option key={index} value={_option.value}>
                                                                            {_option.value}
                                                                        </option>
                                                                ))
                                                                :
                                                                FEILD_TYPE.filter(item => item.id === option.javaDataType && option.parentTableName !== null).length > 0 ?
                                                                    FEILD_TYPE.filter(item => item.id === "parentTableName").map((_option, index) => (
                                                                        <option key={index} value={"Drop Down"}>
                                                                            Drop Down
                                                                        </option>
                                                                    ))
                                                                    :
                                                                    FEILD_TYPE.filter(item => item.id === option.javaDataType).map((_option, index) => (
                                                                        <option key={index} value={_option.value}>
                                                                            {_option.value}
                                                                        </option>
                                                                    ))
                                                                    
                                                                    : FEILD_TYPE.filter(item => item.id === '').map((_option, index) => (
                                                                        <option key={index} value={_option.value}>
                                                                            {_option.value}
                                                                        </option>
                                                                    ))}
                                                            </TextField>}
                                                    </TableCell>

                                                    <TableCell >
                                                        {checked?.includes(option.fieldName) ?
                                                            defaultEditable === option.fieldName ?
                                                                <ControlProps
                                                                    openFrom='Default'
                                                                    updatePayload={handleUpdatePayload}
                                                                    data={payload.filter((item) => item.mapObject?.fieldName === option.fieldName)}
                                                                    handleCancel={handleDefaultChange}
                                                                />
                                                                :
                                                                <IconButton style={{ marginLeft: '28%' }}
                                                                    disabled={(option.fieldName === 'id') || option.parentTableName !== null || (payload.filter((item) => item.mapObject?.fieldName === option.fieldName).length > 0 &&
                                                                        !Boolean(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].fieldType)) ||
                                                                        Boolean(limitEditable) || Boolean(editable) || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 || autoKey === option.fieldName}
                                                                    edge="end" aria-label="default"
                                                                    onClick={() => handleDefaultChange(option.fieldName)}>
                                                                    <SettingsIcon style={{ color: defaultError.indexOf(option.fieldName) !== -1 ? '#f44336' : Boolean(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0]?.defaultVal) ? '#4ADAB3' : '' }} />
                                                                </IconButton>
                                                            :
                                                            null}
                                                    </TableCell>

                                                    <TableCell>
                                                        {checked?.includes(option.fieldName) ?
                                                            limitEditable === option.fieldName ?
                                                                <ControlProps
                                                                    openFrom='Limit'
                                                                    updatePayload={handleUpdatePayload}
                                                                    data={payload.filter((item) => item.mapObject?.fieldName === option.fieldName)}
                                                                    option={option}
                                                                    handleCancel={handleLimitChange}
                                                                />
                                                                :
                                                                <IconButton style={{ marginLeft: '28%' }}
                                                                    disabled={(option.fieldName === 'id') || (payload.filter((item) => item.mapObject?.fieldName === option.fieldName).length > 0 &&
                                                                        !(LIMIT_TYPE.indexOf(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].fieldType) !== -1)) ||
                                                                        Boolean(defaultEditable) || Boolean(editable) || featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 || autoKey === option.fieldName}
                                                                    edge="end" aria-label="limit"
                                                                    onClick={() => handleLimitChange(option.fieldName)}>
                                                                    <SettingsIcon
                                                                        style={{
                                                                            color: Boolean(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0]) &&
                                                                                payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].limit &&
                                                                                Object.values(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].limit).length > 0 &&
                                                                                Object.values(payload.filter((item) => item.mapObject?.fieldName === option.fieldName)[0].limit).some(item => Boolean(item)) ? '#4ADAB3' : ''
                                                                        }}
                                                                    />
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        Cancel
          </MatButton>
                    {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 &&
                        <MatButton type="submit" disabled={isSubmited || !selectionChanged || defaultError.length > 0 || !Boolean(primaryKey) || isEmpty}>
                            Update Table
          </MatButton>}
                </DialogActions>
            </form>
        </Dialog >
    );
});

export default AddMasterTableNew