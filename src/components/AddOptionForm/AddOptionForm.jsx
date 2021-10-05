import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";

import { RESET_ADD_MASTER_CONTROL_FIELD_ERROR } from "../../utils/AppConstants";

import {
  addControlField,
  fetchMasterControlById,
} from "../../actions/ControlActions";

import { generateInternalName } from "../../utils/helpers";
import { ADD_NEW_OPT, CANCEL, handleAddOptionFormError, ENTER_VALID_PROP, MAXIMUN_CHARACTER_ALLOWED_MSG, PROP_NAME, PROP_NAME_EXIST, PROP_NAME_MANDATORY, REQUIRED } from "../../utils/Messages";

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
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
}));

const AddOptionForm = (props) => {
  const { controlId } = useParams();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleCloseForm, formType } = props;
  const {
    register,
    handleSubmit,
    watch,
    errors,
    clearError,
    setError,
  } = useForm({ mode: "onBlur" });
  const controlFieldData = useSelector((state) => state.Control.data);
  const addFieldError = useSelector(
    (state) => state.Control.data.fieldAddError
  );
  const [apiError, setApiError] = useState(null);
  const [isDisabled] = useState(false);
  const activeControl = useSelector(
    (state) => state.Control.individual.details
  );
  const defaultFormObj = {
    fieldLabel: "",
    // fieldName: "",
    fieldType: formType,
    isRequired: "No",
    valueSetBy: "BOTH",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const { isRequired, valueSetBy } = inputs;

  let handleChange = (e) => {
    clearError("fieldLabel");
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_ERROR });
    const { name, value } = e.target;
    if (name === "isRequired" || name === "valueSetBy") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleAddField = () => {
    let formControl = JSON.parse(JSON.stringify(activeControl));
    let isDuplicate = formControl.format.some(
      (control) =>
        control.fieldLabel.toLowerCase().trim() ===
        inputs.fieldLabel.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError("fieldLabel", "notMatch", PROP_NAME_EXIST);
    } else {
      let formData = {
        fieldLabel: inputs.fieldLabel,
        internalName: generateInternalName(inputs.fieldLabel),
        fieldType: inputs.fieldType,
        isFieldRequired: inputs.isRequired,
        valueSetBy: inputs.valueSetBy,
      };
      formControl.format.push(formData);
      dispatch(addControlField(formControl));
    }
  };

  useEffect(() => {
    if (controlFieldData.isFieldAdded) {
      dispatch(fetchMasterControlById(controlId));
      handleCloseForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, controlFieldData.isFieldAdded, controlId]);

  useEffect(() => {
    if (
      addFieldError && !(addFieldError.responseCode === "201")
    ) {
      setApiError(handleAddOptionFormError(addFieldError, activeControl));
    }
    else
      setApiError(false);

    // if (
    //   addFieldError &&
    //   addFieldError.responseCode &&
    //   addFieldError.responseCode === "2054"
    // ) {
    //   setApiError(
    //     `${
    //       activeControl && activeControl.name
    //     } control associated with OOB. Now you cannot add a new property to this control.`
    //   );
    //   setIsDisabled(true);
    // }
  }, [activeControl,addFieldError]);

  return (
    <>
      <DialogTitle className={styles.dialogTitle}>
        {ADD_NEW_OPT}
      </DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddField)}
          id="addField"
        >
          <Grid container className={styles.row}>
            {apiError ? (
              <Grid item xs={12} className={styles.col}>
                <Card
                  className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}
                >
                  <Typography variant="body2">
                    {apiError.message}
                  </Typography>
                </Card>
              </Grid>
            ) : null}
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: PROP_NAME_MANDATORY,
                  },
                  pattern: {
                    value: /^[a-zA-Z-_\s]*$/,
                    message: ENTER_VALID_PROP,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.fieldLabel ? true : false}
                helperText={errors.fieldLabel ? errors.fieldLabel.message : " "}
                disabled={isDisabled}
                required
                name="fieldLabel"
                label={PROP_NAME}
                onChange={handleChange}
              />
            </Grid>

            {/* <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: "Internal name is mandatory.",
                  },
                })}
                error={errors.fieldName ? true : false}
                helperText={errors.fieldName ? errors.fieldName.message : " "}
                required
                name="fieldName"
                label={"Internal Name"}
                onChange={handleChange}
              />
            </Grid> */}

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                })}
                helperText=" "
                select
                disabled={isDisabled}
                defaultValue={isRequired}
                label={REQUIRED}
                onChange={handleChange}
                name="isRequired"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                })}
                helperText=" "
                select
                disabled={isDisabled}
                defaultValue={valueSetBy}
                label="Value Fill By"
                onChange={handleChange}
                name="valueSetBy"
              >
                <MenuItem value="MHK">MHK</MenuItem>
                <MenuItem value="CLIENT">CLIENT</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
              </MaterialTextField>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton type="button" color="primary" onClick={handleCloseForm}>
          {CANCEL}
        </MatButton>
        <MatButton type="submit" form="addField" disabled={isDisabled}>
          Create Option List
        </MatButton>
      </DialogActions>
    </>
  );
};

export default AddOptionForm;
