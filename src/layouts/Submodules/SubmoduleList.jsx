import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MatCard from "../../components/MaterialUi/MatCard";
import ListTable from "../../components/ListTable";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";

//import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { deleteOOBSubmodule } from "../../actions/OOBSubmoduleActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { fetchOOBSubmodulesByOOBModuleId } from "../../actions/OOBSubmoduleActions";
import { DELETE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import DeleteIcon from "@material-ui/icons/Delete";
import { useParams } from "react-router-dom";
import { CONFIRM, termSubmoduleMessage } from "../../utils/Messages";
import { fetchOOBSubmodulesById } from "../../actions/OOBSubmoduleActions";

// const cols = [
//   { id: "submoduleName", label: "Component Name", minWidth: 250 },
//   { id: "controlCount", label: "Number of Fields", minWidth: 200 },
//   // { id: "controlCount", label: "Number of Section", minWidth: 200 },
// ];

const useStyles = makeStyles((theme) => ({
  noneBackground: {
    background: "none"
  }
}));


const SubmoduleList = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  //const { openFrom } = props;
  const { moduleId, oobModuleId, versionId } = useParams();

  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const startIndex = useSelector((state) => state.OOBSubmodule.page.startIndex || 0);
  //const pageSize = useSelector((state) => state.OOBSubmodule.page.pageSize);
  const reset = useSelector((state) => state.OOBSubmodule.reset);
  const OOBSubmoduleList = useSelector((state) =>
    state.OOBSubmodule.getSubmodules.data.map((data) => {
      data.versions.sort((a, b) => (a.version < b.version ? 1 : -1));
      let OOBSubmoduleData = {
        oobSubmoduleId: data.versions.length > 0 && data.versions[0].id,
        submoduleId: data?.component ? data?.component.id : data?.systemTable.id,
        submoduleName: data?.component ? data?.component.componentName : data?.systemTable.tableLabel,
        controlType: 0,
        //editable: props.editable,
        //data.versions.length > 0 && data.versions[0].version,
        controlCount: data.oobControlDataCount,
      };
      return { ...OOBSubmoduleData };
    })
  );

  const handlePageChange = (start, size) => {
    //console.log("Label,start,size", label, start, size);
    dispatch(fetchOOBSubmodulesByOOBModuleId(moduleId, versionId, start, size, props.searchText));
  }

  const viewControls = (submodule) => {
    //if (openFrom === "Global") {
    //   history.push(
    //     `/admin/global-config/fields/${moduleId}/${oobModuleId}/${versionId}/${submodule.submoduleId}/${submodule.oobSubmoduleId}`
    //   );
    // } else {
    dispatch(fetchOOBSubmodulesById(submodule.oobSubmoduleId));
    history.push(
      `/admin/oob-config/fields/${moduleId}/${oobModuleId}/${versionId}/${submodule.submoduleId}/${submodule.oobSubmoduleId}`
    );
    //}
  };

  const tableConfig = {
    tableType: "",
    selectAction: props.editable,
    paginationOption: "custom",
    menuOptions: featuresAssigned.indexOf(DELETE_ACTION_OOB_GLOBAL_CONFIG) !== -1 && [
      {
        type: "link",
        icon: <VisibilityIcon fontSize="small" />,
        label: "View Fields",
        action: viewControls,
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: "Term Component",
        display: "Hide",
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: {
      icon: <MoreVertIcon color="primary" fontSize="small" />,
      tooltipText: "View Fields",
      action: viewControls,
    },
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteOOBSubmodule(e.oobSubmoduleId, e.submoduleName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message:
        termSubmoduleMessage(e.submoduleName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  return (
    <MatCard className={styles.noneBackground}>
      {/* <ListTable
        cols={cols}
        rows={OOBSubmoduleList}
        config={tableConfig}
        resetPagination={reset}
        totalElements={totalElements}
        startIndex={startIndex}
        handleNextPage={handlePageChange} /> */}
      <ListTable data={OOBSubmoduleList} config={tableConfig} />
    </MatCard>
  );
};

export default SubmoduleList;
