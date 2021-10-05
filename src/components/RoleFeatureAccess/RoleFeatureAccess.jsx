import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Card from "@material-ui/core/Card";
import {
  handleRoleFeatureAccessError,
  ROLE_AND_FEATURE,
  EDIT_ROLE_FEATURE,
  SAVE_ROLE_FEATURE,
  CANCEL
} from "../../utils/Messages";
import { RESET_DASHBOARD_DATA } from "../../utils/AppConstants";
import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import { fetchLoggedInUserInfo } from "../../actions/UserActions";
import { updateRole } from "../../actions/RoleActions";
import { VIEW_ROLE_PERMISSION, UPDATE_ROLE_PERMISSION, VIEW_OWN_PROFILE } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  card: {
    // marginTop: '16px'
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  cardSubheadingSize: {
    fontSize: "16px",
    paddingTop: "10px",
  },
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "10px 10px 0px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
  switchList: {
    padding: "0px",
  },
  switchItem: {
    marginRight: "6px",
  },
  listGutter: {
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "6px",
    "&.Mui-disabled": {
      opacity: "0.8",
    },
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
}));
const RoleFeatureAccess = (props) => {

  const styles = useStyles();
  const dispatch = useDispatch();
  const { isUpdated, fireOnUpdate } = props;
  const features = useSelector((state) => state.Feature.data.list);
  const roleProfile = useSelector((state) => state.Role.profile);
  const [isEditable, setEditable] = useState(false);
  const [checked, setChecked] = useState(
    props.details.features.map((feature) => feature.id)
  );
  const [isDirty, setDirty] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const AdminDisabled = [VIEW_ROLE_PERMISSION, UPDATE_ROLE_PERMISSION];

  const handleCancel = () => {
    fireOnUpdate(false);
    setChecked(props.details.features.map((feature) => feature.id));
    setEditable(false);
    setDirty(false);
  };

  const handleFeatureSelection = (value) => () => {
    setApiError(null);
    setDirty(true);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const updateFeatureWithRole = () => {
    fireOnUpdate(true);
    dispatch({ type: RESET_DASHBOARD_DATA });
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      roleName: props.details.roleName,
      roleStatus: props.details.roleStatus,
      roleType: props.details.roleType,
      roleDesc: props.details.roleDesc,
      queue: props.details.queues.map((queue) => queue.id),
      feature: checked,
    };
    dispatch(updateRole(formData));
  };
  const handleRoleName = () => {
    if (props.details.roleDesc.trim() === "Client user details") {
      return "Client";
    }
    else if (props.details.roleDesc.trim() === "QA User Access") {
      return "QA";
    }
    else if (props.details.roleDesc.trim() === "Configuration User Access") {
      return "Config";
    }
    else if (props.details.roleDesc.trim() === "Product User Access") {
      return "Product";
    }
    else if (props.details.roleDesc.trim() === "Administrator") {
      return "Admin";
    }
  }

  useEffect(() => {
    if (roleProfile.error && roleProfile.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleRoleFeatureAccessError(roleProfile.error));
    } else {
      console.log("rolefeature page ", roleProfile, isUpdated);
      dispatch(fetchLoggedInUserInfo());
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [dispatch, roleProfile, isUpdated]);

  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {ROLE_AND_FEATURE}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form noValidate autoComplete="off">
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}

            {features.filter((item) => item.featureFor === 'ALL' || item.featureFor === props.details.roleType).map((feature) => (
              <Grid key={feature.id} item xs={6} className={styles.col}>
                <Paper variant="outlined">
                  <List className={styles.switchList}>
                    <ListItem
                      disabled={!(feature?.roles?.includes(handleRoleName()) || feature?.roles?.includes("ALL")) || !isEditable || (props.details.roleName === 'Administrator' && AdminDisabled.findIndex(internalName => internalName === feature.featureInternalName) !== -1)}
                      className={styles.listGutter}
                      button
                      onClick={handleFeatureSelection(feature.id)}

                      style={{
                        opacity:
                          !(feature?.roles?.includes(handleRoleName()) || feature?.roles?.includes("ALL"))
                            ? "0.5"
                            : "1",
                      }}
                    >
                      <ListItemIcon className={styles.switchItem}>
                        <Switch
                          edge="end"
                          // onChange={handleToggle('wifi')}
                          disabled={(props.details.roleName === 'Administrator' && AdminDisabled.findIndex(internalName => internalName === feature.featureInternalName) !== -1)}
                          checked={checked.indexOf(feature.id) !== -1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            style={{ wordBreak: "break-word" }}
                          >
                            {feature.featureName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable && (
              featuresAssigned.indexOf(UPDATE_ROLE_PERMISSION) !== -1 &&
              <MatButton onClick={() => setEditable(true)}>
                {EDIT_ROLE_FEATURE}
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
                  type="button"
                  onClick={updateFeatureWithRole}
                  disabled={(isSubmited || !isDirty) && !apiError}
                >
                  {SAVE_ROLE_FEATURE}
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default RoleFeatureAccess;
