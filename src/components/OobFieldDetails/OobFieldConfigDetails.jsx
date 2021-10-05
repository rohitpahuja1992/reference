/* eslint-disable no-unused-vars */
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import MatCard from "../MaterialUi/MatCard";
import MatFormControl from "../MaterialUi/MatFormControl";

import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MaterialTextField from "../MaterialUi/MatTextField";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import MatButton from "../MaterialUi/MatButton";
import { makeStyles } from "@material-ui/core";
import { updateFieldProperty } from "../../actions/MasterComponentActions";
import { RESET_UPDATE_OOB_COMPONENT_IS_DONE,
  DEFAULT_PAGE_SIZE_TIMELINE,
  DEFAULT_START_INDEX,
 } from "../../utils/AppConstants";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import {
  isDecimal,
  formatDateDash,
  formatDateDashYearFirst,
} from "../../utils/helpers";
import {
  updateOobComponent,
  resetOobError,
  fetchOobConfigComponentById,
} from "../../actions/OobComponentActions";
// import AddConfigDetails from "./AddConfigDetails";
import TabAddMapping from "./TabAddMapping";

import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";
import {
  handleOobFieldDetailsError,
  ENTER_VALID_TEXT,
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
  radio: {},
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
    justifyContent: "flex-end",
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

const OobFieldConfigDetails = (props) => {
  const { OobControlData, columnData, isUpdated, fireOnUpdate, handlePrimary } =
    props;
  const { oobSubmoduleId, versionId, oobControlId } = useParams();
  const dispatch = useDispatch();
  const styles = useStyles();
  const OobControlObj = useSelector((state) => state.OobControl.individual);
  const OobControlObjUpdateError = useSelector((state) => state?.OobComponent?.data?.updateError?.responseMessage);
  const { register, handleSubmit, errors, formState, setError, clearError } =
    useForm({
      mode: "onBlur",
    });
  let { dirty } = formState;
  const featuresAssigned = useSelector((state) => state.User.features);
  const OobModuleData = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const staticFields = [
    "View Order",
    "Section",
    "Type of Field",
    "Hidden",
    "Mandatory",
    "Disabled",
    "Field Name",
  ];
  const fieldList = columnData.filter(
    (item) => !staticFields.includes(item?.label)
  );
  const details1 = JSON.parse(OobControlData?.mapField);
  //console.log(details1)
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
  Object.entries(details1).forEach(([key, value]) => {
    details[key] = convertDateYearFirst(value);
  });
  const mapConfig = JSON.parse(OobControlData?.mapConfig);
  const [openDialog, setOpenDialog] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [fieldMapping, setFieldMapping] = useState("");
  // const isControlUpdated = useSelector(
  //   (state) => state.OobControl.individual.isControlUpdated
  // );
  const componentData = useSelector((state) => state.OobComponent.data);

  const [isEditable, setEditable] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inputs, setInputs] = useState({
    ...details,
  });
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

  const {
    Section,
    "Field Name": Label,
    "View Order": ViewOrder,
    Hidden,
    Mandatory,
    Disabled,
  } = inputs;

  const ddList = ["Yes", "No"];
  const compData = useSelector((state) => state.OobComponent?.data?.list);

  let primary = props?.columnData.find((item) => item.primary);
  const primaryCol = primary?.label || primary?.mapObject?.columnName;
  const defaultPrimary = JSON.parse(OobControlData?.mapField)[primaryCol];

  const primData = compData?.map(
    (item) => JSON.parse(item?.mapField)[primaryCol]
  );
  const primaryData = primData?.filter(
    (item) => !item?.includes(defaultPrimary)
  );

  handlePrimary(defaultPrimary ? defaultPrimary : "");
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
  let OobComponentData = useSelector((state) =>
    state.OobComponent.data.list.map((data, index) => {
      let componentData = JSON.parse(data.mapField);
      componentData.id = data.id;
      return { ...componentData };
    })
  );

  OobComponentData = OobComponentData.sort((a, b) => a["View Order"] - b["View Order"]);
  const [isDraft, setDraft] = useState(false);
  let handleChange = (e) => {
    setSelectionChanged(true);
    setApiError(null);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    if (name === "ViewOrder") {
      handleViewOrder(ViewOrder, value);
    }
    // dupValid(name, value);
  };

  let handleViewOrderArray = (
    currentOrder,
    selectedOrder,
    increaseDecreasecurrent
  ) => {
    let allorders = [];
    let orderno = {};
    for (let i = currentOrder; i <= selectedOrder; i++) {
      let id = OobComponentData.filter((o) => o["View Order"] === i)[0].id;
      if (i === currentOrder) {
        orderno = {
          id: id,
          viewOrder: selectedOrder,
        };
      } else if (i === increaseDecreasecurrent) {
        orderno = {
          id: id,
          viewOrder: currentOrder,
        };
      } else {
        orderno = {
          id: id,
          viewOrder: i - 1,
        };
      }
      allorders.push(orderno);
    }
    //console.log(allorders);
  };

  let handleViewOrder = (currentOrder, selectedOrder) => {
    currentOrder = parseInt(currentOrder);
    selectedOrder = parseInt(selectedOrder);
    let increasetocurrent = currentOrder + 1;
    let decreasetocurrent = currentOrder - 1;
    if (selectedOrder > currentOrder) {
      handleViewOrderArray(currentOrder, selectedOrder, increasetocurrent);
    } else if (selectedOrder < currentOrder) {
      handleViewOrderArray(selectedOrder, currentOrder, decreasetocurrent);
    }
  };

  let handleCheckChange = (e) => {
    setSelectionChanged(true);
    let { name, checked } = e.target;
    checked = checked ? 1 : 0;

    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  // let handleOpenDialog = (value, mapping) => {
  //   setFieldValue(value);
  //   setFieldMapping(mapping);
  //   setOpenDialog(true);
  // };

  let handleCloseDialog = (e) => {
    setOpenDialog(false);
  };

  const handleUpdateControl = (e) => {

    let formData = {};
    // Object.entries(e).map((a) => {
    //   return dupValid(a[0], a[1]);
    // });
    // dupValid("Field Name", Label);
    Object.entries(inputs).forEach(([key, value]) => {
      formData[key] = convertDate(value);
    });
    //setEditable(false);
    setSelectionChanged(false);
    //fireOnUpdate(true);
    dispatch(
      updateOobComponent(OobControlData.fieldId, formData, selectedConfig, primaryCol)
    );
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    // reset(details);
    // setInputs(details);
    //setOptionField("");
    setEditable(false);
    setSelectedConfig(mapConfig);
    setSelectionChanged(false);
  };

  // const handleSaveDialog = () => {
  //   let obj = { ...selectedConfig };
  //   // obj[selectedData.label] = selectedConfig;
  //   //setConfig(obj);
  //   setSelectedConfig(obj);
  //   setSelectionChanged(true);
  //   setIsConfigDialogOpen(false);
  // };

  const updateConfig = (val) => {
    setSelectedConfig(val);
  };
  useEffect(() => {
    dispatch(resetOobError());
  }, [])
  useEffect(() => {
    if (OobControlObj.updateError && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleOobFieldDetailsError(OobControlObj.updateError));
    } else {
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
    if (OobModuleData) {
      let currentversion = OobModuleData.versions.filter(
        (obj) => obj.version === versionId
      );
      setDraft(currentversion[0].oobModuleStatus === "DRAFT" ? true : false);
    }
  }, [OobControlObj, isUpdated, OobModuleData, versionId]);

  useEffect(() => {
    if (!!OobControlObjUpdateError) {
      setEditable(true);
      setError(primaryCol, "notMatch", "This field name is already exist.");
      setIsValid(false);
    } else {
      setEditable(false);
      setIsValid(true);
      clearError(primaryCol);
    }
  }, [OobControlObjUpdateError]);

  useEffect(() => {
    if (componentData.isComponentUpdated) {
      dispatch(fetchOobConfigComponentById(oobSubmoduleId, oobControlId));
      dispatch(fetchOOBControlAudit(oobControlId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
      dispatch({ type: RESET_UPDATE_OOB_COMPONENT_IS_DONE });
      //dispatch({ type: RESET_UPDATE_OOB_CONTROL_IS_DONE });
    }
  }, [dispatch, componentData, oobControlId, oobSubmoduleId]);

  const handleNext = (fieldProperty, value) => {
    let FieldDetails;
    if (typeof value === "number")
      FieldDetails = selectedConfig[fieldProperty][value].mapping;
    else FieldDetails = selectedConfig[fieldProperty].mapping;
    dispatch(updateFieldProperty(fieldProperty, FieldDetails, value));
    setOpenDialog(true);
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

  return (
    <>
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
                  onChange={handleChange}
                  label="Section"
                  name="Section"
                  disabled={!isEditable}
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
                                value:
                                  field.primary === true
                                    ? field.primary
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
                            label={
                              field?.mapLable ? field.mapLable : field.label
                            }
                            name={
                              field?.mapLable ? field.mapLable : field.label
                            }
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
                                value: field.primary === true ? true : false,
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
                                  value:
                                    field.primary === true
                                      ? field.primary
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
                              label={
                                field?.mapLable ? field.mapLable : field.label
                              }
                              name={
                                field?.mapLable ? field.mapLable : field.label
                              }
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
                          defaultValue={
                            inputs[field.label ? field.label : field.mapLable]
                          }
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
                          defaultValue={
                            inputs[field.label ? field.label : field.mapLable]
                          }
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
                                  field?.mapLable
                                    ? field.mapLable
                                    : field.label
                                  ]
                                )}
                              />
                            }
                            label={
                              field?.mapLable ? field.mapLable : field.label
                            }
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
                            label={
                              field?.mapLable ? field.mapLable : field.label
                            }
                            name={
                              field?.mapLable ? field.mapLable : field.label
                            }
                            onChange={handleChange}
                            disabled={!isEditable}
                            inputRef={register({
                              required: {
                                value:
                                  field.primary === true
                                    ? field.primary
                                    : false,
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
                                  field?.mapLable
                                    ? field.mapLable
                                    : field.label
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
                  onChange={handleChange}
                  label="Label"
                  name="Field Name"
                  disabled={!isEditable}
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
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  disabled={!isEditable}
                  edge="start"
                  aria-label="default"
                  onClick={() => handleNext("Label")}
                // onClick={() => handleOpenDialog(Label, "Label")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          Object.keys(selectedConfig?.Label?.mapping?.description)
                            .length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item xs={4} className={styles.col}>
                <MatFormControl variant="filled" size="small">
                  <InputLabel>Disabled</InputLabel>
                  <MatSelect
                    name="Disabled"
                    defaultValue={Disabled}
                    onChange={handleChange}
                    disabled={!isEditable}
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
                  </MatSelect>
                </MatFormControl>
              </Grid>
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  disabled={!isEditable}
                  edge="start"
                  aria-label="default"
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
            </Grid>
            <Grid container className={styles.row}>
              <Grid item xs={4} className={styles.col}>
                <MatFormControl variant="filled" size="small">
                  <InputLabel>Mandatory</InputLabel>
                  <MatSelect
                    name="Mandatory"
                    defaultValue={Mandatory}
                    onChange={handleChange}
                    disabled={!isEditable}
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
                  </MatSelect>
                </MatFormControl>
              </Grid>
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  disabled={!isEditable}
                  edge="start"
                  aria-label="default"
                  onClick={() => handleNext("Mandatory")}
                >
                  <SettingsIcon
                    style={{
                      color:
                        selectedConfig &&
                          Object.keys(
                            selectedConfig.Mandatory.mapping.description
                          ).length > 0
                          ? "#4ADAB3"
                          : "",
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item xs={4} className={styles.col}>
                <MatFormControl variant="filled" size="small">
                  <InputLabel>Hidden</InputLabel>
                  <MatSelect
                    name="Hidden"
                    defaultValue={Hidden}
                    onChange={handleChange}
                    disabled={!isEditable}
                  >
                    {selectedConfig &&
                      selectedConfig.Hidden.mapping.functionLabel
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
                  </MatSelect>
                </MatFormControl>
              </Grid>
              <Grid item xs={1} className={styles.col}>
                <IconButton
                  disabled={!isEditable}
                  edge="start"
                  aria-label="default"
                  onClick={() => handleNext("Hidden")}
                >
                  {/* <SettingsIcon /> */}
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
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Additional Properties
            </Typography>
            {selectedConfig?.Other?.length > 0 &&
              selectedConfig?.Other?.map((item, key) => (
                <Grid container className={styles.row}>
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      value={item?.value}
                      //value={""}
                      disabled
                      label="Other"
                      name={"option" + key}
                    // name={"option" + 0}
                    />
                  </Grid>
                  <Grid item xs={1} className={styles.col}>
                    <IconButton
                      disabled={!isEditable}
                      edge="start"
                      aria-label="default"
                      onClick={() => handleNext("Other", key)}
                    >
                      {/* <SettingsIcon /> */}
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
                  <Grid item xs={1} className={styles.col}>
                    <IconButton
                      disabled={!isEditable}
                      style={{ color: "#ff9800" }}
                      onClick={() => handleRemoveOther(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
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

            <Grid item xs={12} className={styles.buttonCol}>
              <div className={styles.grow} />
              {!isEditable &&
                isDraft &&
                featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !==
                -1 && (
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
      </MatCard>
      {openDialog && (
        <TabAddMapping
          fieldValue={fieldValue}
          fieldMapping={fieldMapping}
          open={openDialog}
          configDetails={selectedConfig}
          setSelectionChanged={setSelectionChanged}
          handleAddMapping={handleCloseDialog}
        />
      )}
    </>
  );
};

export default OobFieldConfigDetails;
