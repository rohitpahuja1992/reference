import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import LinkSolidIcon from "../../assets/images/link-solid-purple.svg";
import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
//import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { useParams } from "react-router-dom";
import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import {
  updateClientProfile,
  resetClientInfo,
  addClientEnvironment,
  fetchClientById,
} from "../../actions/ClientActions";
// import {
//   COMMON_ERROR_MESSAGE
// } from "../../utils/Messages";
import SetDomain from "./SetDomain";
import RateReviewIcon from "@material-ui/icons/RateReview";
import LinkIcon from '@material-ui/icons/Link';
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { RESET_MODULE_ADDED } from "../../utils/AppConstants";
import {
  CONFIRM,
  EDIT_ENV_ASSIGN,
  removeAssociateEnv,
} from "../../utils/Messages";
import { UPDATE_CLIENT_PROFILE } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: "16px",
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
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  linkIconSize: {
    color: theme.palette.warning.main,
    width: "15px"
  }
}));

const ClientEnvironment = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleSubmit } = useForm({ mode: "onBlur" });
  const { clientId } = useParams();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const [uniqueEnvId, setUniqueEnvId] = useState("");
  const [pairedProp, setPairedProp] = useState("");
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const environmentList = useSelector((state) =>
    state.Environment.environmentDetailsList.list.filter((obj) => !obj.deleted).sort((a, b) => a.environmentName.toLowerCase() > b.environmentName.toLowerCase() ? 1 : -1)
  );
  
  const isClientEnvAdded = useSelector(
    (state) => state.Client.isClientEnvAdded
  );
  //const isClientUpdated = useSelector((state) => state.Client.isClientUpdated);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const roles = loggedInUserData && loggedInUserData.roles.map(item => item.roleName);
  //const Error = useSelector((state) => state.Client.updateError);
  //const [apiError, setApiError] = useState(null);
  const [isEditable, setEditable] = useState(false);
  //const [isUpdateCalled, setIsUpdateCalled] = useState(false);
  const [checked, setChecked] = useState(
    props.details.environments &&
    props.details.environments
      .filter((enabled) => enabled.enable)
      .map((env) => env.environmentId)
  );
  const [selectedName, setSelectedName] = useState("");
  //const [isDirty, setDirty] = useState(false);

  const handleCancel = () => {
    dispatch(resetClientInfo());
    setChecked(
      props.details.environments &&
      props.details.environments
        .filter((enabled) => enabled.enable)
        .map((env) => env.environmentId)
    );
    setEditable(false);
    //setIsUpdateCalled(false);
    //setDirty(false);
    //setApiError(false);
  };

  const handleEdit = () => {
    setEditable(true);
    //setIsUpdateCalled(false);
    //setApiError(false);
  };

  const handleEnvironmentSelection = (value, name) => () => {
    
    setUniqueEnvId(value)
    //setDirty(true);
    dispatch(resetClientInfo());
    //setApiError(false);
    const currentIndex = checked ? checked.indexOf(value) : -1;
    const newChecked = checked ? [...checked] : [];
    
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if (newChecked.indexOf(value) === -1) {
      let newElement = {};
      let Environment = {};
      newElement["clientName"] = props.details.clientName;
      //Environment["domainUrl"] = domainURL;
      Environment["enable"] = false;
      Environment["environmentId"] = value;
      Environment["environmentName"] = name;
      newElement["environmentDomain"] = [Environment];
      newElement["id"] = props.details.id;
      //console.log("New Element",newElement);
      //dispatch(addClientEnvironment(newElement));
      openConfirmDeleteDialog(newElement, name);
    } else {
      setSelectedName(name);
      setDefaultName("");
      setOpenUpdate(false);
      setOpen(true);
    }

    setChecked(newChecked);
  };

  const handleUpdateDomainUrl = (value, name) => () => {
    console.log("fghjkl" + value);
    setUniqueEnvId(value)
    setSelectedName(name);
    setDefaultName(handleSecondaryText(value));
    setPairedProp(handlePairedBit(value));
    setOpenUpdate(true);
    setOpen(true);
  };
  
  // useEffect(() => {
  //   if (
  //     isUpdateCalled &&
  //     Error &&
  //     !(Error.responseCode === "200" || Error.responseCode === 200)
  //   ) {
  //     setDirty(true);
  //     setApiError(true);
  //     //setIsUpdateCalled(false);
  //   }
  //   if (isClientUpdated) {
  //     setDirty(false);
  //     setEditable(false);
  //     setIsUpdateCalled(false);
  //     setApiError(false);
  //     //dispatch(fetchClientById(props.details.id));
  //   }
  // }, [dispatch, Error, isClientUpdated, isDirty, props, isUpdateCalled]);

  const handleUpdateClientProfileEnvironment = () => {
    //setDirty(false);
    //setIsUpdateCalled(true);
    let environments = { environments: checked };
    dispatch(updateClientProfile(environments, props));
  };

  const closeSetDomainDialog = () => {
    if (!openUpdate) {
      const newChecked = [...checked];
      newChecked.pop();
      setChecked(newChecked);
    }
    setDefaultName("");
    setOpenUpdate(false);
    setOpen(false);
  };

  const handleSecondaryText = (envId) => {
    let FilterList = props.details.environments.filter(
      (selected) => selected.environmentId === envId
    );
    let result = FilterList.length > 0 ? FilterList[0].domainUrl : null;
    return result;
  };
  const handlePairedBit = (envId) => {
    let FilterList = props.details.environments.filter(
      (selected) => selected.environmentId === envId
    );
    let result = FilterList.length > 0 ? FilterList[0].paired : false;
    return result;
  };
  const handleSetEnvironment = (domainURL,checkthings) => {
    let newElement = {};
    let Environment = {};
    newElement["clientName"] = props.details.clientName;
    Environment["domainUrl"] = domainURL;
    Environment["enable"] = true;
    Environment["environmentId"] = uniqueEnvId;
    Environment["environmentName"] = selectedName;
    Environment["paired"] = checkthings;
    Environment["overwrite"] = checkthings;
    newElement["environmentDomain"] = [Environment];
    newElement["id"] = props.details.id;
    dispatch(addClientEnvironment(newElement,clientId));
    //dispatch(addMasterModule(watch().domainName));
  };

  const openConfirmDeleteDialog = (payload, envName) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(addClientEnvironment(payload,clientId));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {
        setChecked(
          props.details.environments &&
          props.details.environments
            .filter((enabled) => enabled.enable)
            .map((env) => env.environmentId)
        );
      },
      title: CONFIRM,
      message: removeAssociateEnv(envName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  useEffect(() => {
    if (isClientEnvAdded) {
      setOpen(false);
      //setChecked(props.details.environments && props.details.environments.filter((enabled) => enabled.enable).map((env) => env.environmentId));
      dispatch(fetchClientById(props.details.id));
      dispatch({ type: RESET_MODULE_ADDED });
    }
  }, [dispatch, isClientEnvAdded, props.details]);

  const PairedBitChecked = useSelector((state) => state.PairedBit.checked );
  return (
    <>
      <MatCard className={styles.card}>
        <CardHeader
          className={styles.cardHeading}
          title={
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Environment(s)
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          {/* {apiError && isUpdateCalled ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">
                  {COMMON_ERROR_MESSAGE}
                </Typography>
              </Card>
            </Grid>
          ) : null} */}
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleUpdateClientProfileEnvironment)}
          >
            <Grid container className={styles.row}>
              {environmentList.map((env) => (
                <Grid key={env.id} item xs={4} className={styles.col} style={{ display: 'grid' }}>
                  <Paper variant="outlined">
                    <List className={styles.switchList}>
                      <ListItem
                        disabled={!isEditable}
                        className={styles.listGutter}
                        button
                        onClick={handleEnvironmentSelection(
                          env.id,
                          env.environmentName
                        )}
                      >
                        <ListItemIcon className={styles.switchItem}>
                          <Switch
                            edge="end"
                            // onChange={handleToggle('wifi')}
                            checked={checked && checked.indexOf(env.id) !== -1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              style={{ wordBreak: "break-word" }}
                            >
                              {env.environmentName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                            variant="subtitle2"
                            style={{color:"rgba(0, 0, 0, 0.54)", wordBreak: "break-word",                           
                            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                            fontWeight: "400",
                            lineHeight: "1.43",
                          paddingRight:"15px" }}
                          >
                            {handleSecondaryText(env.id)}
                          </Typography>
                          }                        
                        />
                        {handlePairedBit(env.id) &&
                            <img
                              src={LinkSolidIcon}
                              alt={LinkSolidIcon + " icon"}
                              className={styles.linkIconSize}
                            />
                          }
                        {handleSecondaryText(env.id) && isEditable ? (
                          <ListItemSecondaryAction>
                            
                            <IconButton edge="end" aria-label="update">
                              <RateReviewIcon
                                fontSize="small"
                                onClick={handleUpdateDomainUrl(
                                  env.id,
                                  env.environmentName
                                )}
                              />
                            </IconButton>
                          </ListItemSecondaryAction>
                        ) : null}
                      </ListItem>
                      
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} className={styles.buttonCol}>
              <div className={styles.grow} />
              {!isEditable && loggedInUserData.user_type !== "CLIENT" && featuresAssigned.indexOf(UPDATE_CLIENT_PROFILE) !== -1 && props.details.clientStatus !== 1 && !props.details.isDeleted &&
                roles.indexOf('Administrator') !== -1 && (
                  <MatButton onClick={handleEdit}>
                    {EDIT_ENV_ASSIGN}
                  </MatButton>
                )}

              {isEditable && (
                <div>
                  <MatButton
                    className={styles.cancelBtn}
                    color="primary"
                    onClick={handleCancel}
                  >
                    Done
                  </MatButton>
                  {/* <MatButton type="submit" disabled={!isDirty}>
                    Save Environment Assignment
                </MatButton> */}
                </div>
              )}
            </Grid>
          </form>
        </CardContent>
      </MatCard>
      {open && (
        <SetDomain
          handleClose={closeSetDomainDialog}
          onSubmit={handleSetEnvironment}
          name={defaultName}
          open={open}
          id={uniqueEnvId}
          pairedProp={handlePairedBit(uniqueEnvId)}
        />
      )}
    </>
  );
};

export default ClientEnvironment;
