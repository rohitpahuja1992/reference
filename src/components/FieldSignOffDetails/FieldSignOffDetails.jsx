import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import ReviewNeededPopup from "../ReviewNeededPopup";
import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import { formatDate } from "../../utils/helpers";

import {
  fetchClientControlById,
  fetchClientConfigControlById,
  fetchClientControlAudit,
  changeSingleFieldStatus,
} from "../../actions/ClientModuleActions";

import { showMessageDialog } from "../../actions/MessageDialogActions";

import { RESET_CLIENT_CONTROL_STATUS_IS_DONE } from "../../utils/AppConstants";
import {
  CONFIRM, READY_TO_SIGNOFF, RETRACT_CONFIRM,
  SIGN_OFF_CONFIRM, PRODUCT_REVIEW_CONFIRM
} from "../../utils/Messages";
import { FIELD_RETRACT_ACTION, FIELD_SIGN_OFF_ACTION, FIELD_REVIEW_ACTION } from "../../utils/FeatureConstants";

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

const FieldSignOffDetails = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { controlId } = useParams();
  const { isUpdated, fireOnUpdate, clientControlData, clientInfo } = props;
  const [open, setOpen] = useState(false);
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

  const openProductReviewDialog = () => {
    setOpen(true);
  };

  const closeProductReviewDialog = useCallback(() => {
    fireOnUpdate(true);
    setOpen(false);
    //dispatch(resetDuplicateError());
  }, [fireOnUpdate]);
  const signOffIndex = clientControlData.statusAudits?.findIndex(x => x.status === "SIGN_OFF");
  const temp = clientControlData.statusAudits?.length > 0 ? clientControlData.statusAudits?.map(item => item.status) : [];
  let result = []
  if (temp.length > 0 && temp.indexOf('RETRACTED') === -1)
    result = temp;
  else if (temp.length === 0 || temp.indexOf('RETRACTED') === 0)
    result = [];
  else
    result = temp.slice(0, temp.indexOf('RETRACTED'));

  const signOffControl = () => {
    let fieldLabel = "";
    fireOnUpdate(true);
    let payload = {
      clientOobComponentDataId: clientControlData.id,
      comment: "",
      status: "SIGN_OFF",
    };
    // if (clientControlData.control.type === "form") {
    //   fieldLabel = clientControlData.controlData.label
    //     ? clientControlData.controlData.label
    //     : "";
    // }
    dispatch(changeSingleFieldStatus(payload, "SIGN_OFF", fieldLabel));
  };

  const retractControl = () => {
    let fieldLabel = "";
    fireOnUpdate(true);
    let payload = {
      clientOobComponentDataId: clientControlData.id,
      comment: "",
      status: "RETRACT",
    };
    // if (clientControlData.control.type === "form") {
    //   fieldLabel = clientControlData.controlData.label
    //     ? clientControlData.controlData.label
    //     : "";
    // }
    dispatch(changeSingleFieldStatus(payload, "RETRACT", fieldLabel));
  };

  const reviewApproval = () => {
    let fieldLabel = "";
    fireOnUpdate(true);
    let payload = {
      clientOobComponentDataId: clientControlData.id,
      comment: "",
      status: "PRODUCT_REVIEW_NEEDED",
    };
    // if (clientControlData.control.type === "form") {
    //   fieldLabel = clientControlData.controlData.label
    //     ? clientControlData.controlData.label
    //     : "";
    // }
    dispatch(changeSingleFieldStatus(payload, "PRODUCT_REVIEW_NEEDED", fieldLabel));
  };

  const confirmSignOffControl = () => {
    let messageObj = {
      primaryButtonLabel: "Sign Off",
      primaryButtonAction: () => {
        signOffControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: READY_TO_SIGNOFF,
      message: SIGN_OFF_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const confirmRetractControl = () => {
    let messageObj = {
      primaryButtonLabel: "Retract",
      primaryButtonAction: () => {
        retractControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: RETRACT_CONFIRM,
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

  useEffect(() => {
    // console.log("isStatusChanged",isStatusChanged);
    // console.log("isUpdated",isUpdated);
    if (isStatusChanged && isUpdated) {

      if (clientControlData?.config) {
        dispatch(fetchClientConfigControlById(controlId));
      } else {
        dispatch(fetchClientControlById(controlId));
      }

      dispatch(fetchClientControlAudit(controlId));
      dispatch({ type: RESET_CLIENT_CONTROL_STATUS_IS_DONE });
      fireOnUpdate(false);
    }
  }, [dispatch, controlId, isStatusChanged, isUpdated, fireOnUpdate, clientControlData]);

  return (
    <>
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Sign Off
          </Typography>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Signed Off By:
              </TableCell>
              <TableCell>
                {result.includes('SIGN_OFF') &&
                  signOffIndex !== -1 &&
                  clientControlData.statusAudits[signOffIndex]?.statusInfo.updatedBy
                  ? clientControlData.statusAudits[signOffIndex]?.statusInfo.updatedBy
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Signed Off At:
              </TableCell>
              <TableCell>
                {result.includes('SIGN_OFF') &&
                  signOffIndex !== -1 &&
                  clientControlData.statusAudits[signOffIndex]?.statusInfo.updateAt
                  ? formatDate(clientControlData.statusAudits[signOffIndex]?.statusInfo.updateAt)
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
            {loggedInUserData.user_type !== 'MHK' &&
              featuresAssigned.indexOf(FIELD_RETRACT_ACTION) !== -1 &&
              !(clientControlData.status === "AWAITING_SIGN_OFF" || clientControlData.status === "RETRACT") &&
              < MatButton className={styles.button} onClick={confirmRetractControl}>Retract</MatButton>
            }
            {loggedInUserData.user_type !== 'MHK' && (clientControlData.status === "AWAITING_SIGN_OFF" || clientControlData.status === "RETRACT" || clientControlData.status === 'CLIENT_REVIEW_NEEDED') &&
              <>
                {featuresAssigned.indexOf(FIELD_SIGN_OFF_ACTION) !== -1 &&
                  < MatButton className={styles.button} onClick={confirmSignOffControl}>Sign Off</MatButton>}
                {featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 &&
                  < MatButton className={styles.button} onClick={openProductReviewDialog}>Review Needed</MatButton>}
              </>
            }
            {/* {(clientControlData.status === "AWAITING_SIGN_OFF" ||
            clientControlData.status === "RETRACT") && featuresAssigned.indexOf(FIELD_SIGN_OFF_ACTION) !== -1 && (
              <MatButton onClick={confirmSignOffControl}>Sign Off</MatButton>
            )}

          {clientControlData.status === "SIGN_OFF" && featuresAssigned.indexOf(FIELD_RETRACT_ACTION) !== -1 && (
            <MatButton onClick={confirmRetractControl}>Retract</MatButton>
          )} */}
          </Grid>
        </Grid>
      }
    </MatCard >
    {open && (
      <ReviewNeededPopup
        clientControlData={clientControlData}
        handleClose={closeProductReviewDialog}
        status={"PRODUCT_REVIEW_NEEDED"}
        open={open}
      />
    )}
    </>
  );
};

export default FieldSignOffDetails;
