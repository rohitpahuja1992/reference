import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import MatButton from "../MaterialUi/MatButton";
import MatCard from "../MaterialUi/MatCard";
import MatFormControl from "../MaterialUi/MatFormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MaterialTextField from "../MaterialUi/MatTextField";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { updateFieldProperty } from "../../actions/MasterComponentActions";
// import ClientAddConfigDetails from "./ClientAddConfigDetails";
import ClientTabAddMapping from "./ClientTabAddMapping";
import { makeStyles } from "@material-ui/core";
import {

  fetchClientConfigControlById
} from "../../actions/ClientModuleActions";
import {
  RESET_UPDATE_CLIENT_CONTROL_IS_DONE,
  RESET_CLIENT_CONTROL_RESTORED_IS_DONE,
} from "../../utils/AppConstants";

import {
  FIELD_RESTORE_OOB_ACTION,
  UPDATE_CLIENT_FIELD_ACTION,
} from "../../utils/FeatureConstants";

import { showMessageDialog } from "../../actions/MessageDialogActions";

import {
  updateClientControl,
  restoreOobSingleField,
  resetClientError,
  fetchClientControlAudit,

} from "../../actions/ClientModuleActions";
import {
  handleClientFieldDetails,
  // NO_OPT_AVAILABLE,
  PLEASE_ACKN,
  RESTORE_OUT_OF_BOX_CONF,
  ENTER_VALID_TEXT,
  // VALUE_ALREADY_EXIST,
} from "../../utils/Messages";


const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 8px",
  },
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
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "5px 10px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
  optionBox: {
    padding: "10px 12px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  addOption: {
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
  },
  optionButton: {
    paddingBottom: "15px",
    marginLeft: "10px",
  },
  optionField: {
    width: "300px",
  },
}));

