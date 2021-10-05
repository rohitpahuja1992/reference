import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Switch from "@material-ui/core/Switch";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";

import MaterialTextField from "../MaterialUi/MatTextField";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "5px 8px",
    },
    row: {
        display: "flex",
    },
    switchList: {
        padding: "0px",
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
        marginBottom: "14px",
    },
}));

const PropertyValueMapping = (props) => {
    const styles = useStyles();
    //const { errors } = useForm({ mode: "onBlur" });
    const {
        errors, register, setValue, clearError,unregister,
        selectedSystem,
        propertyList,
        handleUpdateProperty,
        functionLabel,
        handleUpdateFunctionLabel
    } = props;

    const selectedFieldProperty = useSelector(
        (state) => state.MasterComponent.data.selectedFieldProperty
    );

    const [filterData, setFilterData] = useState([]);

    const handleInputChange = (index, event) => {
        const values = [...propertyList]
        values[index].function = event.target.value;
        handleUpdateProperty(values);
    };

    const handleOobChange = (index, event) => {
        const values = [...propertyList]
        values[index].oob = event.target.checked;
        handleUpdateProperty(values);
    };

    const handleRemoveOther = index => {
        const values = [...propertyList]
        values.splice(index, 1);
        unregister(`${'function' + index}`)
        handleUpdateProperty(values);
    };

    useEffect(() => {
        if (selectedFieldProperty !== 'Other')
            setFilterData(JSON.parse(selectedSystem.propertyValue).filter((item) => item.label !== 'Other').map((item) => item.label));
        else {
            let filter = JSON.parse(selectedSystem.propertyValue).filter((item) => item.label === 'Other');
            if (filter.length > 0)
                setFilterData(filter.map((item) => item.otherLabel));
        }
    }, [selectedSystem, selectedFieldProperty]);

    useEffect(() => {
        propertyList.forEach((field, index) => {
            if (field.function !== "") {
                setValue(`${'function' + index}`, field.function);
                clearError(`${'function' + index}`);
            } else {
                register(
                    { name: 'function' + index },
                    { required: { value: true, message: `Function is mandatory.` } }
                );
            }
        });
    }, [clearError, propertyList, register, setValue]);

    return (
        <Grid
            item
            xs={12}
            className={styles.col}
        >
            <Paper variant="outlined">
                <Grid item xs={12} className={styles.col}>
                    <Typography variant="subtitle2" gutterBottom>
                        Property Values Mapping
                  </Typography>
                </Grid>
                {(filterData.length > 0 &&
                    propertyList.map((item, key) => (
                        <Grid item xs={12} className={styles.row}>
                            <Grid item xs={4} className={styles.col}>
                                <MaterialTextField
                                    name={'option' + key}
                                    value={item.value}
                                />
                            </Grid>
                            <Grid item xs={4} className={styles.col}>
                                <MaterialTextField
                                    error={errors['function' + key] ? true : false}
                                    helperText={
                                        errors['function' + key]?.message
                                    }
                                    select
                                    required
                                    label="Function"
                                    name={'function' + key}
                                    onChange={event => handleInputChange(key, event)}
                                    value={item.function}
                                >
                                    {filterData.map((option, index) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MaterialTextField>
                            </Grid>
                            {(selectedFieldProperty === 'Other') &&
                                <>
                                    <Grid item xs={1} className={styles.col}>
                                        <IconButton style={{ color: "#ff9800" }}
                                            onClick={() => handleRemoveOther(key)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                    < Grid item xs={4} className={styles.col}>
                                        <FormControlLabel
                                            control={<Checkbox checked={item.oob}
                                                onChange={event => handleOobChange(key, event)}
                                                name={'oob' + key} />}
                                            label="Turn 'on' as Out-of-the-Box"
                                        />
                                    </Grid>
                                </>
                            }
                        </Grid>
                    )))}
                <Grid item xs={12} className={styles.row}>
                    <Grid item xs={4} className={styles.col}>
                        <Paper variant="outlined">
                            <List className={styles.switchList}>
                                <ListItem
                                    className={styles.listGutter}
                                    button
                                    onClick={handleUpdateFunctionLabel}
                                >
                                    <ListItemIcon className={styles.switchItem}>
                                        <Switch
                                            edge="end"
                                            // onChange={handleToggle('wifi')}
                                            checked={functionLabel}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle2"
                                                style={{ wordBreak: "break-word" }}
                                            >
                                                Use Function Labels
                                                        </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default PropertyValueMapping;
