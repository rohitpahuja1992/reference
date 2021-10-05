import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles, FormHelperText } from "@material-ui/core";
//import Chip from "@material-ui/core/Chip";
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
//import Radio from '@material-ui/core/Radio';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Tooltip from "../../components/MaterialUi/MatTooltip";
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CommentIcon from '@material-ui/icons/Comment';
import {
  updateMasterTable,
  fetchColumnList,
  //resetDuplicateError,
} from "../../actions/MasterTableActions";
import { RESET_UPDATE_ERROR } from "../../utils/AppConstants";
import { MODULE_ASSI_MAND, handleUpdateMasterTableError } from "../../utils/Messages";
import { UPDATE_TABLE, COMMON_ERROR_MESSAGE, ENTER_VALID_TABLE, MAXIMUN_CHARACTER_ALLOWED_MSG, MASTERTABLE_NAME_MANDATORY } from "../../utils/Messages";
//import { NAME_PATTERN } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  table: {
    maxHeight: "250px",
  },
  switchList: {
    padding: "4px",
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

// const colName = [
//   { id: "1", label: "ID", subText: "" },
//   { id: "2", label: "CODE", subText: "" },
//   { id: "3", label: "DESCRIPTION", subText: "" },
//   { id: "4", label: "Str_Value", subText: "" },
// ];

const AddMasterTable = (props) => {
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
  const [selectionChanged, setSelectionChanged] = useState(false);
  const [editable, setEditable] = useState(false);
  const tableDetailsListById = useSelector((state) => state.MasterTable.tableDetailsById.data);

  const defaultFormData = {
    tableName: tableDetailsListById.tableName,
    moduleName: tableDetailsListById.module && tableDetailsListById.module.id,
    subText: ""
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const [checkedSwitch, setCheckedSwitch] = useState(tableDetailsListById.frequentlyUsed);
  const mapField = JSON.parse(tableDetailsListById.mapField);

  const {
    tableName,
    moduleName,
    subText
  } = inputs;
  const isTableUpdated = useSelector(
    (state) => state.MasterTable.isTableUpdated
  );
  const putApiError = useSelector((state) => state.MasterTable.putError);
  const [apiError, setApiError] = useState(null);

  //const defaultSelectedCol = ["ID", "DESCRIPTION", "CODE", "str_value", "INT_VALUE", "LONG_VALUE", "list_value_id", "client"];
  const colName = useSelector((state) =>
    state.MasterTable.columnList
  );
  const [checked, setChecked] = useState(mapField && Object.keys(mapField).length !== 0 ? mapField.map(obj => obj.mapObject.fieldName) : []);
  const [primaryValue, setPrimaryValue] = useState(mapField && Object.keys(mapField).length !== 0 ? mapField.filter(obj => obj.mapReference).map(item => item.mapObject.fieldName) : []);
  const [payload, setPayload] = useState(mapField && Object.keys(mapField).length !== 0 ? mapField : []);

  // React.useState(
  //   colName.reduce((prev, col) => {
  //     let result = defaultSelectedCol.indexOf(col.fieldName);
  //     if (result !== -1)
  //       prev.push(col.fieldname);
  //     return prev;
  //   }, [])
  // );
  // const [payload, setPayload] = React.useState(
  //   colName.reduce((prev, col) => {
  //     let result = defaultSelectedCol.indexOf(col.fieldName);
  //     if (result !== -1) {
  //       let Json = {
  //         mapObject: col,
  //         mapLabel: "",
  //         isPrimary: false,
  //       }
  //       prev.push(Json);
  //     }
  //     return prev;
  //   }, [])

  // );
  const moduleDetailsList = useSelector((state) =>
    state.MasterModule.moduleDetailsList.list?.filter(item => !item.deleted)?.sort((a, b) =>
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
    // if (name === 'columnName' && editable === false)
    //   setInputs((inputs) => ({ ...inputs, [name]: value }));
    // if (name !== 'columnName')
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    //dispatch(resetDuplicateError());
    setApiError(false);
    //setSelectionChanged(true);
  };

  // let handleSubtextChange = (e) => {
  //   e.stopPropagation();
  //   const { name, value } = e.target;
  //   console.log("NAME,VALUE SUBTEXT", name, value);
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  //   //dispatch(resetDuplicateError());
  //   setApiError(false);
  //   //setSelectionChanged(true);
  // };

  const handleCheckChange = (value) => {
    setSelectionChanged(true);
    dispatch({ type: RESET_UPDATE_ERROR });
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    const newPayload = [...payload];
    const newPrimary = [...primaryValue];
    const primaryIndex = newPrimary.indexOf(value);

    if (currentIndex === -1) {
      newChecked.push(value);
      let obj = colName.filter((e) => e.fieldName === value)[0];
      let Json = {
        mapLable: "",
        mapReference: false,
        mapObject: obj,
      }
      newPayload.push(Json);
    } else {
      var removeIndex = newPayload.map((item) => item.mapObject.fieldName).indexOf(value);
      newPayload.splice(removeIndex, 1);
      newPrimary.splice(primaryIndex, 1);
      newChecked.splice(currentIndex, 1);
    }
    setPayload(newPayload);
    setPrimaryValue(newPrimary);
    setChecked(newChecked);
  };

  const handlePrimaryChange = (value) => {
    setSelectionChanged(true);
    dispatch({ type: RESET_UPDATE_ERROR });
    const currentIndex = primaryValue.indexOf(value);
    const newPrimary = [...primaryValue];

    if (currentIndex === -1) {
      newPrimary.push(value);
      let newPayload = payload.map(item =>
        item.mapObject.fieldName === value
          ? { ...item, mapReference: true }
          : item
      );
      setPayload(newPayload);
    } else {
      var removeIndex = payload.map((item) => item.mapObject.fieldName).indexOf(value);
      newPrimary.splice(removeIndex, 1);
      let newPayload = payload.map(item =>
        item.mapObject.fieldName === value
          ? { ...item, mapReference: false }
          : item
      );
      setPayload(newPayload);
    }
    setPrimaryValue(newPrimary);
  };

  const handleSetSubText = (value) => {
    setSelectionChanged(true);
    dispatch({ type: RESET_UPDATE_ERROR });
    let newPayload = payload.map(item =>
      item.mapObject.fieldName === value
        ? { ...item, mapLable: subText }
        : item
    );
    setPayload(newPayload);
    setEditable(false);
  };

  // const handleSelectValue = (selected, list, type) => {
  //   return selected.map((id) => (
  //     <Chip
  //       key={id}
  //       label={list.filter((data) => data.fieldname === id)[0][type]}
  //       className={styles.chip}
  //     />
  //   ));
  // };

  // const handleRadioChange = (event) => {
  //   setRadioSelectedValue(event.target.value);
  //   let newPayload = payload.map(item =>
  //     String(item.mapObject.fieldname) === event.target.value
  //       ? { ...item, isPrimary: true }
  //       : { ...item, isPrimary: false }
  //   );
  //   setPayload(newPayload);
  // };

  const handleSetLabel = (value) => {
    setEditable(value);
  };

  const handleSwitchChange = () => {
    setSelectionChanged(true); 
    dispatch({ type: RESET_UPDATE_ERROR }); 
    setCheckedSwitch(!checkedSwitch)
  };

  const handleTitleMsg = (value) => {
    return payload.filter((item) => item.mapObject.fieldName === value).length > 0 &&
      payload.filter((item) => item.mapObject.fieldName === value)[0].mapLable === "" ? 'Set Label' : 'Edit Label';
    //setEditable(value);
  };

  useEffect(() => {
    if (moduleName !== "") {
      setValue("moduleName", moduleName);
      clearError("moduleName");
    } else {
      register(
        { name: "moduleName" },
        { required: { value: true, message: MODULE_ASSI_MAND } }
      );
    }
  }, [clearError, moduleName, register, setValue]);

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
    //const watchAllFields = watch();
    let payloadJson = {
      id: tableDetailsListById.id,
      moduleId: inputs.moduleName,
      tableName: inputs.tableName,
      frequentlyUsed: checkedSwitch,
      mapField: JSON.stringify(payload)
    }
    dispatch(updateMasterTable(payloadJson));
  };

  useEffect(() => {
    if (tableName !== '')
      dispatch(fetchColumnList(tableName))
  }, [dispatch, tableName]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
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
                onChange={handleChange}
                required
                name="tableName"
                label="Table Name"
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl
                required
                error={errors.moduleName ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>Module(s)</InputLabel>
                <MatSelect
                  name="moduleName"
                  defaultValue={moduleName}
                  onChange={handleChange}
                >
                  {moduleDetailsList.map((option, key) => (
                    <MenuItem key={option.fieldName} value={option.id}>
                      {option.moduleName}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>
                  {errors.moduleName ? errors.moduleName.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={12} className={styles.col} style={{ paddingTop: '0px', marginTop: '-8px' }}>
              <Paper variant="outlined">
                <List className={styles.switchList}>
                  <ListItem className={styles.listGutter} button onClick={handleSwitchChange}>
                    <ListItemIcon className={styles.switchItem}>
                      <Switch
                        edge="end"
                        checked={checkedSwitch}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant="subtitle2" style={{ wordBreak: "break-word" }}>
                        Frequently Used
                      </Typography>
                    } />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <Paper variant="outlined">
                <TableContainer className={styles.table}>
                  <Table aria-label="simple table" size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Primary</TableCell>
                        <TableCell>Checked</TableCell>
                        <TableCell>Column Name</TableCell>
                        <TableCell >Set Label</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {colName.map((option, key) => (
                        <TableRow key={option.fieldName}>
                          <TableCell>
                            <Checkbox
                              onChange={() => handlePrimaryChange(option.fieldName)}
                              disabled={!checked.includes(option.fieldName)}
                              checked={primaryValue.some((id) => id === option.fieldName)}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={() => handleCheckChange(option.fieldName)}
                              //disabled={defaultSelectedCol.includes(option.fieldName)}
                              checked={checked.some((id) => id === option.fieldName)}
                            />
                          </TableCell>
                          <TableCell>
                            {editable === option.fieldName ?
                              <TextField name="subText"
                                defaultValue={payload.filter((item) => item.mapObject.fieldName === option.fieldName)[0].mapLable}
                                onChange={handleChange} />
                              :
                              <>
                                <Typography>{option.columnName}</Typography>
                                {payload.filter((item) => item.mapObject.fieldName === option.fieldName).length > 0 &&
                                  payload.filter((item) => item.mapObject.fieldName === option.fieldName)[0].mapLable &&
                                  <Typography>{payload.filter((item) => item.mapObject.fieldName === option.fieldName)[0].mapLable}</Typography>}
                              </>}
                          </TableCell>
                          <TableCell >
                            {editable === option.fieldName ?
                              <>
                                <Tooltip placement="left" arrow title="Save">
                                  <IconButton edge="end" aria-label="save" onClick={() => handleSetSubText(option.fieldName)}>
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
                                <IconButton disabled={!(checked.some((id) => id === option.fieldName))} edge="end" aria-label="comments" onClick={() => handleSetLabel(option.fieldName)}>
                                  <CommentIcon />
                                </IconButton>
                              </Tooltip>}
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
          <MatButton type="submit" disabled={isSubmited || !selectionChanged}>
            Update Table
          </MatButton>
        </DialogActions>
      </form>
    </Dialog >
  );
};

export default AddMasterTable;
