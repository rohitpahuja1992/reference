import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cpRow1: {
    textAlign: "center",
  },
  moduleLabel: {
    marginTop: "20px",
    marginLeft: "8px",
    fontSize: "16px",
    fontWeight: 400,
    display: "inline-block",
    padding: "10px 20px",
    borderRadius: "7px",
    background: "#5c78ff",
    color: "#fff",
    minWidth: "80px",
    position: "relative",
  },
  moduleLabelLine: {
    content: "",
    position: "absolute",
    left: "50%",
    top: "100%",
    width: "1px",
    height: "25px",
    background: "#bcbecd",
  },
  cpRow2: {
    position: "relative",
    height: "25px",
    marginBottom: "16px",
  },
  cpLine1: {
    width: "calc(100% - 500px)",
    position: "absolute",
    bottom: 0,
    height: "1px",
    left: "248px",
    background: "#bcbecd",
  },
  cpLine2: {
    position: "absolute",
    top: 0,
    width: "1px",
    height: "25px",
    background: "#bcbecd",
  },
  cpLine3: {
    position: "absolute",
    top: 0,
    width: "1px",
    height: "25px",
    background: "#bcbecd",
    right: 0,
  },
}));

const CompareVersionHeading = (props) => {
  const { heading } = props;
  const styles = useStyles();

  return (
    <div className={styles.headingContainer}>
      <div className={styles.cpRow1}>
        <div className={styles.moduleLabel}>
          {heading}
          <div className={styles.moduleLabelLine}></div>
        </div>
      </div>
      <div className={styles.cpRow2}>
        <div className={styles.cpLine1}>
          <div className={styles.cpLine2}></div>
          <div className={styles.cpLine3}></div>
        </div>
      </div>
    </div>
  );
};

export default CompareVersionHeading;
