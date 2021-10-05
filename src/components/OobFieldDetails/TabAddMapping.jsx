import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import MaterialTextField from '../MaterialUi/MatTextField';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MatButton from "../MaterialUi/MatButton";
import { makeStyles, Divider } from '@material-ui/core';
//import { fetchMasterMessage } from "../../actions/MasterMessageActions";
import { fetchMasterMessageByModuleId } from "../../actions/MasterMessageActions";
import { fetchMasterSystemByModuleId } from "../../actions/MasterSystemActions";
//import { fetchMasterSystem } from "../../actions/MasterSystemActions";
import PropertyValueMapping from "./PropertyValueMapping";
import {
  MSG_SYS_VAR_ALREADY_AVAILABLE,
  PLEASE_ACKN
} from "../../utils/Messages";



const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
    },
    grow: {
        flexGrow: 1
    },
    cardHeadingSize: {
        fontSize: "18px",
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
}));


function TabAddMapping(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { moduleId } = useParams();
    // fieldValue
    const { handleAddMapping, configDetails, open, handleClose, setSelectionChanged  } = props;
    const { register, handleSubmit, setValue, clearError, setError, unregister, errors } = useForm();

    const selectedFieldProperty = useSelector(
        (state) => state.MasterComponent.data.selectedFieldProperty
    );
    const selectedFieldMapping = useSelector(
        (state) => state.MasterComponent.data.selectedFieldMapping
    );
    const selectedOptionId = useSelector(
        (state) => state.MasterComponent.data.selectedOptionId
    );
    // const MasterData = useSelector(
    //     (state) => state.MasterComponent.data
    // );
    let systemDetailsList = useSelector((state) => state.MasterSysVariable.systemByModule);
    const messageDetailsList = useSelector((state) => state.MasterMessage.messageByModule);
    const [descriptionList2, setDescriptionList] = useState([]);
    const [propertyList, setPropertyList] = useState(selectedFieldMapping.property);
    // const configDetails = selectedData.config;

let otherExistingVar = configDetails.Other.map(a => a.mapping.description.description);
let existingSysVariable = [...new Set(
  [
  configDetails.Disabled.mapping.description.description,
  configDetails.Mandatory.mapping.description.description,
  configDetails.Hidden.mapping.description.description, ...otherExistingVar]
  )].filter(function( element ) {
    return element !== undefined;
 });
 let descriptionList = []
 if(existingSysVariable.length > 0) {
    descriptionList = descriptionList2.filter(a => existingSysVariable.indexOf(a.description) === -1 )
  }
  else {
    descriptionList = [...descriptionList2]
  }

  


    const [inputs, setInputs] = useState({
        method: selectedFieldMapping?.method,
        description: selectedFieldMapping?.description,
        oob: selectedFieldMapping?.oob,
        functionLabel: selectedFieldMapping?.functionLabel
    });
    const { method, description, oob, functionLabel } = inputs;

    let handleChange = (e) => {
        const { name, checked } = e.target;
        clearError(name);
        if (name === 'oob')
            setInputs(inputs => ({ ...inputs, [name]: checked }));
    }

    let handleUpdateProperty = (data) => {
        setPropertyList(data);
    }

    let handleUpdateFunctionLabel = () => {
        setInputs(inputs => ({ ...inputs, functionLabel: !functionLabel }));
    }

    const handleDescriptionChange = (event, value) => {
      if(value?.used) {
      let messageObj = {
        primaryButtonLabel: "OK",
        primaryButtonAction: () => {
          if(value){
            if (Object.keys(value).length > 0)
                clearError('description');
            if (selectedFieldProperty && selectedFieldProperty === 'Other') {
                let filterMap = JSON.parse(value?.propertyValue).filter((item) => item.label === 'Other');
                let list = [];
                if (filterMap.length > 0) {
                    filterMap.map((item, index) => {
                        let obj = {};
                        obj.value = 'Other' + (index + 1);
                        obj.function = '';
                        obj.oob = false;
                        return list.push(obj)
                    })
                }
                setPropertyList(list);
            }
          }
            setInputs((inputs) => ({ ...inputs, description: value }));
        },
        title: PLEASE_ACKN,
        message: MSG_SYS_VAR_ALREADY_AVAILABLE,
      };
      dispatch(showMessageDialog(messageObj));
    }
    else {
      if(value){
        if (Object.keys(value).length > 0)
            clearError('description');
        if (selectedFieldProperty && selectedFieldProperty === 'Other') {
            let filterMap = JSON.parse(value?.propertyValue).filter((item) => item.label === 'Other');
            let list = [];
            if (filterMap.length > 0) {
                filterMap.map((item, index) => {
                    let obj = {};
                    obj.value = 'Other' + (index + 1);
                    obj.function = '';
                    obj.oob = false;
                    return list.push(obj)
                })
            }
            setPropertyList(list);
        }
      }
        setInputs((inputs) => ({ ...inputs, description: value }));
    }
  }

    const assignMapping = () => {
        if(description){
        if (Object.keys(description).length > 0)
            clearError('description');
        else
            setError('description', 'notMatch', 'System variable is mandatory.')
        if (Object.keys(description).length > 0) {
            selectedFieldMapping.description = description;
            if (selectedFieldProperty !== 'Other')
                selectedFieldMapping.oob = oob;
            selectedFieldMapping.property = propertyList;
            selectedFieldMapping.functionLabel = functionLabel;
            if (selectedFieldProperty === 'Other') {
                //let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
                configDetails.Other[selectedOptionId].value = description.description;
            }
            console.log("configDetails in tabAdd", configDetails);
            setSelectionChanged(true);
            handleAddMapping();
        }
      }
    }

    useEffect(() => {
        if (method === "Message Constant") {
            dispatch(fetchMasterMessageByModuleId([moduleId]));
            //dispatch(fetchMasterMessage());
        } else {
            //dispatch(fetchMasterSystem());
            dispatch(fetchMasterSystemByModuleId([moduleId]));
        }
    }, [dispatch, method, moduleId]);

    useEffect(() => {
        if (method === "Message Constant") {
            setDescriptionList(messageDetailsList);
        } else {
            let filterMap = [];
            let selectedList = [];
            if (systemDetailsList.length > 0) {
                systemDetailsList.forEach(item => {
                    if (selectedFieldProperty && selectedFieldProperty !== 'Other') {
                        filterMap = JSON.parse(item.propertyValue).filter((item) => item.label !== 'Other');
                        if (filterMap.length > 0)
                            selectedList.push(item);
                    }
                    if (selectedFieldProperty && selectedFieldProperty === 'Other') {
                        filterMap = JSON.parse(item.propertyValue).filter((item) => item.label === 'Other');
                        if (filterMap.length > 0)
                            selectedList.push(item);
                    }
                })
            }
            setDescriptionList(selectedList);
        }
    }, [method, systemDetailsList, messageDetailsList, selectedFieldProperty]);

    useEffect(() => {
        if (selectedFieldProperty && selectedFieldProperty !== 'Other' && propertyList.length === 0) {
            setPropertyList([{ value: 'Yes', function: '' }, { value: 'No', function: '' }])
        }
    }, [selectedFieldProperty, propertyList]);

    const filterOptions = createFilterOptions({
      stringify: option => option?.description + option?.messageConstant + option?.code,
    });
    
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle className={styles.dialogTitle} id="scroll-dialog-title">
          {/* {fieldValue} */} Add New Mapping
        </DialogTitle>
        <Divider />

        <DialogContent dividers="true">
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(assignMapping)}
            id="addMappingInfo"
          >
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Field Property Mapping
            </Typography>
            <Grid container className={styles.row}>
              <Grid item xs={4} className={styles.col}>
                <MaterialTextField
                  defaultValue={selectedFieldProperty}
                  disabled
                  label="Field Property"
                  name="fieldProperty"
                />
              </Grid>
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Configuration Mapping
            </Typography>
            <Grid container className={styles.row}>
              <Grid item xs={4} className={styles.col}>
                <MaterialTextField
                  defaultValue={method}
                  disabled
                  label="Configuration Method"
                  name="configurationMethod"
                />
              </Grid>
              <Grid item xs={4} className={styles.col}>
                <Autocomplete
                  options={descriptionList}
                  onChange={(event, value) =>
                    handleDescriptionChange(event, value)
                  }
                  name="description"
                  filterOptions={filterOptions}
                  getOptionLabel={(option) => option.description}
                  defaultValue={description}
                  renderInput={(params) => (
                    <MaterialTextField
                      {...params}
                      inputRef={register}
                      error={errors.description ? true : false}
                      helperText={
                        errors.description ? errors.description.message : " "
                      }
                      required
                      label={method}
                    />
                  )}
                />
              </Grid>
              {selectedFieldProperty !== "Other" && (
                <Grid item xs={4} className={styles.col}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={oob}
                        onChange={handleChange}
                        name="oob"
                      />
                    }
                    label="Turn 'on' as Out-of-the-Box"
                  />
                </Grid>
              )}
              {description &&
                Object.keys(description).length > 0 &&
                method !== "Message Constant" && (
                  <PropertyValueMapping
                    errors={errors}
                    register={register}
                    setValue={setValue}
                    clearError={clearError}
                    unregister={unregister}
                    selectedSystem={description}
                    propertyList={propertyList}
                    functionLabel={functionLabel}
                    handleUpdateProperty={handleUpdateProperty}
                    handleUpdateFunctionLabel={handleUpdateFunctionLabel}
                  />
                )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" className={styles.cancelBtn} onClick={handleAddMapping} >
            Cancel
          </MatButton>
          <MatButton
            type="submit"
            //disabled={disabled}
            form="addMappingInfo"
            onClick={handleSubmit}
          >
            Add Mapping
          </MatButton>
        </DialogActions>
      </Dialog>
    );
}

export default TabAddMapping;