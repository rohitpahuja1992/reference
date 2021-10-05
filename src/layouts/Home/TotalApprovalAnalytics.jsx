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

const TotalApprovalAnalytics = () => {
  const styles = useStyles();
  const controlStats = useSelector(state => state.Dashboard.systemData.controlStats);

  return (
    <MatCard>
      <CardContent className={styles.cardContent}>
        <div className={styles.overallCompletion}>
          <CountInsideCircular
            value={Object.keys(controlStats).length !== 0 ? controlStats.controls : 0}
            size={40}
            thickness={0}
            valueTextVariant="h4"
            label="Total no of Fields for Review"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent style={{ paddingTop: "0px" }}>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Awaiting Sign Off::"
            countWithSuffix={`${Object.keys(controlStats).length !== 0 ? (controlStats.awaiting_sign_off) : 0} Fields`}
            value={controlStats.awaiting_sign_off !==0?parseFloat(
              (
                ((controlStats.awaiting_sign_off) /
                  controlStats.controls) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="redMain"
          />
        </div>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Signed Off::"
            countWithSuffix={`${Object.keys(controlStats).length !== 0 ? (controlStats.sign_off) : 0} Fields`}
            value={controlStats.sign_off !== 0?parseFloat(
              (
                ((controlStats.sign_off) /
                  controlStats.controls) *
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
            label="Approved:"
            countWithSuffix={`${Object.keys(controlStats).length !== 0 ? controlStats.approved : 0} Fields`}
            value={controlStats.approved !== 0?parseFloat(
              (
                (controlStats.approved /
                  controlStats.controls) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="greenMain"
          />
        </div>
      </CardContent>
    </MatCard>
  );
};

export default TotalApprovalAnalytics;
