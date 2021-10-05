import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import { defaultControlData } from "../../utils/defaultControlData";

// import { addMasterControl } from "../../actions/ControlActions";

// import { defaultControlData } from "../../utils/defaultControlData";
// import { fetchMasterControl } from "../../actions/ControlActions";
// import { SET_DEFAULT_STARTINDEX, DEFAULT_START_INDEX, RESET_ADD_CONTROL_ERROR } from "../../utils/AppConstants";
import {
  ADD_NEW_MAPPING,
  COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 8px",
  },
  row: {
    display: "flex",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
}));

const PropertyMapping = (props) => {
  const styles = useStyles();
  const { errors } = useForm({ mode: "onBlur" });
  const {
    data,
    selectedData,
    selectedColumn,
    valueMapingInputs,
    setValueMapingInputs,
  } = props;
  // const filterData =
  //   data.control.format &&
  //   data.control.format.filter((item) => item.internalName === selectedData);

  const filterData =
    defaultControlData.filter((item) => item.internalName === selectedData);

  let handleChange = (e) => {
    const { name, value } = e.target;
    setValueMapingInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  // useEffect(() => {
  //     console.log("PROPS", props);
  //     console.log("FILTER", type);
  //     [0].fieldType
  // }, [props]);

  return (
    <Grid
      item
      xs={12}
      className={styles.col}
      style={{ paddingTop: "0px", marginTop: "-8px" }}
    >
      <Paper variant="outlined">
        <Grid item xs={12} className={styles.col}>
          <Typography variant="subtitle2" gutterBottom>
            Property Values Mapping
          </Typography>
        </Grid>
        {(filterData.length > 0 && filterData[0].fieldType !== "select") ||
          selectedData === "controlType" ? (
            <Grid item xs={12} className={styles.row}>
              <Grid item xs={4} className={styles.col}>
                <MaterialTextField
                  //disabled
                  name="option"
                  //value={data.controlData[selectedData]}
                  label="CMT Value"
                />
              </Grid>
              {selectedColumn !== "" && (
                <Grid item xs={4} className={styles.col}>
                  <MaterialTextField
                    name={selectedData}
                    // {data.controlData[selectedData]}
                    onChange={handleChange}
                    label={
                      selectedColumn
                      // .mapLabel
                      //   ? selectedColumn.mapLabel
                      //   : selectedColumn.mapObject.fieldName
                    }
                  />
                </Grid>
              )}
            </Grid>
          ) : (
            filterData[0].options.map((item, key) => (
              <Grid item xs={12} className={styles.row}>
                <Grid item xs={4} className={styles.col}>
                  <MaterialTextField disabled name="option" label={item.label} />
                </Grid>
                {selectedColumn !== "" && (
                  <Grid item xs={4} className={styles.col}>
                    <MaterialTextField
                      name={item.label}
                      onChange={handleChange}
                      label={
                        selectedColumn
                        // .mapLabel
                        //   ? selectedColumn.mapLabel
                        //   : selectedColumn.mapObject.fieldName
                      }
                    />
                  </Grid>
                )}
              </Grid>
            ))
          )}
      </Paper>
    </Grid>
  );
};

export default PropertyMapping;
