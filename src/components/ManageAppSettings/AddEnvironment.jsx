import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import MatButton from '../MaterialUi/MatButton';
import MaterialTextField from '../MaterialUi/MatTextField';
//import MatInputField from "../MaterialUi/MatInputField";

import { addEnvironment } from "../../actions/EnvironmentActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import {
    handleAddEnvironmentError, ENVIRONMENT_MANDATORY_MSG,
    VALID_ENVIRONMENT_NAME_MSG, MAXIMUN_CHARACTER_ALLOWED_MSG, ENVIRONMENT_ALREADY_EXIST_MSG, ADD_NEW_ENV, ADD_ENV, CANCEL
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300
    },
    col: {
        padding: '10px'
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: 'none !important',
        color: '#ffffff',
        padding: '12px 16px',
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

const AddEnvironment = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { register, handleSubmit, watch, setError, clearError, errors } = useForm({ mode: 'onBlur' });;
    //const environmentDetailsList = useSelector((state) => state.Environment.environmentDetailsList);
    const addApiError = useSelector(state => state.Environment.addError);
    const isEnvironmentAdded = useSelector(state => state.Environment.isEnvironmentAdded);
    //const [prevList, setPrevList] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    const [apiError, setApiError] = useState(null);


    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        setApiError(null);
        clearError();
        props.handleClose();
    }, [props, clearError]);

    useEffect(() => {

        if (!!addApiError) {
            setIsSubmited(false);
            setApiError(handleAddEnvironmentError(addApiError));
        }

        if (addApiError.responseCode && addApiError.responseCode === "2161") {
            setIsSubmited(false);
            setApiError(null);
            setError("environment", "notMatch", ENVIRONMENT_ALREADY_EXIST_MSG);
        }

        if (isEnvironmentAdded) {
            handleCloseForm();
            // dispatch(fetchEnvironment());
            // setIsSubmited(false);
            // props.handleClose();
        }

        // if (environmentDetailsList.list.length > prevList.length) {
        //     setPrevList(environmentDetailsList.list);
        //     setApiError(null);
        //     setIsSubmited(false);
        //     props.handleClose();
        // }
    },
        [addApiError, handleCloseForm, isEnvironmentAdded, setError]
    );

    const handleChange = () => {
        setApiError(null);
    }

    const handleCreateEnvironment = () => {
        setIsSubmited(true);
        const watchEnvironment = watch("environment");
        dispatch(addEnvironment(watchEnvironment));
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
            <DialogTitle className={styles.dialogTitle}>{ADD_NEW_ENV}</DialogTitle>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(handleCreateEnvironment)}>
                <DialogContent dividers="true">
                    <Grid container className={styles.row}>
                        {apiError ?
                            <Grid item xs={12} className={styles.col}>
                                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                                    <Typography variant="body2">{apiError.message}</Typography>
                                </Card>
                            </Grid>
                            : null}
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: { value: true, message: ENVIRONMENT_MANDATORY_MSG },
                                    pattern: {
                                        value: NAME_PATTERN,
                                        message: VALID_ENVIRONMENT_NAME_MSG,
                                    },
                                    maxLength: { value: 50, message: MAXIMUN_CHARACTER_ALLOWED_MSG }
                                })}
                                error={errors.environment ? true : false}
                                helperText={errors.environment?.message}
                                required
                                label="Environment"
                                name="environment"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        {CANCEL}
                    </MatButton>
                    <MatButton type="submit" disabled={isSubmited}>
                        {ADD_ENV}
                    </MatButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddEnvironment;