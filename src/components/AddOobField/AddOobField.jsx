/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import MaterialTextField from "../MaterialUi/MatTextField";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import { resetError } from "../../actions/OOBSubmoduleActions";
import { addOobComponent, resetOobError } from "../../actions/OobComponentActions";
import { fetchOobComponent } from "../../actions/OobComponentActions";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import { isDecimal, formatDateDash } from "../../utils/helpers";
import { PROPER_INTEGER_TYPE, ENTER_VALID_TEXT } from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  radio: {},
  cardHeadingSize: {
    fontSize: "18px",
    marginTop: "-3%",
    marginLeft: "45%",
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
  redcolor: {
    color: "#ff0000",
  },
}));

const AddOobField = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleClose, open } = props;
  const { register, handleSubmit, clearError, errors, setError } = useForm({
    mode: "onBlur",
  });
  const { oobSubmoduleId } = useParams();

  let primary =
    props.colData.find((item) => item.primary === true) ||
    props.colData.find((item) => item.mapReference === true);
  const primaryVal = primary?.label || primary?.mapLable;
  const primaryLabel = primary?.label || primary?.mapObject?.columnName;

  const compData = useSelector((state) => state.OobComponent?.data?.list);
  const primaryData = compData.map(
    (item) => JSON.parse(item?.mapField)[primaryLabel]
  );
  //let arrViewOrder =  props.colData.some(item => item.label === "View Order");
  const arrViewOrder = compData.map(
    (item) => JSON.parse(item?.mapField)["View Order"]
  );
  // const primaryData = compData.map(
  //   (item) => JSON.parse(item?.mapField)[primaryVal]
  // );
  let integerData = props?.colData
    ?.filter(
      (a) =>
        a?.mapObject?.javaDataType === "INTEGER" &&
        a.fieldType === "Integer Field"
    )
    .map((b) => b?.mapLable);

  const isComponentAdded = useSelector(
    (state) => state.OobComponent.data.isComponentAdded
  );
  const oobApiError = useSelector(
    (state) => state?.OobComponent?.data?.addError?.responseMessage
  );
  const OobSubmoduleData = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.data
  );

  const FEILD_TYPE = [
    "Text Field",
    "Integer Field",
    "Drop Down",
    "Radio Button",
    "Calendar Field",
    "Phone Field",
    "Zip Field",
    "Check Box",
    "Search Field",
    "System Generated",
  ];
  const Default_DropDown = ["Yes", "No"];
  const [apiError, setApiError] = useState(null);

  const [inputs, setInputs] = useState([]);
  const handleCloseForm = useCallback(() => {
    dispatch(resetError());
    setApiError(false);
    clearError();
    handleClose();
  }, [dispatch, clearError, handleClose]);

  let handleChange = (e) => {
    let { name, value } = e.target;
    dispatch(resetError());
    setApiError(false);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    dupValid(name, value);
  };
  let errorComes = [];
  const dupValid = (name, value) => {
     if (integerData.indexOf(name) !== -1 && isDecimal(value)) {
      setError(name, "notMatch", PROPER_INTEGER_TYPE);
      errorComes.push("notMatch");
    } else {
      clearError(name);
      errorComes.push("Match");
    }
  };

  let handleCheckChange = (e) => {
    let { name, checked } = e.target;
    checked = checked ? 1 : 0;
    setInputs((inputs) => ({ ...inputs, [name]: checked }));
  };

  // let handleRadioChange = (e) => {
  //   const { name, checked, value } = e.target;
  //   console.log("name,value", name, checked, value);
  //   setInputs((inputs) => ({ ...inputs, [name]: checked }));
  // };

  const getFieldName = (labelVal) => {
    return props.colData
      .filter((a) => a.mapLable === labelVal)
      .map((b) => {
        return b.mapObject.columnName;
      })
      .toString();
  };

  const getLabelName = (fieldVal) => {
    return props.colData
      .filter((a) => a.mapObject.columnName === fieldVal)
      .map((b) => {
        return b.mapLable;
      })
      .toString();
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
  const handleAddOOBField = (e) => {
    let coldataArray = props.colData.filter((a) => a.fieldType === "Drop Down");
    let parentTableName,
      setvalid = true;
    if (
      coldataArray.length > 0 &&
      !OobSubmoduleData?.component?.config &&
      Object.keys(OobSubmoduleData?.dropdownMap).length === 0
    ) {
      for (let i = 0; i < coldataArray.length; i++) {
        parentTableName = OobSubmoduleData?.dropdownMap?.hasOwnProperty(
          coldataArray[i].mapObject.parentTableName || coldataArray[i].parentName
        );
        if (parentTableName) {
          clearError(coldataArray[i].mapLable);
        } else {
          setError(
            coldataArray[i].mapLable,
            "notMatch",
            `Please add values in parent table (${coldataArray[i].mapObject.parentTableName || coldataArray[i]?.parentName})`
          );
          setvalid = false;
        }
      }
    }
    Object.entries(e).map((a) => {
      return dupValid(a[0], a[1]);
    });
    if(oobApiError?.includes("View")) {
      setError("View Order", "notMatch", "This order number is already exist");
    }
    else {
      clearError("View Order");
    }
    if(oobApiError?.includes("primary")) {
      setError(primaryVal, "notMatch", "This field name is already exist.");
    }
    else {
      clearError(primaryVal);
    }
    if (
      OobSubmoduleData?.componentType === "CMT_COMPONENT" &&
      setvalid &&
      errorComes.indexOf("notMatch") === -1
    ) {
      let inputValue = {};
      Object.entries(inputs).forEach(([key, value]) => {
        inputValue[key] = convertDate(value);
      });
      dispatch(addOobComponent(inputValue, oobSubmoduleId, primaryLabel, inputValue["View Order"]));
    } else if (setvalid && errorComes.indexOf("notMatch") === -1) {
      let payload = {};
      Object.entries(inputs).forEach(([key, value]) => {
        payload[getFieldName(key)] = convertDate(value);
      });
      dispatch(addOobComponent(payload, oobSubmoduleId, primaryLabel, payload["View Order"]));
    }
  };
  useEffect(() => {
    dispatch(resetOobError());
  }, [])
  useEffect((e) => {
    if (!!oobApiError) {
      console.log("eeeee",e)
      if(oobApiError.includes("View")) {
        setError("View Order", "notMatch", "This order number is already exist");
      }
      else {
        clearError("View Order");
      }
      if(oobApiError.includes("primary")) {
        setError(primaryVal, "notMatch", "This field name is already exist.");
      }
      else {
        clearError(primaryVal);
      }
    }
    else {
      clearError("View Order");
      clearError(primaryVal);
    }
  }, [oobApiError]);

  useEffect(() => {
    props.colData.forEach((index, key) => {
      setInputs((inputs) => ({
        ...inputs,
        [index?.mapLable ? index.mapLable : index.label]:
          index.defaultVal === 0 ? 0 : index.defaultVal,
      }));
    });
  }, [props.colData]);

  // useEffect(() => {
  //   if (addApiError) {
  //     setApiError(handleManageSubmoduleError(addApiError));
  //   }
  //   else {
  //     setApiError(false);
  //   }

  //   if (isSubmoduleAdded) {
  //     handleCloseForm();
  //   }

  // }, [register, clearError, setValue, addApiError, systemTable, component, controlId, isSubmoduleAdded, handleCloseForm])

  useEffect(() => {
    if (isComponentAdded) {
      // props.resetSearchText();
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchOobComponent(
          oobSubmoduleId,
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE
        )
      );
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isComponentAdded]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>Add New</DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleAddOOBField)}
        id="addOOBSubmodule"
      >
        <DialogContent dividers="true">
          {apiError ? (
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
          ) : null}

          <Grid container className={styles.row}>
            {props.colData.map((index, key) => (
              <>
                {index.fieldType === "Integer Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      inputRef={register({
                        required: {
                          value:
                            index.limit.min ||
                              index.primary ||
                              index.mapReference ||
                              index?.mapObject?.isRequired
                              ? true
                              : false || index.label === "View Order"
                                ? true
                                : false,
                          message: `This field is required.`,
                        },
                        //Number(index.limit.min)!==0 && "abc"
                        min: {
                          value:
                            index.limit.min === ""
                              ? null
                              : Number(index.limit.min),
                          message: `The value must be at least ${index.limit.min}.`,
                        },
                        max: {
                          value:
                            index.limit.max === ""
                              ? null
                              : Number(index.limit.max),
                          message: `The value can't be more than ${index.limit.max}.`,
                        },
                      })}
                      type="number"
                      defaultValue={index.defaultVal}
                      error={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? true
                          : false
                      }
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? errors[
                            index?.mapLable ? index.mapLable : index.label
                          ].message
                          : " "
                      }
                      //required={index.limit}
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      // disabled={
                      //   index?.mapObject &&
                      //   index.mapObject.isAutoIncrement === "true"
                      // }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Zip Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      type="number"
                      defaultValue={index.defaultVal}
                      error={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? true
                          : false
                      }
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? errors[
                            index?.mapLable ? index.mapLable : index.label
                          ].message
                          : " "
                      }
                      //required
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={
                        index?.mapObject &&
                        index.mapObject.isAutoIncrement === "true"
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Phone Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      type="number"
                      defaultValue={index.defaultVal}
                      error={errors[index.label] ? true : false}
                      helperText={
                        errors[index.label] ? errors[index.label].message : " "
                      }
                      //required
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      disabled={
                        index?.mapObject &&
                        index.mapObject.isAutoIncrement === "true"
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Text Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      inputRef={register({
                        required: {
                          value:
                            index.limit.min ||
                              index.primary ||
                              index.mapReference ||
                              index?.mapObject?.isRequired
                              ? true
                              : false,
                          message: `This field is required`,
                        },
                        minLength: {
                          value: Number(index.limit.min),
                          message: `Minimum ${index.limit.min} characters allowed.`,
                        },
                        maxLength: {
                          value: Number(index.limit?.max),
                          message: `Maximum ${index.limit.max} characters allowed.`,
                        },
                      })}
                      defaultValue={index.defaultVal}
                      error={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? true
                          : false
                      }
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? errors[
                            index?.mapLable ? index.mapLable : index.label
                          ].message
                          : " "
                      }
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {(index.fieldType === "Search Field" ||
                  index.fieldType === "System Generated") && (
                    <Grid item xs={4} className={styles.col}>
                      <MaterialTextField
                        inputRef={register({
                          required: {
                            value:
                              index.primary ||
                                index.mapReference ||
                                index?.mapObject?.isRequired
                                ? true
                                : false,
                            message: `This field is required.`,
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9-_\s]*$/,
                            message: ENTER_VALID_TEXT,
                          },
                        })}
                        defaultValue={index.defaultVal}
                        error={
                          errors[index?.mapLable ? index.mapLable : index.label]
                            ? true
                            : false
                        }
                        helperText={
                          errors[index?.mapLable ? index.mapLable : index.label]
                            ? errors[
                              index?.mapLable ? index.mapLable : index.label
                            ].message
                            : " "
                        }
                        label={index?.mapLable ? index.mapLable : index.label}
                        name={index?.mapLable ? index.mapLable : index.label}
                        onChange={handleChange}
                        //disabled={!isEditable}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  )}
                {index.fieldType === "Check Box" && (
                  <Grid item xs={4} className={styles.col}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          // inputRef={register({
                          //   required: {
                          //     value:
                          //       index.primary === true || index.mapReference || index?.mapObject?.isRequired ? true : false,
                          //       message: `This field is required`,
                          //   },
                          // })}
                          error={
                            errors[
                              index?.mapLable ? index.mapLable : index.label
                            ]
                              ? true
                              : false
                          }
                          helperText={
                            errors[
                              index?.mapLable ? index.mapLable : index.label
                            ]
                              ? errors[
                                index?.mapLable ? index.mapLable : index.label
                              ].message
                              : " "
                          }
                          onChange={handleCheckChange}
                          name={index?.mapLable ? index.mapLable : index.label}
                          checked={Boolean(
                            inputs[
                            index?.mapLable ? index.mapLable : index.label
                            ]
                          )}
                        />
                      }
                      label={index?.mapLable ? index.mapLable : index.label}
                    />
                  </Grid>
                )}

                {index.fieldType === "Drop Down" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      // inputRef={register({
                      //       required: {
                      //         value: true,
                      //         message: `This field is required`,
                      //       },
                      //     })}
                      error={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? true
                          : false
                      }
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? errors[
                            index?.mapLable ? index.mapLable : index.label
                          ].message
                          : " "
                      }
                      select
                      defaultValue={index.defaultVal}
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                    >
                      {
                        OobSubmoduleData?.component?.config
                          ? index.label === "Type of Field"
                            ? FEILD_TYPE.map((option) => (
                              <MenuItem
                                key={option}
                                name={option}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))
                            : Default_DropDown.map((option, index) => (
                              <MenuItem
                                key={index}
                                name={option}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))
                          : OobSubmoduleData.dropdownMap !== undefined &&
                          OobSubmoduleData?.dropdownMap[
                          index?.mapObject?.parentTableName || index?.parentName
                          ] &&
                          OobSubmoduleData?.dropdownMap[
                            index?.mapObject?.parentTableName || index?.parentName
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
                              {/* {option.id} */}
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
                )}
                {index.fieldType === "Calendar Field" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      type="date"
                      defaultValue={index.defaultVal}
                      label={index?.mapLable ? index.mapLable : index.label}
                      name={index?.mapLable ? index.mapLable : index.label}
                      onChange={handleChange}
                      //InputProps={{inputProps: { min: index.limit.min, max: index.limit.max} }}

                      inputRef={register({
                        required: {
                          value:
                            index.limit.min ||
                              index.primary ||
                              index.mapReference ||
                              index?.mapObject?.isRequired
                              ? true
                              : false,
                          message: `This field is required`,
                        },
                        min: {
                          value: index.limit.min,
                          message: `Date should not less than ${index.limit.min}.`,
                        },
                        max: {
                          value: index.limit.max,
                          message: `Date should not greater than ${index.limit.max}.`,
                        },
                      })}
                      error={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? true
                          : false
                      }
                      helperText={
                        errors[index?.mapLable ? index.mapLable : index.label]
                          ? errors[
                            index?.mapLable ? index.mapLable : index.label
                          ].message
                          : " "
                      }
                      //disabled={!isEditable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {index.fieldType === "Radio Button" && (
                  <Grid item xs={4} className={styles.col}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        {index?.mapLable ? index.mapLable : index.label}
                      </FormLabel>
                      <RadioGroup
                        row
                        // inputRef={register({
                        //   required: {
                        //     value:
                        //     // index.limit.min ||
                        //     index.primary ||
                        //     index.mapReference ||
                        //     index?.mapObject?.isRequired
                        //     ? true : false,
                        //     message: `This field is required.`,
                        //   },
                        // })}
                        error={
                          errors[index?.mapLable ? index.mapLable : index.label]
                            ? true
                            : false
                        }
                        helperText={
                          errors[index?.mapLable ? index.mapLable : index.label]
                            ? errors[
                              index?.mapLable ? index.mapLable : index.label
                            ].message
                            : " "
                        }
                        defaultValue={
                          inputs[index?.mapLable ? index.mapLable : index.label]
                        }
                        name={index?.mapLable ? index.mapLable : index.label}
                        onChange={handleChange}
                      >
                        {OobSubmoduleData.dropdownMap !== undefined &&
                          OobSubmoduleData?.radioButtonMap[
                          index?.mapObject?.columnName
                          ] &&
                          OobSubmoduleData?.radioButtonMap[
                            index?.mapObject?.columnName
                          ].map((option, index) => (
                            <FormControlLabel
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
              </>
            ))}
          </Grid>
          {/* {props.colData.filter(a => a.fieldType === "Drop Down").length > 0 && !OobSubmoduleData?.component?.config && Object.keys(OobSubmoduleData?.dropdownMap).length == 0 &&
            <Grid item xs={12} className={styles.col}>
              <div className={styles.redcolor}>
                Note: Please configure drop down first for parent child relation.
                </div>
            </Grid>
          } */}
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          <MatButton type="submit">Add New</MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOobField;
