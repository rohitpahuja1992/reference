import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

import RateReviewIcon from "@material-ui/icons/RateReview";
import DeleteIcon from "@material-ui/icons/Delete";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatInputField from "../../components/MaterialUi/MatInputField";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import AddMasterSection from "../../components/ManageAppSettings/AddMasterSection";
import UpdateMasterSection from "../../components/ManageAppSettings/UpdateMasterSection";

import { MASTERSECTION_API_URL } from "../../utils/AppConstants";
import {
  resetDuplicateError,
  fetchSectionById,
  deleteMasterSection,
} from "../../actions/MasterSectionActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { formatDate } from "../../utils/helpers";
import {
  fetchListByPage,
  resetTablePagination,
} from "../../actions/PaginationActions";
import {
  CONFIRM,
  NO_RECORDS_MESSAGE,
  termSectionMessage,
  SEARCH,
  SEARCH_BY_CREATED,
  SEARCH_BY_SECTION,
  TERM_SECTION,
  VIEW_UPDATE_SECTION,
  COMMON_ERROR_MESSAGE,
  ADD_NEW_SEC,
  SEARCH_FILTER,
  MASTER_SEC,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
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
  filterDropdown: {
    paddingRight: "10px",
    minWidth: "200px",
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
}));

// function createData(sectionName, updatedBy, updatedOn, status, statusDialog, description) {
//   return { sectionName, updatedBy, updatedOn, status, statusDialog, description };
// }

// const rows = [
//   createData(
//     "Good Cause Extension",
//     "Chay Levell",
//     "07/13/2020 11:45",
//     "ACTIVE",
//     "ACTIVE",
//     "Good Cause Section"
//   ),
//   createData("Intake", "Maria Fajardo", "07/13/2020 11:45", "ACTIVE", "ACTIVE", "Intake section"),
//   createData(
//     "Expedited Criteria",
//     "Maggie Cajka",
//     "07/13/2020 11:45",
//     "INACTIVE",
//     "INACTIVE",
//     "Expedited Section"
//   ),
// ];

const cols = [
  { id: "sectionName", label: "Section Name" },
  //{ id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created On" },
];

const searchFilter = [
  { id: "sectionName", label: "Section Name" },
  { id: "createdBy", label: "Created By" },
];

