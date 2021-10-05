import React from "react";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import { Pie, Doughnut } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import CustomProgressCircular from "../../components/CustomProgressCircular";

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

const ConfigDeploymentAnalytics = (props) => {
  const { analyticsData, title } = props;
  const styles = useStyles();
  const dataKey = "totalSummary";

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
        {Object.keys(analyticsData).length <= 0 && (
          <Grid item xs={12}>
            <CardContent className={styles.noDataCard}>
              <Typography variant="subtitle2">
                Record(s) not available.
              </Typography>
            </CardContent>
          </Grid>
        )}
        {Object.keys(analyticsData).length > 0 && (
          <>
            <Grid item xs={2}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.overallCompletion}>
                    <CustomProgressCircular
                      value={parseFloat(
                        (
                          (analyticsData[dataKey].validated /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      size={120}
                      thickness={6}
                      valueTextVariant="h5"
                      label="Overall Completion"
                      colorName="greenMain"
                    />
                  </div>
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            </Grid>
            <Grid item xs={2}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.overallCompletion}>
                    <CustomProgressCircular
                      value={parseFloat(
                        (
                          (analyticsData[dataKey].approved /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      )}
                      size={120}
                      thickness={6}
                      valueTextVariant="h5"
                      label="Approved"
                      colorName="greenMain"
                    />
                  </div>
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <Pie
                    data={{
                      labels: ["Awaiting Sign-Off", "Signed Off", "Approved"],
                      datasets: [
                        {
                          backgroundColor: ["#ff9800", "#5C78FF", "#4caf50"],
                          hoverBackgroundColor: [
                            "#f57c00",
                            "#222753",
                            "#388e3c",
                          ],
                          data: [
                            analyticsData[dataKey].awaiting_sign_off,
                            analyticsData[dataKey].sign_off,
                            analyticsData[dataKey].approved,
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                          fontSize: 12,
                          fontColor: "#000000",
                          fontStyle: "500",
                        },
                      },
                      plugins: {
                        datalabels: {
                          color: "white",
                          formatter: (value, ctx) => {
                            const label =
                              parseFloat(
                                (
                                  (value / analyticsData[dataKey].controls) *
                                  100
                                )
                                  .toFixed(1)
                                  .toString()
                              ) + "%"; //ctx.chart.data.labels[ctx.dataIndex];
                            return label;
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <Doughnut
                    data={{
                      labels: ["Custom Configuration", "Out-of-the-Box"],
                      datasets: [
                        {
                          backgroundColor: ["#ff9800", "#4caf50"],
                          hoverBackgroundColor: ["#f57c00", "#388e3c"],
                          data: [
                            analyticsData[dataKey].custom_controls,
                            analyticsData[dataKey].oob_controls,
                          ],
                        },
                      ],
                    }}
                    options={{
                      cutoutPercentage: 45,
                      responsive: true,
                      legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                          fontSize: 12,
                          fontColor: "#000000",
                          fontStyle: "500",
                        },
                      },
                      plugins: {
                        datalabels: {
                          color: "white",
                          formatter: (value, ctx) => {
                            const label =
                              parseFloat(
                                (
                                  (value / analyticsData[dataKey].controls) *
                                  100
                                )
                                  .toFixed(1)
                                  .toString()
                              ) + "%"; //ctx.chart.data.labels[ctx.dataIndex];
                            return label;
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            </Grid>
          </>
        )}
      </Grid>
    </MatCard>
  );
};

export default ConfigDeploymentAnalytics;
