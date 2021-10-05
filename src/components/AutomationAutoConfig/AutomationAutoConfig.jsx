import React from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatCard from "../MaterialUi/MatCard";
import 'font-awesome/css/font-awesome.min.css';
import metStyles from "../../components/AutomationMetrics/AutMetrics.module.scss";

const useStyles = makeStyles((theme) => ({
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
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",

    "& li": { lineHeight: "20px" },
  },

  hyperLink: {
    color: "#3e719e",
    textDecoration: "none",
    "&:active, &:hover, &:focus": {
      outline: "none",
      textDecoration: "none",
      color: "#72afd2",
    },
  },
}));

const AutomationMetrics = (props) => {
  const styles = useStyles();

  return (
    <MatCard>
     
      <Grid container className={metStyles.metContainer} spacing={2}>
        <Grid item xs={12} sm={6} md={3}></Grid>
        <Grid item xs={12} sm={6} md={3}></Grid>
        <Grid item xs={12} sm={6} md={3}></Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={`${metStyles.bgGreen} ${metStyles.smallBox}`}>
            <div className={metStyles.inner}>
              <h3>+{props.autoConfigured}{" "}
              <sup>more</sup>
              </h3>

              <p>Auto Configured</p>
            </div>
            <div className={metStyles.icon}>
              <i className="fa fa-plus-circle"></i>
            </div>
            <Link to="template-library"
              className={metStyles.smallBoxFooter}
            >
              Go To Template Library <i className="fa fa-arrow-circle-right"></i>
            </Link>
          </div>
        </Grid>
      </Grid>
    </MatCard>
  );
};

export default AutomationMetrics;
