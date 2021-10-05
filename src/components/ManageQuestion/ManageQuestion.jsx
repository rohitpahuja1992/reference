import React, { useState } from "react";

import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

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

const ManageQuestion = (props) => {
    const styles = useStyles();
    const [inputs, setInputs] = useState({
        question: '',
        description: ''
    });
    const { question, description } = inputs;

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
          <DialogTitle className={styles.dialogTitle}>Add New Question</DialogTitle>
          <DialogContent dividers="true">
            <Grid container className={styles.row}>
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField required multiline rows={4} name="question" label="Question" value={question} onChange={handleChange} />
                </Grid>
                
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
              Create Question
            </MatButton>
          </DialogActions>
      </Dialog>
    );
}

export default ManageQuestion;