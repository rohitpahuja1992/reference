import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import MatCard from "../../components/MaterialUi/MatCard";
import AutomationMetrics from "../../components/AutomationMetrics";
import AutomationFailure from "../../components/AutomationFailure";
import AutomationInProgress from "../../components/AutomationInProgress";
import AutomationAutoConfig from "../../components/AutomationAutoConfig";
import {
  COMMON_ERROR_MESSAGE,
} from "../../utils/Messages";

import {
  fetchMetricsByClientId,
  fetchBusinessByClientId,
  fetchModulesByClientId,
  fetchCompanyByClientId
} from "../../actions/LettersActions";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",
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

const Automation = () => {
  const styles = useStyles();
  const clientId = useSelector((state) => state.Header.entityId);
  const dispatch = useDispatch();
  const matrixData = useSelector((state) => state.Letters.matrixData) || {};
  useEffect(() => {
    if (clientId) {
      dispatch(fetchModulesByClientId(clientId));
      dispatch(fetchBusinessByClientId(clientId));
      dispatch(fetchCompanyByClientId(clientId));
      dispatch(fetchMetricsByClientId(clientId));
    }
  }, [dispatch, clientId]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Automation
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        {false && (
          <Grid item xs={12} className={styles.error}>
            <Card className={styles.errorCard}>
              <Typography variant="body2">
                {COMMON_ERROR_MESSAGE}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          <AutomationMetrics matrixData={matrixData} />
        </Grid>
        <Grid item xs={12}>
          <AutomationFailure />
        </Grid>

        <Grid item xs={12}>
          <AutomationInProgress />
        </Grid>
        <Grid item xs={12}>
          <AutomationAutoConfig autoConfigured={matrixData.auto_configured} />
        </Grid>
      </Grid>
    </MatCard>
  );
};

export default Automation;

