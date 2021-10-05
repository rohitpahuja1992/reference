import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewNeededPopup from "../ReviewNeededPopup";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";

import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import { formatDate } from "../../utils/helpers";

import {
    fetchClientControlById,
    fetchClientControlAudit,
    changeSingleFieldStatus,
} from "../../actions/ClientModuleActions";

import { showMessageDialog } from "../../actions/MessageDialogActions";

import { RESET_CLIENT_CONTROL_STATUS_IS_DONE } from "../../utils/AppConstants";
import {
    CONFIRM, READY_TO_CONFIGURE, RETRY_CONFIRM,
    CONFIGURE_CONFIRM, PRODUCT_REVIEW_CONFIRM, CONFIG_REVIEW_CONFIRM,
    READY_TO_VALIDATE, VALIDATE_CONFIRM
} from "../../utils/Messages";
import { FIELD_REVIEW_ACTION, FIELD_APPROVE_ACTION, FIELD_MANUALLY_CONFIGURED_ACTION, FIELD_QA_PASSFAIL_ACTION } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
    statusCard: {
        flex: 1,
    },
    cardHeading: {
        paddingTop: "12px",
        paddingBottom: "10px",
    },
    cardHeadingSize: {
        fontSize: "18px",
    },
    highlightedCell: {
        fontWeight: 500,
        width: "100px",
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
    row: {
        padding: "0px 0 0",
    },
    grow: {
        flexGrow: 1,
    },
    buttonCol: {
        padding: "12px 8px",
        display: "flex",
    },
    button: {
        padding: '5px 15px',
        marginLeft: '2%',
        fontSize: '82%'
    }
}));

