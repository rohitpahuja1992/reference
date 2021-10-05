import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReviewIcon from "@material-ui/icons/RateReview";
//import { useParams } from "react-router-dom";
import UpdateVersionLabel from "./UpdateVersionLabel";
import { formatDate } from "../../utils/helpers";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
import { fetchOOBModuleById } from "../../actions/OOBModuleActions";
const cols = [
  { id: "versionName", label: "Version", minWidth: 200 },
  { id: "createdBy", label: "Created By", minWidth: 200 },
  { id: "createdDate", label: "Created On", minWidth: 200 },
  //{ id: "type", label: "Type" },
];

const VersionList = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  //const { url } = useRouteMatch();
  const localPath = "/admin/oob-config";
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const list = props.data.sort((a, b) => (a.version < b.version ? 1 : -1));
  const versionList = list
    .sort((a, b) =>
      new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
    )
    .map((data) => {
      let versionData = {
        id: data.id,
        versionName:
          data.oobModuleStatus === "DRAFT"
            ? data.version + " - " + data.oobModuleStatus
            : data.version,
        version: data.version,
        createdDate: formatDate(data.createdDate),
        createdBy: data.createdByUser,
        sectionCount: 0,
        type: data.oobModuleStatus,
        selectAction: data.oobModuleStatus === "DRAFT" ? false : true,
      };
      return { ...versionData };
    });
    const totalElements = useSelector(
      (state) => state.OOBModule.OOBModuleById.totalElements
    );
  const startIndex = useSelector((state) => state.OOBModule.OOBModuleById.startIndex || 0);
  const pageSize = useSelector((state) => state.OOBModule.OOBModuleById.pageSize);
  const reset = useSelector((state) => state.OOBModule.OOBModuleById.reset);
  
const handlePageChange = (start, size) => {
  dispatch(fetchOOBModuleById(props.moduleId, start, size));
};
  // useEffect(() => {
  //   // if (url.includes("/admin/global-config")) {
  //   //   setLocalPath("/admin/global-config");
  //   // }
  //   // if (url.includes("/admin/oob-config")) {
  //     setLocalPath("/admin/oob-config");
  //   //}
  // }, []);

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    selectAction: true,
    menuOptions: featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !== -1 && [
      {
        type: "link",
        icon: <VisibilityIcon fontSize="small" />,
        label: "View Components",
        action: (data) => {
          history.push(
            `${localPath}/components/${props.moduleId}/${data.id}/${data.version}`
          );
        },
      },
      {
        type: "link",
        icon: <RateReviewIcon fontSize="small" />,
        label: "Label Version",
        display: "Hide",
        action: (e) => {
          openConfirmLabelDialog(e);
        },
      },
    ],
    actions: {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View Components",
      action: (data) => {
        history.push(
          `${localPath}/components/${props.moduleId}/${data.id}/${data.version}`
        );
      },
    },
  };

  const openConfirmLabelDialog = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const closeConfirmLabelDialog = useCallback(() => {
    setSelectedData({});
    setOpen(false);
  }, []);

  return (
    <>
      <MatCard>
        <DataTable 
        cols={cols}
        rows={versionList}
        config={tableConfig}
        resetPagination={reset}
        totalElements={totalElements}
        startIndex={startIndex}
        handleNextPage={handlePageChange} />
      </MatCard>
      {open && (
        <UpdateVersionLabel
          handleClose={closeConfirmLabelDialog}
          data={selectedData}
          open={open}
        />
      )}
    </>
  );
};

export default VersionList;