const MasterSection = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateSection, setOpenUpdateSection] = useState(false);
  //const [selectedData, setSelectedData] = useState({});
  const getApiError = useSelector((state) => state.Pagination.getError);
  const isSectionAdded = useSelector(
    (state) => state.MasterSection.isSectionAdded
  );
  const isSectionUpdated = useSelector(
    (state) => state.MasterSection.isSectionUpdated
  );
  const isSectionDeleted = useSelector(
    (state) => state.MasterSection.isSectionDeleted
  );
  const sectionDetailsById = useSelector(
    (state) => state.MasterSection.sectionDetailsById.data
  );
  const startIndex = useSelector((state) => state.Pagination.page.startIndex);
  const pageSize = useSelector((state) => state.Pagination.page.pageSize);
  const [inputs, setInputs] = React.useState({
    searchBy: "",
    search: "",
  });
  const { searchBy, search } = inputs;

  const searchFieldLabel = {
    "": SEARCH,
    sectionName: SEARCH_BY_SECTION,
    createdBy: SEARCH_BY_CREATED,
  };

  const sectionDetailsList = useSelector((state) =>
    state.Pagination.DetailsList.list
      .filter((data) => {
        if (!searchBy || !search || search === "All") return data;

        if (searchBy && search) {
          let filterData = {
            sectionName: data.name,
            createdBy: data.createdByUser,
            //searchstatus: data.deleted ? "TERMINATED" : data.status,
            //!(data.deleted) ? data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' : 'TERMINATED',
            ...data,
          };
          if (
            filterData[searchBy] &&
            filterData[searchBy].toLowerCase().includes(search.toLowerCase())
          ) {
            return data;
          }
        }

        return false;
      })
      .map((data) => {
        let blankData = {
          id: data.id,
          sectionName: data.name,
          description: data.description,
          createdBy: data.createdByUser,
          createdAt: formatDate(data.createdDate),
        };
        return { ...data, ...blankData };
      })
  );

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: <RateReviewIcon fontSize="small" />,
        label: VIEW_UPDATE_SECTION,
        action: (e) => openUpdateSectionDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: TERM_SECTION,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
  };

  const openUpdateSectionDialog = (data) => {
    dispatch(fetchSectionById(data.id));
  };

  const closeUpdateSectionDialog = useCallback(() => {
    setOpenUpdateSection(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  const openAddMasterSectionFormDialog = () => {
    setOpen(true);
  };

  const closeAddMasterSectionFormDialog = useCallback(() => {
    setOpen(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  let handleSearch = (e) => {
    const { name, value } = e.target;
    if (
      name === "searchBy" &&
      value === "sectionName" &&
      value === "createdBy"
    ) {
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    // if (name === "searchBy" && value !== "sectionName") {
    //   setInputs((inputs) => ({ ...inputs, search: "All" }));
    // }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "sectionName" }));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterSection(e.id, e.sectionName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: termSectionMessage(e.sectionName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  useEffect(() => {
    dispatch(fetchListByPage(MASTERSECTION_API_URL, 0, pageSize, "sections"));
  }, [dispatch, pageSize]);

  useEffect(() => {
    if (Object.keys(sectionDetailsById).length !== 0) {
      setOpenUpdateSection(true);
    }
  }, [dispatch, sectionDetailsById]);

  useEffect(() => {
    if (isSectionAdded) {
      dispatch(fetchListByPage(MASTERSECTION_API_URL, 0, pageSize, "sections"));
      dispatch(resetTablePagination(true));
      closeAddMasterSectionFormDialog();
    }
  }, [dispatch, isSectionAdded, closeAddMasterSectionFormDialog, pageSize]);

  useEffect(() => {
    if (isSectionUpdated) {
      dispatch(
        fetchListByPage(MASTERSECTION_API_URL, startIndex, pageSize, "sections")
      );
      closeUpdateSectionDialog();
    }
  }, [
    dispatch,
    isSectionUpdated,
    closeUpdateSectionDialog,
    startIndex,
    pageSize,
  ]);

  useEffect(() => {
    if (isSectionDeleted) {
      dispatch(
        fetchListByPage(MASTERSECTION_API_URL, startIndex, pageSize, "sections")
      );
      dispatch(resetDuplicateError());
    }
  }, [dispatch, isSectionDeleted, startIndex, pageSize]);

  return (
    <>
      <PageHeading
        heading={MASTER_SEC}
        action={
          <Grid container style={{ width: "auto" }}>
            <Grid item className={styles.filterDropdown}>
              <MatInputField
                select
                onChange={handleSearch}
                label={SEARCH_FILTER}
                name="searchBy"
                value={searchBy}
              >
                {searchFilter.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </MatInputField>
            </Grid>
            {(!searchBy ||
              searchBy === "sectionName" ||
              searchBy === "createdBy") && (
                <Grid item className={styles.col}>
                  <MatInputField
                    value={search}
                    label={searchFieldLabel[searchBy]}
                    onChange={handleSearch}
                    name="search"
                  />
                </Grid>
              )}
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openAddMasterSectionFormDialog}>
                {ADD_NEW_SEC}
              </MatButton>
            </Grid>
          </Grid>
        }
      />
      {getApiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={styles.errorCard}>
            <Typography variant="body2">
              {COMMON_ERROR_MESSAGE}
            </Typography>
          </Card>
        </Grid>
      ) : sectionDetailsList.length ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={sectionDetailsList}
            config={tableConfig}
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
        <AddMasterSection
          handleClose={closeAddMasterSectionFormDialog}
          open={open}
        />
      )}
      {openUpdateSection && (
        <UpdateMasterSection
          handleClose={closeUpdateSectionDialog}
          open={openUpdateSection}
        />
      )}
    </>
  );
};

export default MasterSection;
