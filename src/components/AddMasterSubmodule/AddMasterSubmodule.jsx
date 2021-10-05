import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
//import MenuItem from '@material-ui/core/MenuItem';

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { CANCEL, DESCRIPTION, NO_OF_COL, NO_OF_ROW, SUBMOD_NAME } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
}));

// const controls = [
//     { value: 'form', label: 'Form', icon: '' },
//     { value: 'question', label: 'Question', icon: '' },
//     { value: 'table', label: 'Table', icon: '' },
//     { value: 'section', label: 'Section', icon: '' }
// ];

const AddMasterSubmodule = (props) => {
  const styles = useStyles();
  const [inputs, setInputs] = useState({
    submoduleName: "",
    controlType: "",
    noOfCol: "",
    noOfRow: "",
    description: "",
  });
  const { submoduleName, controlType, noOfCol, noOfRow, description } = inputs;

  let handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

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
        Add New Component
      </DialogTitle>
      <DialogContent dividers="true">
        <Grid container className={styles.row}>
          <Grid item xs={12} className={styles.col}>
            <MaterialTextField
              required
              name="submoduleName"
              label={SUBMOD_NAME}
              value={submoduleName}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={12} className={styles.col}>
                        <MaterialTextField required select label="Control Type" value={controlType} onChange={handleChange} name="controlType">
                            {controls.map((option, key) => (
                                <MenuItem key={key} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </MaterialTextField>
                    </Grid> */}
          {controlType === "table" && (
            <>
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  required
                  type="number"
                  name="noOfCol"
                  label={NO_OF_COL}
                  value={noOfCol}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  required
                  type="number"
                  name="noOfRow"
                  label={NO_OF_ROW}
                  value={noOfRow}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} className={styles.col}>
            <MaterialTextField
              required
              multiline
              rows={4}
              name="description"
              label={DESCRIPTION}
              value={description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={props.handleClose}>
          {CANCEL}
        </MatButton>
        <MatButton onClick={props.handleClose}>Create Component</MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddMasterSubmodule;
