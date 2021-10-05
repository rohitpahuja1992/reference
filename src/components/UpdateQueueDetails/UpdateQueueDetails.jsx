import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { Divider, makeStyles } from "@material-ui/core";
// import Card from '@material-ui/core/Card';

import MatCard from "../MaterialUi/MatCard";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatButton from "../MaterialUi/MatButton";

import { updateQueue } from "../../actions/QueueActions";
import { COMMON_ERROR_MESSAGE, QUENE_NAME_IS_MANDATORY, QUEUE_STATUS_MANDATORY } from "../../utils/Messages";

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
    padding: "3px 8px",
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

const UpdateQueueDetails = (props) => {
  const styles = useStyles();
  const { isUpdated, fireOnUpdate } = props;
  const dispatch = useDispatch();
  const queueData = useSelector((state) => state.Queue.profile);
  const { register, handleSubmit, watch, errors, formState, reset } = useForm({
    mode: "onBlur",
  });
  let { dirty } = formState;
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [apiError, setApiError] = useState(null);

  const defaultFormData = {
    queueName: props.details.name,
    queueInternalName: props.details.internalName,
    queueStatus: props.details.status,
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const { queueName, queueInternalName, queueStatus } = inputs;

  let handleChange = (e) => {
    setApiError(null);
    const { name, value } = e.target;
    if (name === "queueStatus") {
      setSelectionChanged(true);
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleUpdateQueue = () => {
    fireOnUpdate(true);
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      name: inputs.queueName,
      status: inputs.queueStatus,
      internalName: inputs.queueInternalName,
    };
    dispatch(updateQueue(formData));
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(defaultFormData);
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
  };

  useEffect(() => {
    if (queueData.error && queueData.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(COMMON_ERROR_MESSAGE);
    } else {
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [queueData, isUpdated]);

  return (
    <MatCard style={{ flex: 1 }}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Queue Details
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateQueue)}
        >
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={styles.errorCard}>
                  <Typography variant="body2">{apiError}</Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: QUENE_NAME_IS_MANDATORY,
                  },
                  // pattern: {
                  //   value: /^[a-zA-Z][a-zA-Z_\s]*$/,
                  //   message: "Please enter a valid queue name.",
                  // },
                })}
                error={errors.queueName ? true : false}
                defaultValue={queueName}
                helperText={errors.queueName ? errors.queueName.message : " "}
                required
                label="Queue Name"
                name="queueName"
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                error={errors.queueStatus ? true : false}
                value={queueStatus}
                helperText={
                  errors.queueStatus ? errors.queueStatus.message : " "
                }
                inputRef={register({
                  required: {
                    value: true,
                    message: QUEUE_STATUS_MANDATORY,
                  },
                })}
                label="Queue Status"
                name="queueStatus"
                required
                disabled={!isEditable}
              >
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                {/* <MenuItem value="TERMINATED">TERMINATED</MenuItem> */}
              </MaterialTextField>
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                // inputRef={register({
                //   required: {
                //     value: true,
                //     message: "Queue internal name is mandatory.",
                //   },
                // })}
                error={errors.queueInternalName ? true : false}
                defaultValue={queueInternalName}
                helperText={
                  errors.queueInternalName
                    ? errors.queueInternalName.message
                    : " "
                }
                required
                label="Queue Internal Name"
                name="queueInternalName"
                onChange={handleChange}
                disabled
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable && (
              <MatButton onClick={() => setEditable(true)}>
                Edit Details
              </MatButton>
            )}

            {isEditable && (
              <div>
                <MatButton
                  className={styles.cancelBtn}
                  color="primary"
                  onClick={handleCancel}
                >
                  Cancel
                </MatButton>
                <MatButton
                  type="submit"
                  disabled={
                    (isSubmited || !dirty) && !isSelectionChanged && !apiError
                  }
                >
                  Save Details
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default UpdateQueueDetails;
