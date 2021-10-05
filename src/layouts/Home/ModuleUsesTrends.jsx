import React from "react";
import { Divider, makeStyles } from "@material-ui/core";
import { HorizontalBar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
// import CountInsideCircular from "../../components/CountInsideCircular";
// import CustomProgressBar from "../../components/CustomProgressBar";
import { MOD_USERS_TRE, NO_RECORDS_MESSAGE } from "../../utils/Messages";

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
    paddingTop: "20px",
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

const ModuleUsesTrends = () => {
  const styles = useStyles();
  const moduleUsageData = useSelector(
    (state) => state.Dashboard.moduleUsageData
  );
  const sortedList =
    moduleUsageData.length > 0 &&
    moduleUsageData
      .filter((obj) => obj.client_assignments > 0)
      .sort((a, b) =>
        a.module_name.toLowerCase() > b.module_name.toLowerCase() ? 1 : -1
      );
  const moduleName =
    sortedList.length > 0 && sortedList.map((obj) => obj.module_name);
  const clientsAssigned =
    sortedList.length > 0 && sortedList.map((obj) => obj.client_assignments);
  const totalFields =
    sortedList.length > 0 && sortedList.map((obj) => obj.controls);
  const configurable =
    sortedList.length > 0 && sortedList.map((obj) => obj.configurable);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {MOD_USERS_TRE}
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        {Object.keys(sortedList).length <= 0 ? (
          <Grid item xs={12}>
            <CardContent className={styles.noDataCard}>
              <Typography variant="subtitle2">{NO_RECORDS_MESSAGE}</Typography>
            </CardContent>
          </Grid>
        ) : (
            <Grid item xs={12} style={{ display: "flex" }}>
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent className={styles.cardContent}>
                  <div
                    className={styles.overallCompletion}
                    style={{ paddingTop: "0px" }}
                  >
                    <HorizontalBar
                      height={moduleName.length * 25}
                      data={{
                        labels: moduleName,
                        datasets: [
                          {
                            data: clientsAssigned,
                            label: "Assigned in Clients",
                            backgroundColor: "#4caf50",
                            borderWidth: 0,
                            // hoverBackgroundColor: "#18D09E",
                          },
                          {
                            data: totalFields,
                            label: "Total Fields",
                            backgroundColor: "#5c78ff",
                            borderWidth: 0,
                            // hoverBackgroundColor: "#3681E8",
                          },
                          {
                            data: configurable,
                            label: "Configurable Fields",
                            backgroundColor: "#ff9800",
                            borderWidth: 0,
                            // hoverBackgroundColor: "#FE9B19",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            padding: 15,
                            usePointStyle: true,
                            fontSize: 12,
                            fontColor: "#000000",
                            fontStyle: "500",
                          },
                        },
                        scales: {
                          xAxes: [{
                            gridLines: {
                              color: "rgba(0, 0, 0, 0)",
                            }
                          }],
                          // yAxes: [{
                          //   gridLines: {
                          //     offsetGridLines:true,
                          //     color: "rgba(0, 0, 0, 0)",
                          //   }
                          // }],
                        },
                        plugins: {
                          datalabels: {
                            color: "#000000",
                            // anchor: "end",
                            // align: "end",
                            // formatter: (value, ctx) => {
                            //   return value;
                            // },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            </Grid>
          )}
      </Grid>
    </MatCard>
  );
};

export default ModuleUsesTrends;
