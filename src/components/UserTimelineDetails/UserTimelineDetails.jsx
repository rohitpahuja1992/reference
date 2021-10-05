import React from "react";
//import { useSelector } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";

import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import MatCard from "../MaterialUi/MatCard";

import {
  formatTimelineDate,
  formatTimelineTime,
  formatTimelineData,
} from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: "16px",
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  timelineItem: {
    minHeight: "40px",
    "&::before": {
      display: "none",
    },
  },
  paper: {
    padding: "8px 10px",
    boxShadow: "none",
    background: theme.palette.action.hover,
    marginBottom: "0px",
  },
  timelineContent: {
    paddingRight: "0px",
    paddingLeft: "10px",
  },
  timeTypo: {
    opacity: "0.8",
    fontSize: "11px",
  },
  oppContent: {
    flex: "inherit",
    paddingLeft: "0px",
    paddingTop: "1px",
    paddingRight: "10px",
  },
  timelineText: {
    fontSize: "13px",
  },
  dateLabel: {
    padding: "0px 10px",
    marginTop: "20px",
    marginBottom: "10px",
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    fontWeight: 500,
  },
  accessIconContainer: {
    minWidth: "25px",
    marginTop: "3px",
  },
  accessListItemText: {
    margin: "0px",
  },
  timelineList: {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  timelineListItem: {
    padding: "0px",
    alignItems: "start",
  },
  timeline: {
    overflow: "auto",
    maxHeight: "calc(100vh - 180px)",
  },
  timelineMessage: {
    lineHeight: 1,
  },
  timelineContainer: {
    marginTop: "0px",
    paddingTop: "0px",
    paddingBottom: "0px",
  },
}));

const fieldName = {
  roles:"Roles",
  status:"Status",
  clients:"Clients",
  first_name:"First Name",
  last_name: "Last Name",
  phone_number:"Contact Number",
  password: "Password",
  last_login_time: "Last Active On"
}; 

const UserTimelineDetails = (props) => {
  const styles = useStyles();
  const data = formatTimelineData(props.auditDetails, "USER");
  // const activeControl = useSelector(
  //   (state) => state.OobControl.individual.details
  // );

  const formatTimelineMessage = (input, value) => {
    let message = "";
    if (input.action === "ADD")
      message = `${input.createdByUser} created user`;
    if (input.action === "DELETE")
      message = `${input.updatedByUser} deleted user`;
    if (input.action === "UPDATE" && input.changes.length > 0) {
      if (value.action === "REPLACE")
        message = (
          <>
            Updated {fieldName[value.key.split("/")[1]]}{" "}
            {fieldName[value.key.split("/")[1]] !== 'Password' && <>property from{" "}
            <strong>
              <em>
                {value.valueFrom ? (
                  value.valueFrom
                ) : (
                    <span style={{ opacity: "0.5" }}>{`blank `}</span>
                  )}
              </em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>
                {value.valueTo ? (
                  value.valueTo
                ) : (
                    <span style={{ opacity: "0.5" }}>{`blank`}</span>
                  )}
              </em>
            </strong>
            </>}
          </>
        );
      if (value.action === "REMOVE")
        message = (
          <>
            Removed association of {" "}
            <strong>
              <em>
                {value.valueFrom ? (
                  value.valueFrom
                ) : (
                    <span style={{ opacity: "0.5" }}>{`blank `}</span>
                  )}
              </em>
            </strong>{" "}
            from {" "}{fieldName[value.key.split("/")[1]]}{" "} property
          </>
        );
        if (value.action === "ADD")
        message = (
          <>
            Associated {" "}
            <strong>
              <em>
                {value.valueTo ? (
                  value.valueTo
                ) : (
                    <span style={{ opacity: "0.5" }}>{`blank `}</span>
                  )}
              </em>
            </strong>{" "}
            to {" "}{fieldName[value.key.split("/")[1]]}{" "} property
          </>
        );
    }
    return message;
  };

  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Timeline
          </Typography>
        }
      />
      <Divider />
      <div className={styles.timeline}>
        <Timeline align="left" className={styles.timelineContainer}>
          {Object.keys(data).map((key) => (
            <>
              <TimelineItem className={styles.timelineItem}>
                <Chip
                  label={formatTimelineDate(key)}
                  className={styles.dateLabel}
                  color="primary"
                  variant="outlined"
                />
              </TimelineItem>
              {data[key].map((option, index) => (
                option.changes.length > 0 &&
                <TimelineItem className={styles.timelineItem}>
                  <TimelineOppositeContent className={styles.oppContent}>
                    <Typography variant="caption" className={styles.timeTypo}>
                      {formatTimelineTime(option.updatedDate)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary" />
                    {data[key].length !== index + 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent className={styles.timelineContent}>
                    <Paper className={styles.paper}>
                      <Typography
                        variant="body2"
                        className={styles.timelineText}
                      >
                        <Typography variant="subtitle2" component="span">
                          {option.changes.length > 0
                            ? option.updatedByUser +
                            " made changes to the details"
                            : formatTimelineMessage(option)}
                        </Typography>
                      </Typography>
                      {option.changes.length > 0 &&
                        option.changes.map((item, itemkey) => (
                          <List dense={true} className={styles.timelineList}>
                            <ListItem className={styles.timelineListItem}>
                              <ListItemIcon
                                className={styles.accessIconContainer}
                              >
                                <ArrowRightIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              </ListItemIcon>
                              <ListItemText
                                className={styles.accessListItemText}
                                primary={
                                  <Typography
                                    variant="caption"
                                    className={styles.timelineMessage}
                                  >
                                    {formatTimelineMessage(
                                      option,
                                      item
                                      // ,
                                      // activeControl &&
                                      //   activeControl.control.format
                                    )}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </List>
                        ))}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </>
          ))}
        </Timeline>
      </div>
    </MatCard>
  );
};

export default UserTimelineDetails;
