import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Tooltip from "../../components/MaterialUi/MatTooltip";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CustomPagination from "./CustomPagination";
import MatTableCell from "../../components/MaterialUi/MatTableCell";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "../MaterialUi/MatTooltip";

import { TableFooter, Divider } from "@material-ui/core";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTBY,
} from "../../utils/LettersAppConstant";
// import {
//   fetchBusinessByClientId,
//   fetchModulesByClientId,
//   fetchCompanyByClientId,
// } from "../../actions/LettersActions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 40,
  },
  formControlLOB: {
    margin: theme.spacing(0),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tableHead: {
    paddingTop: "10px",
    paddingBottom: "8px",
    cursor: "pointer"
  },
  customPagination: {
    display: "flex",
    alignItems: "end",
  },
  tableRow: {
    height: "40px",
    padding: "0px 4px 0px 4px",
    fontSize: "12px",
  },
  selectBox: {
    fontSize: "13px",
  },
  defaultPadding: {
    padding: "4px 10px 5px 5px",
  },
  icon: {
    cursor: "pointer",
    padding: "4px 10px 5px 5px",
  },
  statusProgress: {
    background: "##5C78FF",
  },
  statusReady: {
    background: "#00c853",
  },
  statusNotReady: {
    background: theme.palette.error.main,
  },

  statusNoTag: {
    backgroundColor: "#cc871a",
  },
  statusInvalidTag: {
    backgroundColor: "#f39c12",
  },
  statusFailure: {
    backgroundColor: "#dd4b39",
  },
  cDisabled: {
    color: "#8e8e8e !important",
    backgroundColor: "#dedede !important",
    fontSize: "13px",
    //pointerEvents: "none",
  },
  disabled: {
    color: "#ccc",
  },
  enabled: {
    color: "#fff",
  },
}));

