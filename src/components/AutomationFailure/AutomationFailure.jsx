/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
// import Chip from "@material-ui/core/Chip";
import ImportDataTable from "../../components/ImportDatatable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MatCard from "../MaterialUi/MatCard";
import RefreshIcon from '@material-ui/icons/Refresh';
import MatButton from "../MaterialUi/MatButton";
import _ from "lodash";

import {
  fetchStoppedFiles, updateFile,
  updateFiles,
  fetchLobsByCompId
} from "../../actions/LettersActions";

// import { COMMON_ERROR_MESSAGE, IMPORT_PORTAL } from "../../utils/Messages";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTBY,
} from "../../utils/LettersAppConstant";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
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

const cols = [
  { id: "id", label: "SNo.", width: "5%" },
  { id: "module", label: "Module", width: "15%" },
  { id: "delivery", label: "Delivery", width: "10%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "letterName", label: "Letter Name", width: "25%" },
  { id: "company", label: "Company", width: "10%" },
  { id: "lineOfBusiness", label: "LOB", width: "10%" },
  { id: "status", label: "Status", width: "15%" },
];

const AutomationFailure = () => {
  const fileListProp = useRef();
  const clientId = useSelector((state) => state.Header.entityId);
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isSubmited, setIsSubmited] = useState(true);
  //  const [apiError, setApiError] = useState(null);
  // const [actionError, setActionError] = useState(null);
  const totalElements = useSelector(
    (state) => state.Letters.stoppedData.totalElements
  );
  const startIndex = useSelector((state) => state.Letters.page.startIndex);
  const status = useSelector((state) => state.Letters.status) || {
    id: "",
    name: "",
    value: "",
  };

  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList
  );
  const lobList = useSelector((state) => state.Letters.lobList);
  const filesList = useSelector((state) =>
    state.Letters.stoppedData.list.map((data) => {
      let blankData = {
        id: data.id,
        module: data.module?.id || 0,
        delivery: data.deliveryMethod,
        type: data.letterImportType,
        letterName: data.letterName,
        lineOfBusiness: data.business?.id || 0,
        company: data.company?.id || 0,
        status: data.letterImportStatus,
        statusDialog: data.letterImportStatus,
        failedReason: data.errorMessage,
        supportedLob: data.supportedLob ? data.supportedLob : [],
      };
      // return { ...data, ...blankData };
      return { ...blankData };
    })
  );

  const [fileData, setFileData] = useState(filesList);
  const [selectAll, setSelectAll] = useState(false);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [importBtnDisabled, setImportBtnDisabled] = useState(true);

  const updateCheckedStatus = (id) => {
    const data = [...fileData];

    data.forEach((item) => {
      if (item.id === id) {
        item.checked = !item?.checked;
      }
    });

    const enabled = data.filter((item) => item.checked);
    const disabled = data.filter((item) => !item.checked);

    if (enabled.length === data.length) {
      setSelectAll(true);
    } else if (disabled.length === data.length) {
      setSelectAll(false);
      setImportBtnDisabled(true);
    }

    if (enabled.length > 0) {
      setImportBtnDisabled(false);
    }

    setFileData(data);
  };

  const updateAllCheckedStatus = (toggle) => {
    const data = [...fileData];
    data.forEach((item) => {
      item.checked = toggle;
    });

    setImportBtnDisabled(!toggle);

    setFileData(data);
    setSelectAll(toggle);
  };

  const [autoSave, setAutoSAve] = useState(false);
  useEffect(() => {
    if (status.id) {
      setFileData((fileData) => {
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

  const tableConfig = {
    tableType: true,
    checked: false,
    paginationOption: "custom",
    enabled: false,
    autoSave: autoSave,
    actions: {
      enabled: true,
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View",
      action: (data) => {
        history.push(`/client/letter-Editor/${clientId}/${data.id}/Automation`);
      },
    },
  };

  // const checkValues = (company, business) => {
  //   let values = {};
  //   if (company) {
  //     values = { ...values, companyId: Number(company) };
  //   }
  //   if (business) {
  //     values = { ...values, businessLineId: Number(business) };
  //   }
  //   return values;
  // };

  const bindings = {
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

  function debounce(method, delay) {
    let counter;
    return function () {
      if (counter) {
        clearTimeout(counter);
      }
      counter = setTimeout(() => method(), delay);
    };
  }

  const updateLetterName = ({ target: { name, value } }, id) => {
    let updateData = [];
    updateData.push({
      id: id,
      [bindings[name]]: value,
      clientId: Number(clientId)
    });
    dispatch(updateFile(updateData, { name, value }));
  }

  const updateValue = ({ target: { name, value } }, id) => {
    setIsSubmited(false);
    const files = (fileData?.length && fileData) || filesList;
    const fList = [...files],
      updateData = [];
    fList.forEach((item) => {
      if (item.id === id) {
        const r = /[^a-z0-9 .-_()-]/gi;
        if (name === "letterName") {
          if (r.test(value)) {
            item[name] = value.replace(r, "");
          } else {
            item[name] = value;
          }
        } else {
          item[name] = value;
        }
        item.updating = {
          status: true,
          elem: name,
        };
        updateData.push({
          id: item.id,
          [bindings[name]]:
            value === "" ? "" : getValue(name, isFinite(value) ? Number(value) : value),
          clientId: Number(clientId)
        });
      }
    });

    setFileData(fList);
    // dispatch action here
    if (name === "company") {
      dispatch(fetchLobsByCompId(getValue(name, isFinite(value) ? Number(value) : value), clientId, id));
    }
    if (name !== "letterName") {
      dispatch(updateFile(updateData, { name, value }));
      return;
    }
  };

  const handlePageChange = (start, size, DEFAULT_SORTBY, clientId) => {
    dispatch(fetchStoppedFiles(start, size, DEFAULT_SORTBY, clientId));
  };

  const handleRefresh = () => {
    dispatch(
      fetchStoppedFiles(
        DEFAULT_START_INDEX,
        DEFAULT_PAGE_SIZE,
        DEFAULT_SORTBY,
        clientId,
        "1"
      )
    );
  }

  useEffect(() => {
    if (clientId !== "") {
      dispatch(
        fetchStoppedFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          clientId
        )
      );
      //console.log("HELLO IMPORT PORTAL");
    }
  }, [dispatch, clientId]);

  const isEqual = (array1, array2, exclude = []) => {
    const result = [];
    if (array1?.length !== array2?.length) {
      return false;
    }

    for (let n = 0; n < array1.length; n++) {
      result.push(
        _.isEqual(
          _.omit(array1[n], [...exclude]),
          _.omit(array2[n], [...exclude])
        )
      );
    }
    return !(result.indexOf(false) > -1);
  };

  useEffect(() => {
    if (isEqual(filesList, fileListProp.current)) {
      return;
    }
    fileListProp.current = _.cloneDeep(filesList);
    setFileData(filesList);
  }, [filesList]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Automation Failure Report
            <RefreshIcon className={styles.refresh} onClick={handleRefresh} />
          </Typography>
        }

      />
      <Divider />
      <Grid container>
        <>
          <Grid item xs={12}>
            <div style={{ flex: 1, display: "flex" }}>
              <ImportDataTable

                cols={cols}
                rows={(fileData?.length && fileData) || filesList || []}
                config={tableConfig}
                updateCheckedStatus={updateCheckedStatus}
                updateAllCheckedStatus={updateAllCheckedStatus}
                selectAll={selectAll}
                pageSize={setPageSize}
                updateValue={updateValue}
                updateLetterName={updateLetterName}
                totalElements={totalElements}
                startIndex={startIndex}
                handleNextPage={handlePageChange}
                lobList={lobList}
              />
            </div>
            <Divider />
          </Grid>
        </>
      </Grid>
    </MatCard>
  );
};

export default AutomationFailure;
