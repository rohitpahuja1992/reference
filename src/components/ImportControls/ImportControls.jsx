import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Switch from "@material-ui/core/Switch";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
// import MaterialTextField from "../MaterialUi/MatTextField";

import { ImportControl } from "../../actions/ControlActions";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
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

const ImportControls = (props) => {
  const { handleClose, open } = props;
  const styles = useStyles();
  const dispatch = useDispatch();
  const oobControlData = useSelector((state) => state.OobControl.data);
  const controlList = useSelector((state) => state.Control.data.list);
  //const oobControlList = useSelector((state) => state.OobControl.data.list);
  const controlFieldList = useSelector((state) => state.ControlGroup.data.list);
  const [checked, setChecked] = useState([]);

  const handleControlSelection = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleImport = () => {
    let selectedControls = checked.map((controlId) => {
      let controlData = controlList.filter(
        (control) => control.id === controlId
      );
      return controlData[0];
    });
    let filteredField = checked.reduce((fieldList, controlId) => {
      let fieldData = controlFieldList.filter(
        (field) => field.controlId === controlId
      );
      fieldList = [...fieldList, ...fieldData];
      return fieldList;
    }, []);

    dispatch(ImportControl(selectedControls, filteredField));
  };

  useEffect(() => {
    if (oobControlData.isFetchDone) {
      handleClose();
    }
  }, [oobControlData.isFetchDone, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle className={styles.dialogTitle}>
        Import from Master Controls
      </DialogTitle>
      <DialogContent dividers="true">
        <Grid container className={styles.row}>
          {controlList.map((control) => (
            <Grid item xs={6} className={styles.col}>
              <Paper variant="outlined">
                <List className={styles.switchList}>
                  <ListItem
                    className={styles.listGutter}
                    button
                    onClick={handleControlSelection(control.id)}
                  >
                    <ListItemIcon className={styles.switchItem}>
                      <Switch
                        edge="end"
                        // onChange={handleToggle('wifi')}
                        checked={checked.indexOf(control.id) !== -1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          style={{ wordBreak: "break-word" }}
                        >
                          {control.name}
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
        <MatButton color="primary" onClick={handleClose}>
          Cancel
        </MatButton>
        <MatButton onClick={handleImport}>Import Controls</MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default ImportControls;
