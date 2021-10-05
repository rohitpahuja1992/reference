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
import {
  CREATED_BY,
  FEATURE_STATUS,
  UPDATED_BY,
  UPDATED_AT,
  CREATED_AT,
} from "../../utils/Messages";
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
    width: "80px",
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
  

}));

const FeatureStatusDetails = (props) => {
  const styles = useStyles();

  const handleUserStatusClass = (status) => {
    if (status === "TERMINATED") {
      return styles.statusTerminated;
    } else if (status === "INACTIVE") {
      return styles.statusInactive;
    } else {
      return styles.statusActive;
    }
  };

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {FEATURE_STATUS}
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
                <Chip
                  label={props.details.featureStatus}
                  className={handleUserStatusClass(props.details.featureStatus)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {UPDATED_BY}
              </TableCell>
              <TableCell>{props.details.updatedByUser}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {UPDATED_AT}
              </TableCell>
              <TableCell>{formatDate(props.details.updatedDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {CREATED_BY}
              </TableCell>
              <TableCell>{props.details.createdByUser}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {CREATED_AT}
              </TableCell>
              <TableCell>{formatDate(props.details.createdDate)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MatCard>
  );
};

export default FeatureStatusDetails;
