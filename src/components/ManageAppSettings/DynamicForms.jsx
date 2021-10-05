import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
//import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import MatButton from "../MaterialUi/MatButton";
import Typography from "@material-ui/core/Typography";
import MaterialTextField from "../MaterialUi/MatTextField";
// import MatFormControl from "../MaterialUi/MatFormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import MatSelect from "../MaterialUi/MatSelect";
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import { defaultFunctionName, defaultValueType, delimeters } from "../../utils/ConfigConstants";
import { NUMBER_PATTERN, ALPHA_PATTERN, ALPHASTR_PATTERN } from "../../utils/AppConstants";


const useStyles = makeStyles((theme) => ({
    col: {
        padding: "10px",
    },
    input: {
        color: theme.palette.primary.main
    },
    deleteButton:
    {
        marginLeft: '10px',
        backgroundColor: theme.palette.warning.main,
        "&:hover": { backgroundColor: theme.palette.warning.dark, }
    },
    cardHeadingSize: {
        marginTop: '2%',
        fontSize: "18px",
    },

}));

const DynamicForms = (props) => {
    const styles = useStyles();
    const { errors, register, setValue, clearError, setError, unregister, handleCode,
        defaultData, isEditable, openFor, isReset, handleReset, handleSelectChange, handleSubmitChange } = props;
    const [inputFields, setInputFields] = useState(defaultData);
    const [delimeter, setDelimeter] = useState("");
    
    const handleAddFields = () => {
        const values = JSON.parse(JSON.stringify(inputFields));
        values.push({ label: '', otherLabel: '', inputRows: [{ type: '', value: "", checked: false, delimeter: "" }] });
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = JSON.parse(JSON.stringify(inputFields));
        values.splice(index, 1);
        unregister(`${'label' + index}`);
        inputFields.forEach((field, indexField) => {
            field.inputRows.forEach((row, indexRow) => {
                if (indexField === index)
                    unregister(`${'type' + indexField + indexRow}`);
            });
        });

        if (values.map(obj => obj.inputRows.some(item => item.type === 'STR Value')).indexOf(true) === -1)
            setDelimeter("");
        handleCode(values);
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(values);
    };

    const handleAddRows = (index) => {
        let newArray = JSON.parse(JSON.stringify(inputFields));
        newArray[index] = { ...newArray[index], inputRows: [...newArray[index].inputRows, { type: '', value: "", checked: false, delimeter: "" }] };
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(newArray);
    };

    const handleRemoveRows = (index, indexRow) => {
        let newArray = JSON.parse(JSON.stringify(inputFields));
        newArray.forEach((item, itemIndex) => item.inputRows.forEach((subItem, indexsubItem) => {
            if (itemIndex === index && indexsubItem === indexRow) {
                unregister(`${'type' + index + indexRow}`);
                return item.inputRows.splice(indexRow, 1);
            }
        }));
        if (newArray.map(obj => obj.inputRows.some(item => item.type === 'STR Value')).indexOf(true) === -1)
            setDelimeter("");
        handleCode(newArray);
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(newArray);
    };

    const handleInputChange = (index, event) => {
        const values = JSON.parse(JSON.stringify(inputFields));
        if (event.target.name.startsWith("label")) {
            values[index].label = event.target.value;
        } else {
            values[index].otherLabel = event.target.value;
        }
        handleCode(values);
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(values);
    };

    const handleInputRowChange = (index, indexRow, event) => {
        const { name, value } = event.target;
        const values = JSON.parse(JSON.stringify(inputFields));
        if (name.startsWith("type")) {
            values[index].inputRows[indexRow].type = value;
            values[index].inputRows[indexRow].value = '';
            clearError(`${'value' + index + indexRow}`);
            if (value === defaultValueType[1])
                values[index].inputRows[indexRow].delimeter = delimeter;
        } else if (name.startsWith("value")) {
            values[index].inputRows[indexRow].value = value;
        } else if (name === "checked") {
            values[index].inputRows[indexRow].checked = !values[index].inputRows[indexRow].checked;
        }
        else {
            setDelimeter(value);
            values.forEach(field => {
                field.inputRows.forEach(item => {
                    if (item.type === 'STR Value')
                        item.delimeter = value
                })
            });
            values[index].inputRows[indexRow].delimeter = value;
        }
        handleCode(values);
        
        if (openFor === 'Update')
            handleSelectChange();
        else
            handleSubmitChange();
        setInputFields(values);
    };

    const handlePattern = (index, indexRow) => {
        if (inputFields[index].inputRows[indexRow].type === 'INT Value' || inputFields[index].inputRows[indexRow].type === 'Long Value')
            return NUMBER_PATTERN
        if (inputFields[index].inputRows[indexRow].type === 'STR Value')
            return ALPHASTR_PATTERN
        if (
            inputFields[index].inputRows[indexRow].type === 'List Value ID')
            return ALPHA_PATTERN

    };

    const handleMax = (value, index, indexRow) => {
        if (inputFields[index].inputRows[indexRow].type === 'INT Value')
            return parseInt(value) < 2147483648
        if (inputFields[index].inputRows[indexRow].type === 'Long Value')
            // eslint-disable-next-line no-undef
            return BigInt(value) < 9223372036854775807n

    };

    const handleErrorMessage = (index, indexRow) => {
        if (inputFields[index].inputRows[indexRow].type === 'INT Value' && errors['value' + index + indexRow]?.type === 'maximum')
            return 'value should be less than 2147483648';
        else if (inputFields[index].inputRows[indexRow].type === 'Long Value' && errors['value' + index + indexRow]?.type === 'maximum')
            return 'value should be less than 9223372036854775807';
        else
            return errors['value' + index + indexRow]?.message
        // if (inputFields[index].inputRows[indexRow].type === 'INT Value')
        //     return 'value should be less than 2147483648';
        // if (inputFields[index].inputRows[indexRow].type === 'Long Value')
        //     return 'value should be less than  9223372036854775807';

    };

    const handleMessage = (index, indexRow) => {
        if (inputFields[index].inputRows[indexRow].type === 'INT Value' ||
        inputFields[index].inputRows[indexRow].type === 'Long Value')
            return 'Enter valid numeric value';
        if (inputFields[index].inputRows[indexRow].type === 'STR Value' ||
            inputFields[index].inputRows[indexRow].type === 'List Value ID')
            return 'Enter valid alphanumeric value';

    };


    useEffect(() => {
        inputFields.forEach((field, index) => {
            if (field.label !== "") {
                setValue(`${'label' + index}`, field.label);
                clearError(`${'label' + index}`);
            } else {
                register(
                    { name: 'label' + index },
                    { required: { value: true, message: `Label is mandatory.` } }
                );
            }
        });
    }, [clearError, inputFields, register, setValue]);

    useEffect(() => {
        inputFields.forEach((field, index) => {
            field.inputRows.forEach((row, indexRow) => {
                if (row.type !== "") {
                    setValue(`${'type' + index + indexRow}`, field.inputRows[indexRow].type);
                    clearError(`${'type' + index + indexRow}`);
                } else {
                    register(
                        { name: 'type' + index + indexRow },
                        { required: { value: true, message: `Value Type is mandatory.` } }
                    );
                }
                // (index === inputFields.map(obj => obj.label === "Other" && obj.inputRows.some(item => item.type === 'STR Value')).indexOf(true))
                // ((index === (field.label === "Other" && row.type === "STR Value")).indexOf(true))
                if (row.type === "STR Value" && field.label === "Other" && (index === inputFields.map(obj => obj.label === "Other" && obj.inputRows.some(item => item.type === 'STR Value')).indexOf(true)) && row.delimeter === "") {
                    register(
                        { name: 'delimeter' + index + indexRow },
                        { required: { value: true, message: `Delimeter is mandatory.` } }
                    )
            }
                // if (row.type === "STR Value" && field.label === "Other" && row.delimeter === "") {
                //         register(
                //             { name: 'delimeter' + index + indexRow },
                //             { required: { value: true, message: `Delimeter is mandatory.` } }
                //         )
                // }
                else {
                    setValue(`${'delimeter' + index + indexRow}`, field.inputRows[indexRow].delimeter);
                    clearError(`${'delimeter' + index + indexRow}`);

                }

                // if (row.type === "INT Value" && Number(row.value) > 2147483648) {
                //      setError(`${'value' + index + indexRow}`, "notMatch", "value should be less than 2147483648");
                // }
                // // eslint-disable-next-line no-undef
                // if (row.type === "Long Value" && BigInt(row.value) > 9223372036854775807n) {
                //     setError(`${'value' + index + indexRow}`, "notMatch", "value should be less than  9,223,372,036,854,775,807");
                // }
            });
        });

    }, [clearError, inputFields, register, setValue, setError]);

    useEffect(() => {
        if (isReset) {
            setInputFields(defaultData);
            handleReset();
        }
    }, [isReset, defaultData, handleReset]);
    
    return (
        <>
            {inputFields.map((inputField, index) => (
                < Fragment key={`${inputField}~${index}`}>
                    <Grid container className={styles.row}>
                        <Grid item xs={4} className={styles.col}>
                            <MaterialTextField
                                error={errors['label' + index] ? true : false}
                                helperText={
                                    errors['label' + index]?.message
                                }
                                select
                                required
                                label="Function Label"
                                onChange={event => handleInputChange(index, event)}
                                name={'label' + index}
                                disabled={!isEditable}
                                value={inputField.label}
                            >
                                {[...defaultFunctionName.filter(f => !(inputFields.map(item => item.label).includes(f))), inputField.label, 'Other'].filter(Boolean).map((option, key) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </MaterialTextField>
                        </Grid>
                        {inputField.label === 'Other' && <Grid item xs={4} className={styles.col}>
                            <MaterialTextField
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: 'Other label is mandatory',
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Maximum 20 Characters allowed',
                                    },
                                })}
                                InputProps={{
                                    endAdornment: (<InputAdornment position="end" className={styles.input}>{inputField.otherLabel.length}/20</InputAdornment>)
                                }}
                                inputProps={{
                                    maxlength: 20,
                                }}
                                error={errors['otherLabel' + index] ? true : false}
                                helperText={errors['otherLabel' + index]?.message}
                                onChange={event => handleInputChange(index, event)}
                                required
                                name={'otherLabel' + index}
                                label="Function Label Other"
                                disabled={!isEditable}
                                value={inputField.otherLabel}
                            />
                        </Grid>}
                        {inputField.inputRows.map((inputRow, indexRow) => (
                            <Fragment key={`${inputRow}~${indexRow}`}>
                                <Grid container className={styles.row}>
                                    <Grid item xs={2} className={styles.col}>
                                        <MaterialTextField
                                            error={errors['type' + index + indexRow] ? true : false}
                                            helperText={
                                                errors['type' + index + indexRow]?.message
                                            }
                                            select
                                            required
                                            label="Value Type"
                                            disabled={!isEditable}
                                            value={inputRow.type}
                                            onChange={event => handleInputRowChange(index, indexRow, event)}
                                            name={'type' + index + indexRow}
                                        >
                                            {[...defaultValueType.filter(f => f !== "List Value ID" && !(inputField.inputRows.map(item => item.type).includes(f))), inputRow.type].filter(Boolean).map((option, key) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MaterialTextField>
                                    </Grid>
                                    <Typography variant="h6" className={styles.cardHeadingSize}>
                                        =
                                    </Typography>
                                    <Grid item xs={4} className={styles.col}>
                                        {inputRow.type !== 'Client Value' ?
                                            <MaterialTextField
                                                inputRef={register({
                                                    pattern: { value: handlePattern(index, indexRow), message: handleMessage(index, indexRow) },
                                                    validate: {
                                                        maximum: value => handleMax(value, index, indexRow)
                                                    }
                                                })}
                                                error={errors['value' + index + indexRow] ? true : false}
                                                helperText={handleErrorMessage(index, indexRow)}
                                                //     errors['value' + index + indexRow]?.message
                                                // }
                                              
                                                onChange={event => handleInputRowChange(index, indexRow, event)}
                                                name={'value' + index + indexRow}
                                                disabled={!isEditable}
                                                label="Value"
                                                value={inputRow.value}
                                            />
                                            :
                                            <Checkbox
                                                name="checked"
                                                checked={inputRow.checked}
                                                disabled={!isEditable}
                                                onChange={event => handleInputRowChange(index, indexRow, event)}
                                            />}
                                    </Grid>
                                    
                                    <Grid item xs={2} className={styles.col}>
                                        {inputRow.type === 'STR Value' && inputField.label === 'Other' &&
                                            (index === inputFields.map(obj => obj.label === "Other" && obj.inputRows.some(item => item.type === 'STR Value')).indexOf(true)) &&
                                            <MaterialTextField
                                                error={errors['delimeter' + index + indexRow] ? true : false}
                                                helperText={
                                                    errors['delimeter' + index + indexRow]?.message
                                                }
                                                select
                                                required
                                                value={inputRow.delimeter}
                                                label="Delimiter"
                                                disabled={!isEditable}
                                                onChange={event => handleInputRowChange(index, indexRow, event)}
                                                name="delimeter"
                                            >
                                                {delimeters.map((option, key) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MaterialTextField>}
                                    </Grid>

                                    <Grid item xs={2} className={styles.col}>
                                        <IconButton color="primary" disabled={inputFields[index].inputRows.length === 4 || !isEditable}
                                            onClick={() => handleAddRows(index)}>
                                            <AddCircleIcon />
                                        </IconButton>
                                        <IconButton style={{ color: (((inputFields[index].inputRows.length !== 1 && openFor === 'Add') || (openFor === 'Update' && !(inputFields[index].inputRows.length === 1 || !isEditable))) ? "#ff9800" : "") }}
                                            disabled={inputFields[index].inputRows.length === 1 || !isEditable}
                                            onClick={() => handleRemoveRows(index, indexRow)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Fragment>
                        ))}

                        <Grid item xs={6} className={styles.col}>
                            <MatButton color="primary" onClick={() => handleAddFields()} disabled={!isEditable}>
                                Add Function
                            </MatButton>
                            <MatButton className={styles.deleteButton} disabled={inputFields.length === 1 || !isEditable} onClick={() => handleRemoveFields(index)}>
                                Delete Function
                            </MatButton>
                        </Grid>
                    </Grid>
                </Fragment>
            ))
            }
        </>
    );
};

export default DynamicForms;
