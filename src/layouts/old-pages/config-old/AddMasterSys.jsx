import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import PropertyMapping from "../ManageMapping/PropertyMapping";
import { AddMSysVariable } from "../../actions/MasterSysVariable";
import { defaultControlData } from "../../utils/defaultControlData";

import {
    MODULE_ASSI_MAND,
    TABLE_IS_MANDATORY,
    ADD_SYSTEM_VARIABLE,
    COMMON_ERROR_MESSAGE,
    MAXIMUN_CHARACTER_ALLOWED_MSG,
    SUB_NAME_EXIST,
    SYSVARIABLECODE_MANDATORY,
    SYSVARIABLEDESC_MANDATORY,
    // SYSVARIABLEUNIQUE_MANDATORY,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    switchList: {
        padding: "4px",
    },
    switchItem: {
        marginRight: "6px",
    },
    listGutter: {
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "6px",
        "&.Mui-disabled": {
            opacity: "0.8",
        },
    },
    errorCard: {
        background: theme.palette.error.main,
        boxShadow: "none !important",
        color: "#ffffff",
        padding: "12px 16px",
        //marginBottom: '14px'
    },
}));

const AddMasterSys = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearError,
        errors,
    } = useForm({ mode: "onBlur" });
    const [isSubmited, setIsSubmited] = useState(false);
    const [tableList, setTableList] = useState([]);
    const [inputs, setInputs] = useState({
        code: "",
        moduleName: "",
        tableName: "",
        fieldProperty: "",
        valueType: "",
        uniqueColumn: "",
        shortDescription: "",
    });

    const {
        code,
        moduleName,
        tableName,
        fieldProperty,
        valueType,
        uniqueColumn,
        shortDescription,
    } = inputs;

    const isTableAdded = useSelector(
        (state) => state.MasterSysVariable.isTableAdded
    );
    const [apiError, setApiError] = useState(null);
    const addApiError = useSelector((state) => state.MasterSysVariable.addError);

    const moduleDetailsList = useSelector((state) =>
        state.MasterModule.moduleDetailsList.list?.filter(item => !item.deleted)?.sort((a, b) =>
            a.moduleName > b.moduleName ? 1 : -1
        )
    );

    const tableDetailsList = useSelector((state) =>
        state.MasterTable.tableDetailsList.list.sort((a, b) =>
            a.tableName > b.tableName ? 1 : -1
        )
    );

    const defaultValueType = ["str_value", "INT_VALUE", "LONG_VALUE", "list_value_id"];

    const handleCloseForm = useCallback(() => {
        setIsSubmited(false);
        clearError();
        props.handleClose();
    }, [props, clearError]);

    let handleChange = (e) => {
        const { name, value } = e.target;

        setInputs((inputs) => ({ ...inputs, [name]: value }));
        if (name === "moduleName") {
            let filterTable = tableDetailsList.filter(
                (data) => data.module === value
            );
            //console.log(filterTable)
            setTableList(filterTable);
        }

        if (name === "tableName") {
            let selectedTable = tableList.filter((table) => table.name === value);
            let primaryColumn = selectedTable[0].columns.filter(
                (column) => column.isPrimary
            );
            setInputs((inputs) => ({
                ...inputs,
                uniqueColumn: primaryColumn[0],
            }));
            //console.log(primaryColumn[0]);
        }

        //dispatch(resetDuplicateError());
        setApiError(false);
        //setSelectionChanged(true);
    };

    useEffect(() => {
        if (moduleName !== "") {
            setValue("moduleName", moduleName);
            clearError("moduleName");
        } else {
            register(
                { name: "moduleName" },
                { required: { value: true, message: MODULE_ASSI_MAND } }
            );
        }
    }, [clearError, moduleName, register, setValue]);

    useEffect(() => {
        if (tableName !== "") {
            setValue("tableName", tableName);
            clearError("tableName");
        } else {
            register(
                { name: "tableName" },
                { required: { value: true, message: TABLE_IS_MANDATORY } }
            );
        }
    }, [clearError, tableName, register, setValue]);

    useEffect(() => {
        if (!!addApiError) {
            setIsSubmited(false);
        }

        if (
            addApiError &&
            !(addApiError.responseCode === "201" || addApiError.responseCode === 201)
        ) {
            setApiError(true);
        }
        if (
            addApiError.responseMessage &&
            addApiError.responseMessage.includes("Table name") &&
            addApiError.responseMessage.includes("exist")
        ) {
            setIsSubmited(false);
            setApiError(false);
            setError("tableName", "notMatch", SUB_NAME_EXIST);
        }

        if (isTableAdded) {
            handleCloseForm();
            //dispatch(resetDuplicateError());
        }
    }, [dispatch, addApiError, setError, isTableAdded, handleCloseForm]);

    const handleCreateTable = () => {
        console.log(inputs);
        setIsSubmited(true);
        //const watchAllFields = watch();
        let payloadJson = {
            id: tableDetailsList.length + 1,
            modules: inputs.moduleName,
            table: inputs.tableName,
            code: inputs.code,
            shortDescription: inputs.shortDescription,
            uniqueColumn: inputs.uniqueColumn,
            createdByUser: "Narendra Bisht",
            createdDate: "2020-10-09T07:16:52.000+0000",
            updatedByUser: null,
            updatedDate: null,
        };
        console.log(payloadJson);
        dispatch(AddMSysVariable(payloadJson));
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className={styles.dialogTitle}>
                {ADD_SYSTEM_VARIABLE}
            </DialogTitle>
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(handleCreateTable)}
            >
                <DialogContent dividers="true">
                    {apiError ? (
                        <Grid item xs={12} className={styles.col}>
                            <Card className={styles.errorCard}>
                                <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
                            </Card>
                        </Grid>
                    ) : null}
                    <Grid container className={styles.row}>
                        <Grid item xs={4} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: SYSVARIABLECODE_MANDATORY,
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                                    },
                                })}
                                error={errors.code ? true : false}
                                helperText={errors.code?.message}
                                onChange={handleChange}
                                required
                                name="code"
                                label="System Variable Code"
                            />
                        </Grid>
                        <Grid item xs={4} className={styles.col}>
                            <MatFormControl
                                required
                                error={errors.moduleName ? true : false}
                                variant="filled"
                                size="small"
                            >
                                <InputLabel>Module(s)</InputLabel>
                                <MatSelect
                                    name="moduleName"
                                    defaultValue={moduleName}
                                    onChange={handleChange}
                                >
                                    {moduleDetailsList.map((option) => (
                                        <MenuItem key={option.id} value={option.moduleName}>
                                            {option.moduleName}
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                                <FormHelperText>
                                    {errors.moduleName ? errors.moduleName.message : " "}
                                </FormHelperText>
                            </MatFormControl>
                        </Grid>
                        <Grid item xs={4} className={styles.col}>
                            <MatFormControl
                                required
                                error={errors.tableName ? true : false}
                                variant="filled"
                                size="small"
                            >
                                <InputLabel>Field Property</InputLabel>
                                <MatSelect
                                    name="fieldProperty"
                                    defaultValue={fieldProperty}
                                    onChange={handleChange}
                                >
                                    {defaultControlData.map((option, key) => (
                                        <MenuItem key={option.internalName} value={option.internalName}>
                                            {option.fieldLabel}
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                                <FormHelperText>
                                    {errors.fieldProperty ? errors.fieldProperty.message : " "}
                                </FormHelperText>
                            </MatFormControl>
                        </Grid>
                        <Grid item xs={4} className={styles.col}>
                            <MatFormControl
                                required
                                error={errors.valueType ? true : false}
                                variant="filled"
                                size="small"
                            >
                                <InputLabel>Value Type</InputLabel>
                                <MatSelect
                                    name="valueType"
                                    defaultValue={valueType}
                                    onChange={handleChange}
                                >
                                    {defaultValueType.map((option, key) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MatSelect>
                                <FormHelperText>
                                    {errors.valueType ? errors.valueType.message : " "}
                                </FormHelperText>
                            </MatFormControl>
                        </Grid>
                        {fieldProperty !== "" && (
                            <PropertyMapping
                                //data={OobControlData}
                                selectedData={fieldProperty}
                                selectedColumn={valueType}
                            //setValueMapingInputs={setValueMapingInputs}
                            />
                        )}
                        {/* <Grid item xs={4} className={styles.col}>
              <MatFormControl
                required
                error={errors.tableName ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>Table</InputLabel>
                <MatSelect
                  name="tableName"
                  defaultValue={tableName}
                  onChange={handleChange}
                >
                  {tableList.map((option, key) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>
                  {errors.tableName ? errors.tableName.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid> */}
                        {/* <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: SYSVARIABLEUNIQUE_MANDATORY,
                  },
                })}
                error={errors.uniqueColumn ? true : false}
                helperText={errors.uniqueColumn?.message}
                required
                disabled
                name="uniqueColumn"
                label="Primary Column"
                value={
                  uniqueColumn &&
                  (uniqueColumn.mapLabel
                    ? uniqueColumn.mapLabel
                    : uniqueColumn.mapObject.fieldName)
                  // uniqueColumn.mapObject.fieldName
                }
              />
            </Grid> */}
                        <Grid item xs={12} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: SYSVARIABLEDESC_MANDATORY,
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                                    },
                                })}
                                error={errors.shortDescription ? true : false}
                                helperText={errors.shortDescription?.message}
                                onChange={handleChange}
                                required
                                name="shortDescription"
                                label="Short Description"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        Cancel
          </MatButton>
                    <MatButton type="submit" disabled={isSubmited}>
                        Submit
          </MatButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddMasterSys;
