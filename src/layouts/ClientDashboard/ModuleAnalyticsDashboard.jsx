import React from "react";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";

import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
// import LinearProgress from "@material-ui/core/LinearProgress";

import MatCard from "../../components/MaterialUi/MatCard";
import CustomProgressCircular from "../../components/CustomProgressCircular";
import CustomProgressBar from "../../components/CustomProgressBar";
import { NO_RECORDS_MESSAGE } from "../../utils/Messages";

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
    paddingTop: "8px",
  },
  noDataCard: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    paddingTop: "20px",
  },
}));

const ModuleAnalyticsDashboard = (props) => {
  const { dashboardData, title } = props;
  const styles = useStyles();

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {title}
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        {Object.keys(dashboardData).length <= 0 && (
          <Grid item xs={12}>
            <CardContent className={styles.noDataCard}>
              <Typography variant="subtitle2">{NO_RECORDS_MESSAGE}</Typography>
            </CardContent>
          </Grid>
        )}
        {Object.keys(dashboardData).map((dataKey) => (
          <>
            <Grid item xs={3}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                    {dashboardData[dataKey].module}
                  </Typography>
                  <div className={styles.overallCompletion}>
                    <CustomProgressCircular
                      value={parseFloat(
                        (
                          (dashboardData[dataKey].validated /
                            dashboardData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      size={80}
                      thickness={5}
                      valueTextVariant="subtitle1"
                      label="Overall Completion"
                      colorName="greenMain"
                    />
                  </div>
                  <div className={styles.statusProgress}>
                    <CustomProgressBar
                      label="Awaiting Sign Off:"
                      countWithSuffix={`${dashboardData[dataKey].awaiting_sign_off} Fields`}
                      value={parseFloat(
                        (
                          (dashboardData[dataKey].awaiting_sign_off /
                            dashboardData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      colorName="yellowMain"
                    />
                  </div>
                  <div className={styles.statusProgress}>
                    <CustomProgressBar
                      label="Signed Off:"
                      countWithSuffix={`${dashboardData[dataKey].sign_off} Fields`}
                      value={parseFloat(
                        (
                          (dashboardData[dataKey].sign_off /
                            dashboardData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      colorName="blueMain"
                    />
                  </div>
                  <div className={styles.statusProgress}>
                    <CustomProgressBar
                      label="Approved:"
                      countWithSuffix={`${dashboardData[dataKey].approved} Fields`}
                      value={parseFloat(
                        (
                          (dashboardData[dataKey].approved /
                            dashboardData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      colorName="greenMain"
                    />
                  </div>
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
              <Divider />
            </Grid>
          </>
        ))}
      </Grid>
    </MatCard>
  );
};

export default ModuleAnalyticsDashboard;
