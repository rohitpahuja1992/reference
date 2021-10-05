import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import MatCard from "../MaterialUi/MatCard";
import { fetchClientControlAudit } from "../../actions/ClientModuleActions"

import {
  fieldCreated,
  fieldDeleted,
  fieldModified,
  fieldRetracted,
  fieldSignOff,
  fieldProdRev,
  fieldClientRev,
  fieldConfigRev,
  approvedOnField,
  configuredOnField,
  validatedOnField,
  userCommented,
  userMadeChanges,
  configChanges,
  TIMELINE,
} from "../../utils/Messages";
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

const ClientProfileTimeline = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const data = formatTimelineData(props.auditDetails) || {};
  const { clientId } = useParams();
  // const activeControl = useSelector(
  //   (state) => state.ClientModule.clientControlById.data
  // );

  const activeControl = useSelector((state) =>
    state.OobComponent.individual.details
      ? state.OobComponent.individual.details
      : state.ClientModule.clientControlById.data
  );

  const control = activeControl ? JSON.parse(activeControl?.mapField) : "";
  const featuresAssigned = useSelector((state) => state.User.features);

  const formatTimelineMessage = (input, value, control) => {
    let message = "";
    if (input.action === "ADD") message = fieldCreated(input.createdByUser);
    if (input.action === "DELETE") message = fieldDeleted(input.createdByUser);
    if (input.action === "APPROVED")
      message = approvedOnField(input.createdByUser);
    if (input.action === "CONFIGURED")
      message = configuredOnField(input.createdByUser);
    if (input.action === "VALIDATED")
      message = validatedOnField(input.createdByUser);
    if (input.action === "RETRACT")
      message = fieldRetracted(input.createdByUser);
    if (input.action === "SIGN_OFF")
      message = fieldSignOff(input.createdByUser);
    if (input.action === "PRODUCT_REVIEW_NEEDED")
      message = fieldProdRev(input.createdByUser);
    if (input.action === "CLIENT_REVIEW_NEEDED")
      message = fieldClientRev(input.createdByUser);
    if (input.action === "CONFIG_REVIEW_NEEDED")
      message = fieldConfigRev(input.createdByUser);
    if (input.action === "MODIFY" && !value)
      message = fieldModified(input.createdByUser);
    if (input.action === "MODIFY") {
      let controlName = control && control.hasOwnProperty(value.key.split("/")[1]) ? value.key.split("/")[1] : "";

      //console.log("ACTIVE",control[5].internalName,value.key.split("/")[1]);
      if (value && value.action === "REPLACE")
        if (value.key.split("/")[1] === "comment") {
          message = (
            <>
              <strong>
                <em>{value.valueTo}</em>
              </strong>
            </>
          );
        }
        else if (value.key.split("/")[1] === "mapConfig") {
          message = (
            <>
              Updated {value.key.split("/")[2]} property configuration value {value.key.split("/")[3]} from{" "}
              <strong>
                <em>
                  {value.valueFrom ? (
                    typeof value.valueFrom === "string"
                      ? (
                        value.valueFrom
                      ) : (
                        value.valueFrom.label
                      )
                  ) : (
                    <span style={{ opacity: "0.5" }}>{`blank `}</span>
                  )}
                </em>
              </strong>{" "}
              to{" "}
              <strong>
                {/* {console.log("value.valueTo: ", value.valueTo)} */}
                <em>
                  {value.valueTo ? (
                    typeof value.valueTo === "string" ||
                      typeof value.valueTo === "boolean" ? (
                      value.valueTo
                    ) : (
                      value.valueTo.label
                    )
                  ) : (
                    <span style={{ opacity: "0.5" }}>{`blank`}</span>
                  )}
                </em>
              </strong>
            </>
          );
        }

        else
          message = (
            <>
              Updated {controlName.length > 0 && controlName} property from{" "}
              <strong>
                <em>
                  {(value.valueFrom).toString() ? (
                    typeof value.valueFrom === "string" ||
                      typeof value.valueFrom === "boolean" ? (
                      value.valueFrom
                    ) : (
                      value?.valueFrom?.label
                    )
                  ) : (
                    <span style={{ opacity: "0.5" }}>{`blank `}</span>
                  )}
                </em>
              </strong>{" "}
              to{" "}
              <strong>
                {/* {console.log("value.valueTo: ", value.valueTo)} */}
                <em>
                  {value.valueTo ? (
                    typeof value.valueTo === "string" ||
                      typeof value.valueTo === "boolean" ? (
                      value.valueTo
                    ) : (
                      value.valueTo.label
                    )
                  ) : (
                    <span style={{ opacity: "0.5" }}>{`blank`}</span>
                  )}
                </em>
              </strong>
            </>
          );
      if (control?.hasOwnProperty(value?.key?.split("/")[1])) {
        message = (
          <>
            Updated {value.key.split("/")[1]} property from{" "}
            <strong>
              <em>
                {(value.valueFrom).toString() ? (
                  (value.valueFrom).toString()
                ) : (
                  <span style={{ opacity: "0.5" }}>{'false'}</span>
                )}
              </em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>
                {(value.valueTo).toString() ? (
                  (value.valueTo).toString()
                ) : (
                  <span style={{ opacity: "0.5" }}>{`blank`}</span>
                )}
              </em>
            </strong>
          </>
        );
      }
      if (value && value.action === "ADD")
        if (value.key.split("/")[1] === "configMapping")
          message = (
            <>
              Added{" "}
              <strong>
                <em>{value.valueTo.fieldProperty}</em>
              </strong>{" "}
              with{" "}
              <strong>
                <em>{value.valueTo.systemTable}</em>
              </strong>{" "}
              as system table &amp;{" "}
              <strong>
                <em>{value.valueTo.systemColumn}</em>
              </strong>{" "}
              as system column
            </>
          );
        else if (value.key.split("/")[1] === "mapConfig") {
          message = (
            <>
              Configured {value.key.split("/")[2]} property.

            </>
          );
        }
        else
          message = (
            <>
              Added{" "}
              <strong>
                <em>
                  {typeof value.valueTo === "string"
                    ? value.valueTo
                    : value.valueTo.label}
                </em>
              </strong>{" "}
              to {controlName.length > 0 && controlName[0].fieldLabel} property
            </>
          );
      if (value && value.action === "REMOVE")
        if (value.key.split("/")[1] === "configMapping")
          message = (
            <>
              Removed{" "}
              <strong>
                <em>{value.valueFrom.fieldProperty}</em>
              </strong>{" "}
              with{" "}
              <strong>
                <em>{value.valueFrom.systemTable}</em>
              </strong>{" "}
              as system table &{" "}
              <strong>
                <em>{value.valueFrom.systemColumn}</em>
              </strong>{" "}
              as system column
            </>
          );
        else if (value.key.split("/")[1] === "mapConfig") {
          message = (
            <>
              Removed configured {value.key.split("/")[2]} property.

            </>
          );
        }
        else
          message = (
            <>
              Removed{" "}
              <strong>
                <em>
                  {typeof value.valueFrom === "string"
                    ? value?.valueFrom
                    : value?.valueFrom?.label}
                </em>
              </strong>{" "}
              from {controlName.length > 0 && controlName[0].fieldLabel}{" "}
              property
            </>
          );
    }
    return message;
  };
  useEffect(() => {
    console.log(activeControl)
    dispatch(fetchClientControlAudit(clientId))
  },
    []
  );
  return (
    <MatCard
      className={
        featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !== -1 &&
        styles.card
      }
    >
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {TIMELINE}
          </Typography>
        }
      />
      <Divider />
      <div className={styles.timeline}>
        <Timeline align="left" className={styles.timelineContainer}>
          {Object?.keys(data)?.map((key) => (
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
                      {formatTimelineTime(option.createdDate)}
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
                          {option.changes.length === 0
                            ? formatTimelineMessage(option)
                            : option.changes[0].key.split("/")[1] ===
                              "configMapping"
                              ? configChanges(option.createdByUser)
                              : option.changes[0].key.split("/")[1] === "comment"
                                ? userCommented(option.createdByUser)
                                : userMadeChanges(option.createdByUser)}
                        </Typography>
                      </Typography>
                      {option.changes.length > 0 &&
                        option.changes.map((item, itemkey) => (
                          <>
                            {(item.key.split("/")[1] !== "comment" ||
                              (item.key.split("/")[1] === "comment" &&
                                item.valueTo !== "null")) && (
                                <List
                                  dense={true}
                                  className={styles.timelineList}
                                >
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
                                            item,
                                            control && control
                                          )}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                </List>
                              )}
                          </>
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

export default ClientProfileTimeline;
