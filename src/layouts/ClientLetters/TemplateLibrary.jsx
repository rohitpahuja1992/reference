/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import DataTable from "../../components/TempLibDataTable";
import MatInputField from "../../components/MaterialUi/MatInputField";
import MatButton from "../../components/MaterialUi/MatButton";
import RateReviewIcon from "@material-ui/icons/RateReview";
import CoverSheetIcon from "../../assets/images/coversheet.svg";
import AppendPagesIcon from "../../assets/images/AppendPages.svg";
import AutoTriggerIcon from "../../assets/images/AutoTrigger.svg";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import MatCard from "../../components/MaterialUi/MatCard";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import MatSelect from "../../components/MaterialUi/MatSelect";
import MatFormControl from "../../components/MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CardContent from "@material-ui/core/CardContent";

import _ from "lodash";
import { COMMON_ERROR_MESSAGE, NO_RECORDS_MESSAGE } from "../../utils/Messages";
import {
  fetchBusinessByClientId,
  fetchModulesByClientId,
  fetchCompanyByClientId,
  fetchAttachments,
  fetchCoverSheets,
  fetchLibraryFiles,
  updateFiles,
  fetchLobsByCompId
} from "../../actions/LettersActions";
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
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "12px",
    paddingLeft: "15px",
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

  filterDropdown: {
    paddingRight: "10px",
    minWidth: "200px",
    margin: "12px 0px 12px 18px",
  },
  btn: {
    borderRadius: "4px",
    margin: "8px 4px",
    padding: "7px 16px",
    "&:hover": {
      backgroundColor: "#4054b2",
    },
  },
  setAs: {
    paddingRight: "10px",
    minWidth: "220px",
    maxWidth: "220px",
    margin: "12px 0px 12px 2px",
  },
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.error.main,
  },
  statusNotConfig: {
    background: "#5C78FF",
  },
  noStatus: {
    background: "#fff",
  },
}));

const deliveryMethod = ["MAIL", "FAX"];
const letterType = ["LETTER", "ATTACHMENT", "COVERSHEET"];

const cols = [
  { id: "id", label: "ID", minWidth: "5%" },
  {
    id: "module", label: "Module",
    minWidth: "10%"
  },
  {
    id: "delivery", label: "Delivery",
    minWidth: "5%"
  },
  {
    id: "type", label: "Type",
    minWidth: "5%"
  },
  {
    id: "letterName", label: "Letter Name",
    minWidth: "15%"
  },
  {
    id: "coverSheet",
    label: {
      icon: (
        <img src={CoverSheetIcon} width="20px" alt="" title="Cover Sheet" />
      ),
    },
    minWidth: "10%",
  },
  {
    id: "attachment",
    label: {
      icon: (
        <img src={AppendPagesIcon} width="20px" alt="" title="Append Pages" />
      ),
    },
    minWidth: "5%",
  },
  {
    id: "autoTrigger",
    label: {
      icon: (
        <img src={AutoTriggerIcon} width="20px" alt="" title="Auto Trigger" />
      ),
    },
    minWidth: "5%",
  },
  {
    id: "company", label: "Company",
    minWidth: "10%"
  },
  {
    id: "lineOfBusiness", label: "LOB",
    minWidth: "10%"
  },
  { id: "status", label: "Status", minWidth: "10%" },
];

