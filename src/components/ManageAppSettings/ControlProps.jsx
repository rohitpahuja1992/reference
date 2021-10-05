import React, { useState, useEffect } from "react";
import Tooltip from "../MaterialUi/MatTooltip";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import MenuItem from "@material-ui/core/MenuItem";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
//import Typography from '@material-ui/core/Typography';
import { isDecimal } from "../../utils/helpers";

const ControlProps = (props) => {
  const { handleCancel, openFrom, data, option, updatePayload } = props;
  const defaultFormData = {
    defaultval: data[0]?.defaultVal,
    limit: data[0]?.limit,
    minval: data[0]?.limit.min,
    maxval: data[0]?.limit.max,
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const [minError, setMinError] = useState(false);
  const [maxError, setMaxError] = useState(false);
  const [minError1, setMinError1] = useState(false);
  const [maxError1, setMaxError1] = useState(false);
  const [minDouble, setMinDouble] = useState(false);
  const [maxDouble, setMaxDouble] = useState(false);
  const {
    defaultval,
    minval,
    maxval,
    //limit,
  } = inputs;

  let handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "0" || value === "1") parseInt(value);
    if (name === "minval" && value === "") setMinError(false);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  let handleSave = (e) => {
    let temp = { min: minval, max: maxval };
    let copyData = { ...data[0], defaultVal: defaultval, limit: temp };
    updatePayload(copyData);
    handleCancel(false);
  };

  useEffect(() => {
    if (data[0]?.fieldType === "Calendar Field" && minval > maxval)
      setMinError(true);
    if (data[0]?.fieldType === "Calendar Field" && minval < maxval)
      setMinError(false);
    if (
      data[0]?.fieldType !== "Calendar Field" &&
      parseInt(minval) > parseInt(maxval)
    )
      setMinError(true);
    if (
      data[0]?.fieldType !== "Calendar Field" &&
      parseInt(minval) < parseInt(maxval)
    )
      setMinError(false);
    if (data[0]?.fieldType === "Text Field" && minval < 0) setMinError1(true);
    if (data[0]?.fieldType === "Text Field" && minval > 0) setMinError1(false);
    if (data[0]?.fieldType === "Text Field" && maxval > option?.fieldLength)
      setMaxError1(true);
    // if (data[0]?.fieldType === 'Text Field' && maxval <= option?.fieldLength)
    //     setMaxError1(false);
    else {
      setMaxError1(false);
    }

    if (
      data[0]?.fieldType === "Integer Field" &&
      option?.javaDataType === "INTEGER" &&
      !(isDecimal(maxval) || option?.maxValue < parseInt(maxval))
    )
      //2147483647 <= 10
      setMaxError(true);
    else {
      setMaxError(false);
    }
    if (
      data[0]?.fieldType === "Integer Field" &&
      option?.javaDataType === "INTEGER" &&
      !(isDecimal(minval) || option?.minValue > parseInt(minval))
    )
      setMinError(true);
    else {
      setMinError(false);
    }

    if (
      data[0]?.fieldType === "Integer Field" &&
      option?.javaDataType === "DOUBLE" &&
      option?.maxValue < parseFloat(maxval)
    )
      //2147483647 <= 10
      setMaxDouble(true);
    else {
      setMaxDouble(false);
    }
    if (
      data[0]?.fieldType === "Integer Field" &&
      option?.javaDataType === "DOUBLE" &&
      option?.minValue >= parseFloat(minval)
    )
      setMinDouble(true);
    else {
      setMinDouble(false);
    }
  }, [data, minval, maxval]);
  return (
    <>
      {openFrom === "Default" && data[0]?.fieldType === "Calendar Field" && (
        <TextField
          type="date"
          name="defaultval"
          defaultValue={defaultval}
          onChange={handleChange}
          inputProps={{
            format: "MM-DD-YYYY",
          }}
        />
      )}
      {openFrom === "Default" && data[0]?.fieldType === "Check Box" && (
        <TextField
          type="number"
          select
          name="defaultval"
          defaultValue={
            option?.defaultValue ? option?.defaultValue : defaultval
          }
          //defaultValue={defaultval}
          onChange={handleChange}
        >
          <MenuItem value={"0"}>0</MenuItem>
          <MenuItem value={"1"}>1</MenuItem>
        </TextField>
      )}
      {openFrom === "Default" && data[0]?.fieldType === "Integer Field" && (
        <TextField
          type="number"
          name="defaultval"
          defaultValue={
            option?.javaDataType === "DOUBLE" ? Number(defaultval) : defaultval ? defaultval : (option?.defaultValue ? option?.defaultValue : parseInt(defaultval))
          }
          onChange={handleChange}
        />
      )}
      {openFrom === "Default" &&
        !(
          data[0]?.fieldType === "Check Box" ||
          data[0]?.fieldType === "Integer Field" ||
          data[0]?.fieldType === "Calendar Field"
        ) && (
          <TextField
            name="defaultval"
            value={defaultval}
            onChange={handleChange}
          />
        )}

      {openFrom === "Limit" && data[0]?.fieldType === "Calendar Field" && (
        <>
          <TextField
            type="date"
            name="minval"
            label="From"
            error={minError}
            defaultValue={
              option?.minValue !== null && option?.minValue !== undefined
                ? option?.minValue
                : minval
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="date"
            name="maxval"
            label="To"
            defaultValue={
              option?.maxValue !== null && option?.maxValue !== undefined
                ? option?.maxValue
                : maxval
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
      {openFrom === "Limit" && data[0]?.fieldType === "Integer Field" && (
        <>
          <TextField
            type="number"
            name="minval"
            label="Minimum value"
            error={minError}
            //disabled
            //defaultValue={option?.minValue !== null && option?.minValue !== undefined ? option?.minValue : parseInt(minval)}
            defaultValue={
              option?.javaDataType === "DOUBLE"
                ? option?.minValue !== null && option?.minValue !== undefined
                  ? parseInt(option?.minValue)
                  : Number(minval)
                : option?.minValue !== null && option?.minValue !== undefined
                  ? parseInt(option?.minValue)
                  : parseInt(minval)
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="number"
            name="maxval"
            label="Maximum value"
            // disabled
            error={maxError}
            //defaultValue={option?.maxValue !== null && option?.maxValue !== undefined ? option?.maxValue : parseInt(maxval)}
            defaultValue={
              option?.javaDataType === "DOUBLE"
                ? option?.maxValue !== null && option?.maxValue !== undefined
                  ? parseInt(option?.maxValue)
                  : Number(maxval)
                : option?.maxValue !== null && option?.maxValue !== undefined
                  ? parseInt(option?.maxValue)
                  : parseInt(maxval)
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}

      {openFrom === "Limit" && data[0]?.fieldType === "Text Field" && (
        <>
          <TextField
            type="number"
            name="minval"
            label="Minimum characters allowed"
            error={minError1}
            //disabled
            defaultValue={
              option?.fieldLength !== null && option?.fieldLength !== undefined
                ? 0
                : minval
            }
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="number"
            name="maxval"
            label="Maximum characters allowed"
            error={maxError1}
            //disabled
            defaultValue={
              option?.fieldLength !== null && option?.fieldLength !== undefined
                ? parseInt(option?.fieldLength)
                : maxval
            }
            //defaultValue={option?.fieldLength !== null && option?.fieldLength !== undefined ? option?.fieldLength : maxval}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
      <Tooltip placement="left" arrow title="Save">
        <IconButton
          disabled={
            minError ||
            maxError ||
            minError1 ||
            maxError1 ||
            minDouble ||
            maxDouble
          }
          edge="end"
          aria-label="save"
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="left" arrow title="Cancel">
        <IconButton
          edge="end"
          aria-label="cancel"
          onClick={() => handleCancel(false)}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ControlProps;
