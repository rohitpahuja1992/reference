import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import MatFormControl from '../MaterialUi/MatFormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MatSelect from '../MaterialUi/MatSelect';
import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import MatButton from "../MaterialUi/MatButton";
import { addOobSubmodule, resetError } from "../../actions/OOBSubmoduleActions";
import { handleManageSubmoduleError, CONTROL_ASSIGNMENT_MANDATORY, SUB_ASSIGNMENT_MANDATORY } from "../../utils/Messages";
//import MaterialTextField from "../MaterialUi/MatTextField";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
    marginTop: "-3%",
    marginLeft: "45%",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));


const ManageSubmodule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, clearError, errors, reset, unregister } = useForm({ mode: "onBlur" });
  const [isDisabled, setIsDisabled] = useState(true);

  const systemTableList = useSelector(
    (state) => state.MasterTable.tableByModule
  );
  const systemTables = systemTableList.length > 0 ? systemTableList.sort((a, b) => (a.tableName > b.tableName ? 1 : -1)) : [];
  const componentList = useSelector(
    (state) => state.MasterSubmodule.componentByModule
  );
  const components = componentList.length > 0 ? componentList.sort((a, b) => (a.componentName > b.componentName ? 1 : -1)) : [];
  const isSubmoduleAdded = useSelector((state) => state.OOBSubmodule.isSubmoduleAdded);
  const addApiError = useSelector(state => state.OOBSubmodule.addError);
  const [apiError, setApiError] = useState(null);
  //const [errorMsg,setErrorMsg] = useState("");

  //const controlList = useSelector((state) => state.Control.data.list && state.Control.data.list.filter(obj => obj.type === 'otherContent'));
  //const [isOtherContent, setIsOtherContent] = useState(false);
  const [inputs, setInputs] = useState({
    systemTable: "",
    component: "",
  });
  const { systemTable, component, controlId } = inputs;

  const handleCloseForm = useCallback(() => {
    dispatch(resetError());
    setApiError(false);
    clearError();
    props.handleClose();
  }, [props, dispatch, clearError]);



  let handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(resetError());
    setApiError(false);
    if (name === 'component') {
      unregister('systemTable');
      if (value !== "") {
        unregister('component');
        setValue("component", component);
        clearError("component");
      } else {
        register({ name: 'component' }, { required: { value: true, message: CONTROL_ASSIGNMENT_MANDATORY } });
      }

    }
    else {
      unregister('component');
      if (value !== "") {
        unregister('systemTable');
        setValue("systemTable", systemTable);
        clearError("systemTable");
      } else {
        register({ name: 'systemTable' }, { required: { value: true, message: SUB_ASSIGNMENT_MANDATORY } });
      }

    }

    // if (name === 'component' && value === 'otherContent')
    //   setIsOtherContent(true);
    // if (name === 'component' && value !== 'otherContent') {
    //   reset();
    //   clearError("controlId");
    //   //setIsOtherContent(false);

    // }

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleAddOOBSubmodule = () => {
    let formData = {};
    if (systemTable)
      formData = {
        "componentType": 'SYSTEM_TABLE',
        "oobModuleVersionId": Number(props.oobModuleId),
        "systemTableId": systemTable,
        "componentId":0
      }
    else
      formData = {
        "componentType": 'CMT_COMPONENT',
        "oobModuleVersionId": Number(props.oobModuleId),
        "componentId": component,
        "systemTableId": 0,
      }

    // const submoduleName = submodulesList.filter(obj => obj.id === inputs.systemTable);
    // let formData = {
    //   "subModuleId": inputs.systemTable,
    //   "oobModuleId": props.oobModuleId,
    //   "metaTag": { "component": inputs.component }
    // }
    // if (inputs.component === 'otherContent')
    //   formData.metaTag.controlId = inputs.controlId;

    dispatch(addOobSubmodule(formData));
  };

  useEffect(() => {
    // if (systemTable !== "") {
    //   setValue("systemTable", systemTable);
    //   clearError("systemTable");
    // } else {
    //   register({ name: 'systemTable' }, { required: { value: true, message: SUB_ASSIGNMENT_MANDATORY } });
    // }

    // if (component !== "") {
    //   setValue("component", component);
    //   clearError("component");
    // } else {
    //   register({ name: 'component' }, { required: { value: true, message: CONTROL_ASSIGNMENT_MANDATORY } });
    // }

    if (addApiError) {
      setApiError(handleManageSubmoduleError(addApiError));
    }
    else {
      setApiError(false);
    }

    if (isSubmoduleAdded) {
      handleCloseForm();
    }

  }, [register, clearError, setValue, addApiError, systemTable, component, controlId, isSubmoduleAdded, handleCloseForm])

  useEffect(() => {
    if (systemTable || component)
      setIsDisabled(false);
    else
      setIsDisabled(true);
  }, [component, systemTable])


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
        {props.heading}
      </DialogTitle>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(handleAddOOBSubmodule)} id="addOOBSubmodule">
        <DialogContent dividers="true">
          {apiError ?
            <Grid item xs={12} className={styles.col}>
              <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                <Typography variant="body2">{apiError.message}</Typography>
              </Card>
            </Grid>
            : null}
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MatFormControl required error={errors.systemTable ? true : false}
                variant="filled" size="small">
                <InputLabel>System Table</InputLabel>
                <MatSelect
                  value={systemTable}
                  name="systemTable"
                  disabled={component}
                  onChange={handleChange}>
                  <MenuItem value="">
                    None
                  </MenuItem>
                  {systemTables.map((option, key) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.tableLabel}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>{errors.systemTable ? errors.systemTable.message : " "}</FormHelperText>
              </MatFormControl>
            </Grid>
            <Typography variant="subtitle2" className={styles.cardHeadingSize}>
              OR
                </Typography>
            <Grid item xs={12} className={styles.col}>
              <MatFormControl required error={errors.component ? true : false}
                variant="filled" size="small">
                <InputLabel>CMT Component</InputLabel>
                <MatSelect
                  value={component}
                  name="component"
                  disabled={systemTable}
                  onChange={handleChange}>
                  <MenuItem value="">
                    None
                  </MenuItem>
                  {components.map((option, key) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.componentName}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>{errors.component ? errors.component.message : " "}</FormHelperText>
              </MatFormControl>
            </Grid>
            {/* {isOtherContent &&
              <Grid item xs={12} className={styles.col}>
                <MatFormControl required error={errors.controlId ? true : false}
                  variant="filled" size="small">
                  <InputLabel>Control</InputLabel>
                  <MatSelect
                    value={controlId}
                    name="controlId"
                    onChange={handleChange}>
                    {controlList.map((option, key) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </MatSelect>
                  <FormHelperText>{errors.controlId ? errors.controlId.message : " "}</FormHelperText>
                </MatFormControl>
              </Grid>
            } */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
        </MatButton>
          <MatButton type="submit" disabled={isDisabled}>Add Component</MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ManageSubmodule;
