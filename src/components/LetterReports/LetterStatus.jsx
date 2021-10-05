/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";

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
  },

  statusInactive: {
    background: theme.palette.warning.main,
  },
  statusTerminated: {
    background: theme.palette.error.main,
  },
}));

const LetterStatus = (props) => {
  const styles = useStyles();
  const [arrStatus, setArrStatus] = useState([]);
  const [arrStatusValue, setArrStatusValue] = useState([]);

  const bindings = {
    active_status: "Active",
    inactive_status: "Inactive",
    letter_tagging: "Letter Tagging",
    awaiting_import: "Awaiting Import",
    error_status: "Errors",
    config_automation: "Config Automation",
  };

  useEffect(() => {
    var status = [],
      statusValue = [];
    for (let [key, value] of Object.entries(props.statusData)) {
      status.push(bindings[key]);
      statusValue.push(value);
    }
    setArrStatus(status);
    setArrStatusValue(statusValue);
  }, [props.statusData]);

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Letter Status
          </Typography>
        }
      />
      <Divider />
      <CardContent className={styles.cardContent}>
        <Doughnut
          data={{
            labels:
              arrStatus.length > 0
                ? arrStatus
                : [
                    "Active",
                    "Inactive",
                    "Letter Tagging",
                    "Awaiting Import",
                    "Errors",
                    "Config Automation",
                  ],
            datasets: [
              {
                backgroundColor: [
                  "#00a65a",
                  "#f56954",
                  "#f39c12",
                  "#00c0ef",
                  "#3c8dbc",
                  "#d2d6de",
                ],
                hoverBackgroundColor: [
                  "#00a65a",
                  "#f56954",
                  "#f39c12",
                  "#00c0ef",
                  "#3c8dbc",
                  "#d2d6de",
                ],
                data:
                  arrStatusValue.length > 0
                    ? arrStatusValue
                    : [0.0, 0, 0, 0, 0, 0],
                //label:arrStatusValue.length>0?arrStatusValue.length:"No data to display",
                fontColor: "fff",
              },
            ],
          }}
          options={{
            cutoutPercentage: 45,
            responsive: true,
            legend: {
              display: true,
              position: "right",
              labels: {
                padding: 15,
                usePointStyle: true,
                fontSize: 14,
                fontColor: "#000",
                fontStyle: "500",
              },
            },
            plugins: {
              datalabels: {
                color: "white",
                formatter: (value, ctx) => {},
              },
            },
          }}
        />
      </CardContent>
    </MatCard>
  );
};

export default LetterStatus;
