import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useRouteMatch } from "react-router-dom";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import ManageModule from "../../components/ManageModule";

import { fetchOOBModuleById, fetchDefaultVersion } from "../../actions/OOBModuleActions";
import VersionList from "./VersionList";
import { ADD_NEW_VERSION, handleVersionHistoryError, NO_RECORDS_MESSAGE, VER_HISTORY } from "../../utils/Messages";
import { ADD_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import {
    SET_DEFAULT_STARTINDEX,
    DEFAULT_START_INDEX,
    DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
//import SubmoduleList from './SubmoduleList';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        paddingLeft: "270px",
    },
    subMenuGrid: {
        position: "fixed",
    },
    noDataCard: {
        minHeight: "200px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
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

const VersionHistory = (props) => {
    const [open, setOpen] = React.useState(false);
    //const history = useHistory();
    const dispatch = useDispatch();
    //const { url } = useRouteMatch();
    const { moduleId, oobModuleId } = useParams();
    const styles = useStyles();
    //const [label, setLabel] = useState("");
    const getApiError = useSelector((state) => state.OOBModule.getByIdError);
    const [apiError, setApiError] = useState(null);
    const OOBModuleById = useSelector((state) => state.OOBModule.OOBModuleById.data);
    const startIndex = useSelector((state) => state.OOBModule.OOBModuleById.startIndex || 0);
    const featuresAssigned = useSelector(
        (state) => state.User.features
    );

    useEffect(() => {
        // if (url.includes('/admin/global-config')) {
        //     setLabel("Global");
        // }
        // else {
        //     setLabel("OOB");
        // }
        dispatch(fetchOOBModuleById(moduleId, startIndex, DEFAULT_PAGE_SIZE));
    }, [dispatch, moduleId]);

    const openManageSubmoduleDialog = () => {
        dispatch(fetchDefaultVersion(moduleId));
        setOpen(true);
    };

    const closeManageModuleDialog = useCallback(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        if (getApiError)
            setApiError(handleVersionHistoryError(getApiError));
        else
            setApiError(false);
    },
        [getApiError]
    );

    return (
        <>
            <PageHeading
                heading={VER_HISTORY}
                action={
                    featuresAssigned.indexOf(ADD_ACTION_OOB_GLOBAL_CONFIG) !== -1 && <MatButton onClick={openManageSubmoduleDialog}>
                        {ADD_NEW_VERSION}
                    </MatButton>
                }
            />
            {apiError ? (
                <Grid item xs={12} className={styles.error}>
                    <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                        <Typography variant="body2">
                            {apiError.message}
                        </Typography>
                    </Card>
                </Grid>
            ) : OOBModuleById.versions && OOBModuleById.versions.length !== 0 ? (
                <VersionList data={OOBModuleById.versions} moduleId={moduleId} oobModuleId={oobModuleId} />
                // <MatCard>
                //     <DataTable cols={cols} rows={OOBModuleById.versions} config={tableConfig} />
                // </MatCard>
            ) : (
                <MatCard>
                    <CardContent className={styles.noDataCard}>
                        <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
                    </CardContent>
                </MatCard>
            )}
            {open && <ManageModule
                addFor={"version"}
                moduleId={moduleId}
                heading={ADD_NEW_VERSION}
                handleClose={closeManageModuleDialog}
                open={open}
            />
            }
        </>
    );
};

export default VersionHistory;
