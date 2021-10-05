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
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  circle: {
    strokeLinecap: "round",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
  },
  progressLabel: {
    color: "rgba(0,0,0,1)",
    marginTop: "3px",
  },
}));

const CountInsideCircular = (props) => {
  const { label, value, size, thickness, valueTextVariant, align } = props;
  const styles = useStyles();

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
            variant="static"
            disableShrink
            className={styles.top}
            classes={{
              circle: styles.circle,
            }}
            size={80}
            thickness={thickness}
            {...props}
            value={100}
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
            style={{ fontWeight: "600" }}
          >{`${value}`}</Typography>
        </Box>
      </Box>
      {label && (
        <Typography variant="subtitle1" className={styles.progressLabel}>
          {label}
        </Typography>
      )}
    </div>
  );
};

export default CountInsideCircular;
