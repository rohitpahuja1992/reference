import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { fetchOOBSubmodulesByOOBModuleId } from "../../actions/OOBSubmoduleActions";
import MatButton from "../../components/MaterialUi/MatButton";
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import { fetchOOBModuleById, updateOOBModule } from '../../actions/OOBModuleActions';
import { RESET_ERROR } from "../../utils/AppConstants";
import { CANCEL, handleUpdateVersionLabelError, LABEL_VERSION, MAX_4000_CHAR_ALLOWED, PLEASE_ACKN } from "../../utils/Messages";
import { showMessageDialog } from "../../actions/MessageDialogActions";
const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    label: {
        margin: '0px'
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
        marginBottom: '14px'
    },
}));

const UpdateVersionLabel = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { moduleId, versionId } = useParams();
    const { register, handleSubmit, watch, clearError, errors } = useForm({ mode: 'onBlur' });
    //const [isSubmited, setIsSubmited] = useState(false);
    //const [isSelectionChanged, setSelectionChanged] = useState(false);
    const putApiError = useSelector((state) => state.OOBModule.putError);
    const [apiError, setApiError] = useState(null);
    const isModuleUpdated = useSelector((state) => state.OOBModule.isModuleUpdated);
    const OOBModuleById = useSelector((state) => state.OOBModule.OOBModuleById.data);
    let OOBSubmoduleList = useSelector((state) =>
    state.OOBSubmodule.getSubmodules.data)
    console.log("OOBSubmoduleLsist",OOBSubmoduleList)
    OOBSubmoduleList = OOBSubmoduleList.filter(a => a.oobControlDataCount === 0).map(b => b.systemTable ? b.systemTable.tableLabel : b.component.componentName)
    // const [inputs, setInputs] = useState({
    //     submoduleName: "",
    //     controlType: "",
    //     noOfCol: "",
    //     noOfRow: "",
    //     description: "",
    // });
    // const { submoduleName, controlType, noOfCol, noOfRow, description } = inputs;

    const handleCloseForm = useCallback(() => {
        clearError();
        dispatch({ type: RESET_ERROR });
        props.handleClose();
    }, [props, dispatch, clearError]);

    let handleChange = (e) => {
        dispatch({ type: RESET_ERROR });

    }


    useEffect(() => {
        if (isModuleUpdated) {
            handleCloseForm();
            dispatch(fetchOOBModuleById(OOBModuleById.module.id));
            dispatch({ type: RESET_ERROR });
        }
    },
        [dispatch, handleCloseForm, isModuleUpdated, OOBModuleById]
    );
    const OOBSubmoduleBlankListMessage = "You are attempting to set labeled version, some components doesn't have any records.\
     Do you want to proceed ?"
    
    const handleCreateModule = () => {
        if(OOBSubmoduleList.length>0) {
        let messageObj = {
            primaryButtonLabel: "Yes",
            primaryButtonAction: () => {
                dispatch(updateOOBModule(OOBModuleById.module.id, props.data.version, watch("description")));
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: PLEASE_ACKN,
            message: OOBSubmoduleBlankListMessage,
          };
          dispatch(showMessageDialog(messageObj));
        }
        else {
            dispatch(updateOOBModule(OOBModuleById.module.id, props.data.version, watch("description")));
        }
    }

    useEffect(() => {
        if (putApiError)
            setApiError(handleUpdateVersionLabelError(putApiError));
        else
            setApiError(false);
    },
        [putApiError]
    );
    useEffect(() => {
        dispatch(fetchOOBSubmodulesByOOBModuleId(moduleId, versionId));
    },
        []
    );

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle className={styles.dialogTitle}>{OOBModuleById.module.moduleName}({props.data.version})</DialogTitle>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(handleCreateModule)}>
                <DialogContent dividers="true">
                    {apiError ?
                        <Grid item xs={12} className={styles.col}>
                            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                                <Typography variant="body2">
                                    {apiError.message}
                                </Typography>
                            </Card>
                        </Grid>
                        : null}
                    <Grid>
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({ maxLength: { value: 4000, message: MAX_4000_CHAR_ALLOWED } })}
                                //({ required: { value: true, message: "Description is Mandatory" }, minLength: { value: 5, message: "Minimum 5 characters" } })
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                                onChange={handleChange}
                                //required 
                                multiline rows={4}
                                name="description" label="Comment"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        {CANCEL}
                    </MatButton>
                    <MatButton type="submit">
                        {LABEL_VERSION}
                    </MatButton>
                </DialogActions>
            </form>
        </Dialog >
    );
};

export default UpdateVersionLabel;
