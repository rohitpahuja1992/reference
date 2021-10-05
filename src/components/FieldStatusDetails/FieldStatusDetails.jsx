import React from "react";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";

import MatCard from "../MaterialUi/MatCard";
import { formatDate } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  statusCard: {
    flex: 1,
    marginBottom: "16px",
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
    width: "140px",
  },
  approved: {
    background: "#00c853",
  },
  awatingSignOff: {
    background: theme.palette.warning.main,
  },
  signedOff: {
    background: theme.palette.primary.main,
  },
  validated:{
    background: "#800080",
  },
}));

const FieldStatusDetails = (props) => {
  const { clientControlData } = props;
  const styles = useStyles();
  const statusLabel = {
    AWAITING_SIGN_OFF: "Awaiting Sign-Off",
    SIGN_OFF: "Signed Off",
    APPROVED: "Approved",
    CONFIGURED: "Configured",
    VALIDATED: "Validated",
    RETRACT: "Awaiting Sign-Off",
    PRODUCT_REVIEW_NEEDED: "Review Needed",
    CLIENT_REVIEW_NEEDED: "Review Needed",
    CONFIG_REVIEW_NEEDED: "Review Needed"
  };

  const handleStatusClass = (status) => {
    if (status === "AWAITING_SIGN_OFF" || status === "RETRACT" || status === "PRODUCT_REVIEW_NEEDED"
       || status === "CLIENT_REVIEW_NEEDED" || status === "CONFIG_REVIEW_NEEDED") {
      return styles.awatingSignOff;
    } else if (status === "SIGN_OFF" || status === "APPROVED" || status === "CONFIGURED") {
      return styles.signedOff;
    }
    else if(status === "VALIDATED")
    return styles.validated;
     else {
      return styles.approved;
    }
  };

  const handleOobStatusClass = (status) => {
    if (status === "YES") {
      return styles.approved;
    } else {
      return styles.awatingSignOff;
    }
  };

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Status
          </Typography>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className={styles.highlightedCell}>Status:</TableCell>
              <TableCell size="small">
                {clientControlData.status ? (
                  <Chip
                    label={statusLabel[clientControlData.status]}
                    className={handleStatusClass(clientControlData.status)}
                    color="primary"
                  />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Set to Out-of-the-Box:
              </TableCell>
              <TableCell size="small">
                {clientControlData.oobChangeStatus ? (
                  <Chip
                    label={clientControlData.oobChangeStatus}
                    className={handleOobStatusClass(
                      clientControlData.oobChangeStatus
                    )}
                    color="primary"
                  />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Updated By:
              </TableCell>
              <TableCell>
                {clientControlData.updatedByUser
                  ? clientControlData.updatedByUser
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Updated At:
              </TableCell>
              <TableCell>
                {clientControlData.updatedDate
                  ? formatDate(clientControlData.updatedDate)
                  : "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MatCard>
  );
};

export default FieldStatusDetails;
