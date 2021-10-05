import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { addMasterSection, resetDuplicateError } from '../../actions/MasterSectionActions';
import { NAME_PATTERN } from "../../utils/AppConstants";
import { ADD_SEC, CANCEL, COMMON_ERROR_MESSAGE, ENTER_VALID_SEC, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, SEC_NAME, SEL_NAME_ALREADY_EXIST, SEL_NAME_MANADTORY } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: 'none !important',
        color: '#ffffff',
        padding: '12px 16px',
        //marginBottom: '14px'
    },
}));

const AddMasterSection = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { register, handleSubmit, watch, setError, clearError, errors } = useForm({ mode: 'onBlur' });
    const [isSubmited, setIsSubmited] = useState(false);
    //const [isSelectionChanged, setSelectionChanged] = useState(false);
    const isSectionAdded = useSelector(state => state.MasterSection.isSectionAdded);
    const [apiError, setApiError] = useState(null);
    const addApiError = useSelector(state => state.MasterSection.addError);

    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        clearError();
        props.handleClose();
    }, [props, clearError]);

    let handleChange = (e) => {
        dispatch(resetDuplicateError());
        setApiError(false);
        //setSelectionChanged(true);
    }

    useEffect(() => {
        if (!!addApiError) {
            setIsSubmited(false);
        }

        if (addApiError && !(addApiError.responseCode === "201" || addApiError.responseCode === 201)) {
            setApiError(true);
        }
        if (addApiError.responseMessage && addApiError.responseMessage.includes("Section name") && addApiError.responseMessage.includes("exist")) {
            setIsSubmited(false);
            setApiError(false);
            setError("sectionName", "notMatch", SEL_NAME_ALREADY_EXIST);
        }

        if (isSectionAdded) {
            handleCloseForm();
            dispatch(resetDuplicateError());
        }

    },
        [dispatch, addApiError, setError, isSectionAdded, handleCloseForm]
    );

    const handleCreateSection = () => {
        setIsSubmited(true);
        const watchAllFields = watch();
        dispatch(addMasterSection(watchAllFields));
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
            <form noValidate autoComplete="off" onSubmit={handleSubmit(handleCreateSection)}>
                <DialogContent dividers="true">
                    {apiError ?
                        <Grid item xs={12} className={styles.col}>
                            <Card className={styles.errorCard}>
                                <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
                            </Card>
                        </Grid>
                        : null}
                    <Grid container className={styles.row}>
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField inputRef={register({ required: { value: true, message: SEL_NAME_MANADTORY }, pattern: { value: NAME_PATTERN, message: ENTER_VALID_SEC }, maxLength: { value: 50, message: MAXIMUN_CHARACTER_ALLOWED_MSG } })}
                                error={errors.sectionName ? true : false}
                                helperText={errors.sectionName?.message}
                                onChange={handleChange}
                                required name="sectionName" label={SEC_NAME}
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({ maxLength: { value: 4000, message: MAX_4000_CHAR_ALLOWED } })}
                                //({ required: { value: true, message: "Description is Mandatory" }, minLength: { value: 5, message: "Minimum 5 characters" } })
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                                onChange={handleChange}
                                //required 
                                multiline rows={4}
                                name="description" label="Description"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        {CANCEL}
                </MatButton>
                    <MatButton type="submit" disabled={isSubmited}>
                        {ADD_SEC}
                </MatButton>
                </DialogActions>
            </form>
        </Dialog >
    );
};

export default AddMasterSection;