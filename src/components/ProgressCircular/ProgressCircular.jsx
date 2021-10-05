import React from "react";
// import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";

//import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import Box from "@material-ui/core/Box";
import MatButton from "../MaterialUi/MatButton";
//import Grid from "@material-ui/core/Grid";
import { Divider, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

//import { COMMON_ERROR_MESSAGE, PLEASE_TRY_OTHER } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
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
    marginBottom: "14px",
  },
  root: {
    margin: "0px 0px 0px",
    width: "50px",
    height: "50px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  errorTable: {
    padding: "10px",
    overflowX: "auto",
    height: "30vh",
    zIndex: "1",
    marginTop: "12px",
    width: "100%",
    '& p': {
      marginTop: "5px",
      marginBottom: "5px",
      fontSize: "12px",
      '& span':{
        color:"#ee3124",
      }
    }
   
  },
}));

function ProgressCircular(props) {
  const styles = useStyles();

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={styles.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={styles.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="sm"
        maxHeight="50vh"
      >
        <DialogTitle className={styles.dialogTitle} onClose={props.handleClose}>
          File upload status
        </DialogTitle>

        <Divider />
        <DialogContent>
          {/*<Grid container className={styles.row}>
            {apiError && (
                <Grid item xs={12} className={styles.col}>
                  <Card
                    className={
                      userData.error.responseCode === "9124" ||
                      userData.error.responseCode === "9123"
                        ? styles.warningCard
                        : styles.errorCard
                    }
                  >
                    <Typography variant="body2">{apiError}</Typography>
                  </Card>
                </Grid>
              )} 
           
          </Grid>*/}
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <CircularProgress variant="static" {...props} />
            {/* {{ props.current === props.total &&  <CircularProgress variant="static" {...props}/>} */}
            <Box
              top={12}
              left={0}
              bottom={18}
              right={0}
              position="absolute"
              display="flex"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                component="div"
                color="textSecondary"
              >
                {`${props.value}%`}
              </Typography>
            </Box>

            <div>
              {/* Files uploaded {props.total - props?.errorData?.length} out of{" "}
              {props.total} */}
              Processed { props.current } files with { props?.errorData?.length } errors
            </div>
            {/* <div>{JSON.stringify(props.errorData)}</div> */}
            {!!props?.errorData?.length && (
              <fieldset className={styles.errorTable}>
                <legend>Errors:</legend>
                {props?.errorData?.map((item, idx) => (
                  <p key={idx}>
                    <label><b>FileName:</b>&nbsp; {item.fileName}</label> &nbsp;&nbsp;
                    <span><b>Error:</b>&nbsp; {item.responseMessage}</span>
                  </p>
                ))}
              </fieldset>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
ProgressCircular.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default ProgressCircular;
