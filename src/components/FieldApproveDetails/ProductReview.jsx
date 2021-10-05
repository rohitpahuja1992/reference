import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
    changeSingleFieldStatus,
} from "../../actions/ClientModuleActions";
import {
    REVIEW_DIALOG_TITLE, handleAddMasterSubmoduleError, QUEUE_MANDATORY,
    MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, SUB_NAME_EXIST,
    SUB_NAME_MANDATORY
} from "../../utils/Messages";
//import { NAME_PATTERN } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: '14px'
    },
    warningCard: {
        background: theme.palette.warning.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: "14px",
    },
}));

const QUEUE_LIST = [
    { id: 'Client', value: 'Client Review Needed Queue' },
    { id: 'Config', value: 'Config Review Needed Queue' }
]

const ProductReview = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearError,
        errors,
    } = useForm({ mode: "onBlur" });
    const { clientControlData } = props;
    const [isSubmited, setIsSubmited] = useState(false);
    //const [isSelectionChanged, setSelectionChanged] = useState(false);
    const isSubmoduleAdded = useSelector(
        (state) => state.MasterSubmodule.isSubmoduleAdded
    );
    const [apiError, setApiError] = useState(null);
    const isStatusChanged = useSelector(
        (state) => state.ClientModule.clientControlById.isStatusChanged
      );
    const addApiError = useSelector((state) => state.MasterSubmodule.addError);
    const [inputs, setInputs] = useState({
        queue: "",
        comment: ""
    });
    const { queue, comment } = inputs;

    let handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    };

    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        clearError();
        props.handleClose();
    }, [props, clearError]);

    // let handleChange = (e) => {
    //     dispatch(resetDuplicateError());
    //     setApiError(false);
    //     //setSelectionChanged(true);
    // };

    useEffect(() => {
        if (isSubmited && isStatusChanged) {
            handleCloseForm();
            //dispatch(resetDuplicateError());
        }
    }, [handleCloseForm,isStatusChanged,isSubmited]);

    useEffect(() => {
        if (queue !== "") {
            setValue("queue", queue);
            clearError("queue");
        } else {
            register(
                { name: "queue" },
                {
                    required: { value: true, message: QUEUE_MANDATORY },
                }
            );
        }
    }, [queue, register, setValue, clearError]);

    const handleCreateSubmodule = () => {
        setIsSubmited(true);
        let fieldLabel = "";
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: comment,
            status: (queue === 'Client' ? "CLIENT_REVIEW_NEEDED" : 'CONFIG_REVIEW_NEEDED'),
        };
        // if (clientControlData.control.type === "form") {
        //     fieldLabel = clientControlData.controlData.label
        //         ? clientControlData.controlData.label
        //         : "";
        // }
        dispatch(changeSingleFieldStatus(payload, payload.status, fieldLabel));
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
                {REVIEW_DIALOG_TITLE}
            </DialogTitle>
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(handleCreateSubmodule)}
            >
                <DialogContent dividers="true">
                    {apiError ? (
                        <Grid item xs={12} className={styles.col}>
                            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                                <Typography variant="body2">{apiError.message}</Typography>
                            </Card>
                        </Grid>
                    ) : null}
                    <Grid container className={styles.row}>
                        <Grid item xs={12} className={styles.col}>
                            <MatFormControl required error={errors.queue ? true : false}
                                variant="filled" size="small">
                                <InputLabel>Queue</InputLabel>
                                <MatSelect
                                    required
                                    name="queue"
                                    onChange={handleChange}>
                                    {QUEUE_LIST.map((option, key) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                                <FormHelperText>{errors.queue ? errors.queue.message : " "}</FormHelperText>
                            </MatFormControl>
                        </Grid>
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    maxLength: {
                                        value: 4000,
                                        message: MAX_4000_CHAR_ALLOWED,
                                    },
                                })}
                                //({ required: { value: true, message: "Description is Mandatory" }, minLength: { value: 5, message: "Minimum 5 characters" } })
                                error={errors.comment ? true : false}
                                helperText={errors.comment?.message}
                                onChange={handleChange}
                                //required
                                multiline
                                rows={4}
                                name="comment"
                                label="Comment"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        Cancel
          </MatButton>
                    <MatButton type="submit" disabled={isSubmited}>
                        Save
          </MatButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductReview;
