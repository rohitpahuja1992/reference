/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { fetchControlPropertyList, fetchClientControlPropertyList } from "../../actions/MasterMessageActions";

// import MenuItem from "@material-ui/core/MenuItem";
import { updateOobControlToggle } from "../../actions/MasterMessageActions";

import MatButton from "../../components/MaterialUi/MatButton";

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
    //marginBottom: '14px'
  },

  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
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
}));

const SetOthers = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { moduleId, versionId, clientId, version } = useParams();
  const {
    //register,
    handleSubmit,
    // watch,
    // setError,
    // setValue,
    // clearError,
    //errors,
  } = useForm({ mode: "onBlur" });

  const isToggleUpdated = useSelector(
    (state) => state.MasterMessage.isToggleUpdated
  );

  const [othersData, setOthersData] = useState({
    propertyValue: JSON.parse(props.data.propertyValue),
    id: props.data.id,
    timeZone:
      props.data.timeZone === null ? null : props.data.timeZone.split(","),
    toggled: props.data.toggled,
  });

  const { id, propertyValue, timeZone } = othersData;
  const [checked, setChecked] = useState(timeZone !== null ? timeZone.map((item) => item) : []);

  const handleSelection = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCloseForm = useCallback(() => {
    props.handleClose();
  }, [props]);

  const handleSave = () => {
    let objData = {
      id: id,
      timeZone: [...checked].toString(),
      toggled: true,
    };
    dispatch(updateOobControlToggle(objData, props.openFrom));
  };

  useEffect(() => {
    if (isToggleUpdated) {
      props.handleClose();
      if (props.openFrom === 'Client')
        dispatch(fetchClientControlPropertyList(moduleId, version, clientId));
      else
        dispatch(fetchControlPropertyList(moduleId, versionId));
    }
  }, [dispatch, moduleId, versionId, clientId, version, isToggleUpdated, props]);

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
        {props.data.description}
      </DialogTitle>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(handleSave)}>
        <DialogContent dividers="true">
          {/* {apiError ? (
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
          ) : null} */}
          <Grid container className={styles.row}>
            {propertyValue
              .filter((item) => item.label === "Other")
              .map((item) => (
                <Grid item xs={12} className={styles.col}>
                  <Paper variant="outlined">
                    <List className={styles.switchList}>
                      <ListItem className={styles.listGutter} button>
                        <ListItemIcon className={styles.switchItem}>
                          <Switch
                            edge="end"
                            //   checked={
                            //     timeZone !==null? timeZone[item.otherLabel]
                            //       ? true
                            //       : false
                            //       :false
                            //   }
                            checked={
                              checked && checked.indexOf(item.otherLabel) !== -1
                            }
                            disableRipple
                            onClick={handleSelection(item.otherLabel)}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              style={{ wordBreak: "break-word" }}
                            >
                              {item.otherLabel}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          <MatButton type="submit">Save</MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SetOthers;