const ClientFieldConfigDetails = (props) => {
  const { clientControlData, columnData, isUpdated, fireOnUpdate, handlePrimary, clientInfo } = props;
  const { controlId } = useParams(); //submoduleVersionId,
  const dispatch = useDispatch();
  const styles = useStyles();
  const clientControlUpdateError = useSelector(
    (state) => state.ClientModule.clientControlById.updateError
  );
  const {
    register,
    handleSubmit,
    setError,
    clearError,
    errors,
    formState,
    // reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const staticFields = [
    "View Order",
    "Section",
    "Type of Field",
    "Hidden",
    "Mandatory",
    "Disabled",
    "Field Name",
  ];
  const fieldList = columnData?.filter(
    (item) => !staticFields.includes(item?.label)
  );
  console.log("fieldList", fieldList)
  //const details = JSON.parse(clientControlData?.mapField);
  const mapConfig = JSON.parse(clientControlData?.mapConfig);
  const [openDialog, setOpenDialog] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [fieldMapping, setFieldMapping] = useState("");
  const featuresAssigned = useSelector((state) => state.User.features);
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);
  // const clientSubmoduleData = useSelector(
  //   (state) => state.ClientModule.clientsSubmoduleById.data
  // );
  const isControlUpdated = useSelector(
    (state) => state.ClientModule.clientControlById.isControlUpdated
  );
  const isControlRestored = useSelector(
    (state) => state.ClientModule.clientControlById.isControlRestored
  );
  const roles = loggedInInfo && loggedInInfo.roles.map((item) => item.roleName);
  // console.log('roles', roles)
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const [isEditable, setEditable] = useState(false);

  const [inputs, setInputs] = useState(JSON.parse(clientControlData?.mapField));
  const [isValid, setIsValid] = useState(false);
  const {
    Section,
    "Field Name": Label,
    "View Order": ViewOrder,
    Hidden,
    Mandatory,
    Disabled,
  } = inputs;
  const ddList = ["Yes", "No"];
  // const compData = useSelector((state) =>
  //   clientSubmoduleData?.ClientComponent?.clientOobComponentData?.map(
  //     (data, index) => {
  //       let componentData = JSON.parse(data.mapField);
  //       return { ...componentData };
  //     }
  //   )
  // );
  // let primary = columnData?.find((item) => item.primary);
  // const primaryCol = primary?.label || primary?.mapObject?.columnName;
  const primaryCol = "Field Name";
  const defaultPrimary = JSON.parse(clientControlData?.mapField)[primaryCol];
  handlePrimary(defaultPrimary ? defaultPrimary : "");

  // const primData = compData?.map(
  //   (item) => item[primaryCol]
  // );
  // const primaryData = primData?.filter(
  //   (item) => !item?.includes(defaultPrimary)
  // );

  // const dupValid = (name, value) => {
  //   if (name === primaryCol && primaryData.indexOf(value) !== -1) {
  //     setError(name, "notMatch", "This field name is already exist.");
  //     setIsValid(false);
  //   } else {
  //     clearError(name);
  //     setIsValid(true);
  //   }
  // };
  const [selectedConfig, setSelectedConfig] = useState(
    mapConfig
      ? mapConfig
      : {
        Section: { value: "" },
        Label: {
          value: "",
          mapping: {
            method: "Message Constant",
            description: {},
            oob: false,
            property: [],
            functionLabel: false,
          },
        },
        Hidden: {
          value: "",
          mapping: {
            method: "System Variable",
            description: {},
            oob: false,
            property: [],
            functionLabel: false,
          },
        },
        Mandatory: {
          value: "",
          mapping: {
            method: "System Variable",
            description: {},
            oob: false,
            property: [],
            functionLabel: false,
          },
        },
        Disabled: {
          value: "",
          mapping: {
            method: "System Variable",
            description: {},
            oob: false,
            property: [],
            functionLabel: false,
          },
        },
        Other: [
          {
            id: 1,
            value: "",
            mapping: {
              method: "System Variable",
              description: {},
              property: [],
              functionLabel: false,
            },
          },
        ],
      }
  );

  let handleChange = (e) => {
    setApiError(null);
    setSelectionChanged(true);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    //dupValid(name, value);
  };

  let handleCloseDialog = (e) => {
    setOpenDialog(false);
  };

  // const handleSelectChange = (e) => {
  //   setSelectionChanged(true);
  //   const { name, value } = e.target;
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // };
  let handleCheckChange = (e) => {
    setSelectionChanged(true);
    let { name, checked } = e.target;
    checked = checked ? 1 : 0;
    // console.log("name,value", name, checked);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };
  const handleUpdateControl = (e) => {
    //dupValid("Field Name", Label);
    let formData = {
      id: clientControlData.id,
      mapConfig: JSON.stringify(selectedConfig),
      mapField: JSON.stringify({ ...inputs }),
      primaryField: primaryCol,
    };

    if (isValid) {
      fireOnUpdate(true);
      setEditable(false);
      setSelectionChanged(false);
      dispatch(updateClientControl(formData));
    }
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    //reset(details);
    setEditable(false);
    setSelectedConfig(mapConfig);
    setSelectionChanged(false);
  };

  const restoreOobControl = () => {
    fireOnUpdate(true);
    dispatch(restoreOobSingleField(clientControlData.id));
  };

  const handleNext = (fieldProperty, value) => {
    let FieldDetails;
    if (typeof value === "number")
      FieldDetails = selectedConfig[fieldProperty][value].mapping;
    else FieldDetails = selectedConfig[fieldProperty].mapping;
    dispatch(updateFieldProperty(fieldProperty, FieldDetails, value));
    setOpenDialog(true);
  };

  const updateConfig = (val) => {
    setSelectedConfig(val);
  };

  const confirmApproveControl = () => {
    let messageObj = {
      primaryButtonLabel: "Restore",
      primaryButtonAction: () => {
        restoreOobControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: PLEASE_ACKN,
      message: RESTORE_OUT_OF_BOX_CONF,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const handleRemoveOther = (index) => {
    setEditable(true);
    setSelectionChanged(true);
    const values = JSON.parse(JSON.stringify(selectedConfig));
    let pos = values.Other.findIndex((x) => x.id === index);
    values.Other.splice(pos, 1);
    setSelectedConfig(values);
    updateConfig(values);
  };

  const handleAddOther = () => {
    const values = JSON.parse(JSON.stringify(selectedConfig));
    values.Other.push({
      id:
        selectedConfig.Other.length > 0
          ? selectedConfig.Other[selectedConfig.Other.length - 1].id + 1
          : 1,
      value: "",
      mapping: {
        method: "System Variable",
        description: {},
        property: [],
        functionLabel: false,
      },
    });
    //setConfig(values);
    setSelectedConfig(values);
    updateConfig(values);
  };

  const handleRestoreDisabled = () => {
    let index = roles.indexOf("Product User Access");
    if (
      loggedInInfo.user_type !== "MHK" &&
      clientControlData.oobChangeStatus === "NO" &&
      featuresAssigned.indexOf(FIELD_RESTORE_OOB_ACTION) !== -1 &&
      (clientControlData.status === "AWAITING_SIGN_OFF" ||
        clientControlData.status === "CLIENT_REVIEW_NEEDED" ||
        clientControlData.status === "RETRACT")
    ) {
      return true;
    } else if (loggedInInfo.user_type !== "MHK") {
      return false;
    } else if (
      index !== -1 &&
      clientControlData.oobChangeStatus === "NO" &&
      loggedInInfo.roles[index].features.findIndex(
        (x) => x.featureInternalName === UPDATE_CLIENT_FIELD_ACTION
      ) !== -1 &&
      clientControlData.status === "PRODUCT_REVIEW_NEEDED"
    ) {
      return true;
    } else return false;
  };
  useEffect(() => {
    dispatch(resetClientError());
  }, [])

  useEffect(() => {
    if (isUpdated) {
      setIsSubmited(false);
      setApiError(handleClientFieldDetails(clientControlUpdateError));
      fireOnUpdate(false);
    } else {
      setIsSubmited(false);
      setApiError(null);
    }
  }, [isUpdated, fireOnUpdate, clientControlUpdateError]);

  useEffect(() => {
    if (!!clientControlUpdateError?.responseMessage) {
      setError(primaryCol, "notMatch", "This field name is already exist.");
      setIsValid(false);
    } else {
      setIsValid(true);
      clearError(primaryCol);
    }
  }, [clientControlUpdateError, setError, clearError]);

  useEffect(() => {
    if (isControlUpdated) {
      dispatch(fetchClientConfigControlById(controlId));
      dispatch(fetchClientControlAudit(controlId));
      dispatch({ type: RESET_UPDATE_CLIENT_CONTROL_IS_DONE });
      //fireOnUpdate(false);
    }
  }, [dispatch, isControlUpdated, controlId]);

  useEffect(() => {
    if (isControlRestored) {
      dispatch(fetchClientConfigControlById(controlId));
      dispatch(fetchClientControlAudit(controlId));
      dispatch({ type: RESET_CLIENT_CONTROL_RESTORED_IS_DONE });
      //fireOnUpdate(false);
    }
  }, [dispatch, controlId, isControlRestored]);


  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {"Details"}
          </Typography>
        }
      />
      <Divider />

      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateControl)}
          id="addConfigurationInfo"
        >
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Details
          </Typography>
          <Grid container className={styles.row}>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                defaultValue={inputs["Type of Field"]}
                disabled
                label="Field Type"
                name="fieldType"
              />
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                defaultValue={Section}
                disabled={!isEditable}
                onChange={handleChange}
                label="Section"
                name="Section"
              />
            </Grid>
            {fieldList &&
              fieldList.length > 0 &&
              fieldList.map((field, index) => (
                <React.Fragment
                  key={field.label ? field.label : field.mapLable}
                >
                  {field.fieldType === "Integer Field" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          inputRef={register({
                            required: {
                              value: !field.primary ? true : false,
                              message: `This field is required`,
                            },
                            min: {
                              value: Number(field.limit.min),
                              message: `The value must be at least ${field.limit.min}.`,
                            },
                            max: {
                              value: Number(field.limit?.max),
                              message: `The value can't be more than ${field.limit.max}.`,
                            },
                          })}
                          type="number"
                          //value={inputs[field.label]}
                          defaultValue={
                            inputs[field.label ? field.label : field.mapLable]
                          }
                          error={
                            errors[field.label ? field.label : field.mapLable]
                              ? true
                              : false
                          }
                          helperText={
                            errors[field.label ? field.label : field.mapLable]
                              ? errors[field.label].message
                              : " "
                          }
                          label={field?.mapLable ? field.mapLable : field.label}
                          name={field?.mapLable ? field.mapLable : field.label}
                          onChange={handleChange}
                          disabled={!isEditable}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {field.fieldType === "Text Field" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          inputRef={register({
                            required: {
                              value: !field.limit.min || !field.primary ? true : false,
                              message: `This field is required`,
                            },
                            minLength: {
                              value: Number(field.limit.min),
                              message: `Minimum ${field.limit.min} characters allowed.`,
                            },
                            maxLength: {
                              value: Number(field.limit?.max),
                              message: `Maximum ${field.limit.max} characters allowed.`,
                            },
                          })}
                          error={
                            errors[field.label ? field.label : field.mapLable]
                              ? true
                              : false
                          }
                          helperText={
                            errors[field.label ? field.label : field.mapLable]
                              ? errors[
                                field.label ? field.label : field.mapLable
                              ].message
                              : " "
                          }
                          defaultValue={
                            inputs[field.label ? field.label : field.mapLable]
                          }
                          //required={field.isFieldRequired === "Yes"}
                          disabled={!isEditable}
                          name={field.label ? field.label : field.mapLable}
                          label={field.label ? field.label : field.mapLable}
                          // value={fieldLabel}
                          onChange={handleChange}
                        />
                      </Grid>
                    </>
                  )}

                  {(field.fieldType === "Search Field" ||
                    field.fieldType === "System Generated") && (
                      <>
                        <Grid item xs={3} className={styles.col}>
                          <MaterialTextField
                            inputRef={register({
                              required: {
                                value: !field.primary ? true : false,
                                message: `This field is required`,
                              },
                              pattern: {
                                value: /^[a-zA-Z0-9-_\s]*$/,
                                message: ENTER_VALID_TEXT
                              },
                            })}
                            defaultValue={
                              inputs[
                              field?.mapLable ? field.mapLable : field.label
                              ]
                            }
                            error={errors.sessionTime ? true : false}
                            helperText={
                              errors.sessionTime
                                ? errors.sessionTime.message
                                : " "
                            }
                            required
                            label={field?.mapLable ? field.mapLable : field.label}
                            name={field?.mapLable ? field.mapLable : field.label}
                            onChange={handleChange}
                            disabled={!isEditable}
                          />
                        </Grid>
                      </>
                    )}

                  {field.fieldType === "Zip Field" && (
                    <Grid item xs={4} className={styles.col}>
                      <MaterialTextField
                        type="number"
                        defaultValue={inputs[field.label ? field.label : field.mapLable]}
                        error={
                          errors[field?.mapLable ? field.mapLable : field.label]
                            ? true
                            : false
                        }
                        helperText={
                          errors[field?.mapLable ? field.mapLable : field.label]
                            ? errors[
                              field?.mapLable ? field.mapLable : field.label
                            ].message
                            : " "
                        }
                        //required
                        label={field?.mapLable ? field.mapLable : field.label}
                        name={field?.mapLable ? field.mapLable : field.label}
                        onChange={handleChange}
                        disabled={!isEditable}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  )}

                  {field.fieldType === "Phone Field" && (
                    <Grid item xs={4} className={styles.col}>
                      <MaterialTextField
                        type="number"
                        defaultValue={inputs[field.label ? field.label : field.mapLable]}
                        error={errors[field.label] ? true : false}
                        helperText={
                          errors[field.label]
                            ? errors[field.label].message
                            : " "
                        }
                        //required
                        label={field?.mapLable ? field.mapLable : field.label}
                        name={field?.mapLable ? field.mapLable : field.label}
                        onChange={handleChange}
                        disabled={!isEditable}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  )}

                  {field.fieldType === "Check Box" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              inputRef={register({
                                required: {
                                  value:
                                    field.primary === true
                                      ? field.primary
                                      : false,
                                  message: `This field is required`,
                                },
                              })}
                              onChange={handleCheckChange}
                              name={
                                field?.mapLable ? field.mapLable : field.label
                              }
                              //checked ={defaultFormData[field.label]}
                              disabled={!isEditable}
                              checked={Boolean(
                                inputs[
                                field?.mapLable ? field.mapLable : field.label
                                ]
                              )}
                            />
                          }
                          label={field?.mapLable ? field.mapLable : field.label}
                        />
                      </Grid>
                    </>
                  )}

                  {field.fieldType === "Calendar Field" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          type="date"
                          defaultValue={
                            inputs[
                            field?.mapLable ? field.mapLable : field.label
                            ]
                          }
                          label={field?.mapLable ? field.mapLable : field.label}
                          name={field?.mapLable ? field.mapLable : field.label}
                          onChange={handleChange}
                          disabled={!isEditable}
                          inputRef={register({
                            required: {
                              value: !field.primary ? true : false,
                              message: `This field is required`,
                            },

                            min: {
                              value: field.limit.min,
                              message: `Date should not less than ${field.limit.min}.`,
                            },
                            max: {
                              value: field.limit.max,
                              message: `Date should not greater than ${field.limit.max}.`,
                            },
                          })}
                          error={
                            errors[
                              field?.mapLable ? field.mapLable : field.label
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field?.mapLable ? field.mapLable : field.label
                            ]
                              ? errors[
                                field?.mapLable ? field.mapLable : field.label
                              ].message
                              : " "
                          }
                        />
                      </Grid>
                    </>
                  )}
                </React.Fragment>
              ))}
          </Grid>
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Default Properties
          </Typography>
          <Grid container className={styles.row}>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                defaultValue={Label}
                disabled={!isEditable} // || Object.keys(selectedConfig?.Label?.mapping?.description).length > 0
                onChange={handleChange}
                label="Label"
                name="Field Name"
                error={
                  errors[
                    "Field Name"
                  ]
                    ? true
                    : false
                }
                helperText={
                  errors[
                    "Field Name"
                  ]
                    ? errors[
                      "Field Name"
                    ].message
                    : " "
                }
              />
            </Grid>
            {roles?.indexOf("Client User Access") === -1 &&
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  edge="start"
                  aria-label="default"
                  disabled={!isEditable}
                  onClick={() => handleNext("Label")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          selectedConfig &&
                          Object.keys(selectedConfig?.Label?.mapping?.description)
                            .length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
            }
            <Grid item xs={4} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Disabled</InputLabel>
                <MatSelect
                  name="Disabled"
                  defaultValue={Disabled}
                  disabled={!isEditable}
                  onChange={handleChange}
                >
                  {selectedConfig &&
                    selectedConfig.Disabled.mapping.functionLabel
                    ? selectedConfig.Disabled.mapping.property.map(
                      (item, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.function}
                        </MenuItem>
                      )
                    )
                    : ddList.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  ))
                </MatSelect>
              </MatFormControl>
            </Grid>
            {roles?.indexOf("Client User Access") === -1 &&
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  edge="start"
                  aria-label="default"
                  disabled={!isEditable}
                  onClick={() => handleNext("Disabled")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          Object.keys(selectedConfig.Disabled.mapping.description)
                            .length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
            }
          </Grid>

          <Grid container className={styles.row}>
            <Grid item xs={4} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Mandatory</InputLabel>
                <MatSelect
                  name="Mandatory"
                  defaultValue={Mandatory}
                  disabled={!isEditable}
                  onChange={handleChange}
                >
                  {selectedConfig &&
                    selectedConfig.Mandatory.mapping.functionLabel
                    ? selectedConfig.Mandatory.mapping.property.map(
                      (item, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.function}
                        </MenuItem>
                      )
                    )
                    : ddList.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  ))
                </MatSelect>
              </MatFormControl>
            </Grid>
            {roles?.indexOf("Client User Access") === -1 &&
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  edge="start"
                  aria-label="default"
                  disabled={!isEditable}
                  onClick={() => handleNext("Mandatory")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          Object.keys(selectedConfig.Mandatory.mapping.description)
                            .length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
            }
            <Grid item xs={4} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Hidden</InputLabel>
                <MatSelect
                  name="Hidden"
                  defaultValue={Hidden}
                  disabled={!isEditable}
                  onChange={handleChange}
                >
                  {selectedConfig && selectedConfig.Hidden.mapping.functionLabel
                    ? selectedConfig.Hidden.mapping.property.map(
                      (item, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.function}
                        </MenuItem>
                      )
                    )
                    : ddList.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  ))
                </MatSelect>
              </MatFormControl>
            </Grid>
            {roles?.indexOf("Client User Access") === -1 &&
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  edge="start"
                  aria-label="default"
                  disabled={!isEditable}
                  onClick={() => handleNext("Hidden")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          Object.keys(selectedConfig.Hidden.mapping.description)
                            .length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
            }
          </Grid>

          {selectedConfig.Other[0].value && (
            <>
              <Typography variant="h6" className={styles.cardHeadingSize}>
                Additional Properties
              </Typography>

              {selectedConfig.Other.length > 0 &&
                selectedConfig.Other.map((item, key) => (
                  <Grid container className={styles.row}>
                    <Grid item xs={4} className={styles.col}>
                      <MaterialTextField
                        value={item.value}
                        disabled
                        label="Other"
                        name={"option" + key}
                      />
                    </Grid>
                    {roles?.indexOf("Client User Access") === -1 &&
                      <Grid item xs={1} className={styles.col}>
                        <IconButton
                          disabled={!isEditable}
                          edge="start"
                          aria-label="default"
                          onClick={() => handleNext("Other", key)}
                        >
                          <SettingsIcon
                            style={{
                              color:
                                selectedConfig &&
                                  Object.keys(
                                    selectedConfig.Other[key].mapping.description
                                  ).length > 0
                                  ? "#4ADAB3"
                                  : "",
                            }}
                          />
                        </IconButton>
                      </Grid>
                    }
                    {roles?.indexOf("Client User Access") === -1 &&
                      <Grid item xs={1} className={styles.col}>
                        <IconButton
                          disabled={!isEditable}
                          style={{ color: "#ff9800" }}
                          onClick={() => handleRemoveOther(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    }
                  </Grid>
                ))}
              {roles?.indexOf("Client User Access") === -1 &&
                <Grid container className={styles.row}>
                  <IconButton
                    color="primary"
                    disabled={
                      !isEditable ||
                      (selectedConfig?.Other?.length > 0 &&
                        Object.keys(
                          selectedConfig?.Other[selectedConfig?.Other?.length - 1]
                            .mapping?.description
                        ).length === 0)
                    }
                    onClick={() => handleAddOther()}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
              }
            </>
          )}

          <Grid item xs={12} className={styles.buttonCol}>
            {/* {clientControlData.oobChangeStatus === "NO" &&
                featuresAssigned.indexOf(FIELD_RESTORE_OOB_ACTION) !== -1 && handleIsDisabled() && ( */}
            {handleRestoreDisabled() && (
              <MatButton
                // disabled={
                //   clientControlData.status === "SIGN_OFF" ||
                //   clientControlData.status === "APPROVED" ||
                //   clientControlData.status === "CONFIGURED"||
                //   clientControlData.status === "VALIDATED"
                // }
                className={styles.cancelBtn}
                color="primary"
                onClick={confirmApproveControl}
              >
                Restore OOB
              </MatButton>
            )}
            <div className={styles.grow} />

            {((loggedInInfo?.user_type === "CLIENT" &&
              featuresAssigned?.indexOf(UPDATE_CLIENT_FIELD_ACTION) !== -1 &&
              (clientControlData?.status === "AWAITING_SIGN_OFF" ||
                clientControlData?.status === "CLIENT_REVIEW_NEEDED" ||
                clientControlData?.status === "RETRACT")) ||
              (roles?.indexOf("Product User Access") !== -1 &&
                featuresAssigned?.indexOf(UPDATE_CLIENT_FIELD_ACTION) !== -1 &&
                clientControlData?.status === "PRODUCT_REVIEW_NEEDED")) &&
              !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1 &&
              !isEditable && (
                <MatButton onClick={() => setEditable(true)}>
                  Edit Details
                </MatButton>
              )}

            {isEditable && (
              <div>
                <MatButton
                  className={styles.cancelBtn}
                  color="primary"
                  onClick={handleCancel}
                >
                  Cancel
                </MatButton>
                <MatButton
                  type="submit"
                  disabled={
                    (isSubmited || !dirty) && !isSelectionChanged && !apiError
                  }
                >
                  Save Details
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
      {openDialog && (
        <ClientTabAddMapping
          fieldValue={fieldValue}
          fieldMapping={fieldMapping}
          open={openDialog}
          configDetails={selectedConfig}
          setSelectionChanged={setSelectionChanged}
          handleAddMapping={handleCloseDialog}
        />
      )}
    </MatCard>
  );
};

export default ClientFieldConfigDetails;
