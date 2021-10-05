import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
//import CircularProgress from "@material-ui/core/CircularProgress";
//import { useForm } from "react-hook-form";
//import { makeStyles } from '@material-ui/core';
// import MatContainer from "../../components/MaterialUi/MatContainer";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import PageHeading from "../../components/PageHeading";
import {
  handleEligibilityPlanError,
  ELIGIBILITY_PLAN,
  NO_RECORDS_MESSAGE,
} from "../../utils/Messages";
import { UPDATE_CLIENT_HIERARCHY } from "../../utils/FeatureConstants";
//import DeleteIcon from "@material-ui/icons/Delete";
//import { showMessageDialog } from "../../actions/MessageDialogActions";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  grow: {
    flexGrow: 1,
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
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

const cols = [
  { id: "ext_id", label: "EXT_ID" },
  { id: "plan_code", label: "Plan_Code" },
  { id: "description", label: "Description" },
  { id: "level1_ext_id", label: "Level1_EXT_ID" },
  { id: "level2_ext_id", label: "Level2_EXT_ID" },
];

const EligibilityPlan = () => {
  const styles = useStyles();
  //const dispatch = useDispatch();
  //const { register, handleSubmit,watch,setValue, errors } = useForm();
  const clientId = useSelector((state) => state.Header.entityId);
  // const spinDetail = useSelector((state) =>
  //   state.ClientHierarchy.spinner.filter(obj => obj.List === 'eligibilityPlanList'));
  const [apiError, setApiError] = useState(null);
  const error = useSelector(
    (state) => state.ClientHierarchy.eligibilityPlanList.error
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const eligibilityPlanDetailsList = useSelector((state) =>
    state.ClientHierarchy.eligibilityPlanList.list
      .filter((obj) => obj.company.client.id === parseInt(clientId))
      .map((data) => {
        let eligibilityPlanData = {
          id: data.id,
          ext_id: data.extId,
          plan_code: data.code,
          description: data.description,
          level1_ext_id: data.company.extId,
          level2_ext_id: data.businessLine.extId,
        };
        return { ...eligibilityPlanData };
      })
  );

  const tableConfig = {
    tableType: "",
  };

  useEffect(() => {
    if(error)
      setApiError(handleEligibilityPlanError(error,clientId,featuresAssigned.indexOf(UPDATE_CLIENT_HIERARCHY)));
    else
      setApiError(false);

  },
    [error, clientId,featuresAssigned]
  );

  return (
    <>
      <PageHeading heading={ELIGIBILITY_PLAN} />
      {/* {spinDetail[0].status ?
        <MatCard>
          <CardContent className={styles.noDataCard}>
            <CircularProgress color="secondary" />
          </CardContent>
        </MatCard> : */}
      {apiError ? (
        <Grid item xs={12} className={styles.col}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : eligibilityPlanDetailsList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={eligibilityPlanDetailsList}
            config={tableConfig}
          />
        </MatCard>
      ) : (
        <MatCard>
          <CardContent className={styles.noDataCard}>
            <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
          </CardContent>
        </MatCard>
      )}
    </>
  );
};

export default EligibilityPlan;
