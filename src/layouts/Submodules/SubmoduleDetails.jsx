import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useRouteMatch } from "react-router-dom";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
//import Paper from '@material-ui/core/Paper';
//import InputBase from '@material-ui/core/InputBase';
//import Fab from '@material-ui/core/Fab';
//import SearchIcon from '@material-ui/icons/Search';
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
//import MatContainer from "../../components/MaterialUi/MatContainer";
// import PageHeading from "../../components/PageHeading";
import PageMultipleHeading from "../../components/PageMultipleHeading";
import ManageSubmodule from "../../components/ManageSubmodule";
import Search from "../../components/Search";
//import MatInputField from "../../components/MaterialUi/MatInputField";
//import LeftDrawer from "./LeftDrawer";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
import { fetchMasterComponentByModule } from "../../actions/MasterSubmoduleActions";
// import { fetchMasterControl } from "../../actions/ControlActions";
import { fetchMasterTableByModule } from "../../actions/MasterTableActions";
import { fetchControlPropertyList } from "../../actions/MasterMessageActions";
import { fetchOOBSubmodulesByOOBModuleId } from "../../actions/OOBSubmoduleActions";
import SubmoduleList from "./SubmoduleList";
import ControlList from "./ControlList";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  RESET_SUBMODULE,
  LIST_PAGE_SIZE,
} from "../../utils/AppConstants";
import { ADD_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import {
  handleSubmoduleDetailsError,
  NO_RECORDS_MESSAGE,
} from "../../utils/Messages";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  filterDropdown: {
    display: "flex",
    paddingRight: "10px",
    minWidth: "300px",
  },
  searchInput: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 300,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  search: {
    width: "30px",
    height: "30px",
    position: "fixed",
    marginLeft: "18%",
    marginTop: "6px",
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
  setWidth: {
    minWidth: "750px",
  },
}));

