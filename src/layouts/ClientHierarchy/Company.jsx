import React, { useEffect, useState } from "react";
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
//import DeleteIcon from "@material-ui/icons/Delete";
//import { showMessageDialog } from "../../actions/MessageDialogActions";
//import { deleteCategories } from '../../actions/CategoriesActions';
import { formatDate } from "../../utils/helpers";
import {
  handleCompanyError,
  NO_RECORDS_MESSAGE
} from "../../utils/Messages";
import { UPDATE_CLIENT_HIERARCHY } from "../../utils/FeatureConstants";

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
  { id: "code", label: "Code" },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "effective_date", label: "Effective Date", minWidth: 120 },
  { id: "term_date", label: "Term Date", minWidth: 120 },
  { id: "company_type", label: "Company Type" }
];

const Company = () => {
  const styles = useStyles();
  //const dispatch = useDispatch();
  const clientId = useSelector((state) => state.Header.entityId);
  // const spinDetail = useSelector((state) =>
  //   state.ClientHierarchy.spinner.filter(obj => obj.List === 'companyList'));
  const [apiError, setApiError] = useState(null);
  const error = useSelector((state) =>
    state.ClientHierarchy.companyList.error);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const clientInfo = useSelector(state => state.Client.clientByIdDetails.details);
  const companyDetailsList = useSelector((state) =>
    state.ClientHierarchy.companyList.list.filter(obj => obj.client.id === parseInt(clientId)).map((data) => {
      let categoriesData = {
        id: data.id,
        ext_id: data.extId,
        code: data.code,
        description: data.description,
        effective_date: formatDate(data.effectiveDate),
        term_date: formatDate(data.termDate),
        company_type: data.companyType,
      };
      return { ...categoriesData };
    })
  );

  const tableConfig = {
    tableType: "",
  };
  useEffect(() => {
    if (error)
      setApiError(handleCompanyError(error, clientId, featuresAssigned.indexOf(UPDATE_CLIENT_HIERARCHY)));
    else
      setApiError(false);

  },
    [error, clientId, featuresAssigned]
  );


  return (
    <>
      <PageHeading heading="Company" />
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

        (companyDetailsList.length > 0 && clientInfo.fileName) ? (
          <MatCard>
            <DataTable
              //maxWidth={"68.5vw"}
              cols={cols}
              rows={companyDetailsList}
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

export default Company;
