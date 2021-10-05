import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { Divider, makeStyles, CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import MatCard from "../../../components/MaterialUi/MatCard";
import MaterialTextField from "../../../components/MaterialUi/MatTextField";
import MatButton from "../../../components/MaterialUi/MatButton";

import {
  updateSessionTimeout,
  resetError,
  //fetchSessionTimeout,
} from "../../../actions/SessionTimeoutActions";
import {
  CANCEL,
  EDIT_DETAILS,
  ENTER_VALID_VALUE,
  MAX_TIMEOUT_VALUE_MES,
  MIN_TIMEOUT_VALUE_MES,
  SAVE_DETAILS,
  SESSION_TIMEOUT,
  SESSION_TIMEOUT_DETAIL,
  SESSION_TIMEOUT_MANDATORY,
} from "../../../utils/Messages";
import { UPDATE_ACTION_APP_SETTINGS } from "../../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "8px",
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
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "5px 10px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
}));

const SessionInfo = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, errors, formState, reset } = useForm({
    mode: "onBlur",
  });
  let { dirty } = formState;
  const [isEditable, setEditable] = useState(false);
  const [isUpdateCalled, setIsUpdateCalled] = useState(false);
  //const [apiError, setApiError] = useState(null);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const isSessionUpdated = useSelector(
    (state) => state.SessionTimeout.isUpdated
  );
  const error = useSelector((state) => state.SessionTimeout.updateError);
  const defaultFormData = {
    sessionTime: props.details.timeout,
  };
  const [inputs, setInputs] = useState(defaultFormData);

  const { sessionTime } = inputs;

  const handleCancel = useCallback(() => {
    reset(defaultFormData);
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
    dispatch(resetError());
  }, [defaultFormData, dispatch, reset]);

  const handleClose = useCallback(() => {
    setEditable(false);
    setSelectionChanged(false);
  }, []);

  let handleChange = (e) => {
    const { name } = e.target;
    setSelectionChanged(true);
    setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  const handleEdit = () => {
    setEditable(true);
    setIsUpdateCalled(false);
    //setApiError(false);
  };

  const handleUpdateClientProfile = () => {
    setIsUpdateCalled(true);
    dispatch(updateSessionTimeout(inputs));
  };

  useEffect(() => {
    if (isUpdateCalled && error) {
      handleCancel();
    }
    if (isSessionUpdated) {
      handleClose();
      //setEditable(false);
      //dispatch(fetchSessionTimeout());
    }
  }, [error, handleClose, handleCancel, isSessionUpdated, isUpdateCalled]);

  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {SESSION_TIMEOUT_DETAIL}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        {/* {apiError && isUpdateCalled ?
                    <Grid item xs={12} className={styles.col}>
                        <Card className={styles.errorCard}>
                            <Typography variant="body2">OOPS! Something went wrong. Please try again.</Typography>
                        </Card>
                    </Grid>
                    : null} */}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateClientProfile)}
          id="updateClientInfo"
        >
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: SESSION_TIMEOUT_MANDATORY,
                  },
                  min: {
                    value: 3,
                    message: MIN_TIMEOUT_VALUE_MES,
                  },
                  max: {
                    value: 480,
                    message: MAX_TIMEOUT_VALUE_MES,
                  },
                  pattern: {
                    value: /^\d{1,3}$/,
                    message: ENTER_VALID_VALUE,
                  },
                })}
                type="number"
                defaultValue={sessionTime}
                error={errors.sessionTime ? true : false}
                helperText={
                  errors.sessionTime ? errors.sessionTime.message : " "
                }
                required
                label={SESSION_TIMEOUT}
                name="sessionTime"
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable && (
              featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 &&
              <MatButton onClick={handleEdit}>{EDIT_DETAILS}</MatButton>
            )}

            {isEditable && (
              <div>
                <MatButton
                  className={styles.cancelBtn}
                  color="primary"
                  onClick={handleCancel}
                >
                  {CANCEL}
                </MatButton>
                <MatButton
                  type="submit"
                  disabled={(isUpdateCalled || !dirty) && !isSelectionChanged}
                >
                  {SAVE_DETAILS}
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default SessionInfo;
