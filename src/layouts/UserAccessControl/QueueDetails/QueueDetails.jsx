import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import PageHeading from "../../../components/PageHeading";
import UpdateQueueDetails from "../../../components/UpdateQueueDetails";
import QueueStatusDetails from "../../../components/QueueStatusDetails";
import { fetchQueueProfile } from "../../../actions/QueueActions";
import { COMMON_ERROR_MESSAGE } from "../../../utils/Messages";

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
}));

const QueueDetails = () => {
  const { queueId } = useParams();
  const styles = useStyles();
  const dispatch = useDispatch();
  const queueData = useSelector((state) => state.Queue.profile.details);
  const queueProfile = useSelector((state) => state.Queue.profile);
  const [isDetailsUpdated, setDetailsUpdated] = useState(false);

  useEffect(() => {
    if (queueId) dispatch(fetchQueueProfile(queueId));
  }, [dispatch, queueId]);

  return (
    <>
      {queueData && <PageHeading heading={queueData.name} />}

      <Grid container>
        {queueProfile.error && queueProfile.isFetchCalled && (
          <Grid item xs={12} className={styles.col}>
            <Card className={styles.errorCard}>
              <Typography variant="body2">
                {COMMON_ERROR_MESSAGE}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={8} style={{ display: "flex" }}>
          {queueData && (
            <UpdateQueueDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              details={queueData}
            />
          )}
        </Grid>
        <Grid item xs={4} style={{ display: "flex" }}>
          {queueData && <QueueStatusDetails details={queueData} />}
        </Grid>
      </Grid>
    </>
  );
};

export default QueueDetails;
