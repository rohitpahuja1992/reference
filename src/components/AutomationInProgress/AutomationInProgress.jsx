/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ImportDataTable from "../../components/ImportDatatable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MatCard from "../MaterialUi/MatCard";
import { fetchProcessingFiles } from "../../actions/LettersActions";
// import UseEventSource from "../../components/UseEventSource";
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

const AutomationInProgress = () => {
  const clientId = useSelector((state) => state.Header.entityId);
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  //let eventSource = undefined;
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
  const filesList = useSelector((state) =>
    state.Letters?.processingData?.list?.map((data) => {
      let blankData = {
        id: data.id,
        module: data.module?.id || 0,
        delivery: data.deliveryMethod,
        type: data.letterImportType,
        letterName: data.letterName,
        lineOfBusiness: data.business?.id || 0,
        company: data.company?.id || 0,
        status: data.letterImportStatus,
        progress: data.progress,
        supportedLob: data.supportedLob ? data.supportedLob : [],
      };
      // return { ...data, ...blankData };
      return { ...blankData };
    })
  );
  const [fileData, setFileData] = useState(filesList);
  const [selectAll, setSelectAll] = useState(false);
  const [importBtnDisabled, setImportBtnDisabled] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const totalElements = useSelector(
    (state) => state.Letters.processingData.totalElements
  );
  const startIndex = useSelector((state) => state.Letters.page.startIndex);

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

  const tableConfig = {
    tableType: true,
    checked: false,
    paginationOption: "custom",
    enabled: "true",
    actions: {
      enabled: false,
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View",
      action: (data) => {
        history.push(`/client/letter-Editor/${clientId}`);
      },
    },
  };

  // const updateValue = ({ target: { name, value } }, id) => {
  //   const data = [...fileData];
  //   data.forEach((item) => {
  //     if (item.id === id) {
  //       if (value === "") {
  //         item.inValid = true;
  //       } else {
  //         item.inValid = false;
  //       }
  //       item[name] = value;
  //     }
  //   });
  //   setFileData(data);
  // };

  const handlePageChange = (start, size, DEFAULT_SORTBY, clientId) => {
    dispatch(fetchProcessingFiles(start, size, DEFAULT_SORTBY, clientId));
  };

  useEffect(() => {
    if (clientId !== "") {
      dispatch(
        fetchProcessingFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          clientId
        )
      );
    }
  }, [dispatch, clientId]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Letter Automation In-Progress
          </Typography>
        }
      />
      <Divider />
      {/* <UseEventSource/> */}
      <Grid container>
        <>
          <Grid item xs={12}>
            <div style={{ flex: 1, display: "flex" }}>
              <ImportDataTable
                cols={cols}
                rows={filesList || []}
                config={tableConfig}
                updateCheckedStatus={updateCheckedStatus}
                updateAllCheckedStatus={updateAllCheckedStatus}
                selectAll={selectAll}
                pageSize={setPageSize}
                //updateValue={updateValue}
                totalElements={totalElements}
                startIndex={startIndex}
                handleNextPage={handlePageChange}
              />
            </div>
            <Divider />
          </Grid>
        </>
      </Grid>
      {/* <Grid>
     <div>
      <header >
        Received Data
        {data}
        {data?.map(d =>
          <span>{d}</span>
        )}
      </header>
    </div>
     </Grid> */}
    </MatCard>
  );
};

export default AutomationInProgress;
