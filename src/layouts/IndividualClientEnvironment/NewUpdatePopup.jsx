import React, { useCallback } from "react";
import DataTable from "../../components/DataTable";
import { makeStyles } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Chip from "@material-ui/core/Chip";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import {
    NO_RECORDS_FOR_NEW_CONFIG,
    NO_RECORDS_FOR_UPDATES,
    NO_RECORDS_FOR_DEPLOYMENT
} from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    statusActive: {
        background: "#00c853",
      },
      statusInactive: {
        background: theme.palette.warning.main,
      },
      statusTerminated: {
        background: theme.palette.error.main,
    },
}));
const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

const NewUpdatePopup = (props) => {
    const styles = useStyles();

    const handleCloseForm = useCallback(() => {
        props.handleClose();
    }, [props,]);

    const tableConfig = {
        tableType: "",
        checked: false,
        paginationOption: "no"
    };
    const cols = [
        // { id: "moduleName", label: "Module" },
        // { id: "componentName", label: "Component" },
        // { id: "type", label: "Type" },
        { id: "labelValue", label: "Field Name" },
        { id: "value", label: "New Value" },
    ];
    const updatecols = [
        // { id: "moduleName", label: "Module" },
        // { id: "componentName", label: "Component" },
        // { id: "type", label: "Type" },
        { id: "labelValue", label: "Field Name" },
        { id: "targetValue", label: "Original Value" },
        { id: "value", label: "New Value" },
    ];
    const deployedcols = [
        // { id: "moduleName", label: "Module" },
        // { id: "componentName", label: "Component" },
        // { id: "type", label: "Type" },
        { id: "labelValue", label: "Field Name" },
        { id: "targetValue", label: "Original Value" },
        { id: "value", label: "New Value" },
        { id: "deployedStatus", label: "Deployed Status" },
      ];

      const handleDeploymentStatusLabel = (details) => {
        if (details === 'Deleted') {
          return "Mark Deleted";
        } else {
          return "Completed";
        }
      };
    
      const handleDeploymentStatusClass = (status) => {
        if (status === 'Completed') {
          return styles.statusActive;
        } else {
          return styles.statusActive;
        }
      };
      const componentName = props.popupContent[0].componentName;
      const moduleName = props.popupContent[0].moduleName;
      console.log("hgj",props.popupContent)
      let DeployedConfigDataContent = props.popupContent?.sort(function(a, b) {
        return a.deployedStatus.toLowerCase() < b.deployedStatus.toLowerCase() ? -1 : 1
      });
      let DeployedConfigData = DeployedConfigDataContent?.map((data) => {
        let blankData = {
          deleted: data.deployedStatus === "Completed" ? false : true,
          deployedStatus: (
            data.deployedStatus === "Completed" ? 
                <div>
                    {
                        <Chip
                            label={handleDeploymentStatusLabel(data.deployedStatus)}
                            className={handleDeploymentStatusClass(
                                handleDeploymentStatusLabel(data.deployedStatus)
                            )}
                            color="primary"
                        />
                    }
                </div>
                : null
            ),          
        };
        return { ...data, ...blankData };
    });
    
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className={styles.dialogTitle} onClose={handleCloseForm}>
                {props.openFrom === "New" ? "New Config" : props.openFrom === "Deployed" ? "Deployment" : "Updates"} - <span title="Module Name">{moduleName}</span> &gt; <span title="Component Name">{componentName}</span>
            </DialogTitle>

            <DialogContent dividers="true">
                {props.popupContent?.length >= 0 && (
                    <DataTable
                        cols={props.openFrom === "New" ? cols : props.openFrom === "Deployed" ? deployedcols : updatecols}
                        rows={props.openFrom === "Deployed" ? DeployedConfigData : props.popupContent}
                        customNoRecordsMessage={props.openFrom === "New" ? NO_RECORDS_FOR_NEW_CONFIG : props.openFrom === "Deployed" ? NO_RECORDS_FOR_DEPLOYMENT : NO_RECORDS_FOR_UPDATES}
                        customNoRecords={!(props.popupContent.length > 0)}
                        noRecordsCols={props.popupContent.length > 0 ? 1 : props.openFrom === "New" ? cols.length : props.openFrom === "Deployed" ? deployedcols.length : updatecols.length + 1}
                        config={tableConfig}
                         />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NewUpdatePopup;
