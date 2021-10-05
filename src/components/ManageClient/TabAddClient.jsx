import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import MaterialTextField from '../MaterialUi/MatTextField';
import MatFormControl from '../MaterialUi/MatFormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MatSelect from '../MaterialUi/MatSelect';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles, FormHelperText } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import ListSubheader from '@material-ui/core/ListSubheader'
import MenuItem from '@material-ui/core/MenuItem';
import { NAME_PATTERN, RESET_ADD_CLIENT_INFO } from '../../utils/AppConstants';
import { resetAddError } from '../../actions/ClientActions';
import {
    CLIENT_ALREADY_EXIST_MSG, CLIENT_NAME_MANDATORY_MSG, CODE_VERSION_MANDATORY_MSG,
    handleTabAddClientError, MAXIMUN_CHARACTER_ALLOWED_MSG, RELATIONSHIP_MANAGER_MANDATORY_MSG, VALID_NAME_MSG
} from '../../utils/Messages';

//import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
    },
    dialogTitle: {
        fontWeight: 300
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
    userCount: {
        backgroundColor: theme.palette.primary.main,
        marginTop: '8px'
    },
    topSection: {
        display: 'flex',
        marginBottom: '10px'
    },
    grow: {
        flexGrow: 1
    },
    moduleCard: {
        background: '#d6e3eb',
        cursor: 'pointer'
    },
    cardTitle: {
        fontWeight: 500,
        color: theme.palette.primary.dark
    },
    cardCaption: {
        color: '#84858a'
    },
    disableClick: {
        pointerEvents: 'none'
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

// const role = [
//     {
//         value: 'Client User',
//         label: 'Client User',
//     }
//     {
//         value: 'MHK User',
//         label: 'MHK User',
//     },
//     {
//         value: 'Administrator',
//         label: 'Administrator',
//     },
//     {
//         value: 'MHK Product User',
//         label: 'MHK Product User',
//     },
// ];

// const codeversion = [
//     {
//         value: "v0.0",
//         label: "v0.0"
//     },
//     {
//         value: "v1.0",
//         label: "v1.0"
//     },
//     {
//         value: "v2.0",
//         label: "v2.0"
//     },
//     {
//         value: "v3.0",
//         label: "v3.0"
//     }
// ];
// const relationshipmanager = [
//     {
//         value: "Chay Levell",
//         label: "Chay Levell"
//     },
//     {
//         value: "Maggie Cajka",
//         label: "Maggie Cajka"
//     },
//     {
//         value: "Maria Fajardo",
//         label: "Maria Fajardo"
//     },
//     {
//         value: "Natalie Dougherty",
//         label: "Natalie Dougherty"
//     }
// ];

function TabAddClient(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { handleDisabled, handleNext } = props;
    const { register, handleSubmit, setValue, clearError, setError, watch, errors } = useForm();
    //const stateCityList = useSelector(state => state.ManageClient.stateCityList.list);
    const codeVersion = useSelector(state => state.CodeVersion.codeVersionDetailsList.list && state.CodeVersion.codeVersionDetailsList.list.filter(obj => !obj.deleted))
    const managerList = useSelector(state => state.User.data.list && state.User.data.list.filter(obj => obj.user_type === 'MHK' && obj.status === 'ACTIVE'));
    const clientInfo = useSelector(state => state.Client.clientInfo);
    const addApiError = useSelector(state => state.Client.addInfoError);
    const [actionError, setActionError] = useState("");
    //const [city, setCity] = useState(true);
    const [inputs, setInputs] = useState({
        clientName: clientInfo.clientName,
        version: clientInfo.version,
        manager: clientInfo.manager,
    });
    const { clientName, version, manager } = inputs;

    let handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: RESET_ADD_CLIENT_INFO });
        handleDisabled(false);
        clearError(name);
        if (name === 'manager' || name === 'version')
            setInputs(inputs => ({ ...inputs, [name]: value }));
        else {
            dispatch(resetAddError());
            setInputs(inputs => ({ ...inputs, [name]: watch(name) }));
        }
    }

    useEffect(() => {
        if (manager !== "") {
            setValue("manager", manager);
            clearError("manager");
        } else {
            register({ name: 'manager' }, { required: { value: true, message: RELATIONSHIP_MANAGER_MANDATORY_MSG } });
        }
        if (version !== "") {
            setValue("version", version);
            clearError("version");
        } else {
            register({ name: 'version' }, { required: { value: true, message: CODE_VERSION_MANDATORY_MSG } });
        }

        if (addApiError) {
            handleDisabled(true);
            setActionError(handleTabAddClientError(addApiError));
        }
        else
            setActionError(false);

        if (addApiError.responseCode && addApiError.responseCode === '2013') {
            setError("clientName", "notMatch", CLIENT_ALREADY_EXIST_MSG);
            setActionError(false);
        }


    }, [
        register, addApiError, manager, version, setValue, clearError, setError, clientInfo, inputs, handleDisabled]
    )

    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(() => handleNext(inputs))} id="addClientInfo">
            {actionError ? (
                <Grid item xs={12} className={styles.col}>
                    <Card className={actionError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                        <Typography variant="body2">
                            {actionError.message}
                        </Typography>
                    </Card>
                </Grid>
            ) : null}
            <Grid container className={styles.row}>
                <Grid item xs={12} className={styles.col}>
                    <MaterialTextField inputRef={register({ required: { value: true, message: CLIENT_NAME_MANDATORY_MSG }, pattern: { value: NAME_PATTERN, message: VALID_NAME_MSG }, maxLength: { value: 50, message: MAXIMUN_CHARACTER_ALLOWED_MSG } })}
                        defaultValue={clientName.trim()}
                        error={errors.clientName ? true : false}
                        helperText={errors.clientName ? errors.clientName.message : " "}
                        required label="Client Name" name="clientName" onChange={handleChange} />
                </Grid>
                <Grid item xs={6} className={styles.col}>
                    <MatFormControl required error={errors.version ? true : false}
                        variant="filled" size="small">
                        <InputLabel>Code Version</InputLabel>
                        <MatSelect
                            value={version}
                            name="version"
                            onChange={handleChange}>
                            <ListSubheader disableSticky={true} className={styles.disableClick}>Released</ListSubheader>
                            {codeVersion.filter(type => type.type === 'RELEASED').map((option, key) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.codeVersion}
                                </MenuItem>
                            ))}
                            <ListSubheader disableSticky={true} className={styles.disableClick}>Unreleased</ListSubheader>
                            {codeVersion.filter(type => type.type === 'UNRELEASED').map((option, key) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.codeVersion}
                                </MenuItem>
                            ))}
                        </MatSelect>
                        <FormHelperText>{errors.version ? errors.version.message : " "}</FormHelperText>
                    </MatFormControl>
                </Grid>
                <Grid item xs={6} className={styles.col}>
                    <MatFormControl required error={errors.manager ? true : false}
                        variant="filled" size="small">
                        <InputLabel>Relationship Manager</InputLabel>
                        <MatSelect
                            value={manager}
                            name="manager"
                            onChange={handleChange}>
                            {managerList.map((option, key) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.firstName + ' ' + option.lastName}
                                </MenuItem>
                            ))}
                        </MatSelect>
                        <FormHelperText>{errors.manager ? errors.manager.message : " "}</FormHelperText>
                    </MatFormControl>
                </Grid>
                {/* <Grid item xs={12} className={styles.col}>
                    <DropzoneArea
                        acceptedFiles={['.xls', '.xlsx', '.csv']}
                        dropzoneText={"Drag and drop an Excel Sheet here or click"}
                        onChange={(files) => console.log('Files:', files)}
                    />
                </Grid> */}
                {/* <Grid item xs={4} className={styles.col}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Generate Password*</FormLabel>
                    <RadioGroup row aria-label="pwdtype" name="pwdtype" value={pwdtype} onChange={handleChange}>
                        <FormControlLabel value="manually" control={<Radio />} label="Manually" />
                        <FormControlLabel value="automatically" control={<Radio />} label="Automatically" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={8} className={styles.col}>
                <MaterialTextField required label="Password" id="password" name="password" type="password" variant="filled" />
            </Grid> */}
            </Grid>
        </form>
    );
}

export default TabAddClient;