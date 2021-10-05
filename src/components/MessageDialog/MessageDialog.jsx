import React from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MatButton from "../MaterialUi/MatButton";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    paddingBottom: "10px",
    marginTop: "-13px",
    wordBreak: "break-word",
  },
}));

const MessageDialog = (props) => {
  const styles = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle className={styles.dialogTitle}>{props.title}</DialogTitle>
      <DialogContent>
        <Grid container className={styles.row}>
          <Grid item xs={12} className={styles.col}>
            {props.message}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {props.secondaryButtonLabel && (
          <MatButton
            color="primary"
            onClick={() => {
              props.handleClose();
              props.secondaryButtonAction();
            }}
          >
            {props.secondaryButtonLabel}
          </MatButton>
        )}
        {props.primaryButtonLabel && (
          <MatButton
            disabled={props.primaryButtonDisabled}
            onClick={() => {
              props.handleClose();
              props.primaryButtonAction();
            }}
          >
            {props.primaryButtonLabel}
          </MatButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
