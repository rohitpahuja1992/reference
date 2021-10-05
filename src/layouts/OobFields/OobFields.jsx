import React, { useState, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import BreadcrumbView from "../../components/BreadcrumbView";
import DeleteIcon from "@material-ui/icons/Delete";
import CommonMenu from "../../components/CommonMenu";
import AddOobField from "../../components/AddOobField";
// import UpdateOobField from "../../components/UpdateOobField";
import Search from "../../components/Search";

import Card from "@material-ui/core/Card";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
//import Chip from "@material-ui/core/Chip";
import {
  fetchOobComponent,
  // fetchOobComponentById,
  deleteOOBComponentById,
} from "../../actions/OobComponentActions";
import { fetchOOBSubmodulesById } from "../../actions/OOBSubmoduleActions";
import { fetchOOBModuleById } from "../../actions/OOBModuleActions";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  handleOobFieldsError,
  CONFIRM,
  NO_RECORDS_MESSAGE,
  // SELECT_STATUS,
  modulesLabel,
  // TERM_FIELD,
  // SEARCH,
  // SEARCH_FIELD_TYPE,
  // SELECT_SECTION,
  FIRST_ADD_MASTER,
  FieldTermMessage,
  VIEW_UPDATE_FIELD,
  VIEW_FIELD_DETAIL,
  VIEW_DETAILS,
} from "../../utils/Messages";
import {
  ADD_ACTION_OOB_GLOBAL_CONFIG,
  DELETE_ACTION_OOB_GLOBAL_CONFIG,
} from "../../utils/FeatureConstants";
import {
  SET_DEFAULT_STARTINDEX,
  RESET_DEFAULTVERSION,
  // RESET_ADD_OOB_CONTROL_IS_DONE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
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
  filterDropdown: {
    display: "flex",
    paddingRight: "10px",
    minWidth: "300px",
  },
  subMenuGrid: {
    position: "fixed",
  },
  searchFilter: {
    padding: "8px 8px 0px",
  },
  moreChip: {
    "& .MuiChip-label": {
      paddingLeft: "0px",
    },
  },
  col: {
    paddingRight: "10px",
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: theme.palette.primary.light,
  },
  cardHeadingSize: {
    fontSize: "16px",
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
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.warning.main,
  },
}));

