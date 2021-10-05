/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  resetDuplicateError,
} from "../../actions/MasterModuleActions";
import {
  COMMON_ERROR_MESSAGE,
  DOMAIN_NAME,
  DOMAIN_NAME_MANDATORY,
  CAMPARISON_DATA_NOT_AVAILABLE,
  PLEASE_ACKN
} from "../../utils/Messages";
import { SHOW_SNACKBAR_ACTION } from "../../utils/AppConstants";
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import EnvironmentStatusPopup from './EnvironmentStatusPopup';
import { PairedBitAction } from "../../actions/PairedBitAction";
import { fetchEnvironmentStatus } from "../../actions/EnvironmentStatusActions";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  nowrap: {
    whiteSpace: "nowrap"
  },
  label: {
    margin: "0px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    //marginBottom: '14px'
  },
  padding0: {
    padding: "0px",
  },
  paddingtop10: {
    padding: "0px",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  checkedClass: {
    paddingLeft: "10px"
  }
}));

const SetDomain = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const { register, handleSubmit, watch, clearError, errors } = useForm({
    mode: "onBlur",
  });
  let environmentData = useSelector(
    (state) => state?.EnvironmentStatusState?.list?.filter(a => a?.environmentId === props?.id) || []
  );
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  //const [isSelectionChanged, setSelectionChanged] = useState(false);
  //const isModuleAdded = useSelector(state => state.MasterModule.isModuleAdded);
  //const [apiError, setApiError] = useState(null);
  //const addApiError = useSelector(state => state.MasterModule.addError);
  //const categoryOptions = useSelector(state => state.ModuleConfig.configModuleList);
  const [domainName, setDomainName] = useState(props.name);
  // const [inputs, setInputs] = useState({
  //     moduleName: "",
  //     isGlobal: false,
  //     category: "",
  //     description: "",
  // });

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  let handleChange = (e) => {
    setDomainName(e.target.value)
    dispatch(resetDuplicateError());
    //setApiError(false);
    const { name, value } = e.target;
    if (value === "") setIsEmpty(true);
    else setIsEmpty(false);
    setIsSubmited(true);
    // if (name === "category") {
    //     setInputs((inputs) => ({ ...inputs, [name]: value }));
    // } else {
    //     setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    // }
    //setSelectionChanged(true);
  };
  useEffect(() => {
    dispatch(fetchEnvironmentStatus(clientId))
  },
    []
  );
  // useEffect(() => {
  //     if (!!addApiError) {
  //         setIsSubmited(false);
  //     }

  //     if (addApiError && !(addApiError.responseCode === "201" || addApiError.responseCode === 201)) {
  //         setApiError(true);
  //     }
  //     if (addApiError.responseMessage && addApiError.responseMessage.includes("Module name") && addApiError.responseMessage.includes("exist")) {
  //         setIsSubmited(false);
  //         setApiError(false);
  //         setError("moduleName", "notMatch", "Module name already exists");
  //     }

  //     if (isModuleAdded) {
  //         handleCloseForm();
  //         dispatch(resetDuplicateError());
  //     }

  // },
  //     [dispatch, addApiError, setError, isModuleAdded, handleCloseForm]
  // );

  const handleSetEnvironment = () => {
    // let envdata = environmentData?.length === 0 || !environmentData[0]?.connectionStatus ||  environmentData[0]?.comparison?.totalItems === 0;
    let envdata = environmentData?.length === 0;
    // if(props.pairedProp !== checked) {
    //   handleTabChange(this,'2')
    // }
    if (checked && envdata) {
      let messageObj = {
        primaryButtonLabel: "Yes",
        primaryButtonAction: () => {
          setIsSubmited(true);
          props.onSubmit(domainName, checked);
        },
        secondaryButtonLabel: "Cancel",
        secondaryButtonAction: () => { },
        title: PLEASE_ACKN,
        message: CAMPARISON_DATA_NOT_AVAILABLE,
      };
      dispatch(showMessageDialog(messageObj));
    }
    else if (!checked) {
      setIsSubmited(true);
      props.onSubmit(domainName, checked);
    }
    else {
      handleTabChange(this, '2')
    }
  };
  const overwriteEnvironment = () => {
    setIsSubmited(true);
    props.onSubmit(domainName, checked);
  };

  const cancelParing = () => {
    setChecked(false);
    handleTabChange(this, '1')
  };

  const [checked, setChecked] = React.useState(props.pairedProp);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  let [value, setValue] = React.useState('1');

  let handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const [openEnvironmentPopupStatus, setOpenEnvironmentPopup] = useState(false);
  const closeEnvironmentPopup = () => {
    setOpenEnvironmentPopup(false);
  };
  const openEnvironmentPopup = () => {
    setOpenEnvironmentPopup(true);
  };
  const PairedBit = useSelector((state) => state.PairedBit.checked);
  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className={styles.dialogTitle}>Set Environment</DialogTitle>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleSetEnvironment)}
        >
          <TabContext value={value}>
            <TabList aria-label="simple tabs example">
              <Tab label="Environment" value="1" disabled={value === 2} />
              <Tab label="Paired Environment" value="2" disabled={value === 1} />
            </TabList>
            <TabPanel value="1" className={styles.padding0}>


              <DialogContent dividers="true">
                {/* {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
              </Card>
            </Grid>
          ) : null} */}
                <Grid container className={styles.row}>
                  <Grid item xs={12} className={styles.col}>
                    <MaterialTextField
                      inputRef={register({
                        required: {
                          value: true,
                          message: DOMAIN_NAME_MANDATORY,
                        },
                        // pattern: {
                        //   value: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9.:]+\.?:[a-z0-9.:]+(\/[a-zA-Z0-9#.?/&]+\/?)*$/,
                        //   message: "Enter valid Domain name",
                        // },
                        // maxLength: {
                        //   value: 250,
                        //   message: "Maximum 250 characters allowed",
                        // },
                      })}
                      error={errors.domainName ? true : false}
                      helperText={errors.domainName?.message}
                      onChange={handleChange}
                      required
                      type="url"
                      name="domainName"
                      value={domainName}
                      label={"Endpoint"}
                    />
                    <Grid item xs={12}>
                      (For example: https://cpcmtdev.medhokapps.com/medhokws/rest/configservices)
                    </Grid>
                  </Grid>
                  <Grid item>
                    <FormGroup className={styles.checkedClass}>
                      <FormControlLabel
                        control={<Checkbox checked={checked} onChange={handleCheckboxChange} inputProps={{ 'aria-label': 'primary checkbox' }} />}
                        label=" Set as Paired Environment"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <MatButton color="primary" onClick={handleCloseForm}>
                  Cancel
                </MatButton>
                <MatButton type="submit" disabled={!(props.pairedProp !== checked) && (!isSubmited || isEmpty)}>
                  Save
                </MatButton>
              </DialogActions>
            </TabPanel>
            <TabPanel value="2" className={styles.paddingtop10}>
              <DialogActions dividers="true">
                <MatButton color="primary" onClick={overwriteEnvironment}>
                  Overwrite
                </MatButton>
                <MatButton type="primary" onClick={openEnvironmentPopup}>
                  Review Config Comparison
                </MatButton>
                <MatButton type="primary" onClick={cancelParing}>
                  Cancel Pairing
                </MatButton>
              </DialogActions>
            </TabPanel>
          </TabContext>
        </form>
      </Dialog>
      {openEnvironmentPopupStatus && <EnvironmentStatusPopup id={props.id} handleClose={closeEnvironmentPopup} open={openEnvironmentPopupStatus} />}
    </>
  );
};

export default SetDomain;
