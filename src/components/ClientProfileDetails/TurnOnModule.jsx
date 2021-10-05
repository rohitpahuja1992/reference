import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import { useSelector, useDispatch } from "react-redux";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MatButton from "../../components/MaterialUi/MatButton";
import MatFormControl from "../MaterialUi/MatFormControl";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider, DatePicker  } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Typography from "@material-ui/core/Typography";
import { fetchCorrespondenceDefinitionId, fetchDefaultCorrespondencePackage, fetchDefaultDeliveryTag } from "../../actions/TurnOnModuleAction";
import moment from "moment";
import {
  SHOW_SNACKBAR_ACTION,
  CLEAR_TURN_ON_POPUP_DATA
} from "../../utils/AppConstants";
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 10px",
  },
  row: {
    padding: "10px 0 0",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "5px 16px",
    marginBottom: "5px",
  },
}));

const TurnOnModule = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const correspondenceDefinitionIdListState = useSelector((state) => state.TurnOnModule.correspondenceDefinitionIdList || {});
  const defaultCorrespondencePackageListState = useSelector((state) => state.TurnOnModule.defaultCorrespondencePackageList || {});
  const defaultDeliveryTagListState = useSelector((state) => state.TurnOnModule.defaultDeliveryTagList || {});
  const [popupError, setPopupError] = useState([]);
  const defaultInputs = {
    selectedDate : props?.details?.modules?.filter(a => a?.module?.id === props?.moduleId)[0]?.goLiveDate ? moment(props?.details?.modules?.filter(a => a?.module?.id === props?.moduleId)[0]?.goLiveDate) : null,
    defID : props?.details?.modules?.filter(a => a?.module?.id === props?.moduleId)[0]?.correspondenceDefinitionId,
    defPackage : props?.details?.modules?.filter(a => a?.module?.id === props?.moduleId)[0]?.defaultCorrespondencePackageId,
    defDeliveryTag : props?.details?.modules?.filter(a => a?.module?.id === props?.moduleId)[0]?.defaultDeliveryTagId

  }
  const [inputs, setInputs] = useState(defaultInputs);
  const { selectedDate, defID, defPackage, defDeliveryTag } = inputs;
  let handleChange = (e) => {
    const { name, value } = e.target
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const handleDateChange = (dateVal) => {
    console.log(dateVal);
    //console.log(dateVal.toISOString());
    setInputs((inputs) => ({ ...inputs, selectedDate: moment(dateVal).toISOString() }));
  };
  let validationText = [];
  let index;
  useEffect(() => {
    dispatch(fetchCorrespondenceDefinitionId(props.clientId));
    dispatch(fetchDefaultCorrespondencePackage(props.clientId));
    dispatch(fetchDefaultDeliveryTag(props.clientId));
    if(props?.details?.environments.filter(a => a.paired).length === 0) {
      dispatch({ type: CLEAR_TURN_ON_POPUP_DATA });
      validationText.push("Paired environments doesn't exist")
      setPopupError(validationText)
    }
    else {
      index = validationText.indexOf("Paired environments doesn't exist");
      index > -1 && validationText.splice(index, 1);
      setPopupError(validationText);
    }
  }, [dispatch]);
  const handleTurnOnModuleSave = (e) => {
    e.preventDefault();
    

    validationText = [...popupError]
    if(!parseInt(defID)) {
      if(!validationText.includes("Correspondence definition id is required")) {
      validationText.push("Correspondence definition id is required")
      }
      setPopupError(validationText)
    }
    else {
      index = validationText.indexOf("Correspondence definition id is required");
      index > -1 && validationText.splice(index, 1);
      setPopupError(validationText)
    }
    if(!parseInt(defPackage)) {
      if(!validationText.includes("Default Correspondence Package")) {
      validationText.push("Default Correspondence Package")
      }
      setPopupError(validationText)
    }
    else {
      index = validationText.indexOf("Default Correspondence Package");
      index > -1 && validationText.splice(index, 1);
      setPopupError(validationText);
    }
    if(parseInt(defID) && parseInt(defPackage)) {
      setPopupError([])
      const payloadval = {
        clientId: props.clientId,
        moduleVersion: props.moduleVersion,
        moduleId: props.moduleId,
        goLiveDate: selectedDate ? selectedDate : (moment().toISOString()),
        correspondenceDefinitionId: parseInt(defID),
        defaultCorrespondencePackageId: parseInt(defPackage),
        defaultDeliveryTagId: parseInt(defDeliveryTag),
        correspondenceDefinitionName: defID ? Object?.entries(correspondenceDefinitionIdListState)?.filter(a => a[0] == defID)[0][1] : "",
        defaultCorrespondencePackageName: defPackage ? Object?.entries(defaultCorrespondencePackageListState)?.filter(a => a[0] == defPackage)[0][1] : "",
        defaultDeliveryTagName: defDeliveryTag ? Object?.entries(defaultDeliveryTagListState)?.filter(a => a[0] == defDeliveryTag)[0][1] : ""
      }
      const isGlobal = props.details.modules.filter(a => a.module.id === props.moduleId)[0].module.global;
      props.handleSave(payloadval,isGlobal)
    }
  }
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>
        Turn on Module: {props.selectedClientName}
      </DialogTitle>

      <DialogContent dividers="true">

        <Grid container className={styles.row}>
          {popupError.length > 0 &&
            <Grid item xs={12} className={styles.col}>
              {popupError.map((item) => (
                <Card className={styles.errorCard}>
                  <Typography key={item} variant="body2">{item}</Typography>
                </Card>
              ))}
            </Grid>
          }
          <Grid item xs={12} className={styles.col}>
            <Typography variant="subtitle2">
              Set Go Live Date
            </Typography>
          </Grid>
          <Grid item xs={6} className={styles.col}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker 
                autoOk
                variant="filled"
                inputVariant="outlined"
                format="MM/DD/yyyy"
                value={selectedDate}
                name="selectedDate"
                InputAdornmentProps={{ position: "start" }}
                onChange={selectedDate => handleDateChange(selectedDate)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} className={styles.col}>
            <MatFormControl
              variant="filled"
              size="small"
            >
              <InputLabel>Correspondence Definition ID *</InputLabel>
              <MatSelect
                value={defID}
                name="defID"
                onChange={handleChange}
              >
                {Object.entries(correspondenceDefinitionIdListState).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </MatSelect>
            </MatFormControl>
          </Grid>
          <Grid item xs={12} className={styles.col}>
            <MatFormControl
              variant="filled"
              size="small"
            >
              <InputLabel>Default Correspondence Package *</InputLabel>
              <MatSelect
                value={defPackage}
                name="defPackage"
                onChange={handleChange}
              >
                {Object.entries(defaultCorrespondencePackageListState).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </MatSelect>
            </MatFormControl>
          </Grid>
          <Grid item xs={12} className={styles.col}>
            <MatFormControl
              variant="filled"
              size="small"
            >
              <InputLabel>Default Delivery Tag</InputLabel>
              <MatSelect
                value={defDeliveryTag}
                name="defDeliveryTag"
                onChange={handleChange}
              >
                {Object.entries(defaultDeliveryTagListState).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </MatSelect>
            </MatFormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={props.handleClose}>
          Cancel
        </MatButton>
        <MatButton color="primary" onClick={handleTurnOnModuleSave}>
          Save
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default TurnOnModule;
