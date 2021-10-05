//import React, { useState, useEffect } from 'react';
import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import sample from '../../assets/Documents/sample-hierarchy.xlsx'
import { SHOW_SNACKBAR_ACTION } from '../../utils/AppConstants';
import { handleTabUploadFileError, DRAG_AND_DROP_EXCEL,DOWNLOAD_SAMPLE } from '../../utils/Messages';

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  download: {
    display: "flex",
    justifyContent: "flex-end"
  },
  anchor: {
    textDecoration: 'none'
  },
  button: {
    marginBottom: '10px',
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
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
}));

function TabUploadFile(props) {
  const styles = useStyles();
  const dispatch = useDispatch();
  const uploadHierarchyDetails = useSelector((state) => state.ClientHierarchy.uploadHierarchy);
  const [apiError, setApiError] = useState(null);
  useEffect(() => {
    if (uploadHierarchyDetails.error)
      setApiError(handleTabUploadFileError(uploadHierarchyDetails.error));
    else
      setApiError(false);
  }, [uploadHierarchyDetails.error]);

  return (
    <Grid item xs={12} >
      {apiError ? (
        <Grid item xs={12} className={styles.col}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">
              {apiError.message}
            </Typography>
          </Card>
        </Grid>
      ) : null}
      <Grid item xs={12} className={styles.download}>
        <a className={styles.anchor} href={sample} target="_blank" rel="noopener noreferrer">
          <Button
            variant="contained"
            color="secondary"
            className={styles.button}
            startIcon={<CloudDownloadIcon />}
          >
            {DOWNLOAD_SAMPLE}
                            </Button>
        </a>
      </Grid>
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
              detail: "File " +
                filename +
                " successfully added.",
              severity: "success",
            },
          });
        }}
        getFileRemovedMessage={(filename) => {
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "File " +
                filename +
                " removed.",
              severity: "success",
            },
          });
        }}
        getDropRejectMessage={(filename) => {
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "File " +
                filename.name +
                " was rejected. File type not supported.",
              severity: "error",
            },
          });
        }}
        onChange={(files) => props.handleFileUpload(files[0])}
      />
      {/* <a href={sample} target="_blank" rel="noopener noreferrer">
        Download Sample File
      </a> */}
    </Grid>
  );
}

export default TabUploadFile;
