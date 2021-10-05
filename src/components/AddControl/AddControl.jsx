import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";

import { addMasterControl } from "../../actions/ControlActions";

import { defaultControlData } from "../../utils/defaultControlData";
import { fetchMasterControl } from "../../actions/ControlActions";

import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX, RESET_ADD_CONTROL_ERROR } from "../../utils/AppConstants";
import {
  ADD_CON, ADD_NEW_CONTROL, CANCEL, CON_NAME, CON_NAME_EXIST,
  CON_NAME_MANDATORY, CON_TYPE, CON_TYPE_MANDATORY, ENTER_VALID_CON, MAXIMUN_CHARACTER_ALLOWED_MSG,
  OTH_CONTENT, handleAddControlError
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
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
}));

const AddControl = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleClose, open } = props;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearError,
    setError,
    errors,
  } = useForm({ mode: "onBlur" });
  const controlData = useSelector((state) => state.Control.data);
  const addApiError = useSelector((state) => state.Control.data.addError);
  const pageSize = useSelector((state) => state.Control.page.pageSize);
  const [apiError, setApiError] = useState(null);
  const defaultFormObj = {
    controlName: "",
    // internalName: "",
    description: "",
    controlType: "",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const { controlType } = inputs;

  let handleChange = (e) => {
    dispatch({ type: RESET_ADD_CONTROL_ERROR });
    const { name, value } = e.target;
    if (name === "controlType") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleAddControl = () => {
    let formData = { ...inputs };
    if (controlType === "form") {
      formData["controlData"] = defaultControlData;
    } else {
      formData["controlData"] = [];
    }
    dispatch(addMasterControl(formData));
  };

  useEffect(() => {
    if (controlType !== "") {
      setValue("controlType", controlType);
      clearError("controlType");
    } else {
      register(
        { name: "controlType" },
        {
          required: { value: true, message: CON_TYPE_MANDATORY },
        }
      );
    }

    if (addApiError && !(addApiError.responseCode === "201")
    ) {
      setApiError(handleAddControlError(addApiError));
    }
    else
      setApiError(false);

    if (addApiError.responseCode === "2053") {
      setApiError(false);
      setError("controlName", "notMatch", CON_NAME_EXIST);
    }
  }, [controlType, register, setValue, clearError, addApiError, setError]);

  useEffect(() => {
    if (controlData.isControlAdded) {
      props.resetSearchText();
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterControl(DEFAULT_START_INDEX, pageSize));
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, controlData.isControlAdded]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle className={styles.dialogTitle}>{ADD_NEW_CONTROL}</DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddControl)}
          id="addControl"
        >
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                <Typography variant="body2">
                  {apiError.message}
                </Typography>
              </Card>
            </Grid>
          ) : null}
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: CON_NAME_MANDATORY,
                  },
                  pattern: {
                    value: /^[a-zA-Z-_\s]*$/,
                    message: ENTER_VALID_CON,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.controlName ? true : false}
                helperText={
                  errors.controlName ? errors.controlName.message : " "
                }
                required
                name="controlName"
                label={CON_NAME}
                onChange={handleChange}
              />
            </Grid>

            {/* <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: "Internal name is mandatory.",
                  },
                })}
                error={errors.internalName ? true : false}
                helperText={
                  errors.internalName ? errors.internalName.message : " "
                }
                required
                name="internalName"
                label="Internal Name"
                onChange={handleChange}
              />
            </Grid> */}

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                error={errors.controlType ? true : false}
                helperText={
                  errors.controlType ? errors.controlType.message : " "
                }
                select
                required
                label={CON_TYPE}
                onChange={handleChange}
                name="controlType"
              >
                <MenuItem value="form">Form</MenuItem>
                <MenuItem value="otherContent">{OTH_CONTENT}</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                })}
                error={errors.description ? true : false}
                helperText={
                  errors.description ? errors.description.message : " "
                }
                multiline
                rows={4}
                name="description"
                label="Description"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleClose}>
          {CANCEL}
        </MatButton>
        <MatButton type="submit" form="addControl">
          {ADD_CON}
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddControl;
