import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";

import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import DataTable from "../../components/FieldListTable";

import DeleteIcon from "@material-ui/icons/Delete";

import { makeStyles } from "@material-ui/core";

import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import {
    RESET_UPDATE_OOB_CONTROL_IS_DONE,
    DEFAULT_START_INDEX,
    DEFAULT_PAGE_SIZE_TIMELINE
  } from "../../utils/AppConstants";
import {
    AddOobControlConfigMapping,
    deleteOobControlConfigMapping,
} from "../../actions/OobControlActions";

import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";
import { fetchConfigColumnByName } from "../../actions/ModuleConfigActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { COLUM_IS_MANDATORY, handleOobFieldMappingError, CONFIRM, FIELD_PROP_MAP_NOT_FOUND, PROP_IS_MANDATORY, TABLE_IS_MANDATORY, termPropertyConfMapping } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: "16px",
    },
    cardHeading: {
        paddingTop: "12px",
        paddingBottom: "10px",
    },
    cardHeadingSize: {
        fontSize: "18px",
    },
    row: {
        padding: "10px 0 0",
    },
    col: {
        padding: "5px 5px",
    },
    dialogTitle: {
        fontWeight: 300,
    },
    chip: {
        margin: "2px",
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
    grow: {
        flexGrow: 1,
    },
    buttonCol: {
        padding: "5px 10px",
        display: "flex",
    },
    cancelBtn: {
        marginRight: "16px",
    },
    addOption: {
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
    },
    optionButton: {
        marginTop: "3px",
    },
    optionField: {
        width: "300px",
    },
    noDataCard: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
    },
}));

