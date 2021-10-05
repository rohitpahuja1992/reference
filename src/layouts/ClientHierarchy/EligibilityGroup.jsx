import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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
import { UPDATE_CLIENT_HIERARCHY } from "../../utils/FeatureConstants";
import { handleEligibilityGroupError, ELIGIBILITY_GROUP, NO_RECORDS_MESSAGE } from "../../utils/Messages";
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
  { id: "group_name", label: "group_name" },
  { id: "description", label: "Description" },
  { id: "group_code", label: "group_Code" },
  { id: "level1_ext_id", label: "Level1_EXT_ID" },
  { id: "level2_ext_id", label: "Level2_EXT_ID" },
];

const EligibilityGroup = () => {
  const styles = useStyles();
  //const dispatch = useDispatch();
  //const { register, handleSubmit,watch,setValue, errors } = useForm();
  const clientId = useSelector((state) => state.Header.entityId);
  // const spinDetail = useSelector((state) =>
  //   state.ClientHierarchy.spinner.filter(obj => obj.List === 'eligibilityGroupList'));
  const [apiError, setApiError] = useState(null);
  const error = useSelector((state) =>
    state.ClientHierarchy.eligibilityGroupList.error);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const eligibilityGroupDetailsList = useSelector((state) =>
    state.ClientHierarchy.eligibilityGroupList.list.filter(obj => obj.company.client.id === parseInt(clientId)).map((data) => {
      let eligibilityGroupData = {
        id: data.id,
        ext_id: data.extId,
        group_name: data.groupName,
        description: data.description,
        group_code: data.groupCode,
        level1_ext_id: data.company.extId,
        level2_ext_id: data.businessLine.extId,
      };
      return { ...eligibilityGroupData };
    })
  );

  const tableConfig = {
    tableType: "",

  };

  useEffect(() => {
    if (error)
      setApiError(handleEligibilityGroupError(error, clientId,featuresAssigned.indexOf(UPDATE_CLIENT_HIERARCHY)));
    else
      setApiError(false);

  },
    [error, clientId,featuresAssigned]
  );



  return (
    <>
      <PageHeading heading={ELIGIBILITY_GROUP} />
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
      ) :
        (eligibilityGroupDetailsList.length > 0) ? (
          <MatCard>
            <DataTable
              //maxWidth={"69vw"}              
              cols={cols}
              rows={eligibilityGroupDetailsList}
              config={tableConfig}
            />
          </MatCard>
        ) : (
            <MatCard>
              <CardContent className={styles.noDataCard}>
                <Typography variant="h5">
                  {NO_RECORDS_MESSAGE}
                </Typography>
              </CardContent>
            </MatCard>
          )}

    </>
  );
};

export default EligibilityGroup;
