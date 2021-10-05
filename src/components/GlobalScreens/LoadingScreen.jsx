import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: "999999",
        color: theme.palette.secondary.light,
    }
}));

const LoadingScreen = () => {
    const styles = useStyles();
    return (
        <Backdrop className={styles.backdrop} open={true}>
                <CircularProgress color="inherit" size={60} />
        </Backdrop>
    );
}

export default LoadingScreen;