const OobFieldMapping = (props) => {
    const { OobControlData, isUpdated, fireOnUpdate } = props;
    const { oobSubmoduleId, versionId, oobControlId } = useParams();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, clearError, errors } = useForm({
        mode: "onBlur",
    });
    const OobControlObj = useSelector((state) => state.OobControl.individual);
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );
    const OobModuleData = useSelector(
        (state) => state.OOBModule.OOBModuleById.data
    );
    const fieldDetails = OobControlData.controlData;
    const isControlUpdated = useSelector(
        (state) => state.OobControl.individual.isControlUpdated
    );
    const systemTableList = useSelector(
        (state) => state.ModuleConfig.configModuleByIdList
    );
    const systemColumnList = useSelector(
        (state) => state.ModuleConfig.configTableNameList
    );
    const [apiError, setApiError] = useState(null);
    const [isDraft, setDraft] = useState(false);
    const defaultFormObj = {
        propertyKey: "",
        systemTable: "",
        systemColumn: "",
    };
    const [inputs, setInputs] = useState(defaultFormObj);
    const { propertyKey, systemTable, systemColumn } = inputs;

    const fieldList = OobControlData.control.format;

    const formatMappingData = (fieldData) => {
        let propertyMappingData = [];
        if (fieldData.configMapping) {
            let configMap = fieldData.configMapping;
            for (let key of Object.keys(configMap)) {
                propertyMappingData.push({
                    propertyKey: configMap[key].propertyKey,
                    fieldProperty: configMap[key].fieldProperty,
                    systemTable: configMap[key].systemTable,
                    systemColumn: configMap[key].systemColumn,
                });
            }
        }
        return propertyMappingData;
    };

    const mappingData = formatMappingData(fieldDetails);

    let handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "systemTable") dispatch(fetchConfigColumnByName(value));
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    };

    const handlePropertyMapping = () => {
        fireOnUpdate(true);
        const fieldData = JSON.parse(JSON.stringify(fieldDetails));
        if (!fieldData.configMapping) {
            fieldData.configMapping = {};
        }

        let propertyLabel = fieldList.filter(
            (field) => field.internalName === propertyKey
        )[0];

        fieldData.configMapping[propertyKey] = {
            fieldProperty:
                propertyKey === "controlType" ? "Field Type" : propertyLabel.fieldLabel,
            propertyKey: propertyKey,
            systemTable: systemTable,
            systemColumn: systemColumn,
        };

        let formData = {
            id: OobControlData.id,
            oobSubmoduleId: oobSubmoduleId,
            masterControlId: OobControlData.control.id,
            controlData: fieldData,
        };
        //console.log("PROPERTY LABEL",propertyLabel);
        dispatch(
            AddOobControlConfigMapping(
                formData,
                fieldData.configMapping[propertyKey].fieldProperty
            )
        );
    };

    const deletePropertyFromConfigMapping = (propertyConfig) => {
        fireOnUpdate(true);
        const fieldData = JSON.parse(JSON.stringify(fieldDetails));
        delete fieldData.configMapping[propertyConfig.propertyKey];
        let formData = {
            id: OobControlData.id,
            oobSubmoduleId: oobSubmoduleId,
            masterControlId: OobControlData.control.id,
            controlData: fieldData,
        };
        dispatch(
            deleteOobControlConfigMapping(formData, propertyConfig.fieldProperty)
        );
    };

    const openConfirmDeleteDialog = (e) => {
        let messageObj = {
            primaryButtonLabel: "Yes",
            primaryButtonAction: () => {
                deletePropertyFromConfigMapping(e);
            },
            secondaryButtonLabel: "No",
            secondaryButtonAction: () => { },
            title: CONFIRM,
            message: termPropertyConfMapping(e.fieldProperty),
        };
        dispatch(showMessageDialog(messageObj));
    };

    const tableConfig = {
        tableType: "",
        actions: {
            icon: <DeleteIcon color="primary" />,
            tooltipText: "Term",
            action: (data) => {
                openConfirmDeleteDialog(data);
            },
        },
    };

    const tableConfigLabeled = {
        tableType: "",
        actions: {
            icon: <DeleteIcon color="primary" style={{ opacity: 0 }} />,
            tooltipText: "",
            action: (data) => { },
        },
    };

    const cols = [
        { id: "fieldProperty", label: "Field Property" },
        { id: "systemTable", label: "System Table" },
        { id: "systemColumn", label: "System Column" },
    ];

    // const systemTableList = [
    //   { key: 0, value: "message_constant" },
    //   { key: 1, value: "system_variable" },
    //   { key: 2, value: "cm_action_task_tab" },
    //   { key: 3, value: "cm_ui_intake" },
    // ];

    // const systemColumnList = [
    //   { key: 0, value: "txt_title" },
    //   { key: 1, value: "is_required" },
    //   { key: 2, value: "is_hidden" },
    //   { key: 3, value: "is_disable" },
    // ];

    useEffect(() => {
        if (propertyKey !== "") {
            setValue("propertyKey", propertyKey);
            clearError("propertyKey");
        } else {
            register(
                { name: "propertyKey" },
                {
                    required: { value: true, message: PROP_IS_MANDATORY },
                }
            );
        }

        if (systemTable !== "") {
            setValue("systemTable", systemTable);
            clearError("systemTable");
        } else {
            register(
                { name: "systemTable" },
                {
                    required: { value: true, message: TABLE_IS_MANDATORY },
                }
            );
        }

        if (systemColumn !== "") {
            setValue("systemColumn", systemColumn);
            clearError("systemColumn");
        } else {
            register(
                { name: "systemColumn" },
                {
                    required: { value: true, message: COLUM_IS_MANDATORY },
                }
            );
        }
    }, [propertyKey, setValue, clearError, register, systemTable, systemColumn]);

    useEffect(() => {
        if (OobControlObj.updateError && isUpdated) {
            setApiError(handleOobFieldMappingError(OobControlObj.updateError));
        } else {
            setApiError(null);
        }
        if (OobModuleData) {
            let currentversion = OobModuleData.versions.filter(
                (obj) => obj.version === versionId
            );
            setDraft(currentversion[0].oobModuleStatus === "DRAFT" ? true : false);
            if (currentversion[0].oobModuleStatus === "DRAFT") {
            }
        }
    }, [
        OobControlObj,
        isUpdated,
        OobModuleData,
        versionId,
        isDraft,
        tableConfig,
    ]);

    useEffect(() => {
        if (isControlUpdated && isUpdated) {
            dispatch(fetchOOBControlAudit(oobControlId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
            dispatch({ type: RESET_UPDATE_OOB_CONTROL_IS_DONE });
        }
    }, [dispatch, isControlUpdated, oobControlId, isUpdated]);

    return (
        <MatCard className={styles.card}>
            <CardHeader
                className={styles.cardHeading}
                title={
                    <Typography variant="h6" className={styles.cardHeadingSize}>
                        {"Configuration Mapping"}
                    </Typography>
                }
            />
            {(isDraft && featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !== -1) && (
                <>
                    <Divider />
                    <CardContent
                        style={{
                            padding: "0px 10px 5px 12px",
                        }}
                    >
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit(handlePropertyMapping)}
                        >
                            <Grid container className={styles.row}>
                                {apiError && (
                                    <Grid item xs={12} className={styles.col}>
                                        <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                                            <Typography variant="body2">{apiError.message}</Typography>
                                        </Card>
                                    </Grid>
                                )}
                                <Grid item xs={12} className={styles.col}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Field Property Mapping
                  </Typography>
                                </Grid>
                                <Grid item xs={3} className={styles.col}>
                                    <MaterialTextField
                                        error={errors.propertyKey ? true : false}
                                        helperText={
                                            errors.propertyKey ? errors.propertyKey.message : " "
                                        }
                                        required
                                        name="propertyKey"
                                        label="Field Property"
                                        onChange={handleChange}
                                        select
                                    >
                                        <MenuItem
                                            value="controlType"
                                            disabled={
                                                fieldDetails &&
                                                fieldDetails.configMapping &&
                                                fieldDetails.configMapping["controlType"]
                                            }
                                        >
                                            Field Type
                                        </MenuItem>
                                        {fieldList.map((field) => (
                                            <MenuItem
                                                value={field.internalName}
                                                disabled={
                                                    fieldDetails &&
                                                    fieldDetails.configMapping &&
                                                    fieldDetails.configMapping[field.internalName]
                                                }
                                            >
                                                {field.fieldLabel}
                                            </MenuItem>
                                        ))}
                                    </MaterialTextField>
                                </Grid>
                                <Grid item xs={3} className={styles.col}>
                                    <MaterialTextField
                                        error={errors.systemTable ? true : false}
                                        helperText={
                                            errors.systemTable ? errors.systemTable.message : " "
                                        }
                                        required
                                        name="systemTable"
                                        label="System Table"
                                        onChange={handleChange}
                                        select
                                    >
                                        {systemTableList.map((table) => (
                                            <MenuItem value={table}>{table}</MenuItem>
                                        ))}
                                    </MaterialTextField>
                                </Grid>
                                <Grid item xs={3} className={styles.col}>
                                    <MaterialTextField
                                        error={errors.systemColumn ? true : false}
                                        helperText={
                                            errors.systemColumn ? errors.systemColumn.message : " "
                                        }
                                        required
                                        name="systemColumn"
                                        label="System Column"
                                        onChange={handleChange}
                                        select
                                    >
                                        {systemColumnList.map((column) => (
                                            <MenuItem value={column.fieldName}>
                                                {column.fieldName}
                                            </MenuItem>
                                        ))}
                                    </MaterialTextField>
                                </Grid>
                                <Grid item xs={3} className={styles.col}>
                                    <div className={styles.optionButton}>
                                        <MatButton type="submit" color="primary">
                                            Add
                    </MatButton>
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>{" "}
                </>
            )}
            <Divider />
            {mappingData.length > 0 ? (
                <DataTable
                    cols={cols}
                    rows={mappingData}
                    config={isDraft ? tableConfig : tableConfigLabeled}
                />
            ) : (
                    <CardContent className={styles.noDataCard}>
                        <Typography variant="subtitle2">
                            {FIELD_PROP_MAP_NOT_FOUND}
                        </Typography>
                    </CardContent>
                )}
        </MatCard>
    );
};

export default OobFieldMapping;
