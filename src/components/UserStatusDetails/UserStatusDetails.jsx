import React from "react";
import { useSelector } from "react-redux";

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
  UPDATED_AT,
  UPDATED_BY,
  CREATED_AT,
  STATUS_1,
  LAST_ACTIVE,
} from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
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
}));

const UserStatusDetails = (props) => {
  const styles = useStyles();
  const loggedInUser = useSelector((state) => state.User.loggedInUser.details);

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
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {loggedInUser.user_type === "MHK" ? "User Status" : "Status"}
          </Typography>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {STATUS_1}
              </TableCell>
              <TableCell size="small">
                <Chip
                  label={props.details.status}
                  className={handleUserStatusClass(props.details.status)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                {LAST_ACTIVE}
              </TableCell>
              <TableCell>{formatDate(props.details.last_login_time)}</TableCell>
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

export default UserStatusDetails;
