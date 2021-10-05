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
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";

import {
  addControlField,
  fetchMasterControlById,
} from "../../actions/ControlActions";

import { RESET_ADD_MASTER_CONTROL_FIELD_ERROR } from "../../utils/AppConstants";

import { generateInternalName } from "../../utils/helpers";
import { ADD_NEW_SEC, CANCEL, handleAddSelectFormError, ENTER_VALID_PROP, MAXIMUN_CHARACTER_ALLOWED_MSG, NO_OPT_AVAILABLE, PROP_NAME, PROP_NAME_EXIST, PROP_NAME_MANDATORY, VALUE_ALREADY_EXIST } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 8px",
  },
  optionBox: {
    padding: "10px 12px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  addOption: {
    padding: "10px 12px 5px",
    display: "flex",
    alignItems: "center",
  },
  optionButton: {
    paddingBottom: "15px",
    marginLeft: "10px",
  },
  optionField: {
    width: "300px",
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

const AddSelectForm = (props) => {
  const { controlId } = useParams();
  const dispatch = useDispatch();
  const styles = useStyles();
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
  //const [isDisabled, setIsDisabled] = useState(false);
  const activeControl = useSelector(
    (state) => state.Control.individual.details
  );
  const [inputs, setInputs] = useState({
    fieldLabel: "",
    // fieldName: "",
    fieldType: formType,
    isRequired: "No",
    valueSetBy: "BOTH",
  });
  const [optionField, setOptionField] = useState("");
  const [options, setOptions] = React.useState([]);
  const { isRequired, valueSetBy } = inputs;

  let handleChange = (e) => {
    clearError("fieldLabel");
    clearError("optionField");
    setOptionField("");
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
        isDefaultGenerated: false,
        options,
      };
      formControl.format.push(formData);
      dispatch(addControlField(formControl));
    }
  };

  let handleOptionChange = (e) => {
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_ERROR });
    clearError("optionField");
    const { value } = e.target;
    setOptionField(value);
  };

  const handleDelete = (optonToDelete) => () => {
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_ERROR });
    setOptions((option) =>
      options.filter((option) => option.key !== optonToDelete.key)
    );
  };

  const handleAddOption = () => {
    let fieldOptions = [...options];
    let isDuplicate = fieldOptions.some(
      (option) =>
        option.label.toLowerCase().trim() === optionField.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError("optionField", "notMatch", VALUE_ALREADY_EXIST);
    } else {
      let newOption = {
        key: options.length,
        label: optionField,
      };
      fieldOptions.push(newOption);
      setOptions(fieldOptions);
      setOptionField("");
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
      setApiError(handleAddSelectFormError(addFieldError, activeControl));
    }
    else
      setApiError(false);
  }, [addFieldError, activeControl]);

  return (
    <>
      <DialogTitle className={styles.dialogTitle}>{ADD_NEW_SEC}</DialogTitle>
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
                //disabled={isDisabled}
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
                label="Internal Name"
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
                label="Required"
                defaultValue={isRequired}
                onChange={handleChange}
                name="isRequired"
                //disabled={isDisabled}
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
                label="Value Fill By"
                defaultValue={valueSetBy}
                onChange={handleChange}
                name="valueSetBy"
                //disabled={isDisabled}
              >
                <MenuItem value="MHK">MHK</MenuItem>
                <MenuItem value="CLIENT">CLIENT</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <Paper variant="outlined">
                <div className={styles.optionBox}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 500 }}
                    gutterBottom
                  >
                    Options ({options.length})
                  </Typography>
                  <div>
                    {options.length > 0 ? (
                      options.map((data) => {
                        return (
                          <Chip
                            label={data.label}
                            onDelete={handleDelete(data)}
                            className={styles.chip}
                          />
                        );
                      })
                    ) : (
                        <Typography variant="body2" gutterBottom>
                          {NO_OPT_AVAILABLE}
                        </Typography>
                      )}
                  </div>
                </div>
                <Divider />
                <div className={styles.addOption}>
                  <div className={styles.optionField}>
                    <MaterialTextField
                      required
                      name="optionField"
                      label="Enter option name..."
                      value={optionField}
                      onChange={handleOptionChange}
                      //disabled={isDisabled}
                      error={errors.optionField ? true : false}
                      helperText={
                        errors.optionField ? errors.optionField.message : " "
                      }
                    />
                  </div>
                  <div className={styles.optionButton}>
                    <MatButton
                      disabled={!optionField.trim()}
                      type="button"
                      color="primary"
                      onClick={handleAddOption}
                    >
                      Add
                    </MatButton>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton type="button" color="primary" onClick={handleCloseForm}>
          {CANCEL}
        </MatButton>
        <MatButton
          type="submit"
          form="addField"
          disabled={options.length < 1 }
            //|| isDisabled}
        >
          Create Select
        </MatButton>
      </DialogActions>
    </>
  );
};

export default AddSelectForm;
