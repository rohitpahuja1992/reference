import React from "react";

import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
// import TableContainer from "@material-ui/core/TableContainer";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableRow from "@material-ui/core/TableRow";
// import TableCell from "@material-ui/core/TableCell";
// import Chip from "@material-ui/core/Chip";
// import { TextField } from "@material-ui/core";
// import StatusIcon from "../../assets/images/status-icon.svg";

import MatCard from "../MaterialUi/MatCard";

import { formatDate } from "../../utils/helpers";

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

const LetterAutVsInt = (props) => {
  const styles = useStyles();
  //autVsIntData
  const data = {
    labels: props.autVsIntData?.user_intervention?.month,
    datasets: [
      
      {
        label: "Intervention Required",
        backgroundColor: "#d2d6de",
        borderColor: "none",
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: "#d2d6de",
        hoverBorderColor: "none",
        data: props.autVsIntData?.user_intervention?.count
        //data: [11,22,33,44]
      },
      {
        label: "Full Automation",
        backgroundColor: "#00a65a",
        borderColor: "none",
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: "#00a65a",
        hoverBorderColor: "none",
        data: props.autVsIntData?.fully_automation?.count
        //data:[10,20,30,40]
      },

    ]
  }
  const options = {
    responsive: true,
    legend: {
      display: true,
      position: "bottom",
    },
    type: "bar"
  };
  // const handleClientStatusLabel = (status) => {
  //   if (status) {
  //     return "ACTIVE";
  //   }
  // };

  // const handleClientStatusClass = (status) => {
  //   if (status === "TERMINATED") {
  //     return styles.statusTerminated;
  //   } else if (status === "INACTIVE") {
  //     return styles.statusInactive;
  //   } else {
  //     return styles.statusActive;
  //   }
  // };

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Automation vs Intervention
          </Typography>
        }
      />
      <Divider />
      <CardContent className={styles.cardContent}>
        <Bar
          data={data}
          width={null}
          height={null}
          options={options}
        />
      </CardContent>
    </MatCard>
  );
};

export default LetterAutVsInt;
