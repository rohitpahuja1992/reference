import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import PropertyMapping from "./PropertyMapping";

// import { addMasterControl } from "../../actions/ControlActions";

// import { defaultControlData } from "../../utils/defaultControlData";
// import { fetchMasterControl } from "../../actions/ControlActions";
// import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX, RESET_ADD_CONTROL_ERROR } from "../../utils/AppConstants";
import { ADD_NEW_MAPPING, COMMON_ERROR_MESSAGE, MAXIMUN_CHARACTER_ALLOWED_MSG } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "5px 8px",
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        marginBottom: "14px",
    },
}));

const SystemMapping = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { columnList,selectedDescription } = props;
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearError,
        setError,
        errors,
    } = useForm({ mode: "onBlur" });
    const [selectedField,setSelectedField] = useState(selectedDescription && selectedDescription.uniqueColumn.mapObject.fieldName);
    // const OOBModuleById = useSelector(
    //     (state) => state.OOBModule.OOBModuleById.data
    // );
    // const OobControlData = useSelector(
    //     (state) => state.OobControl.individual.details
    // );
    // const systemList = useSelector(
    //     (state) => state.MasterTable.tableDetailsList.list
    // );
    // const fieldDetails = OobControlData.controlData;
    // const fieldList = OobControlData.control.format.filter((field) => field.fieldType !== 'option');
    // const systemTableList = systemList.filter((table) => table.module === OOBModuleById.module.moduleName);
    const defaultFormData = {
        property: "",
        table: "",
        column: "",
        description: ""
    };
    const [inputs, setInputs] = useState(defaultFormData);

    const {
        property,
        table,
        column,
        description
    } = inputs;

    const handleAddMapping = () => {

    }

    let handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((inputs) => ({ ...inputs, [name]: value }));
        // if (name === 'columnName' && editable === false)
        //   setInputs((inputs) => ({ ...inputs, [name]: value }));
        // if (name !== 'columnName')
        //   setInputs((inputs) => ({ ...inputs, [name]: value }));
        // //dispatch(resetDuplicateError());
        // setApiError(false);
        //setSelectionChanged(true);
    };

    useEffect(() => {
        console.log("PROPS", props);
    }, [props]);

    return (
        columnList.length > 0 &&
        <>
            <Grid item xs={12} className={styles.col}>
                <Typography variant="subtitle2" gutterBottom>
                    Set System Configuration
                            </Typography>
            </Grid>
            {columnList.map((item, key) =>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        inputRef={register({
                            maxLength: {
                                value: 50,
                                message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                            },
                        })}
                        error={errors.variableCode ? true : false}
                        helperText={errors.variableCode?.message}
                        onChange={handleChange}
                        name="variableCode"
                        value={selectedDescription && selectedDescription.uniqueColumn.mapObject.fieldName === item.mapObject.fieldName?selectedDescription.code:''}
                        disabled={selectedDescription && selectedDescription.uniqueColumn.mapObject.fieldName === item.mapObject.fieldName?true:false}
                        label={item.mapLabel?item.mapLabel:item.mapObject.fieldName}
                    />
                </Grid>
            )
            }
        </>

    );
};

export default SystemMapping;
