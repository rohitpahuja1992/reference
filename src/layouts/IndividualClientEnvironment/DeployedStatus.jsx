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

const DeployedStatus = (props) => {
    const styles = useStyles();

    const handleCloseForm = useCallback(() => {
        props.handleClose();
    }, [props,]);

    const tableConfig = {
        tableType: "",
        checked: false,
        paginationOption: "no"
    };
    const deployedcols = [
        { id: "moduleName", label: "Module" },
        { id: "componentName", label: "Component" },
        { id: "controlVal", label: "Type" },
        { id: "primaryFieldName", label: "Field Name (Primary)" },
        { id: "deploymentStatus", label: "Deployed Status" },
        { id: "failedReason", label: "Failed Reason" },
      ];

      const handleDeploymentStatusLabel = (details) => {
        if (details === 'Failed') {
          return "Failed";
        } else {
          return "Completed";
        }
      };
    
      const handleDeploymentStatusClass = (status) => {
        if (status === 'Completed') {
          return styles.statusActive;
        } else {
          return styles.statusTerminated;
        }
      };
      const handleType = (details) => {
        if (details === 'SYSTEM_TABLE') {
          return "System Table";
        } else if (details === 'SYSTEM_VARIABLE') {
          return "System Variable";
        } else {
          return "Message Constant";
        }
      };
      
    var test = {
      "28": {
        "SYSTEM_TABLE": {
          "deploymentStatus": "Completed",
          "failedReason": null
        }
      },
      "29": {
        "SYSTEM_TABLE": {
          "deploymentStatus": "Completed",
          "failedReason": null
        }
      }
    }
    let configData = {};
  let consumeData = [];
  let controlID = "";
  let controlVal = "";
  let DeployedContent = () => {
    Object.entries(props.deployedData).map((itemval2) => {
    itemval2.map((itemval3) => {
      if (Number.isInteger(Number(itemval3))) {
        controlID = itemval3;
      }
      else {
        Object.entries(itemval3).map(item => {
          item.map((item2) => {
            if (typeof item2 === "string") {
              controlVal = item2;
            }
            else {
              configData = {};
              configData.id = consumeData.length + 1;
              configData.controlID = controlID;
              configData.controlVal = handleType(controlVal);
              configData.deploymentStatus = item2.deploymentStatus;
              configData.failedReason = item2.failedReason;
              configData.moduleName = item2.moduleName;
              configData.componentName = item2.componentName;
              configData.primaryFieldName = item2.primaryFieldName;
              consumeData.push(configData);
            }
          })
        })
      }
    });
  })
  return consumeData;
}

    let DeployedConfigData = DeployedContent()?.map((data) => {
      let blankData = {
        deploymentStatus: (
              <div>
                  {
                      <Chip
                          label={handleDeploymentStatusLabel(data.deploymentStatus)}
                          className={handleDeploymentStatusClass(
                              handleDeploymentStatusLabel(data.deploymentStatus)
                          )}
                          color="primary"
                      />
                  }
              </div>
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
                Deployment Status
            </DialogTitle>

            <DialogContent dividers="true">
                {DeployedConfigData?.length >= 0 && (
                    <DataTable
                        cols={deployedcols}
                        rows={DeployedConfigData}
                        config={tableConfig}
                         />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DeployedStatus;
