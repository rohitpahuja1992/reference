import React from "react";
import { Divider, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
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

const TotalUserAnalytics = () => {
  const styles = useStyles();
  const userStats = useSelector(state => state.Dashboard.systemData.userStats);

  return (
    <MatCard>
      <CardContent className={styles.cardContent}>
        <div className={styles.overallCompletion}>
          <CountInsideCircular
            value={Object.keys(userStats).length !== 0 ? userStats.total_users : 0}
            size={40}
            thickness={0}
            valueTextVariant="h4"
            label="Total no of Users"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent style={{ paddingTop: "0px" }}>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Active:"
            countWithSuffix={`${Object.keys(userStats).length !== 0 ? userStats.active_users : 0} Users`}
            value={userStats.active_users !== 0?parseFloat(
              (
                (userStats.active_users /
                  userStats.total_users) *
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
            countWithSuffix={`${Object.keys(userStats).length !== 0 ? userStats.inactive_users : 0} Users`}
            value={userStats.inactive_users !== 0?parseFloat(
              (
                (userStats.inactive_users /
                  userStats.total_users) *
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
            countWithSuffix={`${Object.keys(userStats).length !== 0 ? userStats.terminated_users : 0} Users`}
            value={userStats.terminated_users !== 0?parseFloat(
              (
                (userStats.terminated_users /
                  userStats.total_users) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="redMain"
          />
        </div>
      </CardContent>
    </MatCard>
  );
};

export default TotalUserAnalytics;
