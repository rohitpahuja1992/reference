import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
// import MatFormControl from "../MaterialUi/MatFormControl";
// import InputLabel from '@material-ui/core/InputLabel';
// import MatSelect from '../MaterialUi/MatSelect';
import MaterialTextField from "../MaterialUi/MatTextField";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import { resetError } from "../../actions/OOBSubmoduleActions";
// import { addOobComponent } from "../../actions/OobComponentActions";
// import {
//   handleManageSubmoduleError,
//   CONTROL_ASSIGNMENT_MANDATORY,
//   SUB_ASSIGNMENT_MANDATORY,
// } from "../../utils/Messages";
//import MaterialTextField from "../MaterialUi/MatTextField";
import { updateOobComponent } from "../../actions/OobComponentActions";
import {
  SET_DEFAULT_STARTINDEX,
  RESET_UPDATE_OOB_COMPONENT_IS_DONE,
  // DEFAULT_START_INDEX,
  // DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
    marginTop: "-3%",
    marginLeft: "45%",
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
    marginBottom: "14px",
  },
}));

const UpdateOobField = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleClose, open } = props;
  const { register, handleSubmit, clearError, errors, formState } = useForm({
    mode: "onBlur",
  });
  let { dirty } = formState;
  // const [isDisabled, setIsDisabled] = useState(true);
  // const {
  //   moduleId,
  //   submoduleId,
  //   versionId,
  //   oobSubmoduleId,
  //   oobModuleId,
  // } = useParams();

  const componentData = useSelector(
    (state) => state.OobComponent.data
  );

  // const isComponentUpdated = useSelector(
  //   (state) => state.OobComponent.data.isComponentUpdated
  // );

  const [isEditable, setIsEditable] = useState(false);
  const [apiError, setApiError] = useState(null);

  // const [inputs, setInputs] = useState({})
  const oobDataDetailsById = useSelector(
    (state) => state.OobComponent.individual.details
    
  );
  const defaultFormData = JSON.parse(oobDataDetailsById.mapField, oobDataDetailsById.fieldId );
  
  const [inputs, setInputs] = useState(defaultFormData);
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const handleCloseForm = useCallback(() => {
    dispatch({ type: RESET_UPDATE_OOB_COMPONENT_IS_DONE }); 
    dispatch(resetError());
    setApiError(false);
    setSelectionChanged(false);
    clearError();
    handleClose();
  }, [dispatch, clearError, handleClose]);

  const handleResetForm = () => {
    // reset(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);   
    setApiError(false);
  };

  let handleChange = (e) => {
    setSelectionChanged(true);
    const { name, value } = e.target;
    console.log("name,value", name, value);
    dispatch(resetError());
    setApiError(false);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  let handleCheckChange = (e) => {
    setSelectionChanged(true);
    const { name, checked } = e.target;
    console.log("name,value", name, checked);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  let handleRadioChange = (e) => {
    setSelectionChanged(true);
    const { name, checked, value } = e.target;
    console.log("name,value", name, checked, value);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  const handleEdit = () => {
    setIsEditable(true);
  };
  
  const handleUpdateOobField = () => {
    setSelectionChanged(false);
    let formData = { ...inputs };
    dispatch(updateOobComponent(oobDataDetailsById.fieldId, formData));
  };

  // useEffect(() => {
  //   props.colData.forEach((index, key) => {
  //     setInputs((inputs) => ({
  //       ...inputs,
  //       [index?.mapLable ? index.mapLable : index.label]: index.defaultVal,
  //     }));
  //   });
  // }, [props.colData]);

  useEffect(() => {    
    if (componentData.isComponentUpdated) {     
      handleCloseForm();
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch({ type: RESET_UPDATE_OOB_COMPONENT_IS_DONE });      
    }
  }, [dispatch,handleCloseForm, componentData.isComponentUpdated]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>Update Field</DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateOobField)}
        id="updateOOBSubmodule"
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card
                className={
                  apiError.messageType === "error"
                    ? styles.errorCard
                    : styles.warningCard
                }
              >
                <Typography variant="body2">{apiError.message}</Typography>
              </Card>
            </Grid>
          ) : null}
          {console.log(inputs)}
          <Grid container className={styles.row}>
            {props.colData.map((index, key) => (
              <>
                {index.fieldType === "Integer Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      inputRef={register({
                        // required: {
                        //   value: true,
                        //   message: SESSION_TIMEOUT_MANDATORY,
                        // },
                        min: {
                          value: Number(index.limit.min),
                          message: `The value must be at least ${index.limit.min}.`,
                        },
                        max: {
                          value: Number(index.limit?.max),
                          message: `The value can't be more than ${index.limit.max}.`,
                        },
                      })}
                      type="number"
                      //value={inputs[index.label]}
                      defaultValue={inputs[index.label?index.label:index.mapLable]}
                      error={errors[index.label?index.label:index.mapLable] ? true : false}
                      helperText={
                        errors[index.label?index.label:index.mapLable] ? errors[index.label].message : " "
                      }
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={!isEditable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Text Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      inputRef={register({
                        min: {
                          value: Number(index.limit.min),
                          message: `Minimum ${index.limit.min} characters allowed.`,
                        },
                        max: {
                          value: Number(index.limit?.max),
                          message: `Maximum ${index.limit.max} characters allowed.`,
                        },
                      })}
                      defaultValue={inputs[index.label?index.label:index.mapLable]}
                      error={errors[index.label?index.label:index.mapLable] ? true : false}
                      helperText={
                        errors[index.label?index.label:index.mapLable] ? errors[index.label?index.label:index.mapLable].message : " "
                      }
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={!isEditable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {(index.fieldType === "Search Field" ||
                  index.fieldType === "System Generated") && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      defaultValue={inputs[index?.mapLable ? index.mapLable : index.label]}
                      // error={errors.sessionTime ? true : false}
                      // helperText={
                      //   errors.sessionTime ? errors.sessionTime.message : " "
                      // }
                      //required
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={!isEditable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Check Box" && (
                  <Grid item xs={4} className={styles.col}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleCheckChange}
                          name={index?.mapLable ? index.mapLable : index.label}
                          //checked ={defaultFormData[index.label]}
                          disabled={!isEditable}
                          checked={Boolean(
                            inputs[
                              index?.mapLable ? index.mapLable : index.label
                            ]
                          )}
                        />
                      }
                      label={index?.mapLable ? index.mapLable : index.label}
                    />
                  </Grid>
                )}
                {index.fieldType === "Radio Button" && (
                  <Grid item xs={4} className={styles.col}>
                    <FormControlLabel
                      value={
                        inputs[index?.mapLable ? index.mapLable : index.label]
                      }
                      // {inputs.hasOwnProperty(index?.mapLable ? index.mapLable : index.label)?Boolean(index.defaultVal):inputs[index?.mapLable ? index.mapLable : index.label]}
                      control={
                        <Radio
                          name={index?.mapLable ? index.mapLable : index.label}
                          onChange={handleRadioChange}
                          //checked ={defaultFormData[index.label]}
                          disabled={!isEditable}
                          checked={Boolean(
                            inputs[
                              index?.mapLable ? index.mapLable : index.label
                            ]
                          )}
                        />
                      }
                      // checked={inputs[index?.mapLable ? index.mapLable : index.label] === Boolean(index.defaultVal)}                      />}
                      label={index?.mapLable ? index.mapLable : index.label}
                    />
                  </Grid>
                )}
                {index.fieldType === "Drop Down" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      error={errors[index?.mapLable ? index.mapLable : index.label] ? true : false}
                      helperText={
                        errors[index.label] ? errors[index.label].message : " "
                      }
                      // required={
                      //   field.isFieldRequired === "Yes" &&
                      //   field.valueSetBy !== "CLIENT"
                      // }
                      select
                      disabled={!isEditable}
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      value={
                        inputs[index?.mapLable ? index.mapLable : index.label] ||
                        console.log("the value", inputs[index.label])
                      }
                      onChange={handleChange}
                    >
                      {
                        index.label && (
                          //index.label.map((option,index) => (
                          <MenuItem
                            key={key}
                            name={index.defaultVal}
                            value={inputs[index.label]}
                          >
                            {inputs[index.label]}
                          </MenuItem>
                        )
                        //))
                      }
                    </MaterialTextField>
                  </Grid>
                )}
                {index.fieldType === "Calendar Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      type="date"
                      defaultValue={defaultFormData[index.label]}
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={!isEditable}
                      inputRef={register({
                        required: {
                          value: index.limit.min? true:false,
                          message: "Calendar value is required.",
                        },
                        min: {
                          value: index.limit.min,
                          message: `Date should not less than ${index.limit.min}.`,
                        },
                        max: {
                          value: index.limit.max,
                          message: `Date should not greater than ${index.limit.max}.`,
                        },
                      })}
                      error={errors[index?.mapLable ? index.mapLable : index.label] ? true : false}
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label] ? errors[index?.mapLable ? index.mapLable : index.label].message : " "
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
              </>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
        {!isEditable && (
          <>
            <MatButton color="primary" onClick={handleCloseForm}>
              Cancel
            </MatButton>
            {/* {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 && (
                <MatButton onClick={handleEdit}>Edit Tag</MatButton>
              )} */}
            <MatButton onClick={handleEdit}>Edit Field</MatButton>
          </>
        )}
        {isEditable && (
          <>
            <MatButton color="primary" onClick={handleResetForm}>
              Cancel
            </MatButton>
            <MatButton type="submit" disabled={!dirty && !isSelectionChanged}>
              Save Changes
            </MatButton>
          </>
        )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateOobField;
