import React from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";

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

const IndividualModuleAnalytics = (props) => {
  const { analyticsData, title} = props;
  const styles = useStyles();
  const dataKey = "totalSummary";



  let DounChartlabels=[];
  let bgColorDoun=[];
  let customDataDoun=[];
  const customLabelsDoun=(data) =>
  {     
    DounChartlabels=[];
    bgColorDoun=[];
    customDataDoun=[];
    if(data.custom_controls>0)
    {
      DounChartlabels.push("Custom Configuration")
      bgColorDoun.push("#ff9800")
      customDataDoun.push(data.custom_controls)
    }
    if(data.oob_controls>0)
    {
      DounChartlabels.push("Out-of-the-Box")
      bgColorDoun.push("#4caf50")
      customDataDoun.push(data.oob_controls)
    }       
   return DounChartlabels; 
  } 

  let pieChartlabels=[];
  let bgColorPie=[];
  let customDataPie=[];
  const customLabelsPie=(data) =>
  {     
    pieChartlabels=[];
    bgColorPie=[];
    customDataPie=[];
    if(data.awaiting_sign_off>0)
    {
      pieChartlabels.push("Awaiting Sign-Off")
      bgColorPie.push("#ffa500")
      customDataPie.push(data.awaiting_sign_off)
    }
    if(data.sign_off>0)
    {
      pieChartlabels.push("Signed Off")
      //bgColorPie.push("#0000FF")
      bgColorPie.push("#5C78FF")
      customDataPie.push(data.sign_off)
    }
    if(data.approved>0)
    {
      pieChartlabels.push("Approved")
      bgColorPie.push("#0000FF")
      customDataPie.push(data.approved)
    }
    if(data.product_review_needed>0 || data.client_review_needed>0   || data.config_review_needed>0)
    {
     // console.log(data.module + data.client_review_needed); 
     pieChartlabels.push("Review Needed")
     bgColorPie.push("#FF0000")
     customDataPie.push(data.product_review_needed+data.client_review_needed+data.config_review_needed)
    }
    if(data.configured>0)
    {
      pieChartlabels.push("Configured")
      bgColorPie.push("#008000")
      customDataPie.push(data.configured)
    }
    if(data.validated)
    {
      pieChartlabels.push("Validated")
      bgColorPie.push("#800080")
      customDataPie.push(data.validated)
    }    
   return pieChartlabels; 
  } 



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
        {(Object.keys(analyticsData).length <= 0 ||
          !analyticsData[dataKey]) && (
          <Grid item xs={12}>
            <CardContent className={styles.noDataCard}>
              <Typography variant="subtitle2">
                Record(s) not available.
              </Typography>
            </CardContent>
          </Grid>
        )}
        {Object.keys(analyticsData).length > 0 && analyticsData[dataKey] && (
          <>
          <Grid item xs={12}>
          <div style={{ flex: 1, display: "flex" }}>              
                <CardContent className={styles.cardContent}>
                  <div className={styles.overallCompletion}>
                    <CustomProgressCircular
                      value={isNaN(parseFloat(
                        (
                          (analyticsData[dataKey].approved /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      ))?0:(parseFloat(
                        (
                          (analyticsData[dataKey].validated /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      ))}
                      size={120}
                      thickness={6}
                      valueTextVariant="h5"
                      label="Overall Completion"
                      colorName="greenMain"
                    />
                  </div>
                </CardContent>
                
                <Divider orientation="vertical" flexItem />            
              <CardContent className={styles.cardContent}>
                  <div className={styles.overallCompletion}>
                    <CustomProgressCircular
                      value={isNaN(parseFloat(
                        (
                          (analyticsData[dataKey].sign_off /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      ))?0:(parseFloat(
                        (
                          ((analyticsData[dataKey].controls - analyticsData[dataKey].awaiting_sign_off) /
                            analyticsData[dataKey].controls) *
                          100
                        )
                          .toFixed(1)
                          .toString()
                      ))}
                      size={120}
                      thickness={6}
                      valueTextVariant="h5"
                      label="Client Review Completion"
                      colorName="greenMain"
                    />
                  </div>
                </CardContent>
                <Divider orientation="vertical" flexItem />
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent >
                  <Pie width="320px" height="200px"
                    data={{
                      labels: customLabelsPie(analyticsData[dataKey]),
                      datasets: [
                        {
                          backgroundColor: bgColorPie,                         
                          data:customDataPie,
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
                                (value /
                                  analyticsData[dataKey].controls) *
                                100
                              )
                                .toFixed(1)
                                .toString()
                            ) + "%"; //ctx.chart.data.labels[ctx.dataIndex];
                          let itemValue = (
                            analyticsData[dataKey].controls / 10
                          ).toFixed(0);
                          if (
                            value > 0 &&
                            analyticsData[dataKey].controls < 20
                          )
                            return label;
                          else if (
                            value > 0 &&
                            value > itemValue &&
                            analyticsData[dataKey].controls > 20
                          )
                            return label;
                          else return "";
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
            
           
              <div style={{ flex: 1, display: "flex" }}>
                <CardContent >
                  <Doughnut width="320px" height="200px"
                    data={{
                      labels: customLabelsDoun(analyticsData[dataKey]), 
                      datasets: [
                        {
                          backgroundColor: bgColorDoun,
                          data:customDataDoun,
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
                              if (ctx.dataset.data[ctx.dataIndex] > 0)
                              return label ;
                            else
                              return "";
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
                <Divider orientation="vertical" flexItem />
              </div>
              </div>
              </Grid>
          </>
        )}
      </Grid>
    </MatCard>
  );
};

export default IndividualModuleAnalytics;
