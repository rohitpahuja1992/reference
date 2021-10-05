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
// import Paper from "@material-ui/core/Paper";
// import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";

import { updateFieldProperty } from "../../actions/MasterComponentActions";
import ClientAddConfigDetails from "./ClientAddConfigDetails";

import { makeStyles } from "@material-ui/core";
import {
  isDecimal,
  formatDateDash,
  // formatDateDashYearFirst,
} from "../../utils/helpers";
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
  resetClientError,
  restoreOobSingleField,
  fetchClientControlAudit,
  fetchClientControlById,
} from "../../actions/ClientModuleActions";
import {
  ATTEMPT_TO_SAVE_OUT_OF_BOX_CONF,
  handleClientFieldDetails,
  NO_FIELD_AVAILABLE,
  // NO_OPT_AVAILABLE,
  PLEASE_ACKN,
  RESTORE_OUT_OF_BOX_CONF,
  ENTER_VALID_TEXT,
  SAVE_DETAILS,
  PROPER_INTEGER_TYPE,
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

const ClientFieldDetails = (props) => {
  const {
    clientControlData,
    columnData,
    isUpdated,
    fireOnUpdate,
    handlePrimary,
    clientInfo
  } = props;
  const { controlId } = useParams(); //submoduleVersionId,
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const styles = useStyles();
  const clientControlUpdateError = useSelector(
    (state) => state.ClientModule.clientControlById.updateError
  );
  const clientSubmoduleData = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.data
  );
  const {
    register,
    handleSubmit,
    setError,
    clearError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const fieldList = columnData;
  const details1 = JSON.parse(clientControlData?.mapField);
  const convertDateYearFirst = (value) => {
    let dateFormat = /^\d{2}\-\d{2}\-\d{4}$/;

    if (
      dateFormat.test(value) &&
      value?.toString()?.split("-").length === 3 &&
      (value?.toString()?.length === 10 || value?.toString()?.length === 28)
    ) {
      var parts = value?.split('-'); //12-10-2021
      let newDate = `${parts[2]}-${parts[0]}-${parts[1]}`
      return newDate;
    } else {
      return value;
    }
  };
  let details = {};

  if (details1) {
    Object?.entries(details1)?.forEach(([key, value]) => {
      details[key] = convertDateYearFirst(value);
    });
  }
  console.log("column", columnData)
  console.log("details", details)
  const mapConfig = JSON.parse(clientControlData.mapConfig);
  const [config, setConfig] = useState(mapConfig);
  const featuresAssigned = useSelector((state) => state.User.features);
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);
  const isControlUpdated = useSelector(
    (state) => state.ClientModule.clientControlById.isControlUpdated
  );
  const isControlRestored = useSelector(
    (state) => state.ClientModule.clientControlById.isControlRestored
  );
  const roles = loggedInInfo && loggedInInfo.roles.map((item) => item.roleName);

  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [inputs, setInputs] = useState({ ...details });
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [selectedConfig, setSelectedConfig] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  let primary = props?.columnData.find(
    (item) => item.mapReference === true || item.primary
  );
  const primaryVal = primary?.label || primary?.mapObject?.columnName;
  const defaultPrimary = JSON?.parse(clientControlData?.mapField)[primaryVal];
  const compData = useSelector((state) =>
    clientSubmoduleData?.ClientComponent?.clientOobComponentData?.map(
      (data, index) => {
        let componentData = JSON.parse(data.mapField);
        return { ...componentData };
      }
    )
  );
  const primData = compData?.map((item) => item[primaryVal]);

  // const primaryData = primData?.filter(
  //   (item) => !item?.includes(defaultPrimary)
  // );
  let integerData = props?.columnData
    ?.filter((a) => a?.mapObject?.javaDataType === "INTEGER")
    .map((b) => b?.mapLable);
  let integerData2 = props?.columnData
    ?.filter((a) => a?.mapObject?.javaDataType === "INTEGER")
    .map((b) => b?.mapObject?.columnName);
  handlePrimary(defaultPrimary ? defaultPrimary : "");

  const dupValid = (name, value) => {
    if (
      clientSubmoduleData?.componentType === "CMT_COMPONENT"
        ? integerData.indexOf(name) !== -1
        : integerData2.indexOf(name) !== -1 && isDecimal(value)
    ) {
      setError(name, "notMatch", PROPER_INTEGER_TYPE);
      setIsValid(false);
    } else {
      clearError(name);
      setIsValid(true);
    }
  };

  let handleChange = (e) => {
    setApiError(null);
    setSelectionChanged(true);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    dupValid(name, value);
  };

  const handleSelectChange = (e) => {
    setSelectionChanged(true);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const convertDate = (value) => {
    let dateWrapper = new Date(value);
    if (
      dateWrapper !== "Invalid Date" &&
      value?.toString()?.split("-").length === 3 &&
      (value?.toString()?.length === 10 || value?.toString()?.length === 28)
    ) {
      let newDate = formatDateDash(value);
      return newDate;
    } else {
      return value;
    }
  };
  const handleUpdateControl = () => {
    let inputValue = {};
    Object.entries(inputs).forEach(([key, value]) => {
      inputValue[key] = convertDate(value);
    });
    //fireOnUpdate(true);
    let formData = {
      id: clientControlData.id,
      mapConfig: JSON.stringify(config),
      mapField: JSON.stringify({ ...inputValue }),
      primaryField: primaryVal,
    };
    dispatch(updateClientControl(formData));
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(details);
    setInputs(details);
    setSelectionChanged(false);
  };

  let handleCheckChange = (e) => {
    setSelectionChanged(true);
    let { name, checked } = e.target;
    checked = checked ? 1 : 0;
    console.log("name,value", name, checked);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  let handleRadioChange = (e) => {
    setSelectionChanged(true);
    const { name, checked, value } = e.target;
    console.log("name,value", name, checked, value);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  const confirmUpdateControl = (e) => {
    Object.entries(e).map((a) => {
      return dupValid(a[0], a[1]);
    });
    if (isValid) {
      let messageObj = {
        primaryButtonLabel: "Save",
        primaryButtonAction: () => {
          handleUpdateControl();
        },
        secondaryButtonLabel: "Cancel",
        secondaryButtonAction: () => {
          handleCancel();
        },
        title: PLEASE_ACKN,
        message: ATTEMPT_TO_SAVE_OUT_OF_BOX_CONF,
      };
      dispatch(showMessageDialog(messageObj));
    }
  };

  const restoreOobControl = () => {
    fireOnUpdate(true);
    // if (clientControlData.control.type === "form") {
    //   fieldLabel = clientControlData.controlData.label
    //     ? clientControlData.controlData.label
    //     : "";
    // }
    dispatch(restoreOobSingleField(clientControlData.id));
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

  const closeAddConfigDialog = () => {
    setSelectedConfig(config);
    setIsConfigDialogOpen(false);
  };

  const handleNextConfigDetailsTab = (fieldProperty, value) => {
    let FieldDetails;
    if (typeof value === "number")
      FieldDetails = selectedConfig[fieldProperty][value].mapping;
    else FieldDetails = selectedConfig[fieldProperty].mapping;
    dispatch(updateFieldProperty(fieldProperty, FieldDetails, value));
    setActiveTab((prevState) => prevState + 1);
  };

  const handlePrevConfigDetailsDialog = () => {
    setActiveTab((prevState) => prevState - 1);
  };

  const handleSaveDialog = () => {
    let obj = { ...config };
    obj[selectedData.label] = selectedConfig;
    setConfig(obj);
    setSelectionChanged(true);
    setIsConfigDialogOpen(false);
  };

  const updateConfig = (val) => {
    setSelectedConfig(val);
  };

  const handleIsDisabled = () => {
    let index = roles.indexOf("Product User Access");
    if (
      loggedInInfo.user_type !== "MHK" &&
      featuresAssigned.indexOf(UPDATE_CLIENT_FIELD_ACTION) !== -1 &&
      (clientControlData.status === "AWAITING_SIGN_OFF" ||
        clientControlData.status === "CLIENT_REVIEW_NEEDED" ||
        clientControlData.status === "RETRACT") &&
      !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1
    ) {
      return false;
    } else if (loggedInInfo.user_type !== "MHK") {
      return true;
    } else if (
      index !== -1 &&
      loggedInInfo.roles[index].features.findIndex(
        (x) => x.featureInternalName === UPDATE_CLIENT_FIELD_ACTION
      ) !== -1 &&
      clientControlData.status === "PRODUCT_REVIEW_NEEDED"
    ) {
      return false;
    } else return true;
  };

  const handleRestoreDisabled = () => {
    let index = roles.indexOf("Product User Access");
    //clientControlData.oobCha ngeStatus === "NO" && featuresAssigned.indexOf(FIELD_RESTORE_OOB_ACTION) !== -1
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
  }, [isUpdated, fireOnUpdate]);

  useEffect(() => {
    if (!!clientControlUpdateError?.responseMessage) {
      setError(primaryVal, "notMatch", "This field name is already exist.");
      setIsValid(false);
    } else {
      setIsValid(true);
      clearError(primaryVal);
    }
  }, [clientControlUpdateError]);

  useEffect(() => {
    if (isControlUpdated) {
      dispatch(fetchClientControlById(controlId));
      dispatch(fetchClientControlAudit(controlId));
      dispatch({ type: RESET_UPDATE_CLIENT_CONTROL_IS_DONE });
      //fireOnUpdate(false);
    }
  }, [dispatch, isControlUpdated, controlId]);

  useEffect(() => {
    if (isControlRestored) {
      dispatch(fetchClientControlById(controlId));
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
            {"Field Details"}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(confirmUpdateControl)}
        >
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card
                  className={
                    apiError.messageType === "error"
                      ? styles.errorCard
                      : styles.warningCard
                  }
                >
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}
            {fieldList && fieldList.length <= 0 && (
              <Grid
                item
                xs={12}
                className={styles.col}
                style={{ textAlign: "center" }}
              >
                <Typography variant="body2">{NO_FIELD_AVAILABLE}</Typography>
              </Grid>
            )}

            {fieldList &&
              fieldList.length > 0 &&
              fieldList.map((field, index) => (
                <React.Fragment
                  key={
                    field?.label ? field?.label : field?.mapObject?.columnName
                  }
                >
                  {field.fieldType === "Integer Field" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          inputRef={register({
                            required: {
                              value:
                                field.limit.min ||
                                  field.primary ||
                                  field.mapReference ||
                                  field?.mapObject?.isRequired
                                  ? true
                                  : false,
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
                          error={
                            errors[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            ]
                              ? errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ].message
                              : " "
                          }
                          defaultValue={
                            inputs[
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                            ]
                          }
                          label={field?.label ? field?.label : field?.mapLable}
                          name={
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                          }
                          onChange={handleChange}
                          disabled={handleIsDisabled()}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid >
                    </>
                  )}
                  {
                    field.fieldType === "Text Field" && (
                      <>
                        <Grid item xs={3} className={styles.col}>
                          <MaterialTextField
                            inputRef={register({
                              required: {
                                value:
                                  field.limit.min ||
                                    field.primary ||
                                    field.mapReference ||
                                    field?.mapObject?.isRequired
                                    ? true
                                    : false,
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
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? true
                                : false
                            }
                            helperText={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? errors[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                ].message
                                : " "
                            }
                            defaultValue={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            disabled={
                              // field.valueSetBy === "MHK" ||
                              // !(
                              //   clientControlData.controlData.configMapping &&
                              //   clientControlData.controlData.configMapping[
                              //   field.label?field.label:field.mapLable
                              //   ]
                              // ) ||
                              handleIsDisabled()
                            }
                            name={
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            }
                            label={field?.label ? field?.label : field?.mapLable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={handleChange}
                          />
                        </Grid>
                      </>
                    )
                  }

                  {
                    field.fieldType === "Zip Field" && (
                      <Grid item xs={4} className={styles.col}>
                        <MaterialTextField
                          type="number"
                          defaultValue={
                            inputs[
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                            ]
                          }
                          error={
                            errors[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            ]
                              ? errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ].message
                              : " "
                          }
                          //required
                          label={field?.label ? field?.label : field?.mapLable}
                          name={
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                          }
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )
                  }
                  {
                    field.fieldType === "Phone Field" && (
                      <Grid item xs={4} className={styles.col}>
                        <MaterialTextField
                          type="number"
                          defaultValue={
                            inputs[
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                            ]
                          }
                          error={errors[field.label] ? true : false}
                          helperText={
                            errors[field.label]
                              ? errors[field.label].message
                              : " "
                          }
                          //required
                          label={field?.label ? field?.label : field?.mapLable}
                          name={
                            field?.label
                              ? field?.label
                              : field?.mapObject?.columnName
                          }
                          onChange={handleChange}
                          disabled={
                            field?.mapObject &&
                            field.mapObject.isAutoIncrement === "true"
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )
                  }

                  {
                    field.fieldType === "Drop Down" && (
                      <>
                        <Grid item xs={3} className={styles.col}>
                          <MaterialTextField
                            inputRef={register({
                              required: {
                                value:
                                  field.primary || field.mapReference
                                    ? true
                                    : false,
                                message: `This field is required`,
                              },
                            })}
                            defaultValue={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            error={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? true
                                : false
                            }
                            helperText={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? errors[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                ].message
                                : " "
                            }
                            select
                            name={
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            }
                            label={field?.label ? field?.label : field?.mapLable}
                            disabled={handleIsDisabled()}
                            // value={fieldLabel}
                            value={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            onChange={handleSelectChange}
                          >
                            {clientSubmoduleData?.ClientComponent?.dropdownMap &&
                              clientSubmoduleData?.ClientComponent?.dropdownMap[
                              field?.mapObject?.parentTableName || field?.parentName
                              ] &&
                              clientSubmoduleData?.ClientComponent?.dropdownMap[
                                field?.mapObject?.parentTableName || field?.parentName
                              ].map((option, index) => (
                                <MenuItem
                                  key={option}
                                  name={option}
                                  value={
                                    JSON.parse(option?.oobComponentData)[
                                    option.primary
                                    ]
                                  }
                                >
                                  {
                                    JSON.parse(option?.oobComponentData)[
                                    option.primary
                                    ]
                                  }
                                </MenuItem>
                              ))}
                            {/* {field.label && (
                            <MenuItem
                              key={index}
                              name={field.defaultVal}
                              value={
                                inputs[
                                field?.label ? field?.label : field?.mapObject?.columnName
                                ]
                              }
                            >
                              {
                                inputs[
                                field?.label ? field?.label : field?.mapObject?.columnName
                                ]
                              }
                            </MenuItem>
                          )} */}
                          </MaterialTextField>
                        </Grid>
                      </>
                    )
                  }

                  {
                    (field.fieldType === "Search Field" ||
                      field.fieldType === "System Generated") && (
                      <>
                        <Grid item xs={3} className={styles.col}>
                          <MaterialTextField
                            inputRef={register({
                              required: {
                                value:
                                  field.primary ||
                                    field.mapReference ||
                                    field?.mapObject?.isRequired
                                    ? true
                                    : false,
                                message: `This field is required`,
                              },
                              pattern: {
                                value: /^[a-zA-Z0-9-_\s]*$/,
                                message: ENTER_VALID_TEXT,
                              },
                            })}
                            defaultValue={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            error={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? true
                                : false
                            }
                            helperText={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? errors[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                ].message
                                : " "
                            }
                            label={field?.label ? field?.label : field?.mapLable}
                            name={
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={handleChange}
                            disabled={handleIsDisabled()}
                          />
                        </Grid>
                      </>
                    )
                  }

                  {
                    field.fieldType === "Check Box" && (
                      <>
                        <Grid item xs={3} className={styles.col}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                inputRef={register({
                                  required: {
                                    value:
                                      field.primary || field.mapReference
                                        ? true
                                        : false,
                                    message: `This field is required`,
                                  },
                                })}
                                error={
                                  errors[
                                    field?.label
                                      ? field?.label
                                      : field?.mapObject?.columnName
                                  ]
                                    ? true
                                    : false
                                }
                                helperText={
                                  errors[
                                    field?.label
                                      ? field?.label
                                      : field?.mapObject?.columnName
                                  ]
                                    ? errors[
                                      field?.label
                                        ? field?.label
                                        : field?.mapObject?.columnName
                                    ].message
                                    : " "
                                }
                                onChange={handleCheckChange}
                                name={
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                }
                                //checked ={defaultFormData[field.label]}
                                disabled={handleIsDisabled()}
                                checked={Boolean(
                                  inputs[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                  ]
                                )}
                              />
                            }
                            label={field?.label ? field?.label : field?.mapLable}
                          />
                        </Grid>
                      </>
                    )
                  }
                  {
                    field.fieldType === "Radio Button" && (
                      <>
                        <Grid item xs={4} className={styles.col}>
                          <FormControlLabel
                            value={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            // {inputs.hasOwnProperty(field?.label ? field?.label : field?.mapObject?.columnName)?Boolean(field.defaultVal):inputs[field?.label ? field?.label : field?.mapObject?.columnName]}
                            control={
                              <Radio
                                name={
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                }
                                onChange={handleRadioChange}
                                disabled={handleIsDisabled()}
                                checked={Boolean(
                                  inputs[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                  ]
                                )}
                              />
                            }
                            // checked={inputs[field?.label ? field?.label : field?.mapObject?.columnName] === Boolean(field.defaultVal)}                      />}
                            label={field?.label ? field?.label : field?.mapLable}
                          />
                        </Grid>
                      </>
                    )
                  }

                  {
                    field.fieldType === "Calendar Field" && (
                      <>
                        <Grid item xs={4} className={styles.col}>
                          <MaterialTextField
                            type="date"
                            defaultValue={
                              inputs[
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                              ]
                            }
                            label={field?.label ? field?.label : field?.mapLable}
                            name={
                              field?.label
                                ? field?.label
                                : field?.mapObject?.columnName
                            }
                            onChange={handleChange}
                            disabled={handleIsDisabled()}
                            inputRef={register({
                              required: {
                                value:
                                  field.limit.min ||
                                    field.primary ||
                                    field.mapReference ||
                                    field?.mapObject?.isRequired
                                    ? true
                                    : false,
                                message: "Calendar value is required.",
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
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? true
                                : false
                            }
                            helperText={
                              errors[
                                field?.label
                                  ? field?.label
                                  : field?.mapObject?.columnName
                              ]
                                ? errors[
                                  field?.label
                                    ? field?.label
                                    : field?.mapObject?.columnName
                                ].message
                                : " "
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </>
                    )
                  }
                </React.Fragment >
              ))}
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

              {featuresAssigned.indexOf(UPDATE_CLIENT_FIELD_ACTION) !== -1 &&
                !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1 && (
                  <MatButton
                    type="submit"
                    disabled={
                      (isSubmited || !dirty) && !isSelectionChanged && !apiError
                    }
                  >
                    {SAVE_DETAILS}
                  </MatButton>
                )}
            </Grid>
          </Grid >
        </form >
      </CardContent >
      {isConfigDialogOpen && (
        <ClientAddConfigDetails
          handleClose={closeAddConfigDialog}
          open={isConfigDialogOpen}
          activeTab={activeTab}
          field={selectedData}
          config={selectedConfig}
          updateConfig={updateConfig}
          handleSave={handleSaveDialog}
          handlePrev={handlePrevConfigDetailsDialog}
          handleConfigNext={handleNextConfigDetailsTab}
        // handleAddComponent={handleAddComponent}
        />
      )}
    </MatCard >
  );
};

export default ClientFieldDetails;
