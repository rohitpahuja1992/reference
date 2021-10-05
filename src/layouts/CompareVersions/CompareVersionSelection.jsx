import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CardContent } from "@material-ui/core";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import MenuItem from "@material-ui/core/MenuItem";
//import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import CompareVersionHeading from "./CompareVersionHeading";
import {
  FIRST_VER_MANDATORY,
  SECOND_VER_MANDATORY,
  COMP_SELCTED_VER,
  VER_REC_NOT_FOUND,
  SEL_FIRST_VERSION,
  SEL_SECOND_VERSION,
  COMP_VERSION
} from "../../utils/Messages";
import compareVersionIcon from "../../assets/images/version-compare-icon.svg";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "fixed",
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  compareButtonGrid: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
}));

const CompareVersionSelection = (props) => {
  const { moduleName } = props;
  const history = useHistory();
  const { moduleId, oobModuleId, versionId } = useParams();
  //const { url } = useRouteMatch();
  const styles = useStyles();
  //const [label, setLabel] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    clearError,
    setError,
    errors,
  } = useForm({ mode: "onBlur" });
  const defaultFormObj = {
    firstVersion: "",
    secondVersion: "",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const [rightVersion, setRightVersion] = useState([]);
  const { firstVersion, secondVersion } = inputs;

  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );

  const versionList = OOBModuleById.versions.sort((a, b) =>
    new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
  );

  let handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleCompareVersions = () => {
    //if (label === "OOB") {
    history.push(
      `/admin/oob-config/two-version-difference/${moduleId}/${oobModuleId}/${versionId}/${firstVersion}/${secondVersion}`
    );
    // } else {
    //   history.push(
    //     `/admin/global-config/two-version-difference/${moduleId}/${oobModuleId}/${versionId}/${firstVersion}/${secondVersion}`
    //   );
    // }
  };

  useEffect(() => {
    if (firstVersion !== "") {
      setValue("firstVersion", firstVersion);
      clearError("firstVersion");
    } else {
      register(
        { name: "firstVersion" },
        {
          required: { value: true, message: FIRST_VER_MANDATORY },
        }
      );
    }

    if (secondVersion !== "") {
      setValue("secondVersion", secondVersion);
      clearError("secondVersion");
    } else {
      register(
        { name: "secondVersion" },
        {
          required: { value: true, message: SECOND_VER_MANDATORY },
        }
      );
    }
  }, [firstVersion, secondVersion, register, setValue, clearError, setError]);

  // useEffect(() => {
  //   if (url.includes("/admin/global-config")) {
  //     setLabel("Global");
  //   } else {
  //     setLabel("OOB");
  //   }
  // }, [url, label]);
  let leftIndex = 0;
  let rightVersionList = [];
  useEffect(() => {

    if (firstVersion) {
      rightVersionList = versionList.filter((a, i) => {
        if (a.version === firstVersion) {
          leftIndex = i
        }
      })
      rightVersionList = versionList.filter((a, i) => {
        if (i > leftIndex) {
          return a
        }
      })
      setRightVersion(rightVersionList)
    }
  }, [firstVersion])

  return (
    <>
      <PageHeading heading={COMP_VERSION} action="" />
      <CompareVersionHeading heading={moduleName} />
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleCompareVersions)}
      >
        <Grid container wrap="nowrap">
          <Grid item xs>
            <MatCard>
              <CardContent style={{ paddingBottom: "10px" }}>
                <MaterialTextField
                  error={errors.firstVersion ? true : false}
                  helperText={
                    errors.firstVersion ? errors.firstVersion.message : " "
                  }
                  select
                  required
                  label={SEL_FIRST_VERSION}
                  onChange={handleChange}
                  name="firstVersion"
                >
                  {versionList && versionList.length > 0 ? (
                    versionList.map((data) => (
                      <MenuItem
                        disabled={secondVersion === data.version}
                        value={data.version}
                      >
                        {data.version}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{VER_REC_NOT_FOUND}</MenuItem>
                  )}
                </MaterialTextField>
              </CardContent>
            </MatCard>
          </Grid>
          <Grid item xs style={{ maxWidth: "40px" }}>
            <img
              src={compareVersionIcon}
              style={{ maxWidth: "100%", marginTop: "35px" }}
              alt="Compare Version Icon"
            />
          </Grid>
          <Grid item xs>
            <MatCard>
              <CardContent style={{ paddingBottom: "10px" }}>
                <MaterialTextField
                  error={errors.secondVersion ? true : false}
                  helperText={
                    errors.secondVersion ? errors.secondVersion.message : " "
                  }
                  disabled={!firstVersion}
                  select
                  required
                  label={SEL_SECOND_VERSION}
                  onChange={handleChange}
                  name="secondVersion"
                >
                  {rightVersion && rightVersion.length > 0 ? (
                    rightVersion.map((data) => (
                      <MenuItem

                        value={data.version}
                      >
                        {data.version}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{VER_REC_NOT_FOUND}</MenuItem>
                  )}
                </MaterialTextField>
              </CardContent>
            </MatCard>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <div className={styles.compareButtonGrid}>
              <MatButton type="submit">{COMP_SELCTED_VER}</MatButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CompareVersionSelection;
