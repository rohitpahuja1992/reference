/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";

import { updateEntityId } from "../../actions/AppHeaderActions";
import { handleIndividualClientConfigAnalyticsError } from "../../utils/Messages";
import { fetchClientAllModuleAnalytics } from "../../actions/ClientAnalyticsActions";
import EnvironmentStatus from "./EnvironmentStatus";
import ScheduleDeployment from "./ScheduleDeployment";
import DeploymentHistory from "./DeploymentHistory";

const IndividualClientConfig = () => {
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const allModuleAnalyticsError = useSelector(
    (state) => state.ClientAnalytics.AllModuleAnalytics.error
  );
  const [analyticsError, setAnalyticsError] = useState(null);

 

  useEffect(() => {
    dispatch(updateEntityId(clientId));
    dispatch(fetchClientAllModuleAnalytics(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (allModuleAnalyticsError)
      setAnalyticsError(handleIndividualClientConfigAnalyticsError(allModuleAnalyticsError));
    else
      setAnalyticsError(false);
  },
    [allModuleAnalyticsError]
  );


  return (
    <MatContainer>
      <PageHeading heading="Configuration Deployment" />
      <ScheduleDeployment/>
      <EnvironmentStatus/>
      <DeploymentHistory/>
    </MatContainer>
  );
};

export default IndividualClientConfig;
