import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import PropertyMapping from "./PropertyMapping";
import SystemMapping from "./SystemMapping";

import { AddOobControlConfigMapping } from "../../actions/OobControlActions";

// import { addMasterControl } from "../../actions/ControlActions";

// import { defaultControlData } from "../../utils/defaultControlData";
// import { fetchMasterControl } from "../../actions/ControlActions";
// import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX, RESET_ADD_CONTROL_ERROR } from "../../utils/AppConstants";
import {
  ADD_NEW_MAPPING,
  COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  PROPS_VAL_MAP,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 8px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
}));

const AddMapping = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleClose, open } = props;
  const { oobSubmoduleId, versionId, oobControlId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearError,
    setError,
    errors,
  } = useForm({ mode: "onBlur" });
  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const OobControlData = useSelector(
    (state) => state.OobControl.individual.details
  );
  const systemList = useSelector(
    (state) => state.MasterTable.tableDetailsList.list
  );
  const codeList = useSelector(
    (state) => state.MasterSysVariable.tableDetailsList.list
  );
  const fieldDetails = OobControlData.controlData;
  const fieldList = OobControlData.control.format.filter(
    (field) => field.fieldType !== "option"
  );
  const systemTableList = systemList.filter(
    (table) => table.module === OOBModuleById.module.moduleName
  );
  const filterCodeList = codeList.filter(
    (table) => table.modules === OOBModuleById.module.moduleName
  );
  const [descriptionList, setDescriptionList] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const defaultFormData = {
    property: "",
    table: "",
    column: "",
    description: "",
  };
  const [inputs, setInputs] = useState(defaultFormData);

  const [valueMapingInputs, setValueMapingInputs] = useState({});
  const [systemMapingInputs, setSystemMapingInputs] = useState({});

  const { property, table, column, description } = inputs;

  const handleAddMapping = () => {
    console.log("valueMapingInputs: ", valueMapingInputs);
    // const fieldData = JSON.parse(JSON.stringify(fieldDetails));
    // if (!fieldData.configMapping) {
    //   fieldData.configMapping = {};
    // }
    // let propertyLabel = fieldList.filter(
    //   (field) => field.internalName === property
    // )[0];
    // fieldData.configMapping[property] = {
    //   fieldProperty:
    //     property === "controlType" ? "Field Type" : propertyLabel.fieldLabel,
    //   propertyKey: property,
    //   systemTable: table,
    //   valueMapWithColumn: column,
    //   systemVariableDiscription: description,
    //   valueMapping: valueMapingInputs,
    //   systemConfigMap: {},
    // };
    // let formData = {
    //   id: OobControlData.id,
    //   oobSubmoduleId: oobSubmoduleId,
    //   masterControlId: OobControlData.control.id,
    //   controlData: fieldData,
    // };
    // //console.log("PROPERTY LABEL",propertyLabel);
    // dispatch(
    //   AddOobControlConfigMapping(
    //     formData,
    //     fieldData.configMapping[property].fieldProperty
    //   )
    // );
  };

  let handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "table") {
      setColumnList(
        systemTableList[0].columns &&
          systemTableList[0].columns.filter((primary) => !primary.isPrimary)
      );
      setDescriptionList(filterCodeList.filter((list) => list.table === value));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    if (name === "property") {
      let selectedField = fieldList.filter(
        (field) => field.internalName === property
      );
      if (selectedField.length > 0 && selectedField[0].fieldType === "select") {
        let internalValue = selectedField[0].options.reduce(
          (initObj, option) => {
            initObj[option.label] = "";
            return initObj;
          },
          {}
        );
        setValueMapingInputs(internalValue);
      } else {
        let valueObj = {};
        let controlObj = OobControlData.controlData[value];
        valueObj[controlObj] = "";
        setValueMapingInputs(valueObj);
      }
    }
    // if (name === 'columnName' && editable === false)
    //   setInputs((inputs) => ({ ...inputs, [name]: value }));
    // if (name !== 'columnName')
    //   setInputs((inputs) => ({ ...inputs, [name]: value }));
    // //dispatch(resetDuplicateError());
    // setApiError(false);
    //setSelectionChanged(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle className={styles.dialogTitle}>
        {ADD_NEW_MAPPING}
      </DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddMapping)}
          id="addControl"
        >
          {/* {apiError ? (
                        <Grid item xs={12} className={styles.col}>
                            <Card className={styles.errorCard}>
                                <Typography variant="body2">
                                    {COMMON_ERROR_MESSAGE}
                                </Typography>
                            </Card>
                        </Grid>
                    ) : null} */}
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <Typography variant="subtitle2" gutterBottom>
                Field Property Mapping
              </Typography>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                error={errors.property ? true : false}
                helperText={errors.property ? errors.property.message : " "}
                required
                name="property"
                label="Field Property"
                onChange={handleChange}
                select
              >
                <MenuItem
                  value="controlType"
                  disabled={
                    fieldDetails &&
                    fieldDetails.configMapping &&
                    fieldDetails.configMapping["controlType"]
                  }
                >
                  Field Type
                </MenuItem>
                {fieldList.map((field) => (
                  <MenuItem
                    value={field.internalName}
                    disabled={
                      fieldDetails &&
                      fieldDetails.configMapping &&
                      fieldDetails.configMapping[field.internalName]
                    }
                  >
                    {field.fieldLabel}
                  </MenuItem>
                ))}
              </MaterialTextField>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                error={errors.table ? true : false}
                helperText={errors.table ? errors.table.message : " "}
                required
                name="table"
                label="System Table"
                onChange={handleChange}
                select
              >
                {systemTableList.map((table) => (
                  <MenuItem value={table.name}>{table.name}</MenuItem>
                ))}
              </MaterialTextField>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                error={errors.column ? true : false}
                helperText={errors.column ? errors.column.message : " "}
                required
                name="column"
                label={PROPS_VAL_MAP}
                onChange={handleChange}
                select
              >
                {columnList.map((table) => (
                  <MenuItem value={table}>
                    {table.mapLabel
                      ? table.mapLabel
                      : table.mapObject.fieldName}
                  </MenuItem>
                ))}
              </MaterialTextField>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                error={errors.description ? true : false}
                helperText={
                  errors.description ? errors.description.message : " "
                }
                required
                name="description"
                label="System Variable Description"
                onChange={handleChange}
                select
              >
                {/* <MenuItem value="a">A</MenuItem>
                                <MenuItem value="b">B</MenuItem>
                                <MenuItem value="c">C</MenuItem> */}
                {descriptionList.map((table) => (
                  <MenuItem value={table}>{table.shortDescription}</MenuItem>
                ))}
              </MaterialTextField>
            </Grid>
            {property !== "" && (
              <PropertyMapping
                data={OobControlData}
                selectedData={property}
                selectedColumn={column}
                valueMapingInputs={valueMapingInputs}
                setValueMapingInputs={setValueMapingInputs}
              />
            )}
            {table !== "" && (
              <SystemMapping
                columnList={systemTableList[0].columns}
                selectedDescription={description}
              />
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleClose}>
          Cancel
        </MatButton>
        <MatButton type="submit" form="addControl">
          Add Mapping
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddMapping;
