import React from "react";
import { useSelector } from "react-redux";
import { Divider, makeStyles } from "@material-ui/core";

import CardContent from "@material-ui/core/CardContent";
import MatCard from "../../components/MaterialUi/MatCard";
import CountInsideCircular from "../../components/CountInsideCircular";
import CustomProgressBar from "../../components/CustomProgressBar";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
  },
  cardContent: {
    flex: 1,
    padding: "16px 30px 25px",
  },
  statusProgress: {
    paddingTop: "14px",
  },
  overallCompletion: {
    paddingTop: "20px",
  },
  noDataCard: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    paddingTop: "20px",
  },
}));

const TotalClientAnalytics = () => {
  const styles = useStyles();
  const clientStats = useSelector(state => state.Dashboard.systemData.clientStats);

  return (
    <MatCard>
      <CardContent className={styles.cardContent}>
        <div className={styles.overallCompletion}>
          <CountInsideCircular
            value={Object.keys(clientStats).length !== 0 ? clientStats.total_clients : 0}
            size={40}
            thickness={0}
            valueTextVariant="h4"
            label="Total no of Clients"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent style={{ paddingTop: "0px" }}>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Active:"
            countWithSuffix={`${Object.keys(clientStats).length !== 0 ? clientStats.active_clients : 0} Clients`}
            value={clientStats.active_clients !== 0 ?parseFloat(
              (
                (clientStats.active_clients /
                  clientStats.total_clients) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="blueMain"
          />
        </div>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Inactive:"
            countWithSuffix={`${Object.keys(clientStats).length !== 0 ? clientStats.inactive_clients : 0} Clients`}
            value={clientStats.inactive_clients !== 0 ?parseFloat(
              (
                (clientStats.inactive_clients /
                  clientStats.total_clients) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="yellowMain"
          />
        </div>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Terminated:"
            countWithSuffix={`${Object.keys(clientStats).length !== 0 ? clientStats.terminated_clients : 0} Clients`}
            value={clientStats.terminated_clients !== 0 ? parseFloat(
              (
                (clientStats.terminated_clients /
                  clientStats.total_clients) *
                100
              )
                .toFixed(1)
                .toString()
            ) : 0.9}
            colorName="redMain"
          />
        </div>
      </CardContent>
    </MatCard>
  );
};

export default TotalClientAnalytics;
