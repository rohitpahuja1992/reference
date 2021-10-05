import React from "react";
import { makeStyles } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import RepeatIcon from "@material-ui/icons/Repeat";
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import { ADDED, CHANGED, LEGEND, REMOVED, NOTPRESENT } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  indicationBox: {
    border: "1px dashed #bcbecd",
    padding: "6px 6px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    marginTop: "-30px",
  },
  indicationText: {
    padding: "0 6px 8px",
    color: "grey",
  },
  indicationRow: {
    display: "flex",
  },
  indicationCol: {
    display: "flex",
    backgroundColor: "#fff",
    padding: "2px 14px 2px 8px",
    borderRadius: "4px",
    margin: "0 6px",
    fontWeight: 500,
    height: "24px",
    alignItems: "center",
  },
  added: {
    background: "#e8f5e9",
    color: "#43a047",
    border: "1px solid #43a047",
  },
  removed: {
    background: "#ffebee",
    color: "#e53935",
    border: "1px solid #e53935",
  },
  notPresent: {
    background: "#dbedff",
    color: "#115293",
    border: "1px solid #115293",
  },
  changed: {
    background: "#fff3e0",
    color: "#fb8c00",
    border: "1px solid #fb8c00",
  },
  addActionIcon: {
    color: theme.palette.success.main,
    marginRight: "5px",
  },
  removeActionIcon: {
    color: theme.palette.error.main,
    marginRight: "5px",
  },
  notPresentActionIcon: {
    color: "#115293",
    marginRight: "5px",
  },
  replaceActionIcon: {
    color: theme.palette.warning.main,
    marginRight: "5px",
  },
}));

const CompareVersionLegend = (props) => {
  const styles = useStyles();

  return (
    <div className={styles.indicationBox}>
      <div className={styles.indicationText}>{LEGEND}</div>
      <div className={styles.indicationRow}>
        <div className={`${styles.indicationCol} ${styles.added}`}>
          <AddIcon fontSize="small" className={styles.addActionIcon} />
          <div className={styles.symbolText}>{ADDED}</div>
        </div>
        <div className={`${styles.indicationCol} ${styles.removed}`}>
          <RemoveIcon fontSize="small" className={styles.removeActionIcon} />
          <div className={styles.symbolText}>{REMOVED}</div>
        </div>
        <div className={`${styles.indicationCol} ${styles.notPresent}`}>
          <TurnedInNotIcon fontSize="small" className={styles.notPresentActionIcon} />
          <div className={styles.symbolText}>{NOTPRESENT}</div>
        </div>
        <div className={`${styles.indicationCol} ${styles.changed}`}>
          <RepeatIcon fontSize="small" className={styles.replaceActionIcon} />
          <div className={styles.symbolText}>{CHANGED}</div>
        </div>
      </div>
    </div>
  );
};

export default CompareVersionLegend;
