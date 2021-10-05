import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { resetSelectedData } from '../../actions/MasterComponentActions';


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
    const dispatch = useDispatch();
    const { handleConfiguration, handleNext } = props;
    const { register, handleSubmit, setValue, clearError, setError, watch, errors } = useForm();
    const selectedData = useSelector(
        (state) => state.MasterComponent.data.selectedData[0]
    );
    const MasterData = useSelector(
        (state) => state.MasterComponent.data
    );

    const configDetails = selectedData.config;

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
        let data = JSON.parse(JSON.stringify(selectedData));
        data.config[name].value = value;
        dispatch(resetSelectedData([data]));
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const handleRemoveOther = index => {
        const values = JSON.parse(JSON.stringify(selectedData));
        let pos = values.config.Other.findIndex(x => x.id ===index);
        values.config.Other.splice(pos, 1);
        let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
        temp.config.Other = values.config.Other;
        dispatch(resetSelectedData([values]));
    };

    const handleAddOther = () => {
        const values = JSON.parse(JSON.stringify(selectedData));
        values.config.Other.push({
            id: values.config.Other.length >0 ?values.config.Other[values.config.Other.length - 1].id + 1:1,
            value: "",
            mapping: { method: "System Variable", description: {}, property: [], functionLabel: false },
        });
        let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
        temp.config.Other = values.config.Other;
        dispatch(resetSelectedData([values]));
    };

    const assignConfiguration = () => {
        let temp = MasterData.column.filter(item => item.id === MasterData.selectedFieldId)[0];
        temp.config.Section.value = Section;
        temp.config.Label.value = Label;
        temp.config.Hidden.value = Hidden;
        temp.config.Mandatory.value = Mandatory;
        temp.config.Disabled.value = Disabled;
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
                        defaultValue={selectedData.fieldType}
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
                        <SettingsIcon style={{ color: Object.keys(selectedData.config.Label.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
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
                        <SettingsIcon style={{ color: Object.keys(selectedData.config.Disabled.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
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
                        <SettingsIcon style={{ color: Object.keys(selectedData.config.Mandatory.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
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
                        <SettingsIcon style={{ color: Object.keys(selectedData.config.Hidden.mapping.description).length > 0 ? '#4ADAB3' : '' }} />
                    </IconButton>
                </Grid>
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
                Additional Properties
                </Typography>
            {
                selectedData.config.Other.length > 0 && selectedData.config.Other.map((item, key) => (
                    <Grid container className={styles.row}>
                        <Grid item xs={4} className={styles.col}>
                            <MaterialTextField
                                defaultValue={item.value}
                                disabled
                                label="Other"
                                name={'option' + key}
                            />
                        </Grid>
                        <Grid item xs={1} className={styles.col}>
                            <IconButton
                                edge="start" aria-label="default"
                                onClick={() => handleNext('Other', key)}>
                                <SettingsIcon style={{ color: Object.keys(selectedData.config.Other[key].mapping.description).length > 0 ? '#4ADAB3' : '' }} />
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
                    disabled={selectedData.config.Other.length > 0 && Object.keys(selectedData.config.Other[selectedData.config.Other.length - 1].mapping.description).length === 0}
                    onClick={() => handleAddOther()}>
                    <AddCircleIcon />
                </IconButton>
            </Grid>
        </form >
    );
}

export default TabConfigurationDetails;