import React from "react";
import { Divider, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";

import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
import CountInsideCircular from "../../components/CountInsideCircular";

//import CustomProgressBar from "../../components/CustomProgressBar";
import {
  //ADMIN, CLIENT_USER_ACC, CONF_USER_ACC, PROD_USER_ACC, QA_USER_ACC, 
  ROLE_BASED_USER_TRE, TOT_NO_ACT_USERS
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  overallCompletion: {
    paddingTop: "20px",
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
  noDataCard: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    paddingTop: "20px",
  },
}));

const ActiveUserRoleWiseAnalytics = () => {
  const styles = useStyles();
  const roleData = useSelector(state => state.Dashboard.roleData);
  const userStats = useSelector(state => state.Dashboard.systemData.userStats);
  const uniqueRoleName = useSelector(state => state.Role.data.list.map(obj => obj?.roleName)).sort((a, b) => (a?a:'').toLowerCase() > (b?b:'').toLowerCase() ? 1 : -1);
  const groupByRole = Object.keys(roleData).length > 0 && roleData.reduce((acc, obj) => {
    let key = obj['role_name']
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})

  const count = Object.keys(groupByRole).length > 0 && uniqueRoleName.map(obj => groupByRole[obj] && groupByRole[obj].length)

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {ROLE_BASED_USER_TRE}
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        <Grid item xs={3} style={{ display: "flex" }}>
          <div style={{ flex: 1, display: "flex" }}>
            <CardContent className={styles.cardContent}>
              <div
                className={styles.overallCompletion}
                style={{ marginTop: "40%" }}
              >
                <CountInsideCircular
                  value={`${
                    Object.keys(userStats).length !== 0
                      ? userStats.active_users
                      : 0
                  }`}
                  size={40}
                  thickness={0}
                  valueTextVariant="h4"
                  label={TOT_NO_ACT_USERS}
                />
              </div>
            </CardContent>
            <Divider orientation="vertical" flexItem />
          </div>
        </Grid>

        <Grid item xs={9}>
          <CardContent className={styles.cardContent}>
            {/* <div className={styles.statusProgress}>
              <CustomProgressBar
                label={ADMIN}
                countWithSuffix={`4 Users`}
                value={8}
                colorName="redMain"
              />
            </div>
            <div className={styles.statusProgress}>
              <CustomProgressBar
                label={PROD_USER_ACC}
                countWithSuffix={`11 Users`}
                value={22}
                colorName="blueMain"
              />
            </div>
            <div className={styles.statusProgress}>
              <CustomProgressBar
                label={CONF_USER_ACC}
                countWithSuffix={`13 Users`}
                value={27}
                colorName="greenMain"
              />
            </div>
            <div className={styles.statusProgress}>
              <CustomProgressBar
                label={QA_USER_ACC}
                countWithSuffix={`6 Users`}
                value={12}
                colorName="yellowMain"
              />
            </div>
            <div className={styles.statusProgress}>
              <CustomProgressBar
                label={CLIENT_USER_ACC}
                countWithSuffix={`14 Users`}
                value={29}
                colorName="cyanMain"
              />
            </div> */}
            <div
              className={styles.overallCompletion}
              style={{ paddingTop: "0px" }}
            >
              <Bar
                height={8 * 16}
                data={{
                  labels: uniqueRoleName,
                 
                  datasets: [
                    {
                      data: count,
                      label: "Number of users",
                      backgroundColor: [
                        "#5c78ff",
                        "#f44336",
                        "#4caf50",
                        "#ff9800",
                        "#9e9e9e",
                      ],
                      borderWidth: 0,
                      barThickness: 40,
                      barPercentage: 0.5,
                      // hoverBackgroundColor: "#18D09E",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  legend: {
                    display: false,
                    // position: "top",
                    // height: 200,
                    // labels: {
                    //   padding: 15,
                    //   usePointStyle: true,
                    //   fontSize: 12,
                    //   fontColor: "#000000",
                    //   fontStyle: "500",
                    // },
                  },
                  scales: {
                    xAxes: [{
                      gridLines: {
                          color: "rgba(0, 0, 0, 0)",
                      }
                  }],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                        gridLines: {
                          color: "rgba(0, 0, 0, 0)",
                        }
                      },
                    ],
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
        </Grid>
      </Grid>
    </MatCard>
  );
};

export default ActiveUserRoleWiseAnalytics;
