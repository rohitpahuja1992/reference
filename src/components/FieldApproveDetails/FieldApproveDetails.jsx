import React, { useEffect, useState, useCallback } from "react";
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

import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import { formatDate } from "../../utils/helpers";
import ProductReview from "./ProductReview";

import {
  fetchClientControlById,
  fetchClientControlAudit,
  changeSingleFieldStatus,
} from "../../actions/ClientModuleActions";

import { showMessageDialog } from "../../actions/MessageDialogActions";

import { RESET_CLIENT_CONTROL_STATUS_IS_DONE } from "../../utils/AppConstants";
import { READY_TO_APROV, PLEASE_CLICK_APROVE } from "../../utils/Messages";
import { FIELD_APPROVE_ACTION,FIELD_REVIEW_ACTION } from "../../utils/FeatureConstants";

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

const FieldApproveDetails = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { controlId } = useParams();
  const { isUpdated, fireOnUpdate, clientControlData, userType, clientInfo } = props;
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

  const approvedIndex = clientControlData.statusAudits?.findIndex(x => x.status === "APPROVED");
  const temp = clientControlData.statusAudits?.length > 0 ? clientControlData.statusAudits?.map(item => item.status) : [];
  let result = []
  if (temp.length > 0 && temp.indexOf('RETRACTED') === -1)
    result = temp;
  else if (temp.length === 0 || temp.indexOf('RETRACTED') === 0)
    result = [];
  else
    result = temp.slice(0, temp.indexOf('RETRACTED'));

  const approveControl = () => {
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
    dispatch(changeSingleFieldStatus(payload, "APPROVED", fieldLabel));
  };

  const confirmApproveControl = () => {
    let messageObj = {
      primaryButtonLabel: "Approve",
      primaryButtonAction: () => {
        approveControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: READY_TO_APROV,
      message: PLEASE_CLICK_APROVE,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openProductReviewDialog = () => {
    setOpen(true);
  };

  const closeProductReviewDialog = useCallback(() => {
    fireOnUpdate(true);
    setOpen(false);
    //dispatch(resetDuplicateError());
  }, [fireOnUpdate]);


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
              Approve
          </Typography>
          }
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.highlightedCell}>
                  Approved By:
              </TableCell>
                <TableCell>
                  {result.includes('APPROVED') &&
                    approvedIndex !== -1 &&
                    clientControlData.statusAudits[approvedIndex]?.statusInfo.updatedBy
                    ? clientControlData.statusAudits[approvedIndex]?.statusInfo.updatedBy
                    : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.highlightedCell}>
                  Approved At:
              </TableCell>
                <TableCell>
                  {result.includes('APPROVED') &&
                    approvedIndex !== -1 &&
                    clientControlData.statusAudits[approvedIndex]?.statusInfo.updateAt
                    ? formatDate(clientControlData.statusAudits[approvedIndex]?.statusInfo.updateAt)
                    : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {!(roles.length === 1 && roles[0] === 'Administrator') &&
        !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1 &&
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.buttonCol}>
              <div className={styles.grow} />
              {(roles.indexOf('Product User Access') !== -1 &&
                (clientControlData.status === 'PRODUCT_REVIEW_NEEDED' ||
                  clientControlData.status === 'SIGN_OFF')) &&
                <>
                  {featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 &&
                    <MatButton className={styles.button} onClick={openProductReviewDialog}>Review Needed</MatButton>
                  }
                  {result.indexOf('SIGN_OFF') !== -1 && featuresAssigned.indexOf(FIELD_APPROVE_ACTION) !== -1 &&  <MatButton className={styles.button} onClick={confirmApproveControl}>Approve</MatButton>}
                </>
              }
            </Grid>
          </Grid>
        }
      </MatCard>
      {open && (
        <ProductReview
          clientControlData={clientControlData}
          handleClose={closeProductReviewDialog}
          open={open}
        />
      )}
    </>
  );
};

export default FieldApproveDetails;
