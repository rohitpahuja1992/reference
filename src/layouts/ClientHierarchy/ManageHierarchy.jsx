import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import PageHeading from "../../components/PageHeading";
import { DropzoneArea } from "material-ui-dropzone";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import sample from "../../assets/Documents/sample-hierarchy.xlsx";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { fetchClientById } from "../../actions/ClientActions";
import {
  SHOW_SNACKBAR_ACTION,
  RESET_HIERARCHY_ERROR,
} from "../../utils/AppConstants";
import {
  fetchCompanyList,
  fetchBusinessLineList,
  fetchEligibilityPlanList,
  fetchEligibilityGroupList,
} from "../../actions/ClientHierarchyActions";
import {
  deleteHierarchy,
  uploadHierarchy,
} from "../../actions/ClientHierarchyActions";
import {
  handleManageHierarchyActionError,
  handleManageHierarchyError,
  CONFIRM,
  DELETE_HIERARCHY,
  DELETE_HIERARCHY_FILE,
  //DOESNOT_EXIST,
  DOWNLOAD_SAMPLE,
  DRAG_AND_DROP_EXCEL,
  MANAGE_HIERARCHY,
  UPLOAD_HIERARCHY,
  fileRejectedError,
  fileRemoved,
  fileSuccessAdded,
  //CLIENT_NOT_EXIST
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  grow: {
    flexGrow: 1,
  },
  anchor: {
    textDecoration: "none",
  },
  button: {
    marginTop: "10px",
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
  { id: "hierarchy", label: "Hierarchy", minWidth: 200 },
  { id: "entity", label: "Number of Entities" },
];

const ManageHierarchy = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileInput, setFileInput] = useState("");
  const error = useSelector((state) => state.Client.getByIdError);
  const clientId = useSelector((state) => state.Header.entityId);
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  const deleteHierarchyDetails = useSelector(
    (state) => state.ClientHierarchy.deleteHierarchy
  );
  const uploadHierarchyDetails = useSelector(
    (state) => state.ClientHierarchy.uploadHierarchy
  );
  const companyDetailsList = useSelector((state) =>
    state.ClientHierarchy.companyList.list.filter(
      (obj) => obj.client.id === parseInt(clientId)
    )
  );
  const businessLineDetailsList = useSelector((state) =>
    state.ClientHierarchy.businessLineList.list.filter(
      (obj) => obj.company.client.id === parseInt(clientId)
    )
  );
  const eligibilityPlanDetailsList = useSelector((state) =>
    state.ClientHierarchy.eligibilityPlanList.list.filter(
      (obj) => obj.company.client.id === parseInt(clientId)
    )
  );
  const eligibilityGroupDetailsList = useSelector((state) =>
    state.ClientHierarchy.eligibilityGroupList.list.filter(
      (obj) => obj.company.client.id === parseInt(clientId)
    )
  );

  function createData(hierarchy, entity) {
    return { hierarchy, entity };
  }

  const rows = [
    createData("Company", companyDetailsList.length),
    createData("Business Line", businessLineDetailsList.length),
    createData("Eligibility Plan", eligibilityPlanDetailsList.length),
    createData("Eligibility Group", eligibilityGroupDetailsList.length),
  ];

  const tableConfig = {
    tableType: "",
  };

  useEffect(() => {
    if (deleteHierarchyDetails.isDone || uploadHierarchyDetails.isDone) {
      setIsSubmitted(false);
      setActionError(null);
      if (!!clientId) dispatch(fetchClientById(clientId));
      dispatch(fetchCompanyList(clientId));
      dispatch(fetchBusinessLineList(clientId));
      dispatch(fetchEligibilityPlanList(clientId));
      dispatch(fetchEligibilityGroupList(clientId));
    }
    if (deleteHierarchyDetails.error) {
      setIsSubmitted(false);
    }
    
  }, [
    dispatch,
    clientId,
    clientInfo,
    deleteHierarchyDetails,
    uploadHierarchyDetails,
    error,
  ]);

  useEffect(() => {
    if(error)
      setApiError(handleManageHierarchyError(error,clientId));
    else
      setApiError(false);
  },
    [error, clientId]
  );

  useEffect(() => {
    if(uploadHierarchyDetails.error){
      setIsSubmitted(false);
      setActionError(handleManageHierarchyActionError(uploadHierarchyDetails.error));
    }
    else
      setActionError(false);
  },
    [uploadHierarchyDetails.error]
  );

  const handleDeleteHierarchy = () => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        setIsSubmitted(true);
        dispatch(deleteHierarchy(clientId));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: DELETE_HIERARCHY_FILE,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const handleFileUpload = (files) => {
    if (files) {
      setIsDisabled(false);
      setFileInput(files);
    } else {
      setIsDisabled(true);
      setFileInput("");
      dispatch({ type: RESET_HIERARCHY_ERROR });
    }
  };

  const handleUploadHierarchy = () => {
    setIsSubmitted(true);
    dispatch(uploadHierarchy(fileInput, clientId));
  };

  return (
    <>
      {apiError && (
        <>
          <PageHeading heading={MANAGE_HIERARCHY} />
          <Grid item xs={12} className={styles.col}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">{apiError.message}</Typography>
            </Card>
          </Grid>
        </>
      )}
      {!apiError && (
        <>
          <PageHeading
            heading={MANAGE_HIERARCHY}
            action={
              clientInfo && clientInfo.fileName ? (
                <MatButton
                  onClick={handleDeleteHierarchy}
                  disabled={isSubmitted}
                >
                  {DELETE_HIERARCHY}
                </MatButton>
              ) : (
                <MatButton
                  onClick={handleUploadHierarchy}
                  disabled={isDisabled}
                >
                  {UPLOAD_HIERARCHY}
                </MatButton>
              )
            }
          />
          {actionError && (
            <Grid item xs={12} className={styles.col}>
              <Card className={actionError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                <Typography variant="body2">{actionError.message}</Typography>
              </Card>
            </Grid>
          )}
          {clientInfo && clientInfo.fileName ? (
            <MatCard>
              <DataTable cols={cols} rows={rows} config={tableConfig} />
            </MatCard>
          ) : (
            <>
              <DropzoneArea
                acceptedFiles={[".xls", ".xlsx", ".csv"]}
                filesLimit={1}
                dropzoneText={DRAG_AND_DROP_EXCEL}
                showAlerts={false}
                showFileNames={true}
                getFileAddedMessage={(filename) => {
                  dispatch({
                    type: SHOW_SNACKBAR_ACTION,
                    payload: {
                      detail: fileSuccessAdded(filename),
                      severity: "success",
                    },
                  });
                }}
                getFileRemovedMessage={(filename) => {
                  dispatch({
                    type: SHOW_SNACKBAR_ACTION,
                    payload: {
                      detail: fileRemoved(filename),
                      severity: "success",
                    },
                  });
                }}
                getDropRejectMessage={(filename) => {
                  dispatch({
                    type: SHOW_SNACKBAR_ACTION,
                    payload: {
                      detail: fileRejectedError(filename.name),
                      severity: "error",
                    },
                  });
                }}
                onChange={(files) => handleFileUpload(files[0])}
              />

              <a
                className={styles.anchor}
                href={sample}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles.button}
                  startIcon={<CloudDownloadIcon />}
                >
                  {DOWNLOAD_SAMPLE}
                </Button>
              </a>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ManageHierarchy;
