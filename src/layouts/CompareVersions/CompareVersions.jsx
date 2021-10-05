import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import BreadcrumbView from "../../components/BreadcrumbView";
import MatContainer from "../../components/MaterialUi/MatContainer";
import LeftDrawer from "./../Submodules/LeftDrawer";
import CompareVersionSelection from "./CompareVersionSelection";
import CompareVersionDifference from "./CompareVersionDifference";
import {
  fetchOOBModule,
  fetchOOBModuleById,
} from "../../actions/OOBModuleActions";
import { fetchOOBSubmodulesByOOBModuleId } from "../../actions/OOBSubmoduleActions";
import { handleCompareVersionsError } from "../../utils/Messages";
//import { RESET_DUPLICATE_ERROR } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "absolute",

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
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const CompareVersions = () => {
  const history = useHistory();
  let { path } = useRouteMatch();
  //const [label, setLabel] = useState("");
  const [isTwoVersionDiffernece, setTwoVersionDiffernece] = useState(false);
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const { moduleId, versionId } = useParams();
  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const moduleIdError = useSelector((state) => state.OOBModule.getByIdError);
  const oobModuleIdError = useSelector((state) => state.OOBSubmodule.getError);
  const [apiError, setApiError] = useState(null);
  //const OOBSubmoduleList = useSelector((state) =>state.OOBSubmodule.getSubmodules.data);
  //const [versionIdError, setVersionIdError] = useState(false); oobModuleId,
  //const [getApiError, setGetApiError] = useState(false);
  const styles = useStyles();

  const handleBackButton = () => {
    //if (label === "OOB") {
    history.push(`/admin/oob-config`);
    dispatch(fetchOOBModule("all"));
    // } else {
    //   history.push(`/admin/global-config`);
    //   dispatch(fetchOOBModule("global"));
    // }
  };

  const BreadcrumbData = [
    {
      id: "modules",
      label: "Modules",
      action: handleBackButton,
    },
    {
      id: "submodules",
      label:
        Object.keys(OOBModuleById).length !== 0 &&
        OOBModuleById.module &&
        OOBModuleById.module.moduleName,
    },
  ];

  useEffect(() => {
    dispatch(fetchOOBSubmodulesByOOBModuleId(moduleId, versionId));
    // if (url.includes("/admin/global-config")) {
    //   setLabel("Global");
    // } else {
    //   setLabel("OOB");
    // }
    if (url.includes("two-version-difference")) {
      setTwoVersionDiffernece(true);
    } else {
      setTwoVersionDiffernece(false);
    }
    dispatch(fetchOOBModuleById(moduleId));
  }, [dispatch, path, url, moduleId, versionId]);

  // useEffect(() => {
  //   if (Object.keys(OOBModuleById).length !== 0) {
  //     let currentversion = OOBModuleById.versions.filter(obj => obj.version === versionId);
  //     if (currentversion.length > 0)
  //       setOobModuleId(currentversion[0].id)
  //   }
  // }, [OOBModuleById, versionId]);
  useEffect(() => {
    if (oobModuleIdError || moduleIdError)
      setApiError(handleCompareVersionsError(oobModuleIdError, moduleIdError));
    else
      setApiError(false);
  },
    [oobModuleIdError, moduleIdError]
  );

  return (
    <MatContainer>
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">
              {apiError.message}
            </Typography>
          </Card>
        </Grid>
      ) : (
        <Grid container wrap="nowrap">
          <Grid item className={styles.subMenuGrid}>
            {OOBModuleById &&
              OOBModuleById.module &&
              OOBModuleById.versions &&
              (
                <LeftDrawer
                  version={versionId}
                  isVersionHistory={true}
                  OOBModule={OOBModuleById}
                />
              )}
          </Grid>
          <Grid item className={styles.grow}>
            <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
            {isTwoVersionDiffernece
              ? OOBModuleById &&
              OOBModuleById.module && (
                <CompareVersionDifference
                  moduleName={OOBModuleById.module.moduleName}
                />
              )
              : OOBModuleById &&
              OOBModuleById.module &&
              OOBModuleById.versions && (
                <CompareVersionSelection
                  moduleName={OOBModuleById.module.moduleName}
                />
              )}
          </Grid>
        </Grid>
      )}
    </MatContainer>
  );
};

export default CompareVersions;