const OobFields = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { moduleId, submoduleId, versionId, oobSubmoduleId, oobModuleId } =
    useParams();
  const { url } = useRouteMatch();
  // const [openUpdateOobField, setOpenUpdateOobField] = useState(false);

  const oobControlIdError = useSelector(
    (state) => state.OobComponent.data.error
  );
  const featuresAssigned = useSelector((state) => state.User.features);
  const oobSubmoduleError = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.error
  );

  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );

  // const oobDataDetailsById = useSelector(
  //   (state) => state.OobComponent.individual.details
  // );

  const [apiError, setApiError] = useState(null);

  const OobSubmoduleData = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.data
  );

  const submoduleData = OobSubmoduleData?.component
    ? OobSubmoduleData.component.componentName
    : OobSubmoduleData?.systemTable
      ? OobSubmoduleData.systemTable.tableLabel
      : "";

  const [columnData, setColumnData] = useState([]);
  const [fieldData, setFieldData] = useState([]);
  const [primaryColumn, setPrimaryColumn] = useState("");
  const isComponentDeleted = useSelector(
    (state) => state.OobComponent.data.isComponentDeleted
  );

  // const isComponentUpdated = useSelector(
  //   (state) => state.OobComponent.data.isComponentUpdated
  // );

  const totalElements = useSelector(
    (state) => state.OobComponent.data.totalElements
  );
  const oobSubmoduleId2 = useSelector(
    (state) => state.OobComponent.data.oobSubmoduleId || ""
  );

  const startIndex = useSelector((state) => state.OobComponent.page.startIndex || 0);
  const pageSize = useSelector((state) => state.OobComponent.page.pageSize || 10);
  const reset = useSelector((state) => state.OobComponent.reset);
  // const column = [
  //   { id: "section", label: "Section", width: "15%" },
  //   { id: "label", label: "Field Name", width: "15%" },
  //   { id: "fieldType", label: "Type of Field", width: "15%" },
  //   { id: "mandatory", label: "Mandatory", width: "10%" },
  //   { id: "disabled", label: "Disabled", width: "10%" },
  //   { id: "hidden", label: "Hidden", width: "10%" },
  // ];

  const OobComponentData = useSelector((state) =>
    state.OobComponent.data.list.map((data, index) => {
      let componentData = JSON.parse(data.mapField);
      componentData.rowid = data.id;
      return { ...componentData };
    })
  );

  const isComponentAdded = useSelector(
    (state) => state.OobComponent.data.isComponentAdded
  );

  OobComponentData?.sort((a, b) => b["View Order"] - a["View Order"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  // const [controlLabel, setControlLabel] = useState(null);
  // const [controlId, setControlId] = useState(null);
  const [editable, setEditable] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const [label, setLabel] = React.useState("");
  const [searchText, setSearchText] = useState("");
  // const [inputs, setInputs] = React.useState({
  //   searchBy: "",
  //   search: "",
  // });
  // const { searchBy, search } = inputs;

  // const openUpdateOobFieldDialog = (data) => {
  //   //setOpenUpdateOobField(true);
  //   dispatch(fetchOobComponentById(oobSubmoduleId, data.id));
  // };

  const handlePageChange = (start, size) => {
    dispatch(fetchOobComponent(oobSubmoduleId, start, size, searchText));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchOobComponent(oobSubmoduleId, DEFAULT_START_INDEX, pageSize)
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
        fetchOobComponent(
          oobSubmoduleId,
          DEFAULT_START_INDEX,
          pageSize,
          searchText.trim()
        )
      );
    }
  };

  const handleModuleBackButton = () => {
    history.push(`/admin/oob-config`);
    dispatch({ type: RESET_DEFAULTVERSION });
  };

  const handleSubmoduleBackButton = () => {
    history.push(
      `/admin/oob-config/components/${moduleId}/${oobModuleId}/${versionId}`
    );
  };

  useEffect(() => {
    if (OOBModuleById && OOBModuleById.versions) {
      let currentversion = OOBModuleById.versions.filter(
        (obj) => obj.version === versionId
      );
      setEditable(currentversion[0].oobModuleStatus === "DRAFT" ? true : false);
    }
  }, [OOBModuleById, versionId]);

  useEffect(() => {
    OobComponentData?.sort((a, b) => b["View Order"] - a["View Order"]);
  }, [isComponentAdded]);

  const BreadcrumbData = [
    {
      id: "modules",
      label: modulesLabel(label),
      action: handleModuleBackButton,
    },
    {
      id: "submodules",
      label:
        OOBModuleById &&
        OOBModuleById.module &&
        OOBModuleById.module.moduleName + " (" + versionId + ")",
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData,
    },
  ];

  const tableConfig = {
    tableType: "",
    selectAction: editable,
    paginationOption: "custom",
    menuOptions: editable &&
      featuresAssigned.indexOf(DELETE_ACTION_OOB_GLOBAL_CONFIG) !== -1 && [
        {
          type: "link",
          icon:
            featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) === -1 ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <RateReviewIcon fontSize="small" />
            ),
          label:
            featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) === -1
              ? VIEW_FIELD_DETAIL
              : editable
                ? VIEW_UPDATE_FIELD
                : VIEW_DETAILS,
          action: (data) => {
            //let primary = primaryColumn !== "" ? data[primaryColumn]?.replace('/', '').replace("#", "hash") : data.mapObject.columnName.replace('/', '').replace("#", "hash");

            history.push(
              `/admin/oob-config/field-details/${moduleId}/${oobModuleId}/${versionId}/${submoduleId}/${oobSubmoduleId}/${data.rowid}`
            );
          },
        },
        {
          type: "link",
          icon: <DeleteIcon fontSize="small" />,
          label: "Delete",
          action: (e) => {
            openConfirmDeleteDialog(e);
          },
        },
      ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_OOB_GLOBAL_CONFIG) ===
      -1 && {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: VIEW_UPDATE_FIELD,
      action: (data) => {
        history.push(
          `/admin/oob-config/field-details/${moduleId}/${oobModuleId}/${versionId}/${submoduleId}/${oobSubmoduleId}/${data.rowid}`
        );
      },
    },
    // menuOptions: featuresAssigned.indexOf(DELETE_ACTION_OOB_GLOBAL_CONFIG) !==
    //   -1 && [
    //   {
    //     type: "link",
    //     icon:
    //       featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !== -1 ? (
    //         <RateReviewIcon fontSize="small" />
    //       ) : (
    //         <VisibilityIcon fontSize="small" />
    //       ),
    //     label:
    //       featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !== -1
    //         ? VIEW_UPDATE_FIELD
    //         : VIEW_FIELD_DETAIL,
    //     action: (data) => {
    //       history.push(
    //         `/admin/oob-config/field-details/${moduleId}/${oobModuleId}/${versionId}/${submoduleId}/${oobSubmoduleId}/${data.id}/${data[primaryColumn]}`
    //       );
    //     },
    //   },
    //   {
    //     type: "link",
    //     icon: <DeleteIcon fontSize="small" />,
    //     label: "Delete",
    //     display: "Hide",
    //     action: (e) => {
    //       openConfirmDeleteDialog(e);
    //     },
    //   },
    // ],
    // actions: {
    //   icon: "",
    //   action: (data) => {
    //   },
    // },
  };

  const openConfirmDeleteDialog = (e) => {
    //let columns = getTableCol();
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        //dispatch(deleteOOBComponentById(e.id, e.label ? e.label : e[columnData[0].id]));
        dispatch(deleteOOBComponentById(e.rowid, e.rowid));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: FieldTermMessage(
        primaryColumn && primaryColumn,
        e[primaryColumn]
      ),
    };
    dispatch(showMessageDialog(messageObj));
  };

  // const statusList = [
  //   { id: "ACTIVE", value: "ACTIVE" },
  //   { id: "INACTIVE", value: "INACTIVE" },
  //   { id: "TERMINATED", value: "TERMINATED" },
  // ];
  // const searchFieldLabel = {
  //   "": SEARCH,
  //   // fieldName: "Search by field name...",
  //   fieldType: SEARCH_FIELD_TYPE,
  //   section: SELECT_SECTION,
  //   // parentSection: "Select Parent Section",
  //   status: SELECT_STATUS,
  // };

  // const handleNewControl = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleCloseControl = () => {
    setAnchorEl(null);
  };

  // const openDynamicFormDialog = (label, id) => {
  //   dispatch({ type: RESET_ADD_OOB_CONTROL_IS_DONE });
  //   setControlLabel(label);
  //   setControlId(id);
  //   setOpen(true);
  // };

  const handleAddNewField = () => {
    setOpen(true);
  };

  const closeAddOobFieldDialog = () => {
    setOpen(false);
  };

  // let handleSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "searchBy" && value === "fieldName") {
  //     setInputs((inputs) => ({ ...inputs, search: "" }));
  //   }
  //   if (name === "searchBy" && value !== "fieldName") {
  //     setInputs((inputs) => ({ ...inputs, search: "All" }));
  //   }
  //   if (name === "search" && !searchBy) {
  //     setInputs((inputs) => ({ ...inputs, searchBy: "fieldName" }));
  //   }
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // };

  const controlList = useSelector((state) =>
    state.Control.data.list.filter((control) => {
      return false;
    })
  );

  const controlMenuOptions =
    controlList.length > 0
      ? controlList
        .sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        )
        .map((control) => {
          return {
            type: "link",
            icon: "",
            label: control.name,
            // action: () => {
            //   openDynamicFormDialog(control.name, control.id);
            // },
          };
        })
      : [
        {
          type: "label",
          icon: "",
          label: FIRST_ADD_MASTER,
        },
      ];

  // const closeUpdateOobFieldDialog = useCallback(() => {
  //   setOpenUpdateOobField(false);
  //   //dispatch(resetDuplicateError());
  // }, []);

  useEffect(() => {
    setLabel("OOB");
    //dispatch(fetchMasterControl());
    dispatch(
      fetchOobComponent(oobSubmoduleId, oobSubmoduleId2 === oobSubmoduleId ? startIndex : DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE)
    );
    dispatch(fetchOOBSubmodulesById(oobSubmoduleId));
    dispatch(fetchOOBModuleById(moduleId));
  }, [dispatch, url, moduleId, oobModuleId, submoduleId, oobSubmoduleId]);

  useEffect(() => {
    if (isComponentDeleted) {
      //dispatch(fetchMasterControl());
      if (
        startIndex + 1 === totalElements &&
        startIndex !== DEFAULT_START_INDEX
      )
        dispatch(
          fetchOobComponent(
            oobSubmoduleId,
            startIndex - pageSize,
            pageSize,
            searchText
          )
        );
      else
        dispatch(
          fetchOobComponent(oobSubmoduleId, startIndex, pageSize, searchText)
        );
      dispatch(fetchOOBSubmodulesById(oobSubmoduleId));
      dispatch(fetchOOBModuleById(moduleId));
    }
  }, [
    dispatch,
    url,
    totalElements,
    startIndex,
    pageSize,
    searchText,
    submoduleId,
    moduleId,
    oobModuleId,
    oobSubmoduleId,
    isComponentDeleted,
  ]);

  // useEffect(() => {
  //   if (oobDataDetailsById?.fieldId) {
  //     setOpenUpdateOobField(true);
  //   }
  // }, [oobDataDetailsById]);

  useEffect(() => {
    if (oobControlIdError || oobSubmoduleError)
      setApiError(handleOobFieldsError(oobControlIdError, oobSubmoduleError));
    else setApiError(false);
  }, [oobControlIdError, oobSubmoduleError]);

  useEffect(() => {
    let data = [],
      cols = [];
    const mapFieldData = OobSubmoduleData?.component
      ? OobSubmoduleData.component.mapField
      : OobSubmoduleData?.systemTable
        ? OobSubmoduleData.systemTable.mapField
        : [];

    if (OobSubmoduleData?.component) {
      data = JSON.parse(mapFieldData).filter((item) => item.visibility);
      let primary = data.find((item) => item.primary === true);
      setPrimaryColumn(primary?.label);
      cols = data.map((item) => {
        return {
          id: item.label,
          label: item.label,
          fieldType: item.fieldType,
          primary: item.primary,
        };
      });

      if (cols.length > 0) {
        setColumnData(cols);
      }
      if (data.length > 0) {
        setFieldData(data);
      }
    }

    if (OobSubmoduleData?.systemTable) {
      data = JSON.parse(mapFieldData);
      let primary = data.find((item) => item.mapReference === true);
      setPrimaryColumn(primary?.mapObject?.columnName);
      cols = data.map((item) => {
        return {
          id: item?.mapObject?.columnName,
          label: item?.mapLable,
          fieldType: item?.fieldType,
          primary: item.mapReference,
        };
      });

      if (cols.length > 0) {
        setColumnData(cols);
      }
      if (data.length > 0) {
        setFieldData(data);
      }
    }
  }, [OobSubmoduleData]);
  var column = columnData?.map((a) => a.label);
  OobComponentData?.reverse()?.map((item, i) =>
    column.map((col) =>
      Object.keys(item).indexOf(col) === -1
        ? (OobComponentData[i][col] = "")
        : null
    )
  );
  console.log("OobComponentData", OobComponentData);
  // useEffect(() => {
  //   if (isComponentUpdated) {
  //     dispatch(
  //       fetchOobComponent(oobSubmoduleId, startIndex, pageSize, searchText)
  //     );
  //     closeUpdateOobFieldDialog();
  //   }
  // }, [
  //   dispatch,
  //   isComponentUpdated,
  //   closeUpdateOobFieldDialog,
  //   oobSubmoduleId,
  //   startIndex,
  //   pageSize,
  //   searchText,
  // ]);

  return (
    <MatContainer>
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
      ) : (
        <>
          <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
          <PageHeading
            heading={submoduleData}
            action={
              <Grid container style={{ width: "auto" }}>
                <Search
                  searchText={searchText}
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  handleSearch={handleSearch}
                />
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  {editable &&
                    columnData.length > 0 &&
                    featuresAssigned.indexOf(ADD_ACTION_OOB_GLOBAL_CONFIG) !==
                    -1 && (
                      <MatButton onClick={handleAddNewField}>Add New</MatButton>
                    )}
                </Grid>
              </Grid>
            }
          />
          {OobComponentData.length > 0 && columnData.length > 0 ? (
            <MatCard
              style={{
                width:
                  window.innerWidth > 1230
                    ? window.innerWidth - 170
                    : window.innerWidth,
              }}
            >
              <DataTable
                cols={columnData}
                rows={OobComponentData}
                config={tableConfig}
                totalElements={totalElements}
                startIndex={startIndex}
                handleNextPage={handlePageChange}
              />
            </MatCard>
          ) : (
            <MatCard>
              <CardContent className={styles.noDataCard}>
                <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
              </CardContent>
            </MatCard>
          )}
          {open && (
            <AddOobField
              open={open}
              colData={fieldData}
              handleClose={closeAddOobFieldDialog}
            />
          )}

          {/* {openUpdateOobField && (
            <UpdateOobField
              colData={fieldData}
              handleClose={closeUpdateOobFieldDialog}
              open={openUpdateOobField}
            />
          )} */}

          <CommonMenu
            anchorEl={anchorEl}
            open={isMenuOpen}
            activeRow={null}
            onClose={handleCloseControl}
            options={controlMenuOptions}
          />
        </>
      )}
    </MatContainer>
  );
};

export default OobFields;
