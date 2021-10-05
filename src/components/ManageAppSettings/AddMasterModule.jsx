import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
// import MenuItem from "@material-ui/core/MenuItem";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  addMasterModule,
  fetchMasterModule,
  fetchAllMasterModule,
  resetDuplicateError,
} from "../../actions/MasterModuleActions";

import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE
} from "../../utils/AppConstants";
import {
  // CAT_MANDATORY,
  // COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  MAX_4000_CHAR_ALLOWED,
  MODULE_ALREADY_EXIST,
  MODULE_NAME_MANDATORY,
  VAL_MODULENAME,
  handleAddModuleError
} from "../../utils/Messages";
//import { NAME_PATTERN } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  label: {
    margin: "0px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    //marginBottom: '14px'
  },

  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
}));

const AddMasterModule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    // setValue,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  const [isSubmited, setIsSubmited] = useState(false);
  //const [isSelectionChanged, setSelectionChanged] = useState(false);
  const isModuleAdded = useSelector(
    (state) => state.MasterModule.isModuleAdded
  );
  const moduleDetailsList = useSelector((state) =>
    state.MasterModule?.allList || []
  );
  const [apiError, setApiError] = useState(null);
  const addApiError = useSelector((state) => state.MasterModule.addError);
  // const categoryOptions = useSelector(
  //   (state) => state.ModuleConfig.configModuleList
  // );
  const [inputs, setInputs] = useState({
    moduleName: "",
    isGlobal: false,
    shortName: "",
    description: "",
  });
  const { moduleName } = inputs;

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  let handleChange = (e) => {
    dispatch(resetDuplicateError());
    setApiError(false);
    const { name, value } = e.target;
    if (name === "category") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
    //setSelectionChanged(true);
  };

  useEffect(() => {
    if (!!addApiError) {
      setIsSubmited(false);
    }

    if (addApiError && !(addApiError.responseCode === "201")
    ) {
      setApiError(handleAddModuleError(moduleName, addApiError));
    }
    else
      setApiError(false);
    if (
      addApiError.responseMessage &&
      addApiError.responseMessage.includes("Module name") &&
      addApiError.responseMessage.includes("exist")
    ) {
      setIsSubmited(false);
      setApiError(false);
      setError("moduleName", "notMatch", MODULE_ALREADY_EXIST);
    }

    if (isModuleAdded) {
      dispatch(fetchMasterModule("All", DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
      handleCloseForm();
      dispatch(fetchAllMasterModule());
      dispatch(resetDuplicateError());
    }
  }, [dispatch, moduleName, addApiError, setError, isModuleAdded, handleCloseForm]);

  const handleCreateModule = () => {
    setIsSubmited(true);
    // const watchAllFields = watch();
    // console.log("INPUTS", inputs);
    // console.log("WATCH", watchAllFields);
    dispatch(addMasterModule(inputs));
  };

  // useEffect(() => {
  //   if (category !== "") {
  //     setValue("category", category);
  //     clearError("category");
  //   } else {
  //     register(
  //       { name: "category" },
  //       {
  //         required: { value: true, message: CAT_MANDATORY },
  //       }
  //     );
  //   }
  // }, [category, register, setValue, clearError]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>Add New Module</DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleCreateModule)}
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
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: MODULE_NAME_MANDATORY },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: VAL_MODULENAME,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.moduleName ? true : false}
                helperText={errors.moduleName?.message}
                onChange={handleChange}
                required
                name="moduleName"
                label="Module Name"
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: "Module abbreviation is mandatory" },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: "Enter valid module abbreviation",
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.shortName ? true : false}
                helperText={errors.shortName?.message}
                onChange={handleChange}
                required
                name="shortName"
                label="Module abbreviation"
              />
            </Grid>
            {moduleDetailsList.filter(a => a.global).length === 0 &&
              <Grid item xs={12} className={styles.col}>
                <Paper variant="outlined">
                  <FormControlLabel
                    className={styles.label}
                    control={<Switch color="secondary" />}
                    inputRef={register}
                    onChange={handleChange}
                    label="Is Global Module?"
                    name="isGlobal"
                    labelPlacement="end"
                  />
                </Paper>
              </Grid>
            }
            {/* <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                error={errors.category ? true : false}
                value={category}
                helperText={errors.category ? errors.category.message : " "}
                label="Category"
                name="category"
                required
              >
                {categoryOptions &&
                  categoryOptions.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
              </MaterialTextField>
            </Grid> */}
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  maxLength: {
                    value: 4000,
                    message: MAX_4000_CHAR_ALLOWED,
                  },
                })}
                //({ required: { value: true, message: "Description is Mandatory" }, minLength: { value: 5, message: "Minimum 5 characters" } })
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                onChange={handleChange}
                //required
                multiline
                rows={4}
                name="description"
                label="Description"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          <MatButton type="submit" disabled={isSubmited}>
            Add Module
          </MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMasterModule;