// overide styles for table cells...
const StyledTableCell = withStyles((theme) => ({
  root: {
    padding: "4px",
  },
  head: {
    backgroundColor: theme.palette.primary.light,
  },
  body: {
    fontSize: 14,
  },
}))(MatTableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  body: { padding: "1px" },
}))(TableRow);

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ImportDataTable = (props) => {
  const styles = useStyles();
  // const dispatch = useDispatch();
  // const fileListProp = useRef();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(0);
  const totalElements = props.totalElements;
  const Actions = Boolean(props.config.actions);

  // eslint-disable-next-line no-unused-vars
  const [selectedAction, setSelectedAction] = useState("");
  const [lobList, setLoblist] = useState({});
  //const selectedAction = "";
  // const [apiError, setApiError] = useState(null);
  // const [actionError, setActionError] = useState(null);
  // const [fileInput, setFileInput] = useState("");
  // const error = useSelector((state) => state.Client.getByIdError);
  const clientId = useSelector((state) => state.Header.entityId);

  // let fileRemoved = useSelector((state) => state.Letters.isFileRemoved);
  // const [isFileRemoved, setIsFIleRemoved] = useState(fileRemoved);


  const moduleList = useSelector((state) =>
    state.Letters.modulesList.sort((a, b) =>
      a.shortName > b.shortName ? 1 : -1
    )
  );

  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList.sort((a, b) => (a.description > b.description ? 1 : -1))
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList.sort((a, b) => (a.description > b.description ? 1 : -1))
  );

  const deliveryList = ["MAIL", "FAX"];

  const handleRequestSort = (event, property) => {
    if (property === "status" || property === "global")
      property = "statusDialog";
    if (property === "fieldOob") property = "oobStatus";
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleStatusMsg = (msg = "", progress = "") => {
    let statusMsg = {
      NO_TAG: "No Tag",
      INVALID_TAG: "Invalid Tag",
      FAILURE: "Failure",
      READY: "Ready to Import",
      NOT_READY: "Not Ready",
      PROCESSING: progress + "% Completed",
    };
    return statusMsg[msg];
  };

  const handleStatusClass = (status = "") => {
    let className = {
      NO_TAG: styles.statusNoTag,
      INVALID_TAG: styles.statusInvalidTag,
      FAILURE: styles.statusFailure,
      READY: styles.statusReady,
      NOT_READY: styles.statusNotReady,
      PROCESSING: styles.statusProgress,
    };
    return className[status.toUpperCase()];
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (props.config.paginationOption === "custom")
      props.handleNextPage(
        newPage * rowsPerPage,
        rowsPerPage,
        DEFAULT_SORTBY,
        clientId
      );
    //remove select all...
    props.updateAllCheckedStatus(false)
  };

  const handleChangeRowsPerPage = (event) => {
    let pages = parseInt(event.target.value, 10);
    setRowsPerPage(pages);
    props.pageSize(pages);
    setPage(0);
    if (props.config.paginationOption === "custom")
      props.handleNextPage(0, pages, DEFAULT_SORTBY, clientId);
    //remove select all...
    props.updateAllCheckedStatus(false)
  };

  // ImportDataTable.setRowsPerPage = () => {
  //   setRowsPerPage(rowsPerPage);
  // }

  useEffect(() => {
    if (props.config.paginationOption === "custom") {
      setPage(Math.ceil(props.startIndex / rowsPerPage));
    }
  }, [
    props.config.paginationOption,
    props.resetPagination,
    props.startIndex,
    rowsPerPage,
  ]);

  // useEffect(() => {
  //   fileListProp.current = isFileRemoved;
  //   if (fileListProp.current) {
  //     setRowsPerPage(DEFAULT_PAGE_SIZE);
  //     fileListProp.current = false;
  //   }
  // }, [fileListProp, isFileRemoved]);

  // useEffect(() => {
  //   if (clientId) {
  //     dispatch(fetchModulesByClientId(clientId));
  //     dispatch(fetchBusinessByClientId(clientId));
  //     dispatch(fetchCompanyByClientId(clientId));
  //   }

  // }, [dispatch, clientId]);

  useEffect(() => {
    if (Actions) {
      setSelectedAction("Action");
    } else {
      props.config.menuOptions
        ? setSelectedAction("Action")
        : setSelectedAction("");
    }
  }, [Actions, props.config]);

  return (
    <>
      <TableContainer style={{ maxWidth: props.maxWidth ? props.maxWidth : "none" }}>
        <Table className={styles.table} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {props.config.tableType && <StyledTableCell></StyledTableCell>}
              {props.config.checked && (
                <StyledTableCell>
                  <Checkbox
                    checked={props.selectAll}
                    disabled={props.selectAllDisabled}
                    className={props.selectAllDisabled ? "disabled" : "enabled"}
                    onClick={() =>
                      props.updateAllCheckedStatus(!props.selectAll)
                    }
                  />
                </StyledTableCell>
              )}
              {props.cols.map((col, key) => (
                <StyledTableCell
                  key={key}
                  component="th"
                  className={styles.tableHead}
                  style={{ minWidth: col.width ? col.width : "none" }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {!col.hasOwnProperty("isSorting") ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </StyledTableCell>
              ))}
              {props.config.actions.enabled && (
                <StyledTableCell style={{ width: "20px" }}>
                  View
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(props?.rows, getComparator(order, orderBy))
              .slice(
                props.config.paginationOption !== "custom"
                  ? page * rowsPerPage
                  : 0,
                page * rowsPerPage + rowsPerPage
              )
              .map((row, index) => (
                <StyledTableRow
                  className={row?.updating?.status ? styles.cDisabled : ""}
                  key={index}
                >
                  {props.config.tableType && (
                    <MatTableCell
                      className={styles.defaultPadding}
                    ></MatTableCell>
                  )}
                  {props.config.checked && (
                    <MatTableCell className={styles.tableRow}>
                      <Checkbox
                        checked={row.checked || false}
                        value={row.id}
                        disabled={
                          row.inValid || row.status === "NOT_READY"
                            ? true
                            : false
                        }
                        className={
                          row.inValid || row.status === "NOT_READY"
                            ? "disabled"
                            : "enabled"
                        }
                        onClick={() => props.updateCheckedStatus(row.id)}
                      />
                    </MatTableCell>
                  )}
                  <MatTableCell className={styles.tableRow}>
                    {row?.updating?.status ? "" : ""}
                    {props.startIndex + (index + 1)}
                  </MatTableCell>

                  {/* <MatTableCell className={styles.tableRow}>
                    {row?.updating?.status ? "" : ""} 
                    {row.id}                    
                  </MatTableCell> */}
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControl}>
                      <NativeSelect
                        value={row.module}
                        name="module"
                        disabled={props.config.enabled ? "disabled" : ""}
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        onChange={(e) => props.updateValue(e, row.id)}
                      >
                        {(moduleList || []).map((item, index) => (
                          <option value={item.id} key={index}>
                            {item.shortName}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControl}>
                      <NativeSelect
                        value={row.delivery}
                        name="delivery"
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        disabled={props.config.enabled ? "disabled" : ""}
                        onChange={(e) => props.updateValue(e, row.id)}
                      >
                        {(deliveryList || []).map((item, index) => (
                          <option value={item.id} key={index}>
                            {item}
                          </option>
                        ))}
                        {/* <option value="MAIL">MAIL</option>
                        <option value="FAX">FAX</option> */}
                      </NativeSelect>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControl}>
                      <NativeSelect
                        value={row.type}
                        name="type"
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        disabled={props.config.enabled ? "disabled" : ""}
                        onChange={(e) => props.updateValue(e, row.id)}
                      >
                        <option value="LETTER">LETTER</option>
                        <option value="ATTACHMENT">ATTACHMENT</option>
                        <option value="COVERSHEET">COVER SHEET</option>
                      </NativeSelect>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControl}>
                      <TextField
                        name="letterName"
                        value={row.letterName}
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        disabled={props.config.enabled ? "disabled" : ""}
                        inputProps={{ style: { fontSize: 13, width: "230px" } }}
                        onChange={(e) => props.updateValue(e, row.id)}
                        onBlur={(e) => props.updateLetterName(e, row.id)}
                        error={
                          RegExp(/[\\/:*?"<>]/gi).test(row.letterName) ||
                          (row.letterName === "" || row.letterName?.length > 200 || row?.duplicateLetterName)
                        }
                      ></TextField>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControl}>
                      <NativeSelect
                        value={row.company}
                        title={companyList?.filter(a => a?.id === row?.company)[0]?.code || ""}
                        name="company"
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        disabled={props.config.enabled ? "disabled" : ""}
                        onChange={(e) => {
                          setLoblist((prev) => {
                            return {
                              ...prev,
                              [row.id]: true,
                            };
                          });
                          props.updateValue(e, row.id);
                        }}
                      >
                        {(companyList || []).map((item, index) =>
                          index === 0 ? (
                            <>
                              <option value="-1" key={-1}></option>
                              <option value={item.id} key={index}>
                                {item.description}
                              </option>
                            </>
                          ) : (
                            <option value={item.id} key={index}>
                              {item.description}
                            </option>
                          )
                        )}
                      </NativeSelect>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <FormControl className={styles.formControlLOB}>
                      <NativeSelect
                        value={row?.lineOfBusiness}
                        title={props.rows?.filter(b => b?.id == row?.id)[0]?.supportedLob?.filter(a => a?.id == row?.lineOfBusiness)[0]?.description || ""}
                        name="lineOfBusiness"
                        disabled={props.config.enabled ? "disabled" : ""}
                        className={
                          props.config.enabled
                            ? styles.cDisabled
                            : styles.selectBox
                        }
                        onChange={(e) => props.updateValue(e, row.id)}
                      >
                        {!lobList?.[row.id] ?
                          ((row?.supportedLob))?.map((item, index) =>
                            index === 0 ? (
                              <>
                                <option value="-1" key={-1}></option>
                                <option value={item.id} key={index}>
                                  {item.description}
                                </option>
                              </>
                            ) : (
                              <option value={item.id} key={index}>
                                {item.description}
                              </option>
                            )
                          )
                          : ((props?.lobList?.[row.id]) || businessList).filter((item, index) => {
                            if (!props?.lobList?.[row.id]) {
                              return true
                            } else {
                              return true;
                            }
                            //return false;
                          }).map((item, index) =>
                            index === 0 ? (
                              <>
                                <option value="-1" key={-1}></option>
                                <option value={item.id} key={index}>
                                  {item.description}
                                </option>
                              </>
                            ) : (
                              <option value={item.id} key={index}>
                                {item.description}
                              </option>
                            )
                          )}
                      </NativeSelect>
                    </FormControl>
                  </MatTableCell>
                  <MatTableCell className={styles.tableRow}>
                    <Chip
                      title={row?.failedReason ? row?.failedReason : ""}
                      label={handleStatusMsg(
                        row.inValid ? "NOT_READY" : row.status,
                        row.progress
                      )}
                      className={handleStatusClass(
                        row.inValid ? "NOT_READY" : row.status
                      )}
                      color="primary"
                    />
                  </MatTableCell>
                  {props.config.actions.enabled && (
                    <MatTableCell
                      style={{
                        opacity: row.deleted ? "0.38" : "1",
                      }}
                    >
                      <Tooltip
                        placement="left"
                        arrow
                        title={
                          props.config.actions.tooltipText
                            ? props.config.actions.tooltipText
                            : ""
                        }
                      >
                        <IconButton
                          className={styles.icon}
                          onClick={(e) => {
                            props.config.actions.action(row);
                          }}
                        >
                          {props.config.actions.icon}
                        </IconButton>
                      </Tooltip>
                    </MatTableCell>
                  )}
                </StyledTableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {props.config.paginationOption === "custom" && (
                <CustomPagination
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {props.config.paginationOption !== "custom" && (
        <>
          <Divider />
          <TablePagination
            component="div"
            count={props.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
};

export default ImportDataTable;
