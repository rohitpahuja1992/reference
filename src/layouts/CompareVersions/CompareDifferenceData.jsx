import React from "react";

import { makeStyles, withStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import RepeatIcon from "@material-ui/icons/Repeat";
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';

import Tooltip from "../../components/MaterialUi/MatTooltip";
import { REC_NOT_AVIALABLE } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  nestedPanel: {
    paddingLeft: "42px",
  },
  itemPoints: {
    border: `2px solid ${theme.palette.primary.main}`,
    height: "8px",
    width: "8px",
    borderRadius: "100%",
    marginRight: "12px",
    position: "relative",
  },
  firstLevelHorizLine: {
    position: "absolute",
    height: "1px",
    width: "20px",
    left: "-21px",
    top: "50%",
    backgroundColor: "rgba(0,0,0,.1)",
    zIndex: "9999",
  },
  secondLevelHorizLine: {
    position: "absolute",
    height: "1px",
    width: "19px",
    left: "-9px",
    top: "50%",
    backgroundColor: "rgba(0,0,0,.1)",
    zIndex: "9999",
  },
  nestedListItem: {
    paddingLeft: "78px",
    alignItems: "start",
  },
  nestedList: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  nestedItemIcon: {
    minWidth: "28px",
    position: "relative",
    marginTop: "2px",
  },
  textTypo: {
    fontSize: "13px",
    whiteSpace: "nowrap",
    maxWidth: "280px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  addAction: {
    backgroundColor: "#e8f5e9",
  },
  removeAction: {
    backgroundColor: "#ffebee",
  },
  notPresentAction: {
    backgroundColor: "#dbedff",
  },
  replaceAction: {
    backgroundColor: "#fff3e0",
  },
  addActionIcon: {
    color: theme.palette.success.main,
  },
  removeActionIcon: {
    color: theme.palette.error.main,
  },
  notPresentActionIcon: {
    color: "#115293",
  },
  replaceActionIcon: {
    color: theme.palette.warning.main,
  },
  actionIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    marginTop: "-10px",
  },
  firstLevelVertLine: {
    position: "absolute",
    height: "calc(100% - 1px)",
    width: "1px",
    content: "",
    left: "42px",
    top: "-17px",
    backgroundColor: "rgba(0,0,0,.1)",
    zIndex: 9999,
  },
  secondLevelVertLine: {
    position: "absolute",
    height: "calc(100% - 0px)",
    width: "1px",
    content: "",
    left: "68px",
    top: "-15px",
    backgroundColor: "rgba(0,0,0,.1)",
    zIndex: 9999,
  },
  connectedLine: {
    width: "56px",
    height: "1px",
    top: "50%",
    background: "#ccc",
    position: "absolute",
    left: "100%",
  },
  connectedLinePoints: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    top: "50%",
    marginTop: "-5px",
    marginLeft: "-6px",
    background: "#fff",
    position: "absolute",
    left: "50%",
    border: "2px solid #ccc",
  },
  rightSideConnectedLine: {
    width: "56px",
    height: "1px",
    top: "50%",
    background: "#ccc",
    position: "absolute",
    right: "100%",
  },
  noDataCard: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

