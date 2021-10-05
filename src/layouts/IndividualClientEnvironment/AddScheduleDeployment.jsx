import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import {
    fetchClientById,
  } from "../../actions/ClientActions";
import MatButton from "../../components/MaterialUi/MatButton";
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import MatFormControl from "../../components/MaterialUi/MatFormControl";
import database from "../../assets/images/database.svg";
import arrows from "../../assets/images/crossed-arrows.svg";
import {addSchedule, deleteSchedule, updateSchedule} from "../../actions/ScheduleDeploymentActions";
import { formatTimelineTime } from "../../utils/helpers";


const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        fontWeight: 300,
    },
    col: {
        padding: "10px",
    },
    iconSize: {
        height: "26px"
    },
    switchList: {
        padding: "0px",
    },
    cmtList: {
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
            opacity: "0.5",
        },
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
    }
}));

const AddScheduleDeployment = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const {
        handleSubmit,
        errors,
    } = useForm({ mode: "onBlur" });
    const { clientId, environment } = useParams();
    const [isSubmited, setIsSubmited] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isEditable, setEditable] = useState(false);
    const scheduleById = useSelector(
        (state) => state?.Scheduled?.scheduleById
    );
    let currentDateTime = new Date();
    const defaultFormObj = {
        deleteid: scheduleById.id,
        scheduleDate: (scheduleById?.copyDate ? scheduleById.copyDate : currentDateTime),
        updateDate: scheduleById?.copyDate,
        // fieldName: "",
        time: formatTimelineTime(scheduleById?.copyDate ? scheduleById.copyDate : ""),
        // time: scheduleById?.time ? scheduleById.time : "",
        frequency: scheduleById?.frequency ? scheduleById.frequency : "OneTime",
        jiraTicketNumber: scheduleById?.jiraTicketNumber ? scheduleById.jiraTicketNumber : "",
        environments: scheduleById?.destinationEnvironment?.id ? scheduleById?.destinationEnvironment?.id : environment,
    };
    const [inputs, setInputs] = useState(defaultFormObj);
    const { deleteid, scheduleDate, updateDate, time, frequency, jiraTicketNumber, environments } = inputs;
    const handleDateChange = (dateVal) => {
        console.log("dateVal",dateVal, dateVal.toISOString());
        setInputs((inputs) => ({ ...inputs, scheduleDate: moment(dateVal).toISOString(), updateDate:moment(dateVal).toISOString()  }));
    };

    // const handleTimeChange = (dateVal) => {
    //     console.log(dateVal);
    //     setInputs((inputs) => ({ ...inputs, time: moment(dateVal).format("MM/DD/yyyy HH:mm") }));
    // };



    const handleCloseForm = useCallback(() => {
        props.handleClose();
    }, [props,]);

    let handleChange = (e) => {
        const { name, value } = e.target;
        // dispatch({ type: RESET_DUPLICATE_ERROR });
        // setApiError(null);
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    };

    let DeleteSchedule = (id) => {
        dispatch(deleteSchedule(id,clientId));
        handleCloseForm();        
    };
   
    let EditSchedule = () => {
        setEditable(true); 
    };
    let updateScheduledeployment = (Scheduledeploymentid) => {
        let payload = {
            "clientId": parseInt(clientId),
            "destinationEnvironemtId": inputs.environments,
            "frequency": inputs.frequency,
            "jiraTicketNumber": inputs.jiraTicketNumber,
            "id": Scheduledeploymentid,
            "scheduleDate": inputs.updateDate,
            "type": "SCHEDULED"
          }
          console.log("ghj",payload)
        dispatch(updateSchedule(payload,clientId));
        handleCloseForm();  
        setEditable(false);      
    };
    useEffect(() => {
        dispatch(fetchClientById(clientId));
      }, [dispatch, clientId]);

      const frequencyItems = [
          {
              value: "OneTime",
              keyvalue: "ONETIME"
          },
          {
            value: "Daily",
            keyvalue: "DAILY"
        },
          {
            value: "Weekly",
            keyvalue: "WEEKLY"
        },
          {
            value: "Monthly",
            keyvalue: "MONTHLY"
        }
      ]
    const handleCreateDeployment = () => {
        // setIsSubmited(true);
        //const watchAllFields = watch();
        console.log("props",props.openFrom);
        console.log("watchallfield",inputs);
        if(props.openFrom === "Add")
        {
            let payload = {
                "clientId": clientId,
                "destinationEnvironemtId": inputs.environments,
                "frequency": inputs.frequency,
                "jiraTicketNumber": inputs.jiraTicketNumber,
                "scheduleDate": inputs.scheduleDate,
                "environments": environmentInfo?.environments?.filter(list => list.environmentId === inputs.environments).map(filteredName => (filteredName.environmentName)),
                "type": "SCHEDULED"
              }
              console.log(payload)
            dispatch(addSchedule(payload,clientId));
            handleCloseForm();
        }
    };

    let environmentInfo = useSelector(
        (state) => state?.Client?.clientByIdDetails?.details?.environments
    );
   environmentInfo = environmentInfo?.filter( a => !a.paired && a.enable)
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className={styles.dialogTitle}>
                Schedule Deployment
      </DialogTitle>
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(handleCreateDeployment)}
            >
                <DialogContent dividers="true">
                    <Grid container className={styles.row}>
                        {apiError ? (
                            <Grid item xs={12} className={styles.col}>
                                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                                    <Typography variant="body2">
                                        {apiError.message}
                                    </Typography>
                                </Card>
                            </Grid>
                        ) : null}
                        <Typography variant="subtitle2">
                            Date/Time
                        </Typography>
                        <Grid container className={styles.row}>
                            <Grid item xs={4} className={styles.col}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDateTimePicker
                                        autoOk
                                        variant="filled"
                                        disabled={Object.keys(scheduleById).length > 0 && !isEditable}
                                        inputVariant="outlined"
                                        format="MM/DD/yyyy hh:mm A"
                                        disablePast="true"
                                        value={scheduleDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={scheduleDate => handleDateChange(scheduleDate)}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            {/* <Typography variant="subtitle2" style={{ paddingTop: '3%', marginLeft: '-16px', marginRight: "20px" }}>
                                EST
                                </Typography> */}
                            <Grid item xs={4} className={styles.col}>
                                <MatFormControl
                                    required
                                    error={errors.frequency ? true : false}
                                    variant="filled"
                                    size="small"
                                >
                                    <MaterialTextField
                                        required
                                        label="Frequency"
                                        disabled={Object.keys(scheduleById).length > 0 && !isEditable}
                                        select
                                        value={frequency}
                                        name="frequency"
                                        onChange={handleChange}
                                    >
                                        {frequencyItems.map((item, index) => 
                                        <MenuItem value={item.keyvalue} key={index}>{item.value}</MenuItem>
                                        )}
                                    </MaterialTextField>
                                    <FormHelperText>
                                        {errors.frequency ? errors.frequency.message : " "}
                                    </FormHelperText>
                                </MatFormControl>
                            </Grid>
                            <Grid item xs={3} className={styles.col}>
                                <MaterialTextField
                                    defaultValue={jiraTicketNumber}
                                    //value={clientName}
                                    // error={errors.ticket ? true : false}
                                    // helperText={errors.ticket ? errors.clientName.message : " "}
                                    // required
                                    label="Ticket #"
                                    disabled={Object.keys(scheduleById).length > 0 && !isEditable}
                                    name="jiraTicketNumber"
                                    onChange={handleChange}
                                    //disabled={!isEditable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle2">
                            Environment
                        </Typography>
                        <Grid container className={styles.row}>
                            <Grid item xs={4} className={styles.col} style={{display:'grid'}}>
                                <Paper variant="outlined">
                                    <List>
                                        <ListItem className={styles.listGutter}
                                            disabled
                                            button
                                        >
                                            <ListItemIcon className={styles.switchItem}>
                                                <img
                                                    src={database}
                                                    alt={"icon"}
                                                    className={styles.iconSize}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="subtitle2"
                                                        style={{ wordBreak: "break-word" }}
                                                    >
                                                        CMT
                                                    </Typography>
                                                }
                                            // secondary={handleSecondaryText(env.id)}
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={1} className={styles.col}>
                                <img
                                    src={arrows}
                                    alt={"arrows"}
                                />
                            </Grid>
                            <Grid item xs={4} className={styles.col}>
                                <Paper variant="outlined">
                                    <List className={styles.switchList}>
                                        <ListItem
                                            disabled={Object.keys(scheduleById).length > 0 && !isEditable}
                                            className={styles.listGutter}
                                            button
                                        >
                                            <ListItemIcon className={styles.switchItem}>
                                                <img
                                                    src={database}
                                                    alt={"icon"}
                                                    className={styles.iconSize}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <MaterialTextField
                                                        required
                                                        disabled={Object.keys(scheduleById).length > 0 && !isEditable}
                                                        select
                                                        value={environments}
                                                       // className={!isEditable && "removeStyle"}
                                                        name="environments"
                                                        onChange={handleChange}
                                                    >
                                                        
                                                        {environmentInfo?.map(list => (
                                                        <MenuItem value={list?.environmentId}>{list?.environmentName} <br /> {list?.domainUrl}</MenuItem>
                                                        ))}
                                                    </MaterialTextField>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>
                                
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MatButton color="primary" onClick={handleCloseForm}>
                        Cancel
                    </MatButton>
                    {props.openFrom === "Add" &&
                        <MatButton type="submit" disabled={isSubmited} onClick={addSchedule}>
                            Schedule Deployment
                    </MatButton>
                    }
                    {props.openFrom === "Cancel" && 
                    <>
                    <MatButton type="submit" disabled={isSubmited} onClick={() => DeleteSchedule(deleteid)}>
                    Cancel Deployment
                    </MatButton>
                    {!isEditable ?
                    <MatButton type="submit" disabled={isSubmited} onClick={() => EditSchedule()}>
                    Edit Deployment
                    </MatButton>
                    :
                    <MatButton type="submit" disabled={isSubmited} onClick={() => updateScheduledeployment(deleteid)}>
                    Save Deployment
                    </MatButton>
}
                    </>
                    }
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddScheduleDeployment;
