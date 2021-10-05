import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    animationDuration: "550ms",
    position: "absolute",
    left: 0,
  },
  blueDark: {
    color: theme.palette.primary.dark,
  },
  blueMain: {
    color: theme.palette.primary.main,
  },
  blueLight: {
    color: theme.palette.primary.light,
  },
  yellowDark: {
    color: theme.palette.warning.dark,
  },
  yellowMain: {
    color: theme.palette.warning.main,
  },
  yellowLight: {
    color: theme.palette.warning.light,
  },
  greenDark: {
    color: theme.palette.success.dark,
  },
  greenMain: {
    color: theme.palette.success.main,
  },
  greenLight: {
    color: theme.palette.success.light,
  },
  redDark: {
    color: theme.palette.error.dark,
  },
  redMain: {
    color: theme.palette.error.main,
  },
  redLight: {
    color: theme.palette.error.light,
  },
  circle: {
    strokeLinecap: "round",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
  },
  progressLabel: {
    color: "rgba(0,0,0,0.6)",
    marginTop: "2px",
    textAlign:"center",
  },
}));

const CustomProgressCircular = (props) => {
  const {
    colorName,
    label,
    value,
    size,
    thickness,
    valueTextVariant,
    align,
  } = props;
  const styles = useStyles();

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
    else return styles.blueMain;
  };

  return (
    <div
      className={styles.chartContainer}
      style={{ alignItems: align || "center" }}
    >
      <Box position="relative" display="inline-flex">
        <div className={styles.root}>
          <CircularProgress
            variant="determinate"
            className={styles.bottom}
            size={size}
            thickness={thickness}
            {...props}
            value={100}
          />
          <CircularProgress
            variant="determinate"
         //  disableShrink
            className={`${styles.top} ${getProgressColor(colorName)}`}
            classes={{
              circle: styles.circle,
            }}
            size={80}
            value={value}
            thickness={thickness}
            {...props}
          />
        </div>
        {/* <CircularProgress variant="static" value={80} /> */}
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant={valueTextVariant}
            component="div"
          >{`${value}%`}</Typography>
        </Box>
      </Box>
      {label && (
        <Typography variant="subtitle2" className={styles.progressLabel}>
          {label}
        </Typography>
      )}
    </div>
  );
};

export default CustomProgressCircular;
