import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import MaterialTextField from '../MaterialUi/MatTextField';
import Typography from '@material-ui/core/Typography';
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core';
// import { resetSelectedData } from '../../actions/MasterComponentActions';


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


function TabConfigurationDetails(props) {
    const styles = useStyles();
    //const dispatch = useDispatch();
    const { handleConfiguration, handleNext, fieldData, configDetails, updateConfig } = props;
    const { handleSubmit, clearError} = useForm();
    //const [config, setConfig] = useState(configDetails);
    // const selectedData = useSelector(
    //     (state) => state.MasterComponent.data.selectedData[0]
    // );
    // const MasterData = useSelector(
    //     (state) => state.MasterComponent.data
    // );

    // const configDetails = configDetails;

    const [inputs, setInputs] = useState({
        Section: configDetails.Section.value,
        Label: configDetails.Label.value,
        Hidden: configDetails.Hidden.value,
        Mandatory: configDetails.Mandatory.value,
        Disabled: configDetails.Disabled.value
    });
    const { Section, Label, Hidden, Mandatory, Disabled } = inputs;

    let handleChange = (e) => {
        const { name, value } = e.target;
        clearError(name);
        //let data = JSON.parse(JSON.stringify(config));
        // console.log("name,value", data[name], value);
        //data[name].value = value;
        configDetails[name].value = value;
        //setConfig(data);
        //dispatch(resetSelectedData([data]));
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const handleRemoveOther = index => {
        const values = JSON.parse(JSON.stringify(configDetails));
        let pos = values.Other.findIndex(x => x.id ===index);
        values.Other.splice(pos, 1);
        updateConfig(values);
    };

    const handleAddOther = () => {
        const values = JSON.parse(JSON.stringify(configDetails));
        values.Other.push({
            id: configDetails.Other.length > 0 ? configDetails.Other[configDetails.Other.length - 1].id + 1 : 1,
            value: "",
            mapping: { method: "System Variable", description: {}, property: [], functionLabel: false },
        });
        //setConfig(values);
        updateConfig(values);
       
        //let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
        //configDetails.Other = values.config.Other;
        //dispatch(resetSelectedData([values]));
    };

    const assignConfiguration = () => {
        //let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
        // configDetails.Section.value = Section;
        // configDetails.Label.value = Label;
        // configDetails.Hidden.value = Hidden;
        // configDetails.Mandatory.value = Mandatory;
        // configDetails.Disabled.value = Disabled;
        handleConfiguration();
    }

    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(assignConfiguration)} id="addConfigurationInfo">
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Details
                </Typography>
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        defaultValue={fieldData.fieldType}
                        disabled
                        label="Field Type" name="fieldType" />
                </Grid>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        defaultValue={Section}
                        onChange={handleChange}
                        label="Section" name="Section" />
                </Grid>
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Default Properties
                </Typography>
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                        defaultValue={Label}
                        onChange={handleChange}
                        label="Label" name="Label" />
                </Grid>
                <Grid item xs={1} className={styles.col}>
                    <IconButton
                        edge="start" aria-label="default"
                        onClick={() => handleNext('Label')}>
                        <SettingsIcon style={{ color: Object.keys(configDetails.Label.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                    </IconButton>
                </Grid>
                <Grid item xs={4} className={styles.col}>
                    <MatFormControl variant="filled" size="small">
                        <InputLabel>Disabled</InputLabel>
                        <MatSelect
                            name="Disabled"
                            defaultValue={Disabled}
                            onChange={handleChange}>
                            <MenuItem value="Yes">
                                Yes
                            </MenuItem>
                            <MenuItem value="No">
                                No
                            </MenuItem>
                            ))
                        </MatSelect>
                    </MatFormControl>
                </Grid>
                <Grid item xs={1} className={styles.col}>
                    <IconButton
                        edge="start" aria-label="default"
                        onClick={() => handleNext('Disabled')}>
                        <SettingsIcon style={{ color: Object.keys(configDetails.Disabled.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                    <MatFormControl variant="filled" size="small">
                        <InputLabel>Mandatory</InputLabel>
                        <MatSelect
                            name="Mandatory"
                            defaultValue={Mandatory}
                            onChange={handleChange}>
                            <MenuItem value="Yes">
                                Yes
                            </MenuItem>
                            <MenuItem value="No">
                                No
                            </MenuItem>
                            ))
                        </MatSelect>
                    </MatFormControl>
                </Grid>
                <Grid item xs={1} className={styles.col}>
                    <IconButton
                        edge="start" aria-label="default"
                        onClick={() => handleNext('Mandatory')}>
                        <SettingsIcon style={{ color: Object.keys(configDetails.Mandatory.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                    </IconButton>
                </Grid>
                <Grid item xs={4} className={styles.col}>
                    <MatFormControl variant="filled" size="small">
                        <InputLabel>Hidden</InputLabel>
                        <MatSelect
                            name="Hidden"
                            defaultValue={Hidden}
                            onChange={handleChange}>
                            <MenuItem value="Yes">
                                Yes
                            </MenuItem>
                            <MenuItem value="No">
                                No
                            </MenuItem>
                            ))
                        </MatSelect>
                    </MatFormControl>
                </Grid>
                <Grid item xs={1} className={styles.col}>
                    <IconButton
                        edge="start" aria-label="default"
                        onClick={() => handleNext('Hidden')}>
                        <SettingsIcon style={{ color: Object.keys(configDetails.Hidden.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                    </IconButton>
                </Grid>
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Additional Properties
                </Typography>
            {
                configDetails.Other.length > 0 && configDetails.Other.map((item, key) => (
                    <Grid container className={styles.row}>
                        <Grid item xs={4} className={styles.col}>
                            <MaterialTextField
                                value={item.value}
                                disabled
                                label="Other"
                                name={'option' + key}
                            />
                        </Grid>
                        <Grid item xs={1} className={styles.col}>
                            <IconButton
                                edge="start" aria-label="default"
                                onClick={() => handleNext('Other', key)}>
                                <SettingsIcon style={{ color: Object.keys(configDetails.Other[key].mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={1} className={styles.col}>
                            <IconButton style={{ color: "#ff9800" }}
                                onClick={() => handleRemoveOther(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))
            }
            <Grid container className={styles.row}>
                <IconButton color="primary"
                    disabled={configDetails.Other.length > 0 && Object.keys(configDetails.Other[configDetails.Other.length - 1].mapping.description).length === 0}
                    onClick={() => handleAddOther()}>
                    <AddCircleIcon />
                </IconButton>
            </Grid>
        </form >
    );
}

export default TabConfigurationDetails;