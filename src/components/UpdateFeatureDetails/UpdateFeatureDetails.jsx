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
import {
  CANCEL,
  handleUpdateFeatureDetailsError,
  SAVE_DETAILS,
  FEATURE_STATUS_MANDATORY,
  FEATURE_INT_NAME,
  FEATURE_NAME,
  FEATURE_DETAIL,
  EDIT_DETAILS,
  ROLE_NAME_MANDATORY,
  FEATURE_STATUS
} from "../../utils/Messages";
import MatCard from "../MaterialUi/MatCard";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatButton from "../MaterialUi/MatButton";

import { updateFeature } from "../../actions/FeatureActions";

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
    padding: "5px 10px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
}));

const UpdateFeatureDetails = (props) => {
  const styles = useStyles();
  const { isUpdated, fireOnUpdate } = props;
  const dispatch = useDispatch();
  const featureData = useSelector((state) => state.Feature.profile);
  const { register, handleSubmit, watch, errors, formState, reset } = useForm({
    mode: "onBlur",
  });
  let { dirty } = formState;
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [apiError, setApiError] = useState(null);

  const defaultFormData = {
    featureName: props.details.featureName,
    featureInternalName: props.details.featureInternalName,
    featureStatus: props.details.featureStatus,
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const { featureName, featureInternalName, featureStatus } = inputs;

  let handleChange = (e) => {
    setApiError(null);
    const { name, value } = e.target;
    if (name === "featureStatus") {
      setSelectionChanged(true);
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleUpdateFeature = () => {
    fireOnUpdate(true);
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      ...inputs,
    };
    dispatch(updateFeature(formData));
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(defaultFormData);
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
  };

  useEffect(() => {
    if (featureData.error && featureData.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleUpdateFeatureDetailsError(featureData.error));
    } else {
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [featureData, isUpdated]);

  return (
    <MatCard style={{ flex: 1 }}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {FEATURE_DETAIL}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateFeature)}
        >
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: ROLE_NAME_MANDATORY },
                  // pattern: {
                  //   value: /^[a-zA-Z][a-zA-Z_\s]*$/,
                  //   message: "Please enter a valid feature name.",
                  // },
                })}
                error={errors.featureName ? true : false}
                defaultValue={featureName}
                helperText={
                  errors.featureName ? errors.featureName.message : " "
                }
                required
                label={FEATURE_NAME}
                name="featureName"
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                error={errors.featureStatus ? true : false}
                value={featureStatus}
                helperText={
                  errors.featureStatus ? errors.featureStatus.message : " "
                }
                inputRef={register({
                  required: {
                    value: true,
                    message: FEATURE_STATUS_MANDATORY,
                  },
                })}
                label={FEATURE_STATUS}
                name="featureStatus"
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
                //     message: "Feature internal name is mandatory.",
                //   },
                // })}
                error={errors.featureInternalName ? true : false}
                defaultValue={featureInternalName}
                helperText={
                  errors.featureInternalName
                    ? errors.featureInternalName.message
                    : " "
                }
                required
                label={FEATURE_INT_NAME}
                name="featureInternalName"
                onChange={handleChange}
                disabled
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable && (
              <MatButton onClick={() => setEditable(true)}>
                {EDIT_DETAILS}
              </MatButton>
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
                  disabled={
                    (isSubmited || !dirty) && !isSelectionChanged && !apiError
                  }
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

export default UpdateFeatureDetails;