const ExpansionPanel = withStyles({
  root: {
    borderRadius: "0px !important",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "0",
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    // backgroundColor: "rgba(0, 0, 0, .03)",
    // borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 40,
    position: "relative",
    "&$expanded": {
      minHeight: 40,
    },
  },
  content: {
    margin: "10px 0",
    paddingLeft: "20px",
    alignItems: "center",
    "&$expanded": {
      margin: "10px 0",
    },
  },
  expandIcon: {
    padding: "8px",
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
  root: {
    padding: "0px",
    flexDirection: "column",
    position: "relative",
  },
})(MuiExpansionPanelDetails);

const CompareDifferenceData = (props) => {
  const {
    versionDataList,
    versionChanges,
    panelState,
    handlePanelState,
    side,
  } = props;
  const styles = useStyles();

  const getAction = (changesVersion, path) => {
    let allChanges = changesVersion.filter((changes) =>
      changes.key.includes(path)
    );
    let changeObj = changesVersion.filter((changes) => changes.key === path);
    if (changeObj.length > 0) {
      return changeObj[0].action;
    } else if (allChanges.length > 0) {
      return "REPLACE";
    } else {
      return "";
    }
  };

  const getClassesByAction = (action, parentAction, topLevelAction) => {
    if (
      action === "REMOVE" ||
      parentAction === "REMOVE" ||
      topLevelAction === "REMOVE"
    ) {
      return styles.removeAction;
    } else if (action === "NOTPRESENT") {
      return styles.notPresentAction;
    } else if (action === "REPLACE") {
      return styles.replaceAction;
    } else if (
      action === "ADD" ||
      parentAction === "ADD" ||
      topLevelAction === "ADD"
    ) {
      return styles.addAction;
    } else {
      return "";
    }
  };

  const getActionIcon = (action, parentAction, topLevelAction) => {
    if (
      action === "REMOVE" ||
      parentAction === "REMOVE" ||
      topLevelAction === "REMOVE"
    ) {
      return (
        <RemoveIcon fontSize="small" className={styles.removeActionIcon} />
      );
    } else if (action === "NOTPRESENT") {
      return (
        <TurnedInNotIcon fontSize="small" className={styles.notPresentActionIcon} />
      );
    } else if (action === "REPLACE") {
      return (
        <RepeatIcon fontSize="small" className={styles.replaceActionIcon} />
      );
    } else if (
      action === "ADD" ||
      parentAction === "ADD" ||
      topLevelAction === "ADD"
    ) {
      return <AddIcon fontSize="small" className={styles.addActionIcon} />;
    } else {
      return "";
    }
  };

  const getConnectLineUIChanges = (action, parentAction, topLevelAction) => {
    if (
      action ||
      parentAction === "REMOVE" ||
      parentAction === "ADD" ||
      parentAction === "NOTPRESENT" ||
      topLevelAction === "NOTPRESENT" ||
      topLevelAction === "REMOVE" ||
      topLevelAction === "ADD"
    ) {
      return (
        <div
          className={
            side === "left"
              ? styles.connectedLine
              : styles.rightSideConnectedLine
          }
        >
          <div className={styles.connectedLinePoints}></div>
        </div>
      );
    } else {
      return "";
    }
  };
  return (
    <div>
      {Object.entries(versionDataList).length > 0 ? (
        Object.entries(versionDataList)?.sort().map((compare, submoduleIndex) => (

          < ExpansionPanel
            expanded={panelState[`/components/${compare[0]}`] || false}
            onChange={() =>
              handlePanelState(`/components/${compare[0]}`)
            }
          >

            <ExpansionPanelSummary
              className={getClassesByAction(
                getAction(versionChanges, `/components/${compare[0]}`)
              )}
              expandIcon={<ExpandMoreIcon />}
            >
              <div className={styles.actionIcon}>
                {getActionIcon(
                  getAction(versionChanges, `/components/${compare[0]}`)
                )}
              </div>
              <div className={styles.itemPoints}></div>
              {getConnectLineUIChanges(
                getAction(versionChanges, `/components/${compare[0]}`)
              )}
              <Typography variant="body2" className={styles.textTypo}>
                {compare[1]?.name}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={styles.firstLevelVertLine}></div>
              {Object.entries(compare[1]?.rows)?.sort()?.map((control, controlIndex) => (
                <ExpansionPanel
                  expanded={
                    panelState[
                    `/components/${compare[0]}/rows/${control[0]}`
                    ] || false
                  }
                  onChange={() =>
                    handlePanelState(
                      `/components/${compare[0]}/rows/${control[0]}`
                    )
                  }
                >
                  <ExpansionPanelSummary
                    className={`${styles.nestedPanel} ${getClassesByAction(
                      getAction(
                        versionChanges,
                        `/components/${compare[0]}/rows/${control[0]}`
                      ),
                      getAction(
                        versionChanges,
                        `/components/${compare[0]}`
                      )
                    )}`}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <div className={styles.actionIcon}>
                      {getActionIcon(
                        getAction(
                          versionChanges,
                          `/components/${compare[0]}/rows/${control[0]}`
                        ),
                        getAction(
                          versionChanges,
                          `/components/${compare[0]}`
                        )
                      )}
                    </div>
                    <div className={styles.itemPoints}>
                      <div className={styles.firstLevelHorizLine}></div>
                    </div>
                    {getConnectLineUIChanges(
                      getAction(
                        versionChanges,
                        `/components/${compare[0]}/rows/${control[0]}`
                      ),
                      getAction(
                        versionChanges,
                        `/components/${compare[0]}`
                      )
                    )}
                    <Typography variant="body2" className={styles.textTypo}>
                      {control[1].rowLabel}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div className={styles.secondLevelVertLine}></div>
                    <List dense={true} className={styles.nestedList}>
                      {Object.entries(control[1].fields)?.sort().map((masterControl, masterIndex) => (
                        <Tooltip
                          arrow
                          title={
                            control[1].rowLabel
                          }
                        >
                          <ListItem
                            className={`${styles.nestedListItem
                              } ${getClassesByAction(
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}/rows/${control[0]}/fields/${masterControl[0]}`
                                ),
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}/rows/${control[0]}}`
                                ),
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}`
                                )
                              )}`}
                          >
                            <div className={styles.actionIcon}>
                              {getActionIcon(
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}/rows/${control[0]}/fields/${masterControl[0]}`
                                ),
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}/rows/${control[0]}}`
                                ),
                                getAction(
                                  versionChanges,
                                  `/components/${compare[0]}`
                                )
                              )}
                            </div>
                            <ListItemIcon className={styles.nestedItemIcon}>
                              <div
                                className={styles.secondLevelHorizLine}
                              ></div>
                              <ArrowRightIcon
                                fontSize="medium"
                                color="primary"
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  className={styles.textTypo}
                                >

                                  {getAction(
                                    versionChanges,
                                    `/components/${compare[0]}/rows/${control[0]}/fields/${masterControl[0]}`
                                  ) ?
                                    //   <strong>
                                    //     <em>
                                    //       {masterControl.fieldType === "option"
                                    //         ? control[1].fields[masterIndex]
                                    //           .map((option) => {
                                    //             if (
                                    //               typeof option === "string"
                                    //             ) {
                                    //               return option;
                                    //             } else {
                                    //               return option.label;
                                    //             }
                                    //           })
                                    //           .join(", ")
                                    //         : control[1].fields[masterIndex]}
                                    //     </em>
                                    //   </strong>
                                    // ) : masterControl.fieldType === "option" ? (
                                    //   control[1].fields[masterIndex]
                                    //     .map((option) => {
                                    //       if (typeof option === "string") {
                                    //         return option;
                                    //       } else {
                                    //         return option.label;
                                    //       }
                                    //     })
                                    //     .join(", ")
                                    // ) : (
                                    //   control[1].fields[masterIndex]
                                    // )
                                    (
                                      // <strong>
                                      //   <em>
                                      //     {masterControl[0]}:{masterControl[1]}
                                      //   </em>
                                      // </strong>
                                      <span>{masterControl[0]}   :   {masterControl[1]}</span>
                                    )
                                    :
                                    <span>{masterControl[0]}   :   {masterControl[1]}</span>
                                  }
                                </Typography>
                              }
                            />
                            {getConnectLineUIChanges(
                              getAction(
                                versionChanges,
                                `/components/${compare[0]}/rows/${control[0]}/fields/${masterControl[0]}`
                              ),
                              getAction(
                                versionChanges,
                                `/components/${compare[0]}/rows/${control[0]}`
                              ),
                              getAction(
                                versionChanges,
                                `/components/${compare[0]}`
                              )
                            )}
                          </ListItem>
                        </Tooltip>
                      ))}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      ) : (
        <CardContent className={styles.noDataCard}>
          <Typography variant="subtitle2">{REC_NOT_AVIALABLE}</Typography>
        </CardContent>
      )}
    </div >
  );
};

export default CompareDifferenceData;
