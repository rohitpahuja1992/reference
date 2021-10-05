import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import SessionInfo from './SessionInfo';
import MatContainer from "../../../components/MaterialUi/MatContainer";
import PageHeading from "../../../components/PageHeading";
import {
  fetchSessionTimeout,
} from "../../../actions/SessionTimeoutActions";
import { fetchUsers } from "../../../actions/UserActions";
import { handleSessionsError, SESSION_TIME } from '../../../utils/Messages';

const useStyles = makeStyles((theme) => ({
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const Session = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const [apiError, setApiError] = useState(null);
  const sessionInfo = useSelector(state => state.SessionTimeout.sessionTimeDetails.list);
  const error = useSelector(state => state.SessionTimeout.getError);
  const isSessionUpdated = useSelector(
    (state) => state.SessionTimeout.isUpdated
  );
  
  useEffect(() => {
    if (error) {
      setApiError(handleSessionsError(error));
    }
    else {
      setApiError(null);
    }

    if (isSessionUpdated) {
      dispatch(fetchSessionTimeout());
    }

  },
    [dispatch, error, clientId, setApiError,isSessionUpdated]
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSessionTimeout());
  },
    [dispatch]
  );

  return (
    <MatContainer>
      {apiError && !(sessionInfo.length > 0) && (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      )}
      {!apiError && (
        <PageHeading
          heading={SESSION_TIME}
        />
      )}
      <Grid container>
        <Grid item xs={6}>
          {!apiError && (
            <SessionInfo details={sessionInfo.length > 0?sessionInfo[0]:0} />
          )}
        </Grid>
      </Grid>
    </MatContainer>
  )
}

export default Session;