import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  updateIndicators,
  //fetchIndicators,
  resetUpdateError,
  resetDuplicateError,
} from "../../actions/LettersActions";
// import { formatDate } from "../../utils/helpers";
import {
  // SUB_ASSOCIATE_OOB,
  // SUB_NAME_EXIST,
  //COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  MAX_4000_CHAR_ALLOWED,
  handleUpdateTagError
} from "../../utils/Messages";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
//import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
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

const UpdateTag = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    //setValue,
    clearError,
    //setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const [isEditable, setIsEditable] = useState(false);
  const putApiError = useSelector((state) => state.Tag.putError);
  const [apiError, setApiError] = useState(null);
  const tagData = useSelector((state) => state.Tag.data);
  //const pageSize = useSelector((state) => state.Tag.page.pageSize);
  const featuresAssigned = useSelector((state) => state.User.features);

  const tagDetailsById = useSelector((state) => state.Tag.tagDetailsById);
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const defaultFormData = {
    tagName: tagDetailsById.name.split("<")[1].split(">")[0],
    tagField: tagDetailsById.fieldId,
    tagType: tagDetailsById.tagType,
    description: tagDetailsById.description,
  };

  const [inputs, setInputs] = useState(defaultFormData);

  let handleChange = (e) => {
    setSelectionChanged(true);
    dispatch(resetUpdateError());
    setApiError(false);
    const { name, value } = e.target;
    if (name === "tagType") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleCloseForm = useCallback(() => {
    clearError();
    setIsEditable(false);
    setSelectionChanged(false);
    props.handleClose();
  }, [props, clearError]);

  const handleResetForm = () => {
    reset(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);
    dispatch(resetUpdateError());
    setApiError(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateTag = () => {
    setSelectionChanged(false);
    let formData = { ...inputs };
    dispatch(updateIndicators(tagDetailsById.id, formData));
  };

  // useEffect(() => {
  //   if (tagData.isTagUpdated) {
  //     //props.resetSearchText();
  //     // dispatch({ type: SET_DEFAULT_STARTINDEX });
  //     // dispatch(fetchIndicators(DEFAULT_START_INDEX, pageSize));
  //     props.handleClose();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, tagData.isTagUpdated]);

  useEffect(() => {
    if (
      putApiError &&
      !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
    ) {
      setApiError(handleUpdateTagError(putApiError));
    }

    if (tagData.isTagUpdated) {
      handleCloseForm();
      dispatch(resetDuplicateError());
    }
  }, [dispatch, putApiError, handleCloseForm, tagData.isTagUpdated]);

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
        {tagDetailsById.name}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateTag)}
        id="updateTag"
      >
        <DialogContent dividers="true">
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
                    message: "Tag Name is Mandatory",
                  },
                  // pattern: {
                  //   value: /^<[a-z A-Z 0-9 _-]*\.?[a-z A-Z 0-9 _-]{1,}>$/ig,
                  //   message:
                  //   "Tag Name value always exist between tag < > (For Exm: <TagName>). No special characters allowed.",
                  // },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required
                error={errors.tagName ? true : false}
                helperText={errors.tagName?.message}
                name="tagName"
                label="Tag Name"
                defaultValue={defaultFormData.tagName}
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: "Tag Field is Mandatory",
                  }                
                })}
                required
                error={errors.tagField ? true : false}
                helperText={errors.tagField?.message}
                name="tagField"
                label="Tag Field"
                defaultValue={defaultFormData.tagField}
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                error={errors.tagType ? true : false}
                helperText={errors.tagType ? errors.tagType.message : " "}
                select
                required
                label="Tag Type"
                defaultValue={defaultFormData.tagType}
                onChange={handleChange}
                disabled={!isEditable}
                name="tagType"
              >
                <MenuItem value="MEMBER_DEMOGRAPHIC">
                  Member Demographic
                </MenuItem>
                <MenuItem value="USER_DEMOGRAPHIC">User Demographic</MenuItem>
                <MenuItem value="DATE">Date</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  maxLength: {
                    value: 4000,
                    message: MAX_4000_CHAR_ALLOWED,
                  },
                })}
                //required={props.selectedMenu === 'UPDATE' ? true : false}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                multiline
                rows={4}
                name="description"
                label="Description"
                defaultValue={defaultFormData.description}
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
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
              {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 && (
               <MatButton onClick={handleEdit}>Edit Tag</MatButton>
              )}
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

export default UpdateTag;
