//import React, { useEffect } from 'react';
import React, { useState } from "react";
//import { useSelector } from 'react-redux';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import MatButton from "../MaterialUi/MatButton";
import { Divider, makeStyles } from "@material-ui/core";

import TabAddClient from "./TabAddClient";
import TabAssignModules from "./TabAssignModules";
import TabUploadFile from "./TabUploadFile";
// import {fetchModules,fetchStatecity,fetchVersion} from '../../actions/ManageClientActions';

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  dialogTitle: {
    fontWeight: 300,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  userCount: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "8px",
  },
  topSection: {
    display: "flex",
    marginBottom: "10px",
  },
  grow: {
    flexGrow: 1,
  },
  moduleCard: {
    background: "#d6e3eb",
    cursor: "pointer",
  },
  cardTitle: {
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  cardCaption: {
    color: "#84858a",
  },
}));

function ManageClient(props) {
  const styles = useStyles();
  const { activeTab, open, disabled, handleActiveTab,
    handleClose, handleNext, handleAssign, handleSubmit } = props;

  const [isInfoDisabled, setIsInfoDisabled] = useState(true);
  const [isAssignDisabled, setIsAssignDisabled] = useState(true)


  const TabLabel = [
    "Add Client Information",
    "Assign Modules",
    // "Hierarchy File Upload",
  ];

  const handleInfoDisabled = (value) => {
    setIsInfoDisabled(value);
  }

  const handleAssignDisabled = (value) => {
    setIsAssignDisabled(value);
  }

  function getTabContent(step) {
    switch (step) {
      case 0:
        return <TabAddClient handleNext={handleNext} handleDisabled={handleInfoDisabled} />;
      case 1:
        return <TabAssignModules handleNext={handleAssign} handleActiveTab={handleActiveTab} handleDisabled={handleAssignDisabled} />;
      // case 2:
      //   return (
      //     <TabUploadFile
      //       handleFileUpload={handleFileUpload}
      //     //apiError={apiError}
      //     />
      //   );
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle className={styles.dialogTitle} id="scroll-dialog-title">
        Add New Client
      </DialogTitle>
      {/* <Divider /> */}
      {/* <Tabs
        value={activeTab}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
      >
        {TabLabel.map((label, key) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs> */}
      <DialogContent dividers="true">
        {/* <TabPanel value={activeTab} index={activeTab}>
          {getTabContent(activeTab)}
        </TabPanel> */}
        <TabAddClient handleNext={handleNext} handleDisabled={handleInfoDisabled} />
      </DialogContent>
      <DialogActions>
        {/* {props.activeTab !== 0 && (
          <MatButton color="primary" onClick={props.handleBack}>
            Back
          </MatButton>
        )} */}
        <MatButton color="primary" onClick={handleClose}>
          Cancel
        </MatButton>
        <MatButton
            type="submit"
            disabled={isInfoDisabled}
            form="addClientInfo"
          >
            Add Client Information
          </MatButton>
        {/* {activeTab === 0 && (
          <MatButton
            type="submit"
            disabled={isInfoDisabled}
            form="addClientInfo"
          >
            {TabLabel[activeTab]}
          </MatButton>
        )}
        {activeTab === 1 && (
          <MatButton
            type="submit"
            disabled={isAssignDisabled}
            form="addClientModule"
            onClick={handleSubmit}
          >
            {TabLabel[activeTab]}
          </MatButton>
        )} */}
        {/* {activeTab === 2 && (
          <MatButton
            type="submit"
            disabled={disabled}

          >
            {TabLabel[activeTab]}
          </MatButton>
        )} */}
      </DialogActions>
    </Dialog>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
      style={{ minHeight: "320px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default ManageClient;
