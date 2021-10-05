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

import { addIndicators, fetchIndicators } from "../../actions/LettersActions";

import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX } from "../../utils/AppConstants";
import {
  ADD_NEW_TAG, CANCEL, MAXIMUN_CHARACTER_ALLOWED_MSG, handleAddTagError
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

const AddTag = (props) => {
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
  const tagData = useSelector((state) => state.Tag.data);
  const addApiError = useSelector((state) => state.Tag.data.addError);
  const pageSize = useSelector((state) => state.Tag.page.pageSize);
  const [apiError, setApiError] = useState(null);
  const defaultFormObj = {
    tagName: "",
    tagField: "",
    description: "",
    tagType: "",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const { tagType, tagName } = inputs;

  // let handleBlur = (e) => {
  //   const { name, value } = e.target;
  //   setInputs((inputs) => ({ ...inputs, [name]: "@" + value }));
  // };

  let handleChange = (e) => {
    //dispatch({ type: RESET_ADD_CONTROL_ERROR });
    const { name, value } = e.target;
    if(name==="tagName"){
      let re = /^<[a-z A-Z 0-9 _-]*\.?[a-z A-Z 0-9 _-]{1,}>$/ig;
      const isValidTag = re.test(value);
      if(isValidTag ){
        setInputs((inputs) => ({ ...inputs, [name]:  + value }));
      }else{
        setInputs((inputs) => ({ ...inputs, [name]: "<" + value +">"}))
      }
    }
   
    if (name === "tagType") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleAddTag = () => {
    let formData = { ...inputs };
    dispatch(addIndicators(formData));
  };

  useEffect(() => {
    if (tagType !== "") {
      setValue("tagType", tagType);
      clearError("tagType");
    } else {
      register(
        { name: "tagType" },
        {
          required: { value: true, message: "Tag Type is Mandatory" },
        }
      );
    }

    if (addApiError && !(addApiError.responseCode === "201")
    ) {
      setApiError(handleAddTagError(tagName, addApiError));
    }
    else
      setApiError(false);

    // if (addApiError.responseCode === "2053") {
    //   setApiError(false);
    //   setError("tagName", "notMatch", CON_NAME_EXIST);
    // }
  }, [tagName, tagType, register, setValue, clearError, addApiError, setError]);

  useEffect(() => {
    if (tagData.isTagAdded) {
      props.resetSearchText();
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchIndicators(DEFAULT_START_INDEX, pageSize));
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tagData.isTagAdded]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle className={styles.dialogTitle}>{ADD_NEW_TAG}</DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddTag)}
          id="addTag"
        >
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
                  required: {
                    value: true,
                    message: "Tag Name is Mandatory",
                  },
                  // pattern: {
                  //   value: /^<[a-z A-Z 0-9 _-]*\.?[a-z A-Z 0-9 _-]{1,}>$/ig,
                  //   message:
                  //     "Tag Name value always exist between tag < > (For Exm: <TagName>). No special characters allowed.",
                  // },
               
                })}
                error={errors.tagName ? true : false}
                helperText={errors.tagName ? errors.tagName.message : " "}
                required
                name="tagName"
                label="Tag Name"
                onChange={handleChange}
                //onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: "Tag Field is Mandatory",
                  },                
                })}
                error={errors.tagField ? true : false}
                helperText={errors.tagField ? errors.tagField.message : " "}
                required
                name="tagField"
                label="Tag Field"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                error={errors.tagType ? true : false}
                helperText={errors.tagType ? errors.tagType.message : " "}
                select
                required
                label="Tag Type"
                onChange={handleChange}
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
                  required: {
                    value: true,
                    message: "Tag Description is Mandatory",
                  },
                 
                  maxLength: {
                    value: 200,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required
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
        <MatButton type="submit" form="addTag">
          Add Tag
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddTag;
