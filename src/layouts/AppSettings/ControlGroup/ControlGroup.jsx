import React, { useEffect } from "react";
//import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import MatCard from "../../../components/MaterialUi/MatCard";
import MatButton from "../../../components/MaterialUi/MatButton";
import PageHeading from "../../../components/PageHeading";
import DataTable from "../../../components/DataTable";
import CommonMenu from "../../../components/CommonMenu";
import AddControlFieldDialog from "../../../components/AddControlFieldDialog";

//import RateReviewIcon from "@material-ui/icons/RateReview";
import DeleteIcon from "@material-ui/icons/Delete";

import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import {
  deleteControlField,
  fetchMasterControlById,
} from "../../../actions/ControlActions";

import {
  RESET_ADD_MASTER_CONTROL_FIELD_IS_DONE,
  RESET_ADD_MASTER_CONTROL_FIELD_ERROR,
} from "../../../utils/AppConstants";
import { ADD_ACTION_APP_SETTINGS, DELETE_ACTION_APP_SETTINGS } from "../../../utils/FeatureConstants";
import { showMessageDialog } from "../../../actions/MessageDialogActions";
import {
  CONFIRM,
  NO_RECORDS_MESSAGE,
  WARNIG,
  defaultPropertyCantDelete,
  deletePropertyMessage,
  TERM_PROP,
} from "../../../utils/Messages";

const cols = [
  { id: "fieldLabel", label: "Control Property" },
  // { id: "internalName", label: "Internal Name" },
  { id: "fieldType", label: "Property Type" },
  { id: "isFieldRequired", label: "Required" },
];

const useStyles = makeStyles((theme) => ({
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

const ControlGroup = (props) => {
  const styles = useStyles();
  const { controlId } = useParams();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fieldType, setFieldType] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  //const history = useHistory();
  const activeControl = useSelector(
    (state) => state.Control.individual.details
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const fieldList = activeControl
    ? activeControl.format.map((data) => {
      // let propertyData = {
      //   selectAction: !data.isDefaultGenerated,
      // };
      return {
        ...data,
        // ...propertyData
      };
    })
    : [];
  const isPropertyDeleted = useSelector(
    (state) => state.Control.data.isPropertyDeleted
  );

  const handleNewField = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseField = () => {
    setAnchorEl(null);
  };

  const openAddFieldDialog = (fieldType) => {
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_ERROR });
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_IS_DONE });
    setFieldType(fieldType);
    setOpen(true);
  };

  const closeAddFieldDialog = () => {
    setOpen(false);
  };

  const deleteControlProperty = (internalName, propertyName, controlName) => {
    let formControl = { ...activeControl };
    formControl.format = formControl.format.filter(
      (property) => property.internalName !== internalName
    );
    // dispatch(deleteMasterSubmodule(e.id, e.submoduleName));
    dispatch(deleteControlField(formControl, propertyName, controlName));
  };

  const openDeleteWarningDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "OK",
      primaryButtonAction: () => { },
      secondaryButtonLabel: "",
      secondaryButtonAction: () => {},
      title: WARNIG,
      message: defaultPropertyCantDelete(e.fieldLabel),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () =>
        deleteControlProperty(e.internalName, e.fieldLabel, activeControl.name),
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: deletePropertyMessage(e.fieldLabel),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const tableConfig = {
    tableType: "",
    // actions: {
    //   icon: <RateReviewIcon color="primary" />,
    //   tooltipText: "View & Add Fields",
    //   action: (data) => {
    //     // history.push(`/admin/app-setting/control-details`);
    //   },
    // },
    selectAction: true,
    // menuOptions: [
    // {
    //   type: "link",
    //   icon: <RateReviewIcon fontSize="small" />,
    //   label: "View & Update Property",
    //   action: (e) => {},
    // },
    // {
    //   type: "link",
    //   icon: <DeleteIcon fontSize="small" />,
    //   label: "Term Property",
    //   display: "Hide",
    //   action: (e) => openConfirmDeleteDialog(e),
    // },
    // ],
    // actions: {
    //   icon: <RateReviewIcon color="primary" fontSize="small" />,
    //   label: "View & Update Property",
    //   action: (e) => {},
    // },
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) !== -1 && {
      icon: <DeleteIcon fontSize="small" color="primary" />,
      tooltipText: TERM_PROP,
      action: (e) => {
        if (e.isDefaultGenerated) {
          openDeleteWarningDialog(e);
        } else {
          openConfirmDeleteDialog(e);
        }
      },
    },
  };

  const controlMenuOptions = [
    {
      type: "link",
      icon: "",
      label: "Textbox",
      action: () => openAddFieldDialog("textbox"),
    },
    {
      type: "link",
      icon: "",
      label: "Textarea",
      action: () => openAddFieldDialog("textarea"),
    },
    {
      type: "link",
      icon: "",
      label: "Select",
      action: () => openAddFieldDialog("select"),
    },
    {
      type: "link",
      icon: "",
      label: "Option List",
      action: () => openAddFieldDialog("option"),
    },
    // {
    //   type: "link",
    //   icon: "",
    //   label: "System Generated Text",
    //   action: () => openAddFieldDialog("systemGeneratedText"),
    // },
  ];

  useEffect(() => {
    dispatch(fetchMasterControlById(controlId));
  }, [dispatch, controlId]);

  useEffect(() => {
    if (isPropertyDeleted) {
      dispatch(fetchMasterControlById(controlId));
    }
  }, [dispatch, controlId, isPropertyDeleted]);

  return (
    <>
      <PageHeading
        heading={activeControl && activeControl.name + " Control"}
        action={
          featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 &&
          <MatButton onClick={handleNewField}>Add New Property</MatButton>
        }
      />
      {fieldList.length > 0 ? (
        <MatCard>
          <DataTable cols={cols} rows={fieldList} config={tableConfig} />
        </MatCard>
      ) : (
          <MatCard>
            <CardContent className={styles.noDataCard}>
              <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
            </CardContent>
          </MatCard>
        )}
      <AddControlFieldDialog
        formType={fieldType}
        handleClose={closeAddFieldDialog}
        open={open}
      />
      <CommonMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        activeRow={null}
        onClose={handleCloseField}
        options={controlMenuOptions}
      />
    </>
  );
};

export default ControlGroup;
