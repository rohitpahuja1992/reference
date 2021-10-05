import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
//import { useHistory } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ImportDataTable from "../../components/ImportDatatable";
import ImportQueueIcon from "../../assets/images/import_queue-icon.svg";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import _ from "lodash";
import {
  DEFAULT_START_INDEX,
  DEFAULT_SORTBY,
  DEFAULT_PAGE_SIZE,
  // RESET_LETTERUPDATE
} from "../../utils/LettersAppConstant";

import {
  updateFile,
  // updateFiles,
  updateProcessingFiles,
  fetchFiles,
  deleteFiles,
  fetchLobsByCompId
} from "../../actions/LettersActions";
// import { getByDisplayValue } from "@testing-library/react";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "14px",
    paddingBottom: "6px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },
  cardAction: {
    borderRadius: "5px",
    fontSize: "14px",
    padding: "7px 10px",
  },
  iconSize: {
    fontSize: "16px",
    paddingRight: "4px",
  },
  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",

    "& li": { lineHeight: "20px" },
  },

  hyperLink: {
    color: "#3e719e",
    textDecoration: "none",
    "&:active, &:hover, &:focus": {
      outline: "none",
      textDecoration: "none",
      color: "#72afd2",
    },
  },
}));

const ImportQueue = (props) => {
  const clientId = useSelector((state) => state.Header.entityId);
  const styles = useStyles();
  //const { setSelectAll } = props;
  //const history = useHistory();
  const dispatch = useDispatch();

  const [fileData, setFileData] = useState(props.rows || []);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllDisabled, setSelectAllDisabled] = useState(true);
  const [importBtnDisabled, setImportBtnDisabled] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState("");
  // const [isSubmited, setIsSubmited] = useState(true);
  //const startIndex = useSelector((state) => state.Letters.page.startIndex);

  const status = useSelector((state) => state.Letters.status) || {
    id: "",
    name: "",
    value: "",
  };
  const isFileRemoved = useSelector((state) => state.Letters.isFileRemoved);
  const lobList = useSelector((state) => state.Letters.lobList);
  // console.log("lobList", lobList);
  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList
  );

  const isFilesProcessed = useSelector((state) => state.Letters.isFilesProcessed);
  // const noLOB = useSelector((state) => state.Letters.noLOB);
  const updateCheckedStatus = (id) => {
    const data = [...fileData];
    let readyData = 0;
    data.forEach((item) => {
      if (item.id === id && item?.status === "READY") {
        item.checked = !item?.checked;
      }
      if (item?.status === "READY") {
        readyData = readyData + 1;
      }
    });

    const checkedStatus = data.filter((item) => item.checked);
    //const notReady = data.filter((item) => !item.checked);

    if (checkedStatus.length === readyData) {
      setSelectAll(true);

    } else {
      setSelectAll(false);

      setImportBtnDisabled(true);
    }

    if (checkedStatus.length > 0) {
      setImportBtnDisabled(false);
    }

    setFileData(data);
  };

  const updateAllCheckedStatus = (toggle) => {
    const data = [...fileData];
    data.forEach((item) => {
      if (item.status === "READY") {
        item.checked = toggle;
      }
      //item.checked = toggle;
    });

    setImportBtnDisabled(!toggle);

    setFileData(data);
    setSelectAll(toggle);
  };

  const autoSave = false;
  //const [autoSave, setAutoSave] = useState(false);
  useEffect(() => {
    if (status.id) {
      setFileData((fileData = []) => {
        const stateCopy = [...fileData];
        stateCopy.forEach((item) => {
          if (item.id === status.id) {
            item.updating = {
              status: false,
              elem: status.name,
            };
          }
        });

        return stateCopy;
      });
    }
  }, [status.id, status.name, status.value]);

  useEffect(() => {
    const data = isMatchingArray(props.rows, fileData)
      ? [...fileData]
      : [...props.rows];

    data.forEach((item) => {
      if (item.status === "READY") {
        setSelectAllDisabled(false);

        return;
      } else {
        setSelectAllDisabled(true);
      }
    });

  }, [fileData, props.rows]);

  // const isMatchingArray = (array1, array2) =>
  //   array1[0].id !== array2[0].id ||
  //   array1.length !== array2.length ||
  //   array1[array1.length - 1].id !== array2[array2.length - 1].id ||
  //   array1[array1.length - 1].duplicateLetterName !== array2[array2.length - 1].duplicateLetterName;

  const isMatchingArray = (array1, array2) => {
    return _.isEqual(array1, array2) ? false : true
  }

  // const isMatchingArray = (a1, a2) =>
  //   (a1 !== a2 ||
  //     a1.length !== a2.length) &&
  //   a1.every((f, i) =>
  //     f.id === a2[i].id &&
  //     f.duplicateLetterName === a2[i].duplicateLetterName
  //   )

  useEffect(() => {
    if (isMatchingArray(props?.rows, fileData)) {
      setFileData(props.rows);
      setSelectAll(false);
    } else {
      const data = [...fileData];
      data.forEach((item) => {
        if (item.status === "READY") {
          setSelectAllDisabled(false);
          return;
        }
      });
    }
  }, [props?.rows]);

  const tableConfig = {
    tableType: false,
    checked: true,
    paginationOption: "custom",
    enabled: false,
    autoSave: autoSave,
    actions: {
      enabled: false,
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View Fields",
      action: (data) => { },
    },
  };

  const bindings = {
    //company: "companyId",
    company: "companyDescription",
    lineOfBusiness: "businessLineDescription",
    delivery: "deliveryMethod",
    type: "letterImportType",
    letterName: "letterName",
    module: "moduleId",
  };

  const getValue = (name, value) => {
    if (name === "company" && value !== -1) {
      return companyList?.find(item => item.id === Number(value))["description"]
    } else if (name === "lineOfBusiness" && value !== -1) {
      return businessList?.find(item => item.id === Number(value))["description"]
    } else {
      return value === -1 ? "" : value
    }
  }

  const updateValue = ({ target: { name, value } }, id) => {
    const updateData = [];
    const data = [...((fileData?.length && fileData) || [])];
    data.forEach(function (item, index) {
      if (item.id === id) {
        if (name === "letterName") {
          const r = /[^a-z0-9 .-_()-]/gi;
          if (value === "" || value.length > 200 || r.test(value)) {
            //item.inValid = true;
            this[index].status = "NOT_READY";

            this[index][name] = value.replace(r, "");
            value = this[index][name];
          } else {
            this[index].status = "READY";
            setSelectAllDisabled(false);
            this[index].inValid = false;
            this[index][name] = value;
          }
        } else {
          this[index][name] = value;
        }

        item.updating = {
          status: true,
          elem: name,
        };
        updateData.push({
          id: item.id,
          [bindings[name]]:
            value === "" ? "" : getValue(name, isFinite(value) ? Number(value) : value),
          letterImportStatus: item.status,
          clientId: Number(clientId)
        });
      }
    }, data);

    setFileData(data);
    if (name === "company") {
      setSelected(value);
      let companyDesc = getValue(name, isFinite(value) ? Number(value) : value);
      //console.log(companyDesc)
      dispatch(fetchLobsByCompId(companyDesc, clientId, id));
    }
    if (name !== "letterName") {
      dispatch(updateFile(updateData, { name, value }));
      return;
    }
  };

  const updateLetterName = ({ target: { name, value } }, id) => {
    let updateData = [];
    updateData.push({
      id: id,
      [bindings[name]]: value,
      clientId: Number(clientId)
    });
    if (value !== "") {
      dispatch(updateFile(updateData, { name, value }));
    }

  }

  const openConfirmDeleteDialog = () => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        const arrFilesId = [];
        fileData.forEach((item) => {
          if (item.checked) {
            arrFilesId.push(item.id);
          }
        });

        dispatch(deleteFiles(arrFilesId, clientId));
        setSelectAll(false);

        //ImportDataTable.setRowsPerPage();
        setImportBtnDisabled(true);
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: "Confirm",
      message: "Are you sure to remove selected items?",
    };
    dispatch(showMessageDialog(messageObj));
  };

  //It will send selected files for processing...
  const handleImport = () => {
    const arrBulkData = [];
    fileData.forEach((item) => {
      if (item.checked) {
        arrBulkData.push(item.id);
      }
    });
    dispatch(updateProcessingFiles(arrBulkData, clientId));
    updateAllCheckedStatus(false);
  };

  useEffect(() => {
    if (isFileRemoved) {
      dispatch(
        fetchFiles(
          DEFAULT_START_INDEX,
          pageSize,
          DEFAULT_SORTBY,
          clientId
        )
      );
    }
  }, [dispatch, clientId, isFileRemoved, pageSize]);


  useEffect(() => {
    if (isFilesProcessed) {
      dispatch(
        fetchFiles(
          DEFAULT_START_INDEX,
          pageSize,
          DEFAULT_SORTBY,
          clientId
        )
      );
    }
  }, [dispatch, clientId, isFilesProcessed, pageSize]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img
              src={ImportQueueIcon}
              alt={ImportQueueIcon + " icon"}
              className={styles.iconSize}
            />
            Import Queue
          </Typography>
        }
        action={
          (
            <>
              {/* <MatButton
                className={styles.cardAction}
                color="secondary"
                disabled={isSubmited}
                onClick={saveLetters}
              >
                Save
              </MatButton>
              &nbsp;&nbsp; */}
              <MatButton
                className={styles.cardAction}
                color="secondary"
                disabled={importBtnDisabled}
                onClick={openConfirmDeleteDialog}
              >
                Remove
              </MatButton>
              &nbsp;&nbsp;
              <MatButton
                className={styles.cardAction}
                color="secondary"
                disabled={importBtnDisabled}
                onClick={handleImport}
              >
                Import
              </MatButton>
            </>
          )
        }
      />
      <Divider />
      <Grid container>
        <>
          <Grid item xs={12}>
            <div style={{ flex: 1, display: "flex" }}>
              <ImportDataTable
                cols={props.cols}
                rows={(fileData?.length && fileData) || []}
                config={tableConfig}
                updateCheckedStatus={updateCheckedStatus}
                updateAllCheckedStatus={updateAllCheckedStatus}
                pageSize={setPageSize}
                selectAll={selectAll}
                selectAllDisabled={selectAllDisabled}
                updateValue={updateValue}
                updateLetterName={updateLetterName}
                lobList={lobList}
                totalElements={props.totalElements}
                startIndex={props.startIndex}
                handleNextPage={props.handlePageChange}
              />
            </div>
            <Divider />
          </Grid>
        </>
      </Grid>
    </MatCard>
  );
};

export default memo(ImportQueue);
