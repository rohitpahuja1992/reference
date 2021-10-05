import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import MaterialTextField from '../MaterialUi/MatTextField';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core';
//import { fetchMasterMessage } from "../../actions/MasterMessageActions";
import { fetchMasterMessageByModuleId } from "../../actions/MasterMessageActions";
import { fetchMasterSystemByModuleId } from "../../actions/MasterSystemActions";
//import { fetchMasterSystem } from "../../actions/MasterSystemActions";
import PropertyValueMapping from "./PropertyValueMapping";



const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
    },
    grow: {
        flexGrow: 1
    },
    cardHeadingSize: {
        fontSize: "18px",
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


function TabAddMapping(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { handleAddMapping } = props;
    const { register, handleSubmit, setValue, clearError, setError, unregister, errors } = useForm();

    const selectedFieldProperty = useSelector(
        (state) => state.MasterComponent.data.selectedFieldProperty
    );
    const selectedFieldMapping = useSelector(
        (state) => state.MasterComponent.data.selectedFieldMapping
    );
    const selectedOptionId = useSelector(
        (state) => state.MasterComponent.data.selectedOptionId
    );
    const MasterData = useSelector(
        (state) => state.MasterComponent.data
    );
    const systemDetailsList = useSelector((state) => state.MasterSysVariable.systemByModule);
    const messageDetailsList = useSelector((state) => state.MasterMessage.messageByModule);
    const [descriptionList, setDescriptionList] = useState([]);
    const [propertyList, setPropertyList] = useState(selectedFieldMapping.property);
    // const configDetails = selectedData.config;

    const [inputs, setInputs] = useState({
        method: selectedFieldMapping.method,
        description: selectedFieldMapping.description,
        oob: selectedFieldMapping.oob,
        functionLabel: selectedFieldMapping.functionLabel
    });
    const { method, description, oob, functionLabel } = inputs;

    let handleChange = (e) => {
        const { name, checked } = e.target;
        clearError(name);
        if (name === 'oob')
            setInputs(inputs => ({ ...inputs, [name]: checked }));
    }

    let handleUpdateProperty = (data) => {
        setPropertyList(data);
    }

    let handleUpdateFunctionLabel = () => {
        setInputs(inputs => ({ ...inputs, functionLabel: !functionLabel }));
    }

    const handleDescriptionChange = (event, value) => {
        if (Object.keys(value).length > 0)
            clearError('description');
        if (selectedFieldProperty && selectedFieldProperty === 'Other') {
            let filterMap = JSON.parse(value.propertyValue).filter((item) => item.label === 'Other');
            let list = [];
            if (filterMap.length > 0) {
                filterMap.map((item, index) => {
                    let obj = {};
                    obj.value = 'Other' + (index + 1);
                    obj.function = '';
                    obj.oob = false;
                    return list.push(obj)
                })
            }
            setPropertyList(list);
        }
        setInputs((inputs) => ({ ...inputs, description: value }));
    }

    const assignMapping = () => {
        if (Object.keys(description).length > 0)
            clearError('description');
        else
            setError('description', 'notMatch', 'System variable is mandatory.')
        if (Object.keys(description).length > 0) {
            selectedFieldMapping.description = description;
            if (selectedFieldProperty !== 'Other')
                selectedFieldMapping.oob = oob;
            selectedFieldMapping.property = propertyList;
            selectedFieldMapping.functionLabel = functionLabel;
            if (selectedFieldProperty === 'Other') {
                let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
                temp.config.Other[selectedOptionId].value = description.description;
            }
            handleAddMapping();
        }
    }

    useEffect(() => {
        if (method === "Message Constant") {
            dispatch(fetchMasterMessageByModuleId(MasterData.moduleIds));
            //dispatch(fetchMasterMessage());
        } else {
            //dispatch(fetchMasterSystem());
            dispatch(fetchMasterSystemByModuleId(MasterData.moduleIds));
        }
    }, [dispatch, method, MasterData.moduleIds]);

    useEffect(() => {
        if (method === "Message Constant") {
            setDescriptionList(messageDetailsList);
        } else {
            setDescriptionList(systemDetailsList);
        }
    }, [method, systemDetailsList, messageDetailsList]);

    useEffect(() => {
        if (selectedFieldProperty && selectedFieldProperty !== 'Other' && propertyList.length === 0) {
            setPropertyList([{ value: 'Yes', function: '' }, { value: 'No', function: '' }])
        }
    }, [selectedFieldProperty, propertyList]);

    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(assignMapping)} id="addMappingInfo">
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Field Property Mapping
                </Typography>
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        defaultValue={selectedFieldProperty}
                        disabled
                        label="Field Property" name="fieldProperty" />
                </Grid>
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Configuration Mapping
                </Typography>
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        defaultValue={method}
                        disabled
                        label="Configuration Method" name="configurationMethod" />
                </Grid>
                <Grid item xs={4} className={styles.col}>
                    <Autocomplete
                        options={descriptionList}
                        onChange={(event, value) => handleDescriptionChange(event, value)}
                        name="description"
                        getOptionLabel={(option) => option.description}
                        defaultValue={description}
                        renderInput={(params) => <MaterialTextField {...params}
                            inputRef={register}
                            error={errors.description ? true : false}
                            helperText={
                                errors.description ? errors.description.message : " "
                            }
                            required
                            label={method} />}
                    />
                </Grid>
                {selectedFieldProperty !== 'Other' &&
                    < Grid item xs={4} className={styles.col}>
                        <FormControlLabel
                            control={<Checkbox checked={oob}
                                onChange={handleChange}
                                name="oob" />}
                            label="Turn 'on' as Out-of-the-Box"
                        />
                    </Grid>
                }
                {description && Object.keys(description).length > 0 && method !== "Message Constant" &&
                    <PropertyValueMapping
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        clearError={clearError}
                        unregister={unregister}
                        selectedSystem={description}
                        propertyList={propertyList}
                        functionLabel={functionLabel}
                        handleUpdateProperty={handleUpdateProperty}
                        handleUpdateFunctionLabel={handleUpdateFunctionLabel}
                    />
                }
            </Grid>
        </form >
    );
}

export default TabAddMapping;