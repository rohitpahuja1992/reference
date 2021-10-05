import React from "react";
import EnvironmentStatus from "../../layouts/IndividualClientConfig/EnvironmentStatus";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles, FormHelperText } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MatButton from "../../components/MaterialUi/MatButton";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    }
}));

const EnvironmentStatusPopup = (props) => {
    const styles = useStyles();
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle className={styles.dialogTitle}>
                Review Config Comparison
      </DialogTitle>
                <DialogContent dividers="true">
                <EnvironmentStatus popupid={props.id} openFrom="environmentPopup" />
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={props.handleClose}>
                        Cancel
                    </MatButton>
                </DialogActions>
        </Dialog>
    );
};

export default EnvironmentStatusPopup;
