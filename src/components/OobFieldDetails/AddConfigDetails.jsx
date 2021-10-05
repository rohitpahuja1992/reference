import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import MatButton from "../MaterialUi/MatButton";
import { Divider, makeStyles } from "@material-ui/core";
import TabConfigurationDetails from "./TabConfigurationDetails";
import TabAddMapping from "./TabAddMapping";


const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
}));


const AddConfigDetails = (props) => {
    const styles = useStyles();
    //const dispatch = useDispatch();
    const { activeTab, open, field, config ,updateConfig,
        handleClose, handleSave, handlePrev, handleConfigNext } = props;
    // const [isEmpty, setIsEmpty] = useState(false);
    // const column = useSelector(
    //     (state) => state.MasterComponent.data.column
    // );
    // const submoduleDetailsById = useSelector(
    //     (state) => state.MasterSubmodule.submoduleDetailsById.data
    // );
    // const featuresAssigned = useSelector(
    //     (state) => state.User.features
    // );

    const TabLabel = [
        { heading: "Configuration Details", label: "Save Details" },
        { heading: "Add New Mapping", label: "Add Mapping" },
    ];

    function getTabContent(step) {
        switch (step) {
            case 0:
                return (
                  <TabConfigurationDetails
                    handleNext={handleConfigNext}
                    handleConfiguration={handleSave}
                    fieldData={field}
                    updateConfig={updateConfig}
                    configDetails={config}
                  />
                );
            case 1:
                return <TabAddMapping handleAddMapping={handlePrev} configDetails={config} />;
            default:
                throw new Error("Unknown step");
        }
    }

    // useEffect(() => {
    //     if (openFrom === 'Update')
    //         dispatch(updateFieldData(submoduleDetailsById.componentName, submoduleDetailsById.modules.map(item => item.id), JSON.parse(submoduleDetailsById.mapField), "", []));
    // }, [dispatch, openFrom, submoduleDetailsById]);

    // useEffect(() => {
    //     let label = column.map(item => item.mapLable);
    //     let fields = column.map(item => item.fieldType);
    //     if (column.length > 0 && (label.indexOf("") !== -1 || fields.indexOf("") !== -1))
    //         setIsEmpty(true);
    //     else
    //         setIsEmpty(false);
    // }, [column]);

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
                {field.label}
    </DialogTitle>
            <Divider />
            <Tabs
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
            </Tabs>
            <DialogContent dividers="true">
                <TabPanel value={activeTab} index={activeTab}>
                    {getTabContent(activeTab)}
                </TabPanel>
            </DialogContent>
            <DialogActions>
                {activeTab === 0 && (
                    <MatButton color="primary" onClick={handleClose}>
                        Cancel
                    </MatButton>
                )}
                {(activeTab === 1) && (
                    <MatButton color="primary" onClick={handlePrev}>
                        Cancel
                    </MatButton>
                )}
                {activeTab === 0 &&  (
                    <MatButton
                        type="submit"
                        //disabled={isEmpty}
                        form="addConfigurationInfo"
                    >
                        {TabLabel[activeTab].label}
                    </MatButton>
                )}
                {activeTab === 1 && (
                    <MatButton
                        type="submit"
                        //disabled={isAssignDisabled}
                        form="addMappingInfo"
                    >
                        {TabLabel[activeTab].label}
                    </MatButton>
                )}
                {/* {activeTab === 2 && (
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

export default AddConfigDetails;