const FieldValidateDetails = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { controlId } = useParams();
    const [open, setOpen] = useState(false);
    const { isUpdated, fireOnUpdate, clientControlData, clientInfo } = props;
    const openProductReviewDialog = () => {
        setOpen(true);
    };

    const closeProductReviewDialog = useCallback(() => {
        fireOnUpdate(true);
        setOpen(false);
        //dispatch(resetDuplicateError());
    }, [fireOnUpdate]);
    const isStatusChanged = useSelector(
        (state) => state.ClientModule.clientControlById.isStatusChanged
    );
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );
    const loggedInUserData = useSelector(
        (state) => state.User.loggedInUser.details
    );
    const roles = loggedInUserData && loggedInUserData.roles.map(item => item.roleName);

    const configuredIndex = clientControlData.statusAudits?.findIndex(x => x.status === "VALIDATED")

    const temp = clientControlData.statusAudits?.length > 0 ? clientControlData.statusAudits?.map(item => item.status) : [];
    let result = []
    if (temp.length > 0 && temp.indexOf('RETRACTED') === -1)
        result = temp;
    else if (temp.length === 0 || temp.indexOf('RETRACTED') === 0)
        result = [];
    else
        result = temp.slice(0, temp.indexOf('RETRACTED'));

    const configureControl = () => {
        let fieldLabel = "";
        fireOnUpdate(true);
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: "",
            status: "CONFIGURED",
        };
        // if (clientControlData.control.type === "form") {
        //     fieldLabel = clientControlData.controlData.label
        //         ? clientControlData.controlData.label
        //         : "";
        // }
        dispatch(changeSingleFieldStatus(payload, "CONFIGURED", fieldLabel));
    };

    const validateControl = () => {
        let fieldLabel = "";
        fireOnUpdate(true);
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: "",
            status: "VALIDATED",
        };
        // if (clientControlData.control.type === "form") {
        //     fieldLabel = clientControlData.controlData.label
        //         ? clientControlData.controlData.label
        //         : "";
        // }
        dispatch(changeSingleFieldStatus(payload, "VALIDATED", fieldLabel));
    };

    const reviewApproval = () => {
        let fieldLabel = "";
        fireOnUpdate(true);
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: "",
            status: "PRODUCT_REVIEW_NEEDED",
        };
        dispatch(changeSingleFieldStatus(payload, "PRODUCT_REVIEW_NEEDED", fieldLabel));
    };

    const configReviewApproval = () => {
        let fieldLabel = "";
        fireOnUpdate(true);
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: "",
            status: "CONFIG_REVIEW_NEEDED",
        };
        // if (clientControlData.control.type === "form") {
        //     fieldLabel = clientControlData.controlData.label
        //         ? clientControlData.controlData.label
        //         : "";
        // }
        dispatch(changeSingleFieldStatus(payload, "CONFIG_REVIEW_NEEDED", fieldLabel));
    };

    const approveControl = (fromRetry) => {
        let fieldLabel = "";
        fireOnUpdate(true);
        let payload = {
            clientOobComponentDataId: clientControlData.id,
            comment: "",
            status: "APPROVED",
        };
        // if (clientControlData.control.type === "form") {
        //   fieldLabel = clientControlData.controlData.label
        //     ? clientControlData.controlData.label
        //     : "";
        // }
        dispatch(changeSingleFieldStatus(payload, "APPROVED", fieldLabel, fromRetry));
    };

    const confirmConfigureControl = () => {
        let messageObj = {
            primaryButtonLabel: "Configure",
            primaryButtonAction: () => {
                configureControl();
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: READY_TO_CONFIGURE,
            message: CONFIGURE_CONFIRM,
        };
        dispatch(showMessageDialog(messageObj));
    };

    const confirmRetryControl = () => {
        let messageObj = {
            primaryButtonLabel: "Retry",
            primaryButtonAction: () => {
                approveControl(true);
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: CONFIRM,
            message: RETRY_CONFIRM,
        };
        dispatch(showMessageDialog(messageObj));
    };

    const confirmReviewApproval = () => {
        let messageObj = {
            primaryButtonLabel: "Review Needed",
            primaryButtonAction: () => {
                reviewApproval();
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: CONFIRM,
            message: PRODUCT_REVIEW_CONFIRM,
        };
        dispatch(showMessageDialog(messageObj));
    };

    const confirmFailTest = () => {
        let messageObj = {
            primaryButtonLabel: "Review Needed",
            primaryButtonAction: () => {
                configReviewApproval();
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: CONFIRM,
            message: CONFIG_REVIEW_CONFIRM,
        };
        dispatch(showMessageDialog(messageObj));
    };

    const confirmPassTest = () => {
        let messageObj = {
            primaryButtonLabel: "Validate",
            primaryButtonAction: () => {
                validateControl();
            },
            secondaryButtonLabel: "Cancel",
            secondaryButtonAction: () => { },
            title: READY_TO_VALIDATE,
            message: VALIDATE_CONFIRM,
        };
        dispatch(showMessageDialog(messageObj));
    };

    useEffect(() => {
        if (isStatusChanged && isUpdated) {
            dispatch(fetchClientControlById(controlId));
            dispatch(fetchClientControlAudit(controlId));
            dispatch({ type: RESET_CLIENT_CONTROL_STATUS_IS_DONE });
            fireOnUpdate(false);
        }
    }, [dispatch, controlId, isStatusChanged, isUpdated, fireOnUpdate]);
    return (
        <>
            <MatCard className={styles.statusCard}>
                <CardHeader
                    className={styles.cardHeading}
                    title={
                        <Typography variant="h6" className={styles.cardHeadingSize}>
                            Validation
                        </Typography>
                    }
                />
                <Divider />
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={styles.highlightedCell}>
                                    Validated By:
                                </TableCell>
                                <TableCell>
                                    {(result.includes('VALIDATED')) &&
                                        configuredIndex !== -1 &&
                                        clientControlData.statusAudits[configuredIndex]?.statusInfo.updatedBy
                                        ? clientControlData.statusAudits[configuredIndex]?.statusInfo.updatedBy
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={styles.highlightedCell}>
                                    Validated At:
                                </TableCell>
                                <TableCell>
                                    {(result.includes('VALIDATED')) &&
                                        configuredIndex !== -1 &&
                                        clientControlData.statusAudits[configuredIndex]?.statusInfo.updateAt
                                        ? formatDate(clientControlData.statusAudits[configuredIndex]?.statusInfo.updateAt)
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {!(roles.length === 1 && roles[0] === 'Administrator') &&
                    !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1 &&
                    < Grid container className={styles.row}>
                        <Grid item xs={12} className={styles.buttonCol}>
                            < div className={styles.grow} />
                            {(roles.indexOf('Configuration User Access') !== -1 &&
                                (clientControlData.status === 'CONFIG_REVIEW_NEEDED' ||
                                    clientControlData.status === 'APPROVED')) &&
                                <>

                                    {result.indexOf('APPROVED') !== -1 && featuresAssigned.indexOf(FIELD_MANUALLY_CONFIGURED_ACTION) !== -1 && <MatButton className={styles.button} onClick={confirmConfigureControl}>Manually Configured</MatButton>}
                                    {featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 &&
                                        <MatButton className={styles.button} onClick={openProductReviewDialog}>Review Needed</MatButton>}
                                    {(result.indexOf('CONFIG_REVIEW_NEEDED') !== -1 && (clientControlData.statusFrom === 'CONFIGURED')) && <MatButton className={styles.button} onClick={confirmRetryControl}>Retry</MatButton>}
                                </>
                            }
                            {(roles.indexOf('QA User Access') !== -1 &&
                                clientControlData.status === 'CONFIGURED' && featuresAssigned.indexOf(FIELD_QA_PASSFAIL_ACTION) !== -1) &&
                                <>
                                    <MatButton className={styles.button} onClick={confirmFailTest}>Failed Testing</MatButton>
                                    <MatButton className={styles.button} onClick={confirmPassTest}>Passed Testing</MatButton>
                                </>
                            }
                        </Grid>
                    </Grid>
                }
            </MatCard >
            {/* {open && (
                <ReviewNeededPopup
                    clientControlData={clientControlData}
                    handleClose={closeProductReviewDialog}
                    status={"PRODUCT_REVIEW_NEEDED"}
                    open={open}
                />
            )} */}
        </>
    );
};

export default FieldValidateDetails;