const TemplateLibrary = () => {
  const clientId = useSelector((state) => state.Header.entityId);
  const history = useHistory();

  const dispatch = useDispatch();
  const styles = useStyles();
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  //const [selectAllDisabled, setSelectAllDisabled] = useState(true);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const [searchBtnDisabled, setSearchBtnDisabled] = useState(true);
  const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
  const [enableLobDDL, setEnableLobDDL] = useState(false);
  const [selectedLob, setSelectedLob] = useState("");
  const totalElements = useSelector(
    (state) => state.Letters.allLibraryData.totalElements
  );
  const startIndex = useSelector((state) => state.Letters.page.startIndex);
  const lobList = useSelector((state) => state.Letters.lobList);
  // const [supportedLob, setSupportedLob] = useState({});

  const filesList = useSelector((state) =>
    state.Letters.allLibraryData.list.map((data, index) => {
      let blankData = {
        id: data.id,
        module: data.module?.id,
        delivery: data.deliveryMethod,
        type: data.letterImportType,
        letterName: data.letterName,
        lineOfBusiness: data.business?.id,
        company: data.company?.id,
        // status: data.letterImportStatus,
        // statusDialog: data.letterImportStatus,
        status: data.status,
        statusDialog: data.status,
        coverSheet: data.coverSheet?.id,
        attachment: data.attachment,
        supportedLob: data.supportedLob ? data.supportedLob : [],
        //mailingAddress: data.mailingAddress,
        mailingAddress: "",
        autoTrigger: "",
        coversheetActive: false,
        attachementActive: false,
      };
      return { ...data, ...blankData };
      //return { ...blankData };
    })
  );
  const [fileData, setFileData] = useState([]);

  const [inputs, setInputs] = useState({
    massConfigure: "",
    search: "",
    attachment: [],
    setas: "",
    mailingAddress: "",
  });

  const { massConfigure, search, attachment, mailingAddress } = inputs;

  const moduleList = useSelector((state) =>
    state.Letters.modulesList.sort((a, b) =>
      a.moduleName > b.moduleName ? 1 : -1
    )
  );

  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList
  );

  const attachmentList = useSelector((state) =>
    state.Letters.attachments.sort((a, b) =>
      a.letterName > b.letterName ? 1 : -1
    )
  );

  const coversheetList = useSelector((state) => [
    { id: -1, letterName: "---" },
    ...state.Letters.coverSheets.sort((a, b) =>
      a.letterName > b.letterName ? 1 : -1
    ),
  ]);

  const updateCheckedStatus = (id) => {
    //console.log(inputs);
    const data = [...fileData];
    data.forEach((item) => {
      if (item.id === id) {
        item.checked = !item?.checked;
      }
    });

    const checkedStatus = data.filter((item) => item.checked);

    if (
      checkedStatus.length > 0 &&
      inputs.massConfigure !== "" &&
      (inputs.search !== "" || inputs.attachment.length > 0 ||
        selectedLob !== ""
        || (inputs.massConfigure === "mailingAddress" ? mailingAddress !== "" : true))
    ) {
      setSelectAll(false);
      setSaveBtnDisabled(false);
    } else {
      setSaveBtnDisabled(true);
    }
    if (checkedStatus.length === data.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setFileData(data);
  };

  const updateAllCheckedStatus = (toggle) => {
    const data = [...fileData];
    data.forEach((item) => {
      (item.letterImportStatus === "REDEPLOY" || item.coversheetActive || item.attachementActive) ? item.checked = false : item.checked = toggle
    });

    const checkedStatus = data.filter((item) => item.checked);

    if (
      checkedStatus.length > 0 &&
      inputs.massConfigure !== "" &&
      (inputs.search !== "" || inputs.attachment.length > 0 ||
        selectedLob !== ""
        || (inputs.massConfigure === "mailingAddress" ? mailingAddress !== "" : true))
    ) {
      setSaveBtnDisabled(false);
    } else {
      setSaveBtnDisabled(true);
    }
    setFileData(data);
    setSelectAll(toggle);
  };

  const bindings = {
    company: "companyDescription",
    lob: "businessLineDescription",
    deliveryMethod: "deliveryMethod",
    letterType: "letterImportType",
    letterName: "letterName",
    module: "moduleId",
    coverSheet: "coverSheet",
    attachment: "attachment",
    mailingAddress: "mailingAddress"
  };

  const getValue = (name, value) => {
    if (name === "company" && value !== -1) {
      return companyList?.find(item => item.id === Number(value))["description"]
    } else if (name === "lob" && value !== -1) {
      return businessList?.find(item => item.id === Number(value))["description"]
    } else {
      return value === -1 ? "" : value
    }
  }

  const handleMassUpdate = () => {
    const arrBulkData = [];
    const data = [...((fileData?.length && fileData) || [])];
    data.forEach((item) => {
      if (item.checked) {

        if (massConfigure === "company" && selectedLob) {
          arrBulkData.push({
            id: item.id,
            [bindings[massConfigure]]: search,
            [bindings["lob"]]: selectedLob,
            clientId: Number(clientId)
          });
        }
        else if (massConfigure === "mailingAddress" && mailingAddress) {
          arrBulkData.push({
            id: item.id,
            mailingAddress: mailingAddress,
            clientId: Number(clientId)
          });
        }
        else {
          arrBulkData.push({
            id: item.id,
            [bindings[massConfigure]]:
              massConfigure === "attachment"
                ? attachment
                : massConfigure === "coverSheet"
                  ? search.id
                  : getValue(massConfigure, isFinite(search) ? Number(search) : search),
            clientId: Number(clientId)
          });
        }

      }
    });

    dispatch(updateFiles(arrBulkData, clientId, false));
    setSelectedLob("");
    updateAllCheckedStatus(false);
  };

  const tableConfig = {
    tableType: "",
    tableName: "Library",
    checked: true,
    maxWidth: window.innerWidth - 560,

    paginationOption: "custom",
    actions: {
      icon: <RateReviewIcon fontSize="small" />,
      tooltipText: "Edit Fields",
      action: (data) => {
        history.push(
          `/client/letter-Editor/${clientId}/${data.id}/Template-Library`
        );
      },
    },
    handlers: {
      handleClientStatusClass: (status) => {
        if (status === "Active") {
          return styles.statusActive;
        } else if (status === "Inactive") {
          return styles.statusInactive;
        } else if (status === "Config Incomplete") {
          return styles.statusNotConfig;
        }
        else if (status === "REDEPLOY") {
          return styles.statusRedeploy;
        }
        else {
          return styles.noStatus;
        }
      },
    },
  };

  const searchFieldLabel = {
    "": "Set as...",
    blank: "blank",
    coverSheet: "Select Coversheet",
    attachment: "Select Attachment",
    module: "Select Module",
    lob: "Select Lob",
    company: "Select company",
    deliveryMethod: "Select Delivery Method",
    letterType: "Select Letter Type",
  };

  const handlePageChange = (start, size, DEFAULT_SORTBY, clientId) => {
    dispatch(fetchLibraryFiles(start, size, DEFAULT_SORTBY, "", "", clientId));
  };

  let handleFilter = (e, label) => {
    const { name, value } = e.target;
    setEnableLobDDL(false);
    if (name === "massConfigure") {
      setSearchText("");
      setInputs((inputs) => ({ ...inputs, search: "", massConfigure: "", }));
    }
    if (label[0] === "Select company") {
      setSelectedLob("")
      dispatch(fetchLobsByCompId(value, clientId, "lobs"));
      setEnableLobDDL(true);
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  let handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mailingAddress") {
      //console.log(value)
      setInputs((inputs) => ({ ...inputs, [name]: value, }));

    } else {
      setSelectedLob(value)

    }
    setSaveBtnDisabled(false)

  }

  const handleSearch = () => {
    if (clientId) {

      if (massConfigure === "company" || selectedLob) {

        dispatch(
          fetchLibraryFiles(
            DEFAULT_START_INDEX,
            DEFAULT_PAGE_SIZE,
            DEFAULT_SORTBY,
            selectedLob ? "lob" : inputs.massConfigure,
            selectedLob ? selectedLob : search,
            clientId
          )
        );
      } else {
        dispatch(
          fetchLibraryFiles(
            DEFAULT_START_INDEX,
            DEFAULT_PAGE_SIZE,
            DEFAULT_SORTBY,
            inputs.massConfigure,
            massConfigure === "attachment"
              ? attachment.join(",")
              : massConfigure === "coverSheet"
                ? search.id
                : getValue(massConfigure, isFinite(search) ? Number(search) : search),
            clientId
          )
        );
      }

    }
  };

  const handleReset = () => {
    setInputs((inputs) => ({ ...inputs, search: "", massConfigure: "", mailingAddress: "" }));
    setSelectAll(false);
    setEnableLobDDL(false);
    const data = [...fileData];
    data.forEach((item) => {
      item.checked = false;
    });

    if (clientId) {
      dispatch(
        fetchLibraryFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          "",
          "",
          clientId
        )
      );
    }
  };

  const handleSelectValue = (selected, list, type) => {
    return selected.map((selectedItem) => (
      <Chip
        key={selectedItem?.id}
        label={list.filter((data) => data?.id === selectedItem)?.[0]?.[type]}
        className={styles.chip}
      />
    ));
  };

  const isEqual = (array1, array2, exclude) => {
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

    const data = [...fileData];
    const checkedStatus = data.filter((item) => item.checked);
    if (
      checkedStatus.length > 0 &&
      inputs.massConfigure !== "" &&
      (inputs.search !== "" || inputs.attachment.length > 0 ||
        selectedLob !== ""
        || (inputs.massConfigure === "mailingAddress" ? mailingAddress !== "" : true))
    ) {
      setSaveBtnDisabled(false);
    } else {
      setSaveBtnDisabled(true);
    }

    if (
      inputs.massConfigure !== "" &&
      (inputs.search !== "" || inputs.attachment.length > 0)
    ) {
      setSearchBtnDisabled(false);
      setResetBtnDisabled(false);
    } else {
      setSearchBtnDisabled(true);
      setResetBtnDisabled(true);
    }
    if (
      inputs.massConfigure !== "" &&
      (inputs.search === "" || inputs.attachment.length === 0)
    ) {
      setResetBtnDisabled(false);
    }
    if (massConfigure === "coverSheet") {
      setFileData(
        data.map(item => (
          {
            ...item,
            coversheetActive: item.type === "COVERSHEET" ? true : false
          }
        ))
      )
    }

    if (massConfigure === "attachment") {
      setFileData(
        data.map(item => (
          {
            ...item,
            attachementActive: item.type === "ATTACHMENT" ? true : false
          }
        ))
      )
    }

  }, [inputs, selectedLob]);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchModulesByClientId(clientId));
      dispatch(fetchBusinessByClientId(clientId));
      dispatch(fetchCompanyByClientId(clientId));
      dispatch(fetchAttachments(clientId, "ATTACHMENT", "LIBRARY"));
      dispatch(fetchCoverSheets(clientId, "COVERSHEET", "LIBRARY"));
      dispatch(
        fetchLibraryFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          "",
          "",
          clientId
        )
      );
    }

  }, [dispatch, clientId]);

  useEffect(() => {
    if (!isEqual(filesList, fileData, ["checked"]) && (massConfigure !== "coverSheet" && massConfigure !== "attachment")) {
      setFileData(filesList);
      //console.log('filesList', filesList);
    }
  }, [dispatch, filesList, fileData]);

  // useEffect(() => {

  //   console.log('fileData', fileData);

  // }, [dispatch, fileData]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Template Library
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        {false && (
          <Grid item xs={12} className={styles.error}>
            <Card className={styles.errorCard}>
              <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
            </Card>
          </Grid>
        )}

        <Grid item className={styles.filterDropdown}>
          <MatInputField
            select
            label="Mass Configure"
            name="massConfigure"
            value={massConfigure}
            onChange={handleFilter}
          >
            <MenuItem value="module">Module</MenuItem>
            <MenuItem value="deliveryMethod">Delivery Method</MenuItem>
            <MenuItem value="letterType">Letter Type</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            {/* <MenuItem value="lob">Line of Business</MenuItem> */}
            <MenuItem value="coverSheet">Cover Sheet</MenuItem>
            <MenuItem value="attachment">Append Document</MenuItem>
            <MenuItem value="mailingAddress">Mailing Address</MenuItem>
          </MatInputField>
        </Grid>
        {massConfigure !== "attachment" && massConfigure !== "mailingAddress" && (
          <Grid item className={styles.setAs}>
            <MatInputField
              select
              onChange={(e) => { handleFilter(e, [searchFieldLabel[massConfigure]]) }}
              label={searchFieldLabel[massConfigure]}
              name="search"
              value={search}
            >
              {/* <MenuItem value="All">All</MenuItem> */}
              {massConfigure === "deliveryMethod" &&
                deliveryMethod.map((item, index) => (
                  <MenuItem key={index} value={item} disabled={!item}>
                    {item}
                  </MenuItem>
                ))}
              {massConfigure === "letterType" &&
                letterType.map((item, index) => (
                  <MenuItem key={index} value={item} disabled={!item}>
                    {item}
                  </MenuItem>
                ))}
              {massConfigure === "company" &&
                companyList.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item.description}
                    disabled={!item.description}

                  >
                    {item.description}
                  </MenuItem>
                ))}
              {massConfigure === "module" &&
                moduleList.map((module, index) => (
                  <MenuItem
                    key={index}
                    value={module.id}
                    disabled={!module?.shortName}
                  >
                    {module?.shortName}
                  </MenuItem>
                ))}
              {massConfigure === "coverSheet" &&
                coversheetList.map((item, index) =>
                  index === 0 ? (
                    (
                      <MenuItem value="--" key="-1">
                        --
                      </MenuItem>
                    ) && (
                      <MenuItem
                        key={index}
                        value={item}
                        disabled={!item.letterName}
                      >
                        {item.letterName}
                      </MenuItem>
                    )
                  ) : (
                    <MenuItem
                      key={index}
                      value={item}
                      disabled={!item.letterName}
                    >
                      {item.letterName}
                    </MenuItem>
                  )
                )}
            </MatInputField>
          </Grid>
        )}

        {(massConfigure === "mailingAddress") && (
          < Grid item xs={6} className={styles.setAs}>
            <MatInputField
              inputProps={{
                maxLength: 1000,
              }}
              searchText={searchText}
              onChange={handleChange}
              label="Set as"
              name="mailingAddress"
              // defaultValue={mailingAddress}
              value={mailingAddress}
            />
          </Grid>
        )}

        {enableLobDDL && (
          <Grid item xs={3} className={styles.setAs}>

            <MatInputField
              select
              name="lob"
              value={selectedLob}
              label={searchFieldLabel["lob"]}
              onChange={handleChange}
            >
              {
                lobList?.lobs?.map((item, index) =>
                  <MenuItem value={item.description} key={index}>
                    {item.description}
                  </MenuItem>
                )
              }
            </MatInputField>

          </Grid>
        )}

        {massConfigure === "attachment" && (
          <Grid item xs={6} className={styles.setAs}>
            <MatFormControl variant="filled" size="small">
              <InputLabel>Select Attachment</InputLabel>
              <MatSelect
                multiple
                name="attachment"
                value={attachment}
                renderValue={(selected) =>
                  handleSelectValue(selected, attachmentList, "letterName")
                }
                onChange={handleFilter}
              //onChange={(e) => updateValue(e, props.letterData.id)}
              >
                {(attachmentList || []).map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    <Checkbox
                      checked={attachment.some((id) => id === item.id)}
                    />
                    <ListItemText primary={item?.letterName} />
                  </MenuItem>
                ))}
              </MatSelect>
            </MatFormControl>
          </Grid>
        )}
        <Grid item style={{ display: "flex", alignItems: "center" }}>
          <MatButton
            onClick={handleMassUpdate}
            className={styles.btn}
            color="primary"
            disabled={saveBtnDisabled}
          >
            Save
          </MatButton>
          <MatButton
            onClick={handleSearch}
            className={styles.btn}
            color="primary"
            disabled={searchBtnDisabled}
          >
            Search
          </MatButton>
          <MatButton
            onClick={handleReset}
            className={styles.btn}
            color="primary"
            disabled={resetBtnDisabled}
          >
            Reset
          </MatButton>
        </Grid>
        <Grid item xs={12}>
          {fileData?.length > 0 ? (
            <MatCard>
              <DataTable
                cols={cols}
                rows={fileData}
                config={tableConfig}
                updateCheckedStatus={updateCheckedStatus}
                updateAllCheckedStatus={updateAllCheckedStatus}
                selectAll={selectAll}
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
          <Divider />
        </Grid>
      </Grid>
    </MatCard >
  );
};

export default TemplateLibrary;
