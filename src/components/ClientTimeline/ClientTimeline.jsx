import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Pagination from '@material-ui/lab/Pagination';
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
import { fetchClientTimeline } from "../../actions/ClientTimelineActions";
import {
  DEFAULT_PAGE_SIZE_TIMELINE
} from "../../utils/AppConstants";
import {
  // fieldCreated,
  clientCreated,
  fieldDeleted,
  fieldModified,
  fieldRetracted,
  fieldSignOff,
  fieldProdRev,
  fieldClientRev,
  fieldConfigRev,
  fieldFailedConfigRev,
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
// import { repeat } from "lodash";

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
  pl15: {
    paddingLeft: "15px"
  },
  breakWord: {
    wordBreak: "break-word"
  }
}));

const ClientTimeline = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [perPage] = useState(20);
  const [LIST_PAGE_SIZE] = useState(20);

  const totalElements = props?.controlAuditDetailsCount;
  const startIndex = useSelector((state) => state.ClientTimelineState.startIndex);
  const [page, setPage] = useState((startIndex / LIST_PAGE_SIZE) + 1);
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
    if (input.action === "ADD") message = clientCreated(input.createdByUser);

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
    // if (input.action === "CONFIG_REVIEW_NEEDED")
    //   message = fieldFailedConfigRev(input.createdByUser);
    if (input.action === "UPDATE" && !value)
      message = fieldModified(input.createdByUser);
    if (input.action === "UPDATE") {
      let controlName = control && control.hasOwnProperty(value.key.split("/")[1]) ? value.key.split("/")[1] : "";

      //console.log("ACTIVE",control[5].internalName,value.key.split("/")[1]);
      if (value && value.action === "REPLACE")
        if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] === "status")
          message = (
            <>
              Updated scheduler status  from {value.valueFrom} to {value.valueTo}
            </>
          );
        else if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] === "scheduleAuditId")
          message = (
            <>
              Updated scheduler id from {value.valueFrom} to {value.valueTo}
            </>
          );
        else if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] === undefined)
          message = (
            <>
              Scheduler {value.valueFrom ? value.valueFrom.status : value.valueTo.status}
            </>
          );
        else if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] !== "status")
          message = (
            <>
              {value.valueFrom && value.valueTo ?
                <>
                  Updated scheduler info:
                  <ul className={styles.pl15}>
                    <li>Updated environmentName from {value.valueFrom.environmentName} to {value.valueTo.environmentName}</li>
                    <li>Updated frequency from {value.valueFrom.frequency} to {value.valueTo.frequency}</li>
                    <li>Updated type from {value.valueFrom.type} to {value.valueTo.type}</li>
                  </ul>
                </>
                :
                <>
                  {value.valueTo ?
                    <>
                      Added scheduler info:
                      <ul className={styles.pl15}>
                        <li>environmentName - {value.valueTo.environmentName}</li>
                        <li>frequency - {value.valueTo.frequency}</li>
                        <li>type - {value.valueTo.type}</li>
                      </ul>
                    </>
                    :
                    <>
                      Removed scheduler info:
                      <ul className={styles.pl15}>
                        <li>environmentName - {value.valueFrom.environmentName}</li>
                        <li>frequency - {value.valueFrom.frequency}</li>
                        <li>type - {value.valueFrom.type}</li>
                      </ul>
                    </>
                  }
                </>
              }

            </>
          );

        else if (value.key.split("/")[1] === "environment")
          message = (
            <>
              {(value?.valueTo?.split(":::")[2] === "false"
                && value?.valueTo?.split(":::")[3] === "false"
                && value?.valueTo?.split(":::")[4] === "null") ?
                <>
                  Removed{" "}
                  <strong>
                    <em>{value.valueFrom.split(":::")[1]}</em>
                  </strong>{" "}
                  Environment
                </>
                :
                value.valueFrom ?
                  <>
                    Updated {" "}
                    {(value.valueTo.split(":::")[1] === value.valueFrom.split(":::")[1]) &&
                      <strong>
                        <em>{value.valueTo.split(":::")[1]}{" "}</em>
                      </strong>
                    }
                    Environment Propeties :
                    <ul className={styles.pl15}>
                      {value.valueTo.split(":::")[1] !== value.valueFrom.split(":::")[1] &&
                        <li>{value.valueFrom.split(":::")[1]} to {value.valueTo.split(":::")[1]} Environment</li>
                      }
                      {value.valueTo.split(":::")[2] !== value.valueFrom.split(":::")[2] &&
                        <>
                          {value.valueFrom.split(":::")[2] === "false" ?
                            <li>Inactive to Active</li>
                            :
                            <li>Active to Inactive</li>
                          }
                        </>
                      }
                      {value.valueTo.split(":::")[3] !== value.valueFrom.split(":::")[3] &&
                        <>
                          {value.valueFrom.split(":::")[3] === "false" ?
                            <li>Unpaired to Paired</li>
                            :
                            <li>Paired to Unpaired</li>
                          }
                        </>
                      }
                      {value.valueTo.split(":::")[4] !== value.valueFrom.split(":::")[4] &&
                        <li className={styles.breakWord}>Endpoint set from {value.valueFrom.split(":::")[4] !== "null" ? value.valueFrom.split(":::")[4] : 'blank'} to {value.valueTo.split(":::")[4] !== "null" ? value.valueTo.split(":::")[4] : 'blank'}</li>
                      }
                    </ul>
                  </>
                  :
                  <>
                    Updated <strong>{value.valueTo.split(":::")[1]}</strong> Environment Propeties :
                    <ul className={styles.pl15}>
                      {value.valueTo.split(":::")[2] === "true" &&
                        <li>Inactive to Active</li>
                      }
                      {value.valueTo.split(":::")[3] === "true" &&
                        <li>Unpaired to Paired</li>
                      }
                      {value.valueTo.split(":::")[4] &&
                        <li className={styles.breakWord}>Endpoint set from blank to {value.valueTo.split(":::")[4] !== "null" ? value.valueTo.split(":::")[4] : 'blank'}</li>
                      }
                    </ul>
                  </>
              }
            </>
          );
        else if (value.key.split("/")[1] === "moduleVersion") {
          message = (
            <>
              Updated module {" "}
              <strong>{value?.valueFrom?.moduleName?.split(":::")[1] || value?.valueTo?.moduleName?.split(":::")[1]}</strong>{" "}
              with{" "}
              <strong>{value?.valueFrom?.moduleName?.split(":::")[2] || value?.valueTo?.moduleName?.split(":::")[2]}</strong>{" "}
              version
            </>
          )
        }
        else if (value.key.split("/")[1] === "comment") {
          message = (
            <>
              <strong>
                <em>{value.valueTo}</em>
              </strong>
            </>
          );
        }
        else if (value.key.split("/")[1] === "emailNotificationOn") {
          message = (
            <>
              Updated email notification from {" "}
              <strong>{value.valueFrom}</strong>{" "}
              to
              <strong>{value.valueTo}</strong>{" "}
            </>
          )
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
                  {(value.valueFrom) ? (
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
        if (value.key.split("/")[1] === "environment")
          message = (
            <>
              {value.valueFrom ?
                <>
                  Added {" "}
                  {(value.valueTo.environmentName.split(":::")[1] === value.valueFrom.split(":::")[1]) &&
                    <strong>
                      <em>{value.valueTo.environmentName.split(":::")[1]}{" "}</em>
                    </strong>
                  }
                  Environment Propeties :
                  <ul className={styles.pl15}>
                    {value.valueTo.environmentName.split(":::")[1] !== value.valueFrom.split(":::")[1] &&
                      <li>{value.valueFrom.split(":::")[1]} to {value.valueTo.environmentName.split(":::")[1]} Environment</li>
                    }
                    {value.valueTo.environmentName.split(":::")[2] !== value.valueFrom.split(":::")[2] &&
                      <>
                        {value.valueFrom.split(":::")[2] === "false" ?
                          <li>Inactive to Active</li>
                          :
                          <li>Active to Inactive</li>
                        }
                      </>
                    }
                    {value.valueTo.environmentName.split(":::")[3] !== value.valueFrom.split(":::")[3] &&
                      <>
                        {value.valueFrom.split(":::")[3] === "false" ?
                          <li>Unpaired to Paired</li>
                          :
                          <li>Paired to Unpaired</li>
                        }
                      </>
                    }
                    {value.valueTo.environmentName.split(":::")[4] !== value.valueFrom.split(":::")[4] &&
                      <li className={styles.breakWord}>Endpoint set from {value.valueFrom.split(":::")[4] !== "null" ? value.valueFrom.split(":::")[4] : 'blank'} to {value.valueTo.split(":::")[4] !== "null" ? value.valueTo.split(":::")[4] : 'blank'}</li>
                    }
                  </ul>
                </>
                :
                <>
                  Added <strong>{value.valueTo.environmentName.split(":::")[1]}</strong> Environment Propeties :
                  <ul className={styles.pl15}>
                    {value.valueTo.environmentName.split(":::")[2] === "true" &&
                      <li>Inactive to Active</li>
                    }
                    {value.valueTo.environmentName.split(":::")[3] === "true" &&
                      <li>Unpaired to Paired</li>
                    }
                    {value.valueTo.environmentName.split(":::")[4] &&
                      <li className={styles.breakWord}>Endpoint set from blank to {value.valueTo.environmentName.split(":::")[4] !== "null" ? value.valueTo.environmentName.split(":::")[4] : 'blank'}</li>
                    }
                  </ul>
                </>
              }
            </>
          )

        else if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] === undefined)
          message = (
            <>
              Scheduler {value.valueFrom ? value.valueFrom.status : value.valueTo.status}
            </>
          )
        else if (value.key.split("/")[1] === "moduleVersion") {
          message = (
            <>
              Added module {" "}
              <strong>{value?.valueTo?.moduleName?.split(":::")[1]}</strong>{" "}
              with{" "}
              <strong>{value?.valueTo?.moduleName?.split(":::")[2]}</strong>{" "}
              version
              <ul>
                {value?.valueTo?.moduleName?.split(":::")[3] !== 'null' &&
                  <li>Correspondence Definition ID {value?.valueTo?.moduleName?.split(":::")[3]}</li>
                }
                {value?.valueTo?.moduleName?.split(":::")[4] !== 'null' &&
                  <li>Default Correspondence Package {value?.valueTo?.moduleName?.split(":::")[4]}</li>
                }
                {value?.valueTo?.moduleName?.split(":::")[5] !== 'null' &&
                  <li>Default Delivery Tag {value?.valueTo?.moduleName?.split(":::")[5]}</li>
                }
              </ul>
            </>
          )
        }
        else if (value.key.split("/")[1] === "emailNotificationOn") {
          message = (
            <>
              Updated email notification from {" "}
              <strong>{value.valueFrom}</strong>{" "}
              to
              <strong>{value.valueTo}</strong>{" "}
            </>
          )
        }
        else if (value.key.split("/")[1] === "configMapping")
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
        if (value.key.split("/")[1] === "environment")
          message = (
            <>
              Removed{" "}
              <strong>
                <em>{value.valueFrom.environmentName.split(":::")[1]}</em>
              </strong>{" "}
              Environment property
            </>
          );
        else if (value.key.split("/")[1] === "moduleVersion") {
          message = (
            <>
              Removed module {" "}
              <strong>{value?.valueFrom?.moduleName?.split(":::")[1]}</strong>{" "}
              with{" "}
              <strong>{value?.valueFrom?.moduleName?.split(":::")[2]}</strong>{" "}
              version
            </>
          )
        }
        else if (value.key.split("/")[1] === "emailNotificationOn") {
          message = (
            <>
              Updated email notification from {" "}
              <strong>{value.valueFrom}</strong>{" "}
              to
              <strong>{value.valueTo}</strong>{" "}
            </>
          )
        }
        else if (value.key.split("/")[1] === "configMapping")
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
    if (input.action === "Add" || input.action === "ADD") {
      //let controlName = control && control.hasOwnProperty(value.key.split("/")[1]) ? value.key.split("/")[1] : "";

      //console.log("ACTIVE",control[5].internalName,value.key.split("/")[1]);
      if (value && value.action === "REPLACE")

        if (value.key.split("/")[1] === "schedulerInfo" && value.key.split("/")[2] === undefined)
          message = (
            <>
              Scheduler {value.valueFrom ? value.valueFrom.status : value.valueTo.status}
            </>
          )
        else if (value.key.split("/")[1] === "moduleVersion") {
          message = (
            <>
              Added module {" "}
              <strong>{value?.valueTo?.split(":::")[1]}</strong>{" "}
              with{" "}
              <strong>{value?.valueTo?.split(":::")[2]}</strong>{" "}
              version
              <ul>
                {value?.valueTo?.split(":::")[3] !== 'null' &&
                  <li>Correspondence Definition ID <strong>
                    <em>{value?.valueTo?.split(":::")[3]}</em></strong></li>
                }
                {value?.valueTo?.split(":::")[4] !== 'null' &&
                  <li>Default Correspondence Package <strong>
                    <em>{value?.valueTo?.split(":::")[4]}</em></strong></li>
                }
                {value?.valueTo?.split(":::")[5] !== 'null' &&
                  <li>Default Delivery Tag <strong>
                    <em>{value?.valueTo?.split(":::")[5]}</em></strong></li>
                }
              </ul>
            </>
          )
        }
    }
    return message;
  };
  const handlePageChange = (e, page) => {
    dispatch(fetchClientTimeline(clientId, (page - 1) * LIST_PAGE_SIZE, DEFAULT_PAGE_SIZE_TIMELINE));
  };
  // useEffect(() => {
  //   dispatch(fetchClientTimeline(clientId))
  // },
  //   []
  // );
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
                                <>
                                  {formatTimelineMessage(
                                    option,
                                    item,
                                    control && control
                                  ) &&
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
                                  }
                                </>
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
        <Grid container style={{ width: "auto", alignItems: "center", justifyContent: "flex-end", paddingTop: "8px" }}>
          {(LIST_PAGE_SIZE * (page - 1) + 1).toFixed(0)}{"-"}{(LIST_PAGE_SIZE * page) > totalElements ? totalElements : LIST_PAGE_SIZE * page}{" of "}{totalElements}
          <Pagination
            count={Math.ceil(totalElements / 20)}
            page={page}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
          />
        </Grid>
      </div>
    </MatCard>
  );
};

export default ClientTimeline;
