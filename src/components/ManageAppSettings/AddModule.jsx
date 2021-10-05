import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
//import Typography from '@material-ui/core/Typography';
//import Card from '@material-ui/core/Card';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { addModule } from "../../actions/ModuleActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, MODULE_NAME_MANDATORY, MOD_ALREADY_EXISTS, VAL_MODULENAME } from "../../utils/Messages";

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
    marginBottom: "14px",
  },
}));

const AddModule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  //const moduleDetailsList = useSelector(state => state.Module.moduleDetailsList);
  const isModuleAdded = useSelector((state) => state.Module.isModuleAdded);
  const addApiError = useSelector((state) => state.Module.addError);
  //const [prevList, setPrevList] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  useEffect(() => {
    if (!!addApiError) {
      setIsSubmited(false);
    }

    if (
      addApiError.responseMessage &&
      addApiError.responseMessage.includes("Duplicate")
    ) {
      setIsSubmited(false);
      setError("moduleName", "notMatch", MOD_ALREADY_EXISTS);
    }

    if (isModuleAdded) {
      //dispatch(fetchModule());
      handleCloseForm();
      // dispatch(fetchModule());
      // setIsSubmited(false);
      // props.handleClose();
    }

    // if (moduleDetailsList.list.length > prevList.length) {
    //     setPrevList(moduleDetailsList.list);
    //     setIsSubmited(false);
    //     props.handleClose();
    // }
  }, [dispatch, addApiError, setError, isModuleAdded, handleCloseForm]);

  const handleCreateModule = () => {
    setIsSubmited(true);
    const watchAllFields = watch();
    dispatch(addModule(watchAllFields));
  };

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
          <Grid container className={styles.row}>
            {/* {apiError ?
                            <Grid item xs={12} className={styles.col}>
                                <Card className={styles.errorCard}>
                                    <Typography variant="body2">OOPS! Something went wrong. Please try again.</Typography>
                                </Card>
                            </Grid>
                            : null} */}
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: MODULE_NAME_MANDATORY,
                  },
                  pattern: {
                    value: NAME_PATTERN,
                    message: VAL_MODULENAME,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.moduleName ? true : false}
                helperText={errors.moduleName?.message}
                required
                name="moduleName"
                label="Module Name"
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <Paper variant="outlined">
                <FormControlLabel
                  className={styles.label}
                  value="isGlobal"
                  control={<Switch color="secondary" />}
                  label="Is Global Module?"
                  labelPlacement="end"
                />
              </Paper>
            </Grid>
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

export default AddModule;