const SubmoduleDetails = (props) => {
  const [open, setOpen] = React.useState(false);
  //const history = useHistory();
  const dispatch = useDispatch();
  //const { url } = useRouteMatch();
  const { moduleId, oobModuleId, versionId } = useParams();
  const styles = useStyles();
  //const [label, setLabel] = useState("");
  const [editable, setEditable] = useState(false);
  const [searchText, setSearchText] = useState("");
  const featuresAssigned = useSelector((state) => state.User.features);
  const totalElements = useSelector(
    (state) => state.OOBSubmodule.getSubmodules.totalElements
  );
  const startIndex = useSelector((state) => state.OOBSubmodule.page.startIndex || 0);
  const pageSize = useSelector((state) => state.OOBSubmodule.page.pageSize);
  const getApiError = useSelector((state) => state.OOBSubmodule.getError);
  const [apiError, setApiError] = useState(null);
  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const isSubmoduleAdded = useSelector(
    (state) => state.OOBSubmodule.isSubmoduleAdded
  );
  const isSubmoduleDeleted = useSelector(
    (state) => state.OOBSubmodule.isSubmoduleDeleted
  );
  const OOBSubmoduleList = useSelector(
    (state) => state.OOBSubmodule.getSubmodules.data
  );

  //const OOBModule = useSelector((state) => state.OOBModule.OOBModuleDetailsList.data.filter(obj => obj.module.id === parseInt(moduleId)));
  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchOOBSubmodulesByOOBModuleId(
          moduleId,
          versionId,
          DEFAULT_START_INDEX,
          pageSize
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchOOBSubmodulesByOOBModuleId(
          moduleId,
          versionId,
          DEFAULT_START_INDEX,
          pageSize,
          searchText
        )
      );
    }
  };

  // useEffect(() => {
  //   if (url.includes("/admin/global-config")) {
  //     //dispatch(fetchOOBModule("global"));
  //     setLabel("Global");
  //   } else {
  //     //dispatch(fetchOOBModule("oob"));
  //     setLabel("OOB");
  //   }
  //   //dispatch(fetchOOBSubmodulesByOOBModuleId(moduleId, versionId));
  // }, [url, label]);

  // useEffect(() => {
  //   return () => {
  //     dispatch({ type: RESET_SUBMODULE });
  //   };
  // }, []);

  useEffect(() => {
    if (OOBModuleById.versions) {
      let currentversion = OOBModuleById.versions.filter(
        (obj) => obj.version === versionId
      );
      setEditable(currentversion[0]?.oobModuleStatus === "DRAFT" ? true : false);
    }
  }, [OOBModuleById, versionId]);

  const openManageSubmoduleDialog = () => {
    // dispatch(fetchMasterSubmodule());
    // dispatch(fetchMasterControl());
    dispatch(fetchMasterTableByModule(moduleId));
    dispatch(fetchMasterComponentByModule(moduleId));
    setOpen(true);
  };

  const closeManageSubmoduleDialog = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (isSubmoduleAdded) {
      setSearchText("");
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchOOBSubmodulesByOOBModuleId(
          moduleId,
          versionId,
          DEFAULT_START_INDEX,
          pageSize
        )
      );
      closeManageSubmoduleDialog();
    }
  }, [
    dispatch,
    isSubmoduleAdded,
    moduleId,
    versionId,
    pageSize,
    closeManageSubmoduleDialog,
  ]);

  useEffect(() => {
    if (isSubmoduleDeleted) {
      if (
        startIndex + 1 === totalElements &&
        startIndex !== DEFAULT_START_INDEX
      )
        dispatch(
          fetchOOBSubmodulesByOOBModuleId(
            moduleId,
            versionId,
            startIndex - pageSize,
            pageSize,
            searchText
          )
        );
      else
        dispatch(
          fetchOOBSubmodulesByOOBModuleId(
            moduleId,
            versionId,
            startIndex,
            pageSize,
            searchText
          )
        );
    }
  }, [
    dispatch,
    isSubmoduleDeleted,
    moduleId,
    versionId,
    totalElements,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    if (getApiError) setApiError(handleSubmoduleDetailsError(getApiError));
    else setApiError(false);
  }, [getApiError]);

  useEffect(() => {
    dispatch(fetchControlPropertyList(moduleId, versionId));
  }, [dispatch, moduleId, versionId]);

  return (
    <>
      <div className={styles.setWidth}>
        {/* <PageHeading
        heading={OOBModuleById.module.moduleName + " Control Panel"}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search searchText={searchText} handleChange={handleChange} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />
            {editable && featuresAssigned.indexOf(ADD_ACTION_OOB_GLOBAL_CONFIG) !== -1 &&
              <Grid item style={{ display: "flex", alignItems: "center" }}>
                <MatButton onClick={openManageSubmoduleDialog}>
                  Add Component
                </MatButton>
              </Grid>}
          </Grid>
        }
      /> */}
        <PageMultipleHeading
          heading={OOBModuleById.module.moduleName}
          subHeading={"Control Panel"}
          action={
            <Grid container style={{ width: "auto" }}>
              <Search
                searchText={searchText}
                handleChange={handleChange}
                handleKeyPress={handleKeyPress}
                handleSearch={handleSearch}
              />
              {editable &&
                featuresAssigned.indexOf(ADD_ACTION_OOB_GLOBAL_CONFIG) !==
                -1 && (
                  <Grid item style={{ display: "flex", alignItems: "center" }}>
                    <MatButton onClick={openManageSubmoduleDialog}>
                      Add Component
                    </MatButton>
                  </Grid>
                )}
            </Grid>
          }
        />

        {apiError ? (
          <Grid item xs={12} className={styles.error}>
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
        ) : OOBSubmoduleList.length > 0 ? (
          <SubmoduleList editable={editable} searchText={searchText} />
        ) : (
          <MatCard>
            <CardContent className={styles.noDataCard}>
              <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
            </CardContent>
          </MatCard>
        )}
        <ControlList
          open={"OOB"}
          editable={
            !editable ||
            featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) === -1
          }
        />
        {open && (
          <ManageSubmodule
            oobModuleId={oobModuleId}
            heading={"Add New Component"}
            handleClose={closeManageSubmoduleDialog}
            open={open}
          />
        )}
      </div>
    </>
  );
};

export default SubmoduleDetails;
