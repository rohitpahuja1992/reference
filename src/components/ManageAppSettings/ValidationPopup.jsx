import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    statusActive: {
        background: "#00c853",
      },
      statusInactive: {
        background: theme.palette.warning.main,
      },
      statusTerminated: {
        background: theme.palette.error.main,
    },
}));
const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

const ValidationPopup = (props) => {
    const styles = useStyles();

    const handleCloseForm = useCallback(() => {
        props.handleClose();
    }, [props,]);

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className={styles.dialogTitle} onClose={handleCloseForm}>
                Error
            </DialogTitle>

            <DialogContent dividers="true">
                {props.errorData}
            </DialogContent>
        </Dialog>
    );
};

export default ValidationPopup;
