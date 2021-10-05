import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyle = makeStyles((theme) => ({
  root: {
    height: 8,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  blueDark: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.dark,
  },
  blueMain: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
  blueLight: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.light,
  },
  yellowDark: {
    borderRadius: 5,
    backgroundColor: theme.palette.warning.dark,
  },
  yellowMain: {
    borderRadius: 5,
    backgroundColor: theme.palette.warning.main,
  },
  yellowLight: {
    borderRadius: 5,
    backgroundColor: theme.palette.warning.light,
  },
  greenDark: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.dark,
  },
  greenMain: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.main,
  },
  greenLight: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.light,
  },
  redDark: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.dark,
  },
  redMain: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.main,
  },
  redLight: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.light,
  },
  cyanDark: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.dark,
  },
  cyanMain: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  },
  cyanLight: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.light,
  },
  label: {
    fontSize: "13px",
    color: "rgba(0,0,0,0.6)",
    fontWeight: 700,
    paddingBottom: "4px",
  },
  suffix: {
    color: "rgba(0,0,0,1)",
  },
}));

const CustomProgressBar = (props) => {
  const { value, label, countWithSuffix, colorName } = props;
  const styles = useStyle();

  const getProgressColor = (color) => {
    if (color === "blueDark") return styles.blueDark;
    else if (color === "blueMain") return styles.blueMain;
    else if (color === "blueLight") return styles.blueLight;
    else if (color === "yellowDark") return styles.yellowDark;
    else if (color === "yellowMain") return styles.yellowMain;
    else if (color === "yellowLight") return styles.yellowLight;
    else if (color === "greenDark") return styles.greenDark;
    else if (color === "greenMain") return styles.greenMain;
    else if (color === "greenLight") return styles.greenLight;
    else if (color === "redDark") return styles.redDark;
    else if (color === "redMain") return styles.redMain;
    else if (color === "redLight") return styles.redLight;
    else if (color === "cyanDark") return styles.cyanDark;
    else if (color === "cyanMain") return styles.cyanMain;
    else if (color === "cyanLight") return styles.cyanLight;
    else return styles.blueMain;
  };

  return (
    <>
      {(label || countWithSuffix) && (
        <Typography variant="subtitle2" className={styles.label}>
          {label} <span className={styles.suffix}>{countWithSuffix}</span>
        </Typography>
      )}
      <LinearProgress
        classes={{
          root: styles.root,
          colorPrimary: styles.colorPrimary,
          bar: getProgressColor(colorName),
        }}
        variant="determinate"
        value={value}
      />
    </>
  );
};

export default CustomProgressBar;
