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

const TotalModuleAnalytics = () => {
  const styles = useStyles();
  const moduleStats = useSelector(state => state.Dashboard.systemData.moduleStats);

  return (
    <MatCard>
      <CardContent className={styles.cardContent}>
        <div className={styles.overallCompletion}>
          <CountInsideCircular
            value={Object.keys(moduleStats).length !== 0 ? moduleStats.total_modules : 0}
            size={40}
            thickness={0}
            valueTextVariant="h4"
            label="Total no of Modules"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent style={{ paddingTop: "0px" }}>
        <div className={styles.statusProgress}>
          <CustomProgressBar
            label="OOB Module:"
            countWithSuffix={`${Object.keys(moduleStats).length !== 0 ? moduleStats.total_modules : 0} Modules`}
            value={moduleStats.normal_modules !== 0 ?parseFloat(
              (
                (moduleStats.normal_modules /
                  moduleStats.total_modules) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="blueMain"
          />
        </div>
        {/* <div className={styles.statusProgress}>
          <CustomProgressBar
            label="Global Module:"
            countWithSuffix={`${Object.keys(moduleStats).length !== 0 ? moduleStats.global_modules : 0} Modules`}
            value={moduleStats.global_modules !== 0 ?parseFloat(
              (
                (moduleStats.global_modules /
                  moduleStats.total_modules) *
                100
              )
                .toFixed(1)
                .toString()
            ):0.9}
            colorName="greenMain"
          />
        </div> */}
      </CardContent>
    </MatCard>
  );
};

export default TotalModuleAnalytics;
