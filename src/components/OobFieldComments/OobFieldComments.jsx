import React, { useState, useEffect } from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import MatCard from "../MaterialUi/MatCard";

import { makeStyles } from "@material-ui/core";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { updateControlComment } from "../../actions/ControlCommentActions";
import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";
import { fetchClientControlAudit } from "../../actions/ClientModuleActions";
import {
  handleOobFieldCommentsError,
  TYPE_YOUR_COMMENT,
  COMMENT_IS_MANDATORY,
  SAVE,
} from "../../utils/Messages";
import { RESET_COMMENT_STATUS,
  DEFAULT_PAGE_SIZE_TIMELINE,
  DEFAULT_START_INDEX,
 } from "../../utils/AppConstants";
const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  dialogTitle: {
    fontWeight: 300,
  },
  chip: {
    margin: "2px",
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
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "12px 8px 0",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
}));

const OobFieldComments = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setValue, watch } = useForm({
    mode: "onBlur",
  });
  const { url } = useRouteMatch();
  const param = useParams();
  const [isSubmited, setIsSubmited] = useState(false);
  // const [isSelectionChanged, setIsSelectionChanged] = useState(false);
  // const [apiError, setApiError] = useState(false);
  const isSuccess = useSelector((state) => state.ControlComment.success);
  const isError = useSelector((state) => state.ControlComment.error);
  const [apiError, setApiError] = useState(null);

  const handleChange = () => {
    dispatch({ type: RESET_COMMENT_STATUS });
  };

  const addComments = () => {
    setIsSubmited(true);
    if (url.split("/")[1] === "client")
      dispatch(
        updateControlComment(watch().comment, param.controlId, "client")
      );
    else
      dispatch(
        updateControlComment(watch().comment, param.oobControlId, "oob")
      );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setIsSubmited(false);
      //dispatch({ type: RESET_COMMENT_STATUS });
    }
    if (isSuccess) {
      setValue("comment", "");
      if (url.split("/")[1] === "client")
        dispatch(fetchClientControlAudit(param.controlId));
      else dispatch(fetchOOBControlAudit(param.oobControlId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
    }
  }, [dispatch, setValue, isSuccess, isError, param, url]);

  useEffect(() => {
    if (isError) {
      setApiError(handleOobFieldCommentsError(isError));
    }
    else {
      setApiError(false);
    }
  }, [isError])

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {"Comments"}
          </Typography>
        }
      />
      <Divider />
      <CardContent style={{ padding: "5px 10px 20px" }}>
        {apiError ?
          <Grid item xs={12} className={styles.col}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">{apiError.message}</Typography>
            </Card>
          </Grid>
          : null}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(addComments)}
        >
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                multiline
                rows={3}
                // disabled={field.valueSetBy === "CLIENT"}
                name="comment"
                label={TYPE_YOUR_COMMENT}
                inputRef={register({
                  required: {
                    value: true,
                    message: COMMENT_IS_MANDATORY,
                  },
                })}
                error={errors.comment ? true : false}
                helperText={errors.comment ? errors.comment.message : " "}
                onChange={handleChange}
              // inputRef={register({
              //   required: {
              //     value:
              //       field.isFieldRequired === "Yes" &&
              //       field.valueSetBy !== "CLIENT",
              //     message: `${field.fieldLabel} is mandatory.`,
              //   },
              // })}
              // error={errors[field.internalName] ? true : false}
              // helperText={
              //   errors[field.internalName]
              //     ? errors[field.internalName].message
              //     : " "
              // }
              // required={field.isFieldRequired === "Yes"}
              //onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} className={styles.buttonCol}>
              <div className={styles.grow} />
              <MatButton type="submit" disabled={isSubmited}>
                {SAVE}
              </MatButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default OobFieldComments;
