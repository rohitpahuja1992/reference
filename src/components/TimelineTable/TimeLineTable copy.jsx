import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Pagination from '@material-ui/lab/Pagination';
// import { LIST_PAGE_SIZE } from "../../utils/AppConstants";
import { fetchUserAudit } from "../../actions/UserTimelineActions";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";

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
import {
  formatTimelineDate,
  formatTimelineTime,
  formatTimelineData,
} from "../../utils/helpers";
import MatCard from "../MaterialUi/MatCard";
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

const TimeLineTable = (props) => {
  const userDataID=props.tableConfig.UserID;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [perPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const { moduleId, versionId } = useParams();
  //const styles = useStyles();
  const styles = useStyles();
  const [LIST_PAGE_SIZE]= useState(20);
  
  const totalElements = props.tableConfig.TotalRecords;
  // const [totalElements]= useState(props.tableConfig.TotalRecords);
  //const LIST_PAGE_SIZE=1;
  const startIndex = useSelector((state) => state.OOBSubmodule.page.startIndex);
  const [page, setPage] = useState((startIndex/LIST_PAGE_SIZE)+1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  

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

  
  const getData = () => {
   if(props?.data.length>0){
  const data =  formatTimelineData(props?.data, "USER");
   const slice = Object.keys(data).slice(offset, offset + perPage);
    const postData = slice.map((key) => (
      // Object.keys(data).map((key)
    <div>
        <TimelineItem className={styles.timelineItem} ref={myRef}>
                <Chip
                  label={formatTimelineDate(key)}
                  className={styles.dateLabel}
                  color="primary"
                  variant="outlined"
                />
              </TimelineItem>
              {data[key].map((option, index) => (
                data[key].length === index + 1 ?
                option.changes.length > 0 &&
                  <div ref={lastBookElementRef}>
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
                </div>
                :
                option.changes.length > 0 && <div>
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
                </div> 
              
              ))}
    </div>
              
     
      
    ));
    setData(postData);
    setPageCount(Math.ceil(slice.length / perPage));
                              }
  };

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
        else if(value?.key?.split("/")[1] === "emailNotificationOn"){
          message = (
            <>
              Updated email notification from {" "}
              <strong>{value?.valueFrom? 'true' : 'false'}</strong>{" "}
              to{" "}
              <strong>{value?.valueTo? 'true' : 'false'}</strong>{" "}
              </>
          )
        }
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
        else if(value?.key?.split("/")[1] === "emailNotificationOn"){
          message = (
            <>
              Updated email notification from {" "}
              <strong>{value?.valueFrom? 'true' : 'false'}</strong>{" "}
              to{" "}
              <strong>{value?.valueTo? 'true' : 'false'}</strong>{" "}
              </>
          )
        }
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
    else if(value?.key?.split("/")[1] === "emailNotificationOn"){
      message = (
        <>
          Updated email notification from {" "}
          <strong>{value?.valueFrom? 'true' : 'false'}</strong>{" "}
          to{" "}
          <strong>{value?.valueTo? 'true' : 'false'}</strong>{" "}
          </>
      )
    }
    return message;
  };

 

  const handlePageChange = (e, page) => {
    setPage(page);
    console.log("userdatais"+userDataID)
    console.log("startindex"+(page - 1) * LIST_PAGE_SIZE)
    console.log("lastindex"+LIST_PAGE_SIZE)
    dispatch(fetchUserAudit(userDataID,(page - 1) * LIST_PAGE_SIZE, DEFAULT_PAGE_SIZE_TIMELINE ));
   // dispatch(fetchOOBSubmodulesByOOBModuleId(moduleId, versionId, (page - 1) * LIST_PAGE_SIZE, LIST_PAGE_SIZE));
    // const selectedPage = e.selected;
    // setOffset(page);
  };
  const [startIndexPage, setStartIndexPage] = useState(0)
  const observer = useRef()
  const myRef = useRef()
  const lastBookElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if(props.tableConfig.TotalRecords > startIndexPage) {
           setStartIndexPage(prev => prev + 20)
        }
      }
    })
    if (node) observer.current.observe(node)
  }, [observer.current])

  useEffect(() => {
    dispatch(fetchUserAudit(userDataID,startIndexPage, DEFAULT_PAGE_SIZE_TIMELINE ));
    if(props.data && startIndexPage) {
    myRef.current.scrollTo(0, 0);
    }
  },[startIndexPage])

  useEffect(() => {
    getData();
  }, [props.data]);

  useEffect(() => {
    setPage((startIndex/LIST_PAGE_SIZE)+1);    
  }, [startIndex]);

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
         {data}
         </Timeline>
         </div>
      {/* <div className={listStyles.componentList}>
        {data}
      </div> */}
      {}
      {/* <Grid container style={{ width: "auto", alignItems: "center", justifyContent: "flex-end", paddingTop: "8px" }}>
        {(LIST_PAGE_SIZE * (page - 1) + 1).toFixed(0)}{"-"}{(LIST_PAGE_SIZE * page) > totalElements ? totalElements : LIST_PAGE_SIZE * page}{" of "}{totalElements}
        <Pagination
          count={Math.ceil(totalElements / 20)}
          page={page}
          onChange={handlePageChange}
          siblingCount={0}
          boundaryCount={1}
           />
      </Grid> */}
      {/* {selectedAction === "MenuAction" && (
        <CommonMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          options={props.config.menuOptions}
          activeRow={activeModule}
        />
      )} */}
      {/* <ReactPaginate
     previousLabel={"prev"}
     nextLabel={"next"}
     breakLabel={"..."}
     breakClassName={"break-me"}
     pageCount={pageCount}
     marginPagesDisplayed={2}
     pageRangeDisplayed={5}
     onPageChange={handlePageClick}
     containerClassName={listStyles.pagination}
     subContainerClassName={"pages pagination"}
     activeClassName={"active"}
   /> */}
   </MatCard>
  );
};

export default TimeLineTable;
