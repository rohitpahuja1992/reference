import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Pagination from '@material-ui/lab/Pagination';
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import { formatDateDash } from "../../utils/helpers";
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
import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";

import {
  fieldCreated,
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
import {
  DEFAULT_PAGE_SIZE_TIMELINE
} from "../../utils/AppConstants";
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

const OobFieldTimeline = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const data = formatTimelineData(props.auditDetails) || {};
  const userDataID = props?.tableConfig?.UserID;
  const [perPage] = useState(20);
  const [LIST_PAGE_SIZE] = useState(20);

  const totalElements = props?.tableConfig?.TotalRecords;
  const startIndex = useSelector((state) => state.OOBSubmodule.page.startIndex);
  const [page, setPage] = useState((startIndex / LIST_PAGE_SIZE) + 1);
  // const activeControl = useSelector(
  //   (state) => state.ClientModule.clientControlById.data
  // );

  const activeControl = useSelector((state) =>
    state.OobComponent.individual.details
      ? state.OobComponent.individual.details
      : state.ClientModule.clientControlById.data
  );

  const colToLabel = (value) => (props?.columnData?.map(a => a?.mapObject?.columnName)?.includes(value)) ?
    props?.columnData?.filter(a => a?.mapObject?.columnName === value)[0]?.mapLable
    : value;


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
    if (input.action === "CONFIG_REVIEW_NEEDED" && (input?.changes[0]?.valueFrom === "APPROVED" || input?.changes[0]?.valueFrom === "CONFIGURED"))
      message = fieldFailedConfigRev(input.createdByUser);
    if (input.action === "MODIFY" && !value)
      message = fieldModified(input.createdByUser);
    if (
      input.action === "MODIFY" ||
      input.action === "ADD" ||
      input.action === "DELETE" ||
      input.action === "APPROVED" ||
      input.action === "CONFIGURED" ||
      input.action === "VALIDATED" ||
      input.action === "RETRACT" ||
      input.action === "SIGN_OFF" ||
      input.action === "PRODUCT_REVIEW_NEEDED" ||
      input.action === "CLIENT_REVIEW_NEEDED" ||
      input.action === "CONFIG_REVIEW_NEEDED"
    ) {

      //console.log("ACTIVE",control[5].internalName,value?.key?.split("/")[1]);
      if (value && value.action === "REPLACE")
        if (value?.key?.split("/")[1] === "comment") {
          message = (
            <>
              <strong>
                <em>{value?.valueTo}</em>
              </strong>
            </>
          );
        }
    }
    if (input.action === "MODIFY") {
      let controlName = control && control.hasOwnProperty(value?.key?.split("/")[1]) ? value?.key?.split("/")[1] : "";

      //console.log("ACTIVE",control[5].internalName,value?.key?.split("/")[1]);
      if (value?.key?.split("/")[1] === "Checkbox") {
        message = (
          <>
            Updated checkbox from
            <strong>
              <em> {value?.valueFrom} </em>
            </strong>
            to
            <strong>
              <em> {value?.valueTo}</em>
            </strong>
          </>
        );
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[5] === "propertyValue") {
        return null
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[4] === "functionLabel") {
        return null
      }
      else if (value?.key?.split("/").includes("createdDate") || value?.key?.split("/").includes("updatedDate")) {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? formatDateDash(value?.valueFrom) : 'blank'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? formatDateDash(value?.valueTo) : 'blank'}</em>
            </strong>
          </>
        )
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[4] === "oob") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? 'true' : 'false'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? 'true' : 'false'}</em>
            </strong>
          </>
        )
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[4] === "mapping") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? 'true' : 'false'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? 'true' : 'false'}</em>
            </strong>
          </>
        )
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[5] === "used") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? 'true' : 'false'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? 'true' : 'false'}</em>
            </strong>
          </>
        )
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[5] === "id") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? value?.valueFrom : 'blank'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? value?.valueTo : 'blank'}</em>
            </strong>
          </>
        )
      }
      else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[5] === "oobComponentDataId") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>{value?.valueFrom ? value?.valueFrom : 'blank'}</em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>{value?.valueTo ? value?.valueTo : 'blank'}</em>
            </strong>
          </>
        )
      }

      else if (value?.key?.split("/")[1] === "mapConfig") {
        message = (
          <>
            Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
            <strong>
              <em>
                {value?.valueFrom ? (
                  typeof value?.valueFrom === "string"
                    ? (
                      value?.valueFrom
                    ) : (
                      value?.valueFrom.label
                    )
                ) : (
                  <span style={{ opacity: "0.5" }}>{`blank `}</span>
                )}
              </em>
            </strong>{" "}
            to{" "}
            <strong>
              {/* {console.log("value?.valueTo: ", value?.valueTo)} */}
              <em>
                {value?.valueTo ? (
                  typeof value?.valueTo === "string" ||
                    typeof value?.valueTo === "boolean" ? (
                    value?.valueTo
                  ) : (
                    value?.valueTo.label
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
            Updated{" "}
            <strong>
              <em>{colToLabel(value?.key.split("/")[1])}</em>
            </strong>{" "}
            property from{" "}
            <strong>
              <em>
                {(value?.valueFrom)?.toString() ? (
                  typeof value?.valueFrom === "string" ||
                    typeof value?.valueFrom === "number" ||
                    typeof value?.valueFrom === "boolean" ? (
                    value?.valueFrom
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
              {/* {console.log("value?.valueTo: ", value?.valueTo)} */}
              <em>
                {value?.valueTo ? (
                  typeof value?.valueTo === "string" ||
                    typeof value?.valueFrom === "number" ||
                    typeof value?.valueTo === "boolean" ? (
                    value?.valueTo
                  ) : (
                    value?.valueTo.label
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
            Updated{" "}
            <strong>
              <em>{colToLabel(value?.key.split("/")[1])}</em>
            </strong>{" "}
            field {value?.valueType} from{" "}
            <strong>
              <em>
                {(value?.valueFrom)?.toString() ? (
                  (value?.valueFrom)?.toString()
                ) : (
                  <span style={{ opacity: "0.5" }}>{'blank'}</span>
                )}
              </em>
            </strong>{" "}
            to{" "}
            <strong>
              <em>
                {(value?.valueTo)?.toString() ? (
                  (value?.valueTo)?.toString()
                ) : (
                  <span style={{ opacity: "0.5" }}>{`blank`}</span>
                )}
              </em>
            </strong>
          </>
        );
      }
      if (value && value.action === "ADD")
        if (value?.key?.split("/")[1] === "configMapping")
          message = (
            <>
              Added{" "}
              <strong>
                <em>{value?.valueTo.fieldProperty}</em>
              </strong>{" "}
              with{" "}
              <strong>
                <em>{value?.valueTo.systemTable}</em>
              </strong>{" "}
              as system table &amp;{" "}
              <strong>
                <em>{value?.valueTo.systemColumn}</em>
              </strong>{" "}
              as system column
            </>
          );
        else if (value?.key?.split("/").includes("createdDate") || value?.key?.split("/").includes("updatedDate")) {
          message = (
            <>
              Updated {value?.key?.split("/")[2]} property configuration value {value?.key?.split("/")[3]} from{" "}
              <strong>
                <em>{value?.valueFrom ? formatDateDash(value?.valueFrom) : 'blank'}</em>
              </strong>{" "}
              to{" "}
              <strong>
                <em>{value?.valueTo ? formatDateDash(value?.valueTo) : 'blank'}</em>
              </strong>
            </>
          )
        }
        else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[2] === undefined) {
          message = (
            <>
              Configuration{" "}
              <strong>
                <em>Updated</em>
              </strong>
            </>
          );
        }
        else if (value?.key?.split("/")[1] === "Checkbox") {
          message = (
            <>
              Updated checkbox from
              <strong>
                <em> {value?.valueFrom} </em>
              </strong>
              to
              <strong>
                <em> {value?.valueTo}</em>
              </strong>
            </>
          );
        }
        else if (value?.key?.split("/")[1] === "mapConfig" && value?.key?.split("/")[3] === "mapping" && value?.key?.split("/")[4] === "description" && value?.key?.split("/")[5] === "description") {
          message = (
            <>
              {
                (value?.key?.split("/")[2] === "Label") ?
                  <>Configured Label with <strong>{value?.valueTo}</strong> message constant property.</>
                  : <>Configured {value?.key?.split("/")[2]} with <strong>{value?.valueTo}</strong> system variable property.</>
              }
            </>

          );
        }
        else if (value?.key?.split("/")[1] === "mapConfig") {
          return null
        }
        else
          message = (
            <>
              Added{" "}
              <strong>
                <em>
                  {typeof value?.valueTo === "string"
                    ? value?.valueTo
                    : value?.valueTo.label}
                </em>
              </strong>{" "}
              to {controlName.length > 0 && controlName[0].fieldLabel} property
            </>
          );
      if (value && value.action === "REMOVE")
        if (value?.key?.split("/")[1] === "configMapping")
          message = (
            <>
              Removed{" "}
              <strong>
                <em>{value?.valueFrom.fieldProperty}</em>
              </strong>{" "}
              with{" "}
              <strong>
                <em>{value?.valueFrom.systemTable}</em>
              </strong>{" "}
              as system table &{" "}
              <strong>
                <em>{value?.valueFrom.systemColumn}</em>
              </strong>{" "}
              as system column
            </>
          );
        else if (value?.key?.split("/")[1] === "Checkbox") {
          message = (
            <>
              Removed checkbox property
            </>
          );
        }
        else if (value?.key?.split("/")[1] === "mapConfig") {
          message = (
            <>
              Removed configured {value?.key?.split("/")[2]} property.

            </>
          );
        }
        else
          message = (
            <>
              Removed{" "}
              <strong>
                <em>
                  {typeof value?.valueFrom === "string"
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

  const handlePageChange = (e, page) => {
    dispatch(fetchOOBControlAudit(userDataID, (page - 1) * LIST_PAGE_SIZE, DEFAULT_PAGE_SIZE_TIMELINE));
  };
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

export default OobFieldTimeline;
