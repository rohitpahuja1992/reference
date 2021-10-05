import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
// import Box from "@material-ui/core/Box";
import MatButton from "../MaterialUi/MatButton";
import { Divider, makeStyles } from "@material-ui/core";
import TabComponentDetails from "./TabComponentDetails";
// import TabConfigurationDetails from "./TabConfigurationDetails";
// import TabAddMapping from "./TabAddMapping";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
import { updateFieldData } from "../../actions/MasterComponentActions";
import {
  SHOW_SNACKBAR_ACTION,
} from "../../utils/AppConstants";
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
    paddingTop:"10px",
    paddingBottom:"10px"
  },
}));

const AddMasterComponent = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    activeTab,
    open,
    openFrom,
    handleClose,
    handleNext,
    handlePrev,
    handleConfigNext,
    defaultError,
    handleAddComponent,
    handleSubmit,
  } = props;
  const [isEmpty, setIsEmpty] = useState(false);
  const column = useSelector((state) => state.MasterComponent.data.column);
  const submoduleDetailsById = useSelector(
    (state) => state.MasterSubmodule.submoduleDetailsById.data
  );
  const featuresAssigned = useSelector((state) => state.User.features);

  // const TabLabel = [
  //     { heading: "Component Details", label: openFrom === 'Update' ? "Update Component" : "Add Component" },
  //     { heading: "Configuration Details", label: "Save Details" },
  //     { heading: "Add New Mapping", label: "Add Mapping" },
  // ];

  // function getTabContent(step) {
  //     switch (step) {
  //         case 0:
  //             return <TabComponentDetails handleNext={handleNext} handleAddComponent={handleAddComponent} openFrom={openFrom} />;
  //         case 1:
  //             return <TabConfigurationDetails handleNext={handleConfigNext} handleConfiguration={handlePrev} />;
  //         case 2:
  //             return <TabAddMapping handleAddMapping={handlePrev} />;
  //         default:
  //             throw new Error("Unknown step");
  //     }
  // }

  useEffect(() => {
    if (openFrom === "Update")
      dispatch(
        updateFieldData(
          submoduleDetailsById.componentName,
          submoduleDetailsById.config,
          submoduleDetailsById.modules.map((item) => item.id),
          JSON.parse(submoduleDetailsById.mapField),
          "",
          []
        )
      );
  }, [dispatch, openFrom, submoduleDetailsById]);
  
  useEffect(() => {
    console.log("column",column)
    let label = column.map((item) => item.label);
    let fields = column.map((item) => item.fieldType);
    if (
      column.length > 0 &&
      (label.indexOf("") !== -1 || fields.indexOf("") !== -1)
    )
      setIsEmpty(true);
    else setIsEmpty(false);
  }, [column]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle className={styles.dialogTitle} id="scroll-dialog-title">
        {openFrom === "Update" ? "Update Component" : "Add New Component" }
      </DialogTitle>
      <Divider/>
      {/* <Tabs
                value={activeTab}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
            >
                {TabLabel.map((label, key) => (
                    <Tab key={label} label={label.heading} />
                ))}
            </Tabs> */}
      <DialogContent style={{paddingTop:"5px"}} dividers="true">
        <TabComponentDetails
          handleNext={handleNext}
          defaultError={defaultError}
          handleAddComponent={handleAddComponent}
          openFrom={openFrom}
        />
        {/* <TabPanel value={activeTab} index={activeTab}>
                    {getTabContent(activeTab)}
                </TabPanel> */}
      </DialogContent>
      <DialogActions>
        {/* {activeTab === 0 && ( */}
        <MatButton color="primary" onClick={handleClose}>
          Cancel
        </MatButton>
        {/* )}
                {(activeTab === 1 || activeTab === 2) && (
                    <MatButton color="primary" onClick={handlePrev}>
                        Cancel
                    </MatButton>
                )} */}
        {/* {activeTab === 0 && featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 && ( */}
        {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 && (
          <MatButton type="submit"  form="addComponentInfo">
            {openFrom === "Update" ? "Update Component" : "Add Component"}
          </MatButton>
        )}
        {/* {activeTab === 1 && (
                    <MatButton
                        type="submit"
                        //disabled={isAssignDisabled}
                        form="addConfigurationInfo"
                    >
                        {TabLabel[activeTab].label}
                    </MatButton>
                )}
                {activeTab === 2 && (
                    <MatButton
                        type="submit"
                        //disabled={disabled}
                        form="addMappingInfo"
                    //onClick={handleSubmit}
                    >
                        {TabLabel[activeTab].label}
                    </MatButton>
                )} */}
      </DialogActions>
    </Dialog>
  );
};

// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`scrollable-force-tabpanel-${index}`}
//             aria-labelledby={`scrollable-force-tab-${index}`}
//             {...other}
//             style={{ minHeight: "320px" }}
//         >
//             {value === index && <Box>{children}</Box>}
//         </div>
//     );
// }

export default AddMasterComponent;
