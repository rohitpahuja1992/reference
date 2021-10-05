import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
//import Typography from '@material-ui/core/Typography';
//import Card from '@material-ui/core/Card';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import MatButton from '../MaterialUi/MatButton';
import MaterialTextField from '../MaterialUi/MatTextField';
//import MatInputField from "../MaterialUi/MatInputField";

import { addCategories } from "../../actions/CategoriesActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { CAT_ALREADY_EXIST, CAT_MANDATORY, ENTER_VALID_CAT, MAXIMUN_CHARACTER_ALLOWED_MSG } from "../../utils/Messages";

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
    }
}));

const AddCategory = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { register, handleSubmit, watch, setError, clearError, errors } = useForm({ mode: 'onBlur' });;
    //const categoriesDetailsList = useSelector((state) => state.Categories.categoriesDetailsList);
    const addApiError = useSelector(state => state.Categories.addError);
    const isCategoryAdded = useSelector(state => state.Categories.isCategoryAdded);
    //const [prevList, setPrevList] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    //const [apiError, setApiError] = useState(null);


    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        //setApiError(null);
        clearError();
        props.handleClose();
    }, [props, clearError]);

    useEffect(() => {

        if (!!addApiError) {
            setIsSubmited(false);
            //setApiError(true);
        }

        if (addApiError.responseMessage && addApiError.responseMessage.includes("Duplicate")) {
            setIsSubmited(false);
            //setApiError(null);
            setError("categories", "notMatch", CAT_ALREADY_EXIST);
        }

        if (isCategoryAdded) {
            handleCloseForm();
            // dispatch(fetchCategories());
            // setIsSubmited(false);
            // props.handleClose();
        }

        // if (categoriesDetailsList.list.length > prevList.length) {
        //     setPrevList(categoriesDetailsList.list);
        //     setApiError(null);
        //     setIsSubmited(false);
        //     props.handleClose();
        // }
    },
        [addApiError, handleCloseForm, isCategoryAdded, setError]
    );

    const handleCreateCategory = () => {
        setIsSubmited(true);
        const watchCategories = watch("categories");
        dispatch(addCategories(watchCategories));
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
            <DialogTitle className={styles.dialogTitle}>Add New Category</DialogTitle>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(handleCreateCategory)}>
                <DialogContent dividers="true">
                    <Grid container className={styles.row}>
                        {/* {apiError ?
                            <Grid item xs={12} className={styles.col}>
                                <Card className={styles.errorCard}>
                                    <Typography variant="body2">OOPS! Something went wrong. Please try again.</Typography>
                                </Card>
                            </Grid>
                            : null} */}
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: { value: true, message: CAT_MANDATORY },
                                    pattern: {
                                        value: NAME_PATTERN,
                                        message: ENTER_VALID_CAT,
                                    },
                                    maxLength: { value: 50, message: MAXIMUN_CHARACTER_ALLOWED_MSG }
                                })}
                                error={errors.categories ? true : false}
                                helperText={errors.categories?.message}
                                required
                                label="Category"
                                name="categories"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        Cancel
            </MatButton>
                    <MatButton type="submit" disabled={isSubmited}>
                        Add Category
            </MatButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddCategory;