import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
import Paper from "@material-ui/core/Paper";
import MatButton from "../../components/MaterialUi/MatButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {
  updateJiraTickeInfo,
  fetchJiraTickeInfo,
} from "../../actions/JiraTicketActions";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";

import {
  CANCEL,
  EDIT_DETAILS,
  // ENTER_VALID_VALUE,
  SAVE_DETAILS,
  JIRATICKET,
  JIRATICKET_DETAIL,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
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
  listGutter: {
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "6px",
    "&.Mui-disabled": {
      opacity: "0.8",
    },
  },
}));

const JiraTicket = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState(null);
  const { handleSubmit, formState } = useForm({
    mode: "onBlur",
  });
  let { dirty } = formState;
  const [isEditable, setEditable] = useState(false);
  const [isUpdateCalled, setIsUpdateCalled] = useState(false);
  //const [apiError, setApiError] = useState(null);
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const featuresAssigned = useSelector((state) => state.User.features);
  const jiraTicketEnable = useSelector((state) => state.JiraTicket.jiraDetails);
  const isJiraUpdated = useSelector((state) => state.JiraTicket.isUpdated);
  console.log('jiraTicketEnable', jiraTicketEnable)
  const [checked, setChecked] = useState(jiraTicketEnable);

  const handleSelection = (value) => () => {
    setSelectionChanged(true);
    setChecked(!value);
  };

  const handleEdit = () => {
    setEditable(true);
    setIsUpdateCalled(false);
    //setApiError(false);
  };

  const handleCancel = useCallback(() => {
    //reset(defaultFormData);
    // setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
    setChecked(jiraTicketEnable)
    //dispatch(resetError());
  }, [jiraTicketEnable]);
  //[defaultFormData, dispatch, reset]);

  // const error = useSelector(state => state.SessionTimeout.getError);

  const handleClose = useCallback(() => {
    setEditable(false);
    setSelectionChanged(false);
  }, []);

  const handleUpdateClientProfile = () => {
    setIsUpdateCalled(true);
    dispatch(updateJiraTickeInfo(checked));
  };

  useEffect(() => {
    if (isUpdateCalled) {
      handleCancel();
    }
    if (isJiraUpdated) {
      handleClose();
      setEditable(false);
      // dispatch(fetchJiraTickeInfo());
    }
  }, [handleClose, handleCancel, jiraTicketEnable, isJiraUpdated, isUpdateCalled]);


  useEffect(() => {
    if (jiraTicketEnable === "") {

      dispatch(fetchJiraTickeInfo());
    } else {
      setChecked(jiraTicketEnable);
    }
  }, [dispatch, jiraTicketEnable]);

  return (
    <MatContainer>
      {apiError && !(jiraTicketEnable.length > 0) && (
        <Grid item xs={12} className={styles.error}>
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
      )}
      {!apiError && <PageHeading heading={JIRATICKET} />}
      <Grid container>
        <Grid item xs={6}>
          {!apiError && (
            <MatCard className={styles.card}>
              <CardHeader
                className={styles.cardHeading}
                title={
                  <Typography variant="h6" className={styles.cardHeadingSize}>
                    {JIRATICKET_DETAIL}
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid item xs={12} className={styles.col}>
                  <Paper variant="outlined">
                    <List className={styles.switchList}>
                      <ListItem
                        className={styles.listGutter}
                        button
                        disabled={!isEditable}
                        onClick={handleSelection(checked)}
                      >
                        <ListItemIcon className={styles.switchItem}>
                          <Switch edge="end" checked={checked} disableRipple />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              style={{ wordBreak: "break-word" }}
                            >
                              {"Jira Ticket Setting"}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(handleUpdateClientProfile)}
                  id="updateClientInfo"
                >
                  <Grid item xs={12} className={styles.buttonCol}>
                    <div className={styles.grow} />
                    {!isEditable &&
                      featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !==
                      -1 && (
                        <MatButton onClick={handleEdit}>
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
                            (isUpdateCalled || !dirty) && !isSelectionChanged
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
          )}
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default JiraTicket;
