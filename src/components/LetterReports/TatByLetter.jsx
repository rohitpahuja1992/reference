import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
//import { useHistory } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import DataTable from "../../components/DataTable";
import MatCard from "../MaterialUi/MatCard";

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
    alignItems: "center"
  },
  iconSize: {
    fontSize: "16px",
    paddingRight: "5px",
    width: "18px"
  },
  highlightedCell: {
    fontWeight: 500,
    width: "100px",
    padding: "9px 0px 9px 16px",
  },

  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.error.main,
  },
  statusNotConfig: {
    background: "#f39c12",
  },
}));

const cols = [
  { id: "id", label: "ID", width: "10%" },
  { id: "module", label: "Module", width: "15%" },
  { id: "delivery", label: "Delivery", width: "15%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "letterName", label: "Letter Name", width: "35%" },
  { id: "importedDate", label: "Date Import", width: "10%" },
  { id: "dateSetActive", label: "Date Set Active", width: "10%" },
  { id: "status", label: "Tat", maxWidth: "10%" },
];

const TatByLetter = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const clientId = useSelector((state) => state.Header.entityId);

  const tableConfig = {
    tableType: false,
    checked: false,
    paginationOption: "custom",
    enabled: false,
  };

  const updateCheckedStatus = () => {
    //do nothing
  }

  const updateAllCheckedStatus = () => {
    //do nothing
  }

  useEffect(() => {
  }, [dispatch, clientId]);

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Tat by Letter
          </Typography>
        }
      />
      <Divider />

      <DataTable
        cols={cols}
        rows={props.rows}
        config={tableConfig}
        updateCheckedStatus={updateCheckedStatus}
        updateAllCheckedStatus={updateAllCheckedStatus}
        // selectAll={selectAll}
        //updateValue={updateValue}
        totalElements={props.totalElements}
        startIndex={props.startIndex}
        handleNextPage={props.handlePageChange}
      />


    </MatCard>
  );
}

export default TatByLetter;
