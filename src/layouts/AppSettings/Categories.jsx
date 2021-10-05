import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import PageHeading from "../../components/PageHeading";
import AddCategory from "../../components/ManageAppSettings/AddCategory";
import DeleteIcon from "@material-ui/icons/Delete";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  resetDuplicateError,
  deleteCategories,
  fetchCategories,
} from "../../actions/CategoriesActions";
import { formatDate } from "../../utils/helpers";
import {
  CONFIRM,
  NO_RECORDS_MESSAGE,
  TERM_CATEGORY,
  termCategoryMessage,
  ADD_NEW_CATEGORY,
  COMMON_ERROR_MESSAGE,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  grow: {
    flexGrow: 1,
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

const cols = [
  { id: "id", label: "ID" },
  { id: "categoryName", label: "Categories Name" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created Date", minWidth: 120 },
];

const Categories = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const getApiError = useSelector((state) => state.Categories.getError);
  const isCategoryDeleted = useSelector(
    (state) => state.Categories.isCategoryDeleted
  );
  const isCategoryAdded = useSelector(
    (state) => state.Categories.isCategoryAdded
  );
  const categoriesDetailsList = useSelector((state) =>
    state.Categories.categoriesDetailsList.list.map((data) => {
      let categoriesData = {
        id: data.id,
        categoryName: data.categoryName,
        createdBy: data.createdByUser,
        createdAt: formatDate(data.createdDate),
        updatedBy: data.updatedByUser,
        updatedAt: formatDate(data.updatedDate),
        deleted: data.deleted,
      };
      return { ...categoriesData };
    })
  );

  const tableConfig = {
    tableType: "",
    actions: {
      icon: <DeleteIcon fontSize="small" />,
      tooltipText: TERM_CATEGORY,
      action: (e) => {
        openConfirmDeleteDialog(e);
      },
    },
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteCategories(e.id, e.categoryName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: termCategoryMessage(e.categoryName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openAddCategoryDialog = () => {
    setOpen(true);
  };

  const closeAddCategoryDialog = useCallback(() => {
    dispatch(resetDuplicateError());
    setOpen(false);
  }, [dispatch]);

  useEffect(() => {
    if (isCategoryAdded) {
      dispatch(fetchCategories());
      closeAddCategoryDialog();
    }
  }, [dispatch, isCategoryAdded, closeAddCategoryDialog]);

  useEffect(() => {
    if (isCategoryDeleted) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isCategoryDeleted]);

  return (
    <>
      <PageHeading
        heading="Categories"
        action={
          <MatButton onClick={openAddCategoryDialog}>
            {ADD_NEW_CATEGORY}
          </MatButton>
        }
      />
      {getApiError ? (
        <Grid item xs={12} className={styles.col}>
          <Card className={styles.errorCard}>
            <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
          </Card>
        </Grid>
      ) : categoriesDetailsList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={categoriesDetailsList}
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
      <AddCategory handleClose={closeAddCategoryDialog} open={open} />
    </>
  );
};

export default Categories;
