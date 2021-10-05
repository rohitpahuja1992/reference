import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { handleFeatureDetailsError } from "../../../utils/Messages"
import PageHeading from "../../../components/PageHeading";
import UpdateFeatureDetails from "../../../components/UpdateFeatureDetails";
import FeatureStatusDetails from "../../../components/FeatureStatusDetails";
import { fetchFeatureProfile } from "../../../actions/FeatureActions";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "5px 10px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const FeatureDetails = () => {
  const { featureId } = useParams();
  const styles = useStyles();
  const dispatch = useDispatch();
  const featureData = useSelector((state) => state.Feature.profile.details);
  const featureProfile = useSelector((state) => state.Feature.profile);
  const [isDetailsUpdated, setDetailsUpdated] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (featureId) dispatch(fetchFeatureProfile(featureId));
  }, [dispatch, featureId]);

  useEffect(() => {
    if(featureProfile.error)
      setApiError(handleFeatureDetailsError(featureProfile.error));
    else
      setApiError(false);
  },
    [featureProfile.error]
  );

  return (
    <>
      {featureData && (
        <PageHeading heading={featureData.featureName + ` Feature`} />
      )}

      <Grid container>
        {apiError && featureProfile.isFetchCalled && (
          <Grid item xs={12} className={styles.col}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">
                {apiError.message}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={8} style={{ display: "flex" }}>
          {featureData && (
            <UpdateFeatureDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              details={featureData}
            />
          )}
        </Grid>
        <Grid item xs={4} style={{ display: "flex" }}>
          {featureData && <FeatureStatusDetails details={featureData} />}
        </Grid>
      </Grid>
    </>
  );
};

export default FeatureDetails;
