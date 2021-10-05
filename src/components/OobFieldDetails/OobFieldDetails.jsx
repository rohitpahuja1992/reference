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
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";

import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { makeStyles } from "@material-ui/core";
// import { updateFieldProperty } from "../../actions/MasterComponentActions";
import { RESET_UPDATE_OOB_COMPONENT_IS_DONE } from "../../utils/AppConstants";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import {
  updateOobComponent,
  resetOobError,
  fetchOobComponentById,
} from "../../actions/OobComponentActions";
import { fetchOobComponent } from "../../actions/OobComponentActions";
// import AddConfigDetails from "./AddConfigDetails";
import {
  isDecimal,
  formatDateDash,
  formatDateDashYearFirst,
} from "../../utils/helpers";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_TIMELINE
} from "../../utils/AppConstants";
import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";
import {
  handleOobFieldDetailsError,
  NO_FIELD_AVAILABLE,
  ENTER_VALID_TEXT,
  PROPER_INTEGER_TYPE,
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

const OobFieldDetails = (props) => {
  const { OobControlData, columnData, isUpdated, fireOnUpdate, handlePrimary } =
    props;
  const { oobSubmoduleId, versionId, oobControlId } = useParams();
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const styles = useStyles();
  const OobControlObj = useSelector((state) => state.OobControl.individual);
  const OobControlObjUpdateError = useSelector((state) => state?.OobComponent?.data?.updateError?.responseMessage);
  const {
    register,
    handleSubmit,
    clearError,
    setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });

  let { dirty } = formState;
  const featuresAssigned = useSelector((state) => state.User.features);
  const OobModuleData = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const OobSubmoduleData = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.data
  );

  const fieldList = columnData;
  let details1 = JSON.parse(OobControlData?.mapField);
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
  // let checkvalthings = columnData.filter(a => a.fieldType === "Check Box").map(a => {
  //   return details[a.mapLable] = (details[a.mapLable] === true || details[a.mapLable] === 1) ? 1 : 0
  // })
  // console.log(checkvalthings)

  const componentData = useSelector((state) => state.OobComponent.data);
  const startIndex = useSelector((state) => state.OobComponent.page.startIndex || 0);
  const pageSize = useSelector((state) => state.OobComponent.page.pageSize || 10);

  const [isEditable, setEditable] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [inputs, setInputs] = useState({
    ...details,
  });
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const [isDraft, setDraft] = useState(false);

  let primary = props?.columnData.find(
    (item) => item.mapReference === true || item.primary
  );
  const primaryVal = primary?.label || primary?.mapObject?.columnName;
  const defaultPrimary = JSON.parse(OobControlData?.mapField)[primaryVal];

  const compData = useSelector((state) => state.OobComponent?.data?.list);
  const primData = compData?.map(
    (item) => JSON.parse(item?.mapField)[primaryVal]
  );
  // const primaryData = primData ? primData?.filter(
  //   (item) => !item?.includes(defaultPrimary)
  // ) : [];
  let integerData = props?.columnData
    ?.filter((a) => a?.mapObject?.javaDataType === "INTEGER")
    .map((b) => b?.mapLable);
  let integerData2 = props?.columnData
    ?.filter((a) => a?.mapObject?.javaDataType === "INTEGER")
    .map((b) => b?.mapObject?.columnName);
  handlePrimary(defaultPrimary ? defaultPrimary : "");
  const dupValid = (name, value) => {
    if (
      OobSubmoduleData?.componentType === "CMT_COMPONENT"
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
    setSelectionChanged(true);
    setApiError(null);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    dupValid(name, value);
  };

  const handleSelectChange = (e) => {
    setSelectionChanged(true);
    setApiError(null);
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  let handleCheckChange = (e) => {
    setSelectionChanged(true);
    let { name, checked } = e.target;
    checked = checked ? 1 : 0;
    console.log("name,value", name, checked);
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  // let handleRadioChange = (e) => {
  //   setSelectionChanged(true);
  //   const { name, checked, value } = e.target;
  //   console.log("name,value", name, checked, value);
  //   setInputs((inputs) => ({ ...inputs, [name]: checked }));
  // };
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
  const handleUpdateControl = (e) => {
    Object.entries(e).map((a) => {
      return dupValid(a[0], a[1]);
    });
    let inputValue = {};
    Object.entries(inputs).forEach(([key, value]) => {
      inputValue[key] = convertDate(value);
    });
    if (isValid) {
      setSelectionChanged(false);
      dispatch(updateOobComponent(OobControlData.fieldId, inputValue, null, primaryVal));
    }
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(details);
    setInputs(details);
    //setOptionField("");
    setEditable(false);
    setSelectionChanged(false);
  };
  useEffect(() => {
    dispatch(resetOobError());
  },[])
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
      setError(primaryVal, "notMatch", "This field name is already exist.");
      setIsValid(false);
    } else {
      setEditable(false);
      setIsValid(true);
      clearError(primaryVal);
    }
  }, [OobControlObjUpdateError]);

  useEffect(() => {
    if (componentData.isComponentUpdated) {
      dispatch(fetchOobComponentById(oobSubmoduleId, oobControlId));
      dispatch(fetchOOBControlAudit(oobControlId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
      dispatch({ type: RESET_UPDATE_OOB_COMPONENT_IS_DONE });
      //dispatch({ type: RESET_UPDATE_OOB_CONTROL_IS_DONE });
    }
  }, [dispatch, componentData, oobControlId, oobSubmoduleId]);

  useEffect(() => {
    dispatch(
      fetchOobComponent(oobSubmoduleId, startIndex, DEFAULT_PAGE_SIZE)
    );
  }, []);

  // useEffect(()=>{
  //   primaryData = primData?.filter(item=> item !== inputs[primaryVal])
  //   console.log("primaryData", primaryData)
  // },[inputs[primaryVal]])

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
            {/* <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                helperText=""
                defaultValue={inputs.controlType}
                disabled
                name="fieldType"
                label="Field Type"
                // value={fieldLabel}
                onChange={handleChange}
              />
            </Grid> */}
            {fieldList &&
              fieldList.length > 0 &&
              fieldList.map((field, index) => (
                <React.Fragment
                  key={field.label ? field.label : field.mapObject.columnName}
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
                          defaultValue={
                            inputs[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                            ]
                          }
                          error={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? errors[
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                              ].message
                              : " "
                          }
                          label={field.label ? field.label : field.mapLable}
                          name={
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          }
                          onChange={handleChange}
                          disabled={!isEditable}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      {/* {OobSubmoduleData?.component && <Grid item xs={1} className={styles.col}>
                        <IconButton disabled={!isEditable}
                          onClick={() => handleOpenConfig(field)}>
                          <SettingsIcon style={{ color: (config && config[field.label]) ? '#4ADAB3' : '' }} />
                        </IconButton>
                      </Grid>} */}
                    </>
                  )}
                  {field.fieldType === "Text Field" && (
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
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? errors[
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                              ].message
                              : " "
                          }
                          defaultValue={
                            inputs[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                            ]
                          }
                          //required={field.isFieldRequired === "Yes"}
                          disabled={!isEditable}
                          name={
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          }
                          label={field.label ? field.label : field.mapLable}
                          // value={fieldLabel}
                          onChange={handleChange}
                        />
                      </Grid>
                      {/* {OobSubmoduleData?.component && <Grid item xs={1} className={styles.col}>
                        <IconButton disabled={!isEditable}
                          onClick={() => handleOpenConfig(field)}>
                          <SettingsIcon style={{ color: (config && config[field.label]) ? '#4ADAB3' : '' }} />
                        </IconButton>
                      </Grid>} */}
                    </>
                  )}

                  {field.fieldType === "Drop Down" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          // inputRef={register({
                          //   required: {
                          //     value:
                          //       field.primary || field.mapReference
                          //         ? true
                          //         : false,
                          //     message: `This field is required`,
                          //   },
                          // })}
                          defaultValue={
                            inputs[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                            ]
                          }
                          error={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? errors[
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                              ].message
                              : " "
                          }
                          //required={field.isFieldRequired === "Yes"}
                          select
                          name={
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          }
                          label={field.label ? field.label : field.mapLable}
                          disabled={!isEditable}
                          // value={
                          //   inputs[field.mapLable ? field.mapLable : field.label]
                          // }
                          onChange={handleSelectChange}
                        >
                          {/* {field.options &&
                          field.options.map((option) => (
                            <MenuItem value={option.label}>
                              {option.label}
                            </MenuItem>
                          ))} */}
                          {
                            //index.label && (
                            OobSubmoduleData.dropdownMap !== undefined &&
                            OobSubmoduleData?.dropdownMap[
                            field?.mapObject?.parentTableName || field?.parentName
                            ] &&
                            OobSubmoduleData?.dropdownMap[
                              field?.mapObject?.parentTableName || field?.parentName
                            ].map((option, index) => (
                              <MenuItem
                                key={index}
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
                            ))
                            // <MenuItem key={key} name={index.label} value={index.label}>
                            //   {index.label}
                            // </MenuItem>
                            //))
                          }
                        </MaterialTextField>
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
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                              ]
                            }
                            label={field.label ? field.label : field.mapLable}
                            name={
                              field.label
                                ? field.label
                                : field.mapObject.columnName
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
                          inputs[
                          field.label
                            ? field.label
                            : field.mapObject.columnName
                          ]
                        }
                        error={
                          errors[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          ]
                            ? true
                            : false
                        }
                        helperText={
                          errors[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          ]
                            ? errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ].message
                            : " "
                        }
                        //required
                        label={field.label ? field.label : field.mapLable}
                        name={
                          field.label ? field.label : field.mapObject.columnName
                        }
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
                          inputs[
                          field.label
                            ? field.label
                            : field.mapObject.columnName
                          ]
                        }
                        error={errors[field.label] ? true : false}
                        helperText={
                          errors[field.label]
                            ? errors[field.label].message
                            : " "
                        }
                        //required
                        label={field.label ? field.label : field.mapLable}
                        name={
                          field.label ? field.label : field.mapObject.columnName
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
                  )}

                  {field.fieldType === "Check Box" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleCheckChange}
                              name={
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                              }
                              //checked ={defaultFormData[field.label]}
                              disabled={!isEditable}
                              checked={Boolean(
                                inputs[
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                                ]
                              )}
                            />
                          }
                          label={field.label ? field.label : field.mapLable}
                        />
                      </Grid>
                    </>
                  )}
                  {field.fieldType === "Radio Button" && (
                    <>
                      <Grid item xs={4} className={styles.col}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            {field.label
                              ? field.label
                              : field.mapObject.columnName}
                          </FormLabel>
                          <RadioGroup
                            row
                            inputRef={register({
                              required: {
                                value:
                                  field.primary || field.mapReference
                                    ? true
                                    : false,
                                message: `This field is required`,
                              },
                            })}
                            error={errors[field.label] ? true : false}
                            helperText={
                              errors[field.label]
                                ? errors[field.label].message
                                : " "
                            }
                            defaultValue={
                              inputs[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                              ]
                            }
                            name={
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            }
                            onChange={handleChange}
                          >
                            {
                              //index.label && (
                              OobSubmoduleData.radioButtonMap[
                              field.mapObject.columnName
                              ] &&
                              OobSubmoduleData.radioButtonMap[
                                field.mapObject.columnName
                              ].map((option, index) => (
                                <FormControlLabel
                                  value={option}
                                  control={<Radio />}
                                  label={option}
                                  disabled={!isEditable}
                                />
                              ))
                            }
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {/* {field.fieldType === "Radio Button" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <FormControlLabel

                          value={
                            inputs[field.label ? field.label : field.mapObject.columnName]
                          }
                          // {inputs.hasOwnProperty(field.label ? field.label : field.mapObject.columnName)?Boolean(field.defaultVal):inputs[field.label ? field.label : field.mapObject.columnName]}
                          control={
                            <Radio
                              inputRef={register({
                                required: {
                                  value: field.primary === true ? field.primary : false,
                                  message: `This field is required`,
                                },
                              })}
                              name={
                                field.label ? field.label : field.mapObject.columnName
                              }
                              onChange={handleRadioChange}
                              //checked ={defaultFormData[field.label]}
                              disabled={!isEditable}
                              checked={Boolean(
                                inputs[
                                field.label ? field.label : field.mapObject.columnName
                                ]
                              )}
                            />
                          }
                          // checked={inputs[field.label ? field.label : field.mapObject.columnName] === Boolean(field.defaultVal)}                      />}
                          label={field.label ? field.label : field.mapLable}
                        />
                      </Grid>
                      {OobSubmoduleData?.component && <Grid item xs={1} className={styles.col}>
                        <IconButton disabled={!isEditable}
                          onClick={() => handleOpenConfig(field)}>
                          <SettingsIcon style={{ color: (config && config[field.label]) ? '#4ADAB3' : '' }} />
                        </IconButton>
                      </Grid>}
                    </>
                  )} */}

                  {field.fieldType === "Calendar Field" && (
                    <>
                      <Grid item xs={3} className={styles.col}>
                        <MaterialTextField
                          type="date"
                          defaultValue={
                            inputs[
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                            ]
                          }
                          label={field.label ? field.label : field.mapLable}
                          name={
                            field.label
                              ? field.label
                              : field.mapObject.columnName
                          }
                          onChange={handleChange}
                          disabled={!isEditable}
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
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              field.label
                                ? field.label
                                : field.mapObject.columnName
                            ]
                              ? errors[
                                field.label
                                  ? field.label
                                  : field.mapObject.columnName
                              ].message
                              : " "
                          }
                        />
                      </Grid>
                    </>
                  )}
                </React.Fragment>
              ))}
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
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default OobFieldDetails;
