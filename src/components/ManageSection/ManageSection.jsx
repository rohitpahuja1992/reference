import React, { useState } from "react";

import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import MatButton from '../MaterialUi/MatButton';
import MaterialTextField from '../MaterialUi/MatTextField';

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
      fontWeight: 300
    },
    col: {
        padding: '10px'
    }
}));

const controls = [
    { value: 'form', label: 'Form', icon: '' },
    { value: 'question', label: 'Question', icon: '' },
    { value: 'table', label: 'Table', icon: '' },
    { value: 'section', label: 'Section', icon: '' }
];

const ManageSection = (props) => {
    const styles = useStyles();
    const [inputs, setInputs] = useState({
        sectionName: '',
        controlType: '',
        noOfCol: '',
        noOfRow: '',
        description: ''
    });
    const { sectionName, controlType, noOfCol, noOfRow, description } = inputs;

    let handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    return (
        <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="sm"
      >
          <DialogTitle className={styles.dialogTitle}>Add New Section</DialogTitle>
          <DialogContent dividers="true">
            <Grid container className={styles.row}>
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField required name="sectionName" label="Section Name" value={sectionName} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField required select label="Control Type" value={controlType} onChange={handleChange} name="controlType">
                        {controls.map((option,key) => (
                            <MenuItem key={key} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </MaterialTextField>
                </Grid>
                { controlType === 'table' && (
                    <>
                        <Grid item xs={6} className={styles.col}>
                            <MaterialTextField required type="number" name="noOfCol" label="Number of Column" value={noOfCol} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6} className={styles.col}>
                            <MaterialTextField required type="number" name="noOfRow" label="Number of Row" value={noOfRow} onChange={handleChange} />
                        </Grid>
                    </>
                )}
                
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField required multiline rows={4} name="description" label="Description" value={description} onChange={handleChange} />
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <MatButton color="primary" onClick={props.handleClose}>
                Cancel
            </MatButton>
            <MatButton onClick={props.handleClose}>
              Create Section
            </MatButton>
          </DialogActions>
      </Dialog>
    );
}

export default ManageSection;