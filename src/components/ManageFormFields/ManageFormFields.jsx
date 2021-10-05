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

const ManageFormFields = (props) => {
    const styles = useStyles();
    const [inputs, setInputs] = useState({
        fieldLabel: '',
        hidden: '',
        mandatory: '',
        disabled: '',
        locationPath: '',
        internalName: '',
        listCategory: '',
        dataStoreTag: '',
        mailMergeTag: '',
        messageConstant: '',
        description: ''
    });
    const { 
        fieldLabel, hidden, mandatory, disabled, locationPath, internalName, listCategory,
        dataStoreTag, mailMergeTag, messageConstant, description
    } = inputs;

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
        maxWidth="md"
      >
          <DialogTitle className={styles.dialogTitle}>Add New {props.formLabel}</DialogTitle>
          <DialogContent dividers="true">
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required name="fieldLabel" label={props.formLabel + " Name"} value={fieldLabel} onChange={handleChange} />
                </Grid>

                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required select label="Hidden" value={hidden} onChange={handleChange} name="hidden">
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </MaterialTextField>
                </Grid>

                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required select label="Mandatory" value={mandatory} onChange={handleChange} name="mandatory">
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </MaterialTextField>
                </Grid>

                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required select label="Disabled" value={disabled} onChange={handleChange} name="disabled">
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </MaterialTextField>
                </Grid>

                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required name="internalName" label="Internal Name" value={internalName} onChange={handleChange} />
                </Grid>

                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField required name="listCategory" label="List Category" value={listCategory} onChange={handleChange} />
                </Grid>

                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField required name="locationPath" label="Location Path" value={locationPath} onChange={handleChange} />
                </Grid>

                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField required name="dataStoreTag" label="Data Store Tag" value={dataStoreTag} onChange={handleChange} />
                </Grid>

                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField required name="mailMergeTag" label="Mail Merge Tag" value={mailMergeTag} onChange={handleChange} />
                </Grid>

                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField required name="messageConstant" label="Message Constant" value={messageConstant} onChange={handleChange} />
                </Grid>
                
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField required multiline rows={3} name="description" label="Description" value={description} onChange={handleChange} />
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <MatButton color="primary" onClick={props.handleClose}>
                Cancel
            </MatButton>
            <MatButton onClick={props.handleClose}>
              Create {props.formLabel}
            </MatButton>
          </DialogActions>
      </Dialog>
    );
}

export default ManageFormFields;