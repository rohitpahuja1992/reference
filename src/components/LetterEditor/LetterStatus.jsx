import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";
// import { TextField } from '@material-ui/core';
import StatusIcon from "../../assets/images/status-icon.svg";
import Docx from "../../assets/images/docx-file.svg";

import MatCard from "../MaterialUi/MatCard";
import MomentUtils from "@date-io/moment";
import moment from "moment";

import { updateFile, downloadOriginalFile, downloadLibraryFile } from "../../actions/LettersActions";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { formatDate } from "../../utils/helpers";
// import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  statusCard: {
    flex: 1,
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },
  iconSize: {
    fontSize: "16px",
    paddingRight: "5px",
    width: "18px",
  },
  highlightedCell: {
    fontWeight: 500,
    width: "100px",
    padding: "9px 0px 9px 16px",
  },

  statusActive: {
    background: "#00c853",
    height: "25px",
    width: "80px",
  },

  statusNotConfigured: {
    background: "#5C78FF",
    height: "25px",
    width: "150px",
  },
  statusInactive: {
    background: theme.palette.error.main,
    height: "25px",
    width: "80px",
  },
  noStatus: {
    background: "#fff",
    height: "25px",
    width: "80px",
  },
}));

const LetterStatus = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  //const fileListProp = useRef();
  const orginalDoc = useSelector((state) =>
    state?.Letters?.downloadOriginalLetter
  );
  const libraryDoc = useSelector((state) =>
    state?.Letters?.downloadLibraryLetter
  );
  // The first commit of Material-UI
  //const orginalDoc = `/lat/letters/download/${props.letterData.id}?docType=`
  //const libraryDoc = `/lat/letters/download/${props.letterData.id}?docType=library`
  const [selectedDate, setSelectedDate] = useState({
    effectiveDate: formatDate(props.letterData.effectiveDate),
    termDate:
      !(props.letterData.termDate)
        ? ""
        : formatDate(props.letterData.termDate),
    status: props.letterData.status,
  });

  const { effectiveDate, termDate, status } = selectedDate;

  const handleDateChange = (date, name, id) => {
    let updateData = [];
    setSelectedDate((state) => ({
      ...state,
      [name]: date,
      //status: handleLetterStatusLabel(),
    }));

    updateData.push({
      id: Number(id),
      [name]: date !== null ? moment(date).format("yyyy-MM-DD HH:mm:ss") : "",
    });

    dispatch(updateFile(updateData, { name, date }));
  };

  const handleClientStatusClass = (status) => {
    if (status === "Active") {
      return styles.statusActive;
    } else if (status === "Inactive") {
      return styles.statusInactive;
    }
    else if (status === "") {
      return styles.statusNotConfigured;
    }
    else {
      //do nothing
    }

  };

  // const handleLetterStatusLabel = () => {
  //   let edate = moment(effectiveDate).format("DD/MM/YYYY");
  //   let tdate = moment(termDate).format("DD/MM/YYYY");
  //   let tsDate = moment().format("DD/MM/YYYY");
  //   if ((edate <= tsDate && tdate >= tsDate) || tdate === null) {
  //     return "Active";
  //   } else if (tdate <= tsDate) {
  //     return "InActive";
  //   } else {
  //     return "Config Incomplete";
  //   }
  // };

  // useEffect(() => {
  //   // setLetterData(props.letterData);
  //   //let letterData = props.letterData
  //   if (!_.isEqual(selectedDate, fileListProp.current)) {
  //     fileListProp.current = _.cloneDeep(selectedDate);
  //     setSelectedDate({
  //       selectedDate
  //       : [...fileListProp.current],
  //     });
  //   }
  // }, [props.letterData, selectedDate]);

  useEffect(() => {
    if (props.letterUpdates.isDateUpdated) {
      setSelectedDate((state) => ({
        ...state,
        status: props.letterUpdates.status,

      }))
    }
  }, [props.letterUpdates])


  useEffect(() => {
    setSelectedDate({
      effectiveDate: formatDate(props.letterData.effectiveDate),
      termDate:
        !(props.letterData.termDate)
          ? null
          : formatDate(props.letterData.termDate),
      status: props.letterData.status,
    });
  }, [props.letterData])

  useEffect(() => {
    dispatch(downloadOriginalFile(props.letterData.id))
  }, [dispatch, props?.letterData?.id])

  useEffect(() => {
    console.log("lib statues:", props?.letterData?.letterImportStatus)
    if (props?.letterData?.letterImportStatus === "LIBRARY") {
      dispatch(downloadLibraryFile(props.letterData.id))
    }
  }, [dispatch, props?.letterData?.letterImportStatus, props?.letterData?.id])



  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img
              src={StatusIcon}
              alt={StatusIcon + " icon"}
              className={styles.iconSize}
            />{" "}
            Letter Status
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
                  label={status}
                  className={handleClientStatusClass(status)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Effective Date:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {/* <TextField
                    id="effectiveDate"
                    type="date"
                    format={'MM/DD/YYYY'}
                    defaultValue={formatDate(props.letterData.effectiveDate)}
                    
                     /> */}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    autoOk
                    value={effectiveDate}
                    onChange={(date) =>
                      handleDateChange(
                        date,
                        "effectiveDate",
                        props.letterData.id
                      )
                    }
                    format="MM/DD/yyyy"
                  />
                </MuiPickersUtilsProvider>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Term Date:
              </TableCell>
              <TableCell>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    autoOk
                    disablePast
                    error={false}
                    helperText={null}
                    value={termDate}
                    placeholder="MM/DD/yyyy"
                    onChange={(date) =>
                      handleDateChange(date, "termDate", props.letterData.id)
                    }
                    //minDate={new Date()}
                    format="MM/DD/yyyy"
                  />
                </MuiPickersUtilsProvider>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Imported:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {formatDate(
                  props.letterData.importedDate
                    ? props.letterData.importedDate
                    : props.letterData.createdDate
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Auto Configured:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {props.letterData.autoConfigure ? "Yes" : "No"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>JIRA #: </TableCell>
              <TableCell className={styles.highlightedCell}>
                {props.letterData.jiraTicketId
                  ? props.letterData.jiraTicketId
                  : "N/A"}
              </TableCell>
            </TableRow>

            <TableRow className={styles.highlightedCell}>
              <TableCell className={styles.highlightedCell}>
                Download Original Letter:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {/* <a href={props.letterData?.originalStoragePath}>
                  <img src={Docx} width="20px" alt="" title="Download here" />
                </a> */}
                {orginalDoc ?
                  <a href={orginalDoc} download={props.letterData.letterName + "_originalDoc.docx"}>
                    <img src={Docx} width="20px" alt="" title="Download here" />
                  </a>
                  :
                  "N/A"
                }
              </TableCell>
            </TableRow>
            <TableRow className={styles.highlightedCell}>
              <TableCell className={styles.highlightedCell}>
                Download Mail Merge Letter:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {/* <a
                  href={
                    props.letterStage ? props.letterData?.libraryStoragePath : !props.letterData?.importStoragePath
                      ? props.letterData?.originalStoragePath
                      : props.letterData?.importStoragePath
                  }
                >
                  <img src={Docx} width="20px" alt="" title="Download here" />
                </a> */}
                {libraryDoc ?
                  <a
                    href={libraryDoc} download={props.letterData.letterName + "_libraryDoc.docx"}
                  >
                    <img src={Docx} width="20px" alt="" title="Download here" />
                  </a>
                  :
                  "N/A"
                }

              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                Updated By:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {props.letterData.createdByUser}
              </TableCell>
            </TableRow>
            <TableRow className={styles.highlightedCell}>
              <TableCell className={styles.highlightedCell}>
                Created At:
              </TableCell>
              <TableCell className={styles.highlightedCell}>
                {formatDate(props.letterData.createdDate)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MatCard >
  );
};

export default LetterStatus;
