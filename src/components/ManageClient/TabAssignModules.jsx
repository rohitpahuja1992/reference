import React, {  useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core';
import AssignModuleList from './AssignModuleList';
import { handleTabAssignModulesError } from '../../utils/Messages';

const useStyles = makeStyles((theme) => ({
    col: {
        padding: '10px'
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
    cardHeadingSize: {
        fontSize: "18px",
    },
    cardHeadingSizeOOB: {
        fontSize: "18px",
        marginTop: "10px"
    },
}));

function TabAssignModules(props) {
    const styles = useStyles();
    const { handleDisabled, handleNext,handleActiveTab } = props;
    const { handleSubmit } = useForm();
    const OOBModuleDetailsList = useSelector(state => state.OOBModule.OOBModuleDetailsList.data.sort((a, b) => a.module.moduleName.toLowerCase() > b.module.moduleName.toLowerCase() ? 1 : -1));
    const GlobalModuleDetailsList = useSelector(state => state.OOBModule.GlobalModuleDetailsList.data.sort((a, b) => a.module.moduleName.toLowerCase() > b.module.moduleName.toLowerCase() ? 1 : -1));
    const addApiError = useSelector(state => state.Client.addModuleError);
    const requestParamGlobal = useSelector(state => state.Client.addSelectedGlobalModule);
    const requestParamOOB = useSelector(state => state.Client.addSelectedOOBModule);
    const isModuleUpdated = useSelector(state => state.TurnOnModule.isModuleUpdated)
    const [apiError, setApiError] = useState(null);
    const ModuleDetailsList = [...GlobalModuleDetailsList,...OOBModuleDetailsList];

    const assignModules = () => {
       // handleNext([...requestParamOOB, ...requestParamGlobal]);
       handleActiveTab(2)
    }
  
    useEffect(() => {
        if (isModuleUpdated)
            handleDisabled(false);
        else
            handleDisabled(true);
    }, [handleDisabled,isModuleUpdated]);

    useEffect(() => {
        if (addApiError)
            setApiError(handleTabAssignModulesError(addApiError));
        else
            setApiError(false);
    }, [addApiError]);


    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(assignModules)} id="addClientModule">
            {apiError ? (
                <Grid item xs={12} className={styles.col}>
                    <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                        <Typography variant="body2">
                            {apiError.message}
                        </Typography>
                    </Card>
                </Grid>
            ) : null}
            {/* <Typography variant="h6" className={styles.cardHeadingSize}>
                Global Modules
                </Typography>
            <Grid container className={styles.row}>
                <AssignGlobalModuleList ModuleDetailsList={GlobalModuleDetailsList}
                />
            </Grid> */}
            <Typography variant="h6" className={styles.cardHeadingSizeOOB}>
                Module(s)
                </Typography>
            <Grid container className={styles.row}>
                <AssignModuleList handleDisabled={handleDisabled} ModuleDetailsList={ModuleDetailsList}
                />
            </Grid>
           
        </form>
    );
}

export default TabAssignModules;

