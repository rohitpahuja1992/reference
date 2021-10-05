import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CoverSheetIcon from "../../assets/images/coversheet.svg";
import AppendPagesIcon from "../../assets/images/AppendPages.svg";
// import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "../MaterialUi/MatTooltip";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
import Chip from "@material-ui/core/Chip";
import CustomPagination from "../../components/DataTable/CustomPagination";
import MatAvatar from "../MaterialUi/MatAvatar";
import MatTableCell from "../MaterialUi/MatTableCell";

import { TableFooter, Divider } from "@material-ui/core";
// import {
//   fetchBusinessByClientId,
//   fetchModulesByClientId,
//   fetchCompanyByClientId,
// } from "../../actions/LettersActions";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTBY,
} from "../../utils/LettersAppConstant";
const useStyles = makeStyles((theme) => ({
  // table: {
  //   width: "100px"
  // },

  tableHead: {
    paddingTop: "10px",
    paddingBottom: "8px",
  },
  customPagination: {
    display: "flex",
    alignItems: "end",
  },
  tableRow: {
    height: "50px",
    padding: "0px 4px 0px 4px",
    fontSize: "13px",
  },
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.error.main,
  },
  statusNotConfig: {
    background: "#f39c12",
  },
  statusRedeploy: {
    background: "green",
  },
  // ellipsis: {
  //   display: "block", /* Fallback for non-webkit */
  //   maxWidth: "55px",
  //   height: "26px*1.4*2", /* Fallback for non-webkit */
  //   margin: "0 auto",
  //   lineHeight: "1.4",
  //   "-webkit-line-clamp": "2",
  //   "-webkit-box-orient": "vertical",
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   whiteSpace: "nowrap"
  // },
  // scroll: {
  //   "&::-webkit-scrollbar": {
  //     width: "8px",
  //     height: "8px"
  //   },
  //   "&::-webkit-scrollbar-thumb": {
  //     background: "#888",
  //   },
  //   "&::-webkit-scrollbar-thumb:hover": {
  //     background: "#555",
  //   },
  //   "&::-webkit-scrollbar-track": {
  //     background: "#f1f1f1",
  //   },
  //   "&::-webkit-scrollbar-corner": {
  //     background: "#888",
  //   },
  // }
}));

const StyledTableCell = withStyles((theme) => ({
  root: {
    padding: "4px",
    '&  $lastChild': { paddingRight: '5px' },
  },
  head: {
    backgroundColor: theme.palette.primary.light,
    // color: theme.palette.common.white,
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
    //'&  $lastChild': { paddingRight: '5px' },
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

const DataTable = (props) => {
  const styles = useStyles();
  //const dispatch = useDispatch();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(0);
  const totalElements = props.totalElements;
  const Actions = Boolean(props.config.actions);
  const clientId = useSelector((state) => state.Header.entityId);
  const moduleList = useSelector((state) =>
    state.Letters?.modulesList?.sort((a, b) =>
      a?.shortName > b?.shortName ? 1 : -1
    )
  );
  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList.sort((a, b) => (a.description > b.description ? 1 : -1))
    //.filter((v,i,a)=>a.findIndex(t=>(t.produtLine === v.produtLine))===i)
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList.sort((a, b) =>
      a.description > b.description ? 1 : -1
    )
  );

  const defaultStatus =
    props?.config?.handlers?.handleClientStatusClass ||
    (() => styles.statusActive);
  const [selectedAction, setSelectedAction] = useState("");

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
    props.updateAllCheckedStatus(false);
  };

  const handleChangeRowsPerPage = (event) => {
    let pages = parseInt(event.target.value, 10);
    setRowsPerPage(pages);
    setPage(0);
    if (props.config.paginationOption === "custom")
      props.handleNextPage(0, pages, DEFAULT_SORTBY, clientId);
    //remove select all...
    props.updateAllCheckedStatus(false);
  };

  const handleRequestSort = (event, property) => {
    if (
      property === "status" ||
      property === "global" ||
      property === "coverSheet"
    )
      property = "statusDialog";
    if (property === "fieldOob") property = "oobStatus";
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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
  //   dispatch(fetchModulesByClientId(clientId));
  //   dispatch(fetchBusinessByClientId(clientId));
  //   dispatch(fetchCompanyByClientId(clientId));
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

  const getModuleName = (id) => {
    // const { shortName = "MEM" } = (moduleList || []).find(
    //   (item) => item?.id === id
    // );
    let shortName = (moduleList || []).find((item) => item?.id === id)?.shortName;
    return !shortName ? "Global" : shortName;
  };

  const getCompany = (id) => {
    const { description = "" } =
      (companyList || []).find((item) => item.id === id) || {};
    return description;
  };

  const getLob = (id) => {
    const { description = "" } =
      (businessList || []).find((item) => item.id === id) || {};
    return description;
  };

  const setCoversheet = (value) => {
    let icon = null;
    if (value) {
      icon = <img src={CoverSheetIcon} width="20px" height="auto" alt="" />;
    }
    return icon;
  };

  const setAttachment = (value) => {
    let icon = null;
    if (value.length > 0) {
      icon = <img src={AppendPagesIcon} width="20px" height="auto" alt="" />;
    }
    return icon;
  };

  return (
    <>
      <TableContainer
        style={{ width: props?.maxWidth ? props?.maxWidth : "940px" }}
      >
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
                  style={{ width: col.minWidth ? col.minWidth : "none" }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {!col.hasOwnProperty("isSorting") ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, col.id)}
                    >
                      {typeof col.label === "string"
                        ? col.label
                        : col.label.icon}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </StyledTableCell>
              ))}
              {props.config.actions && (
                <StyledTableCell style={{ width: "20px" }}></StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(props.rows, getComparator(order, orderBy))
              .slice(
                props.config.paginationOption !== "custom"
                  ? page * rowsPerPage
                  : 0,
                page * rowsPerPage + rowsPerPage
              )
              //.slice(0,10)
              .map((row, index) => (
                <StyledTableRow className={styles.tableRow} key={index}>
                  {props.config.checked && (
                    <MatTableCell className={styles.tableRow}>
                      <Checkbox
                        checked={row.checked || false}
                        value={row.id}
                        disabled={(row.letterImportStatus === "REDEPLOY" || row.coversheetActive || row.attachementActive) ? true : false}
                        className={row.letterImportStatus === "REDEPLOY" ? "disabled" : "enabled"}
                        onClick={() => props?.updateCheckedStatus(row.id)}
                      />
                    </MatTableCell>
                  )}
                  {props.config.tableType && (
                    <MatTableCell>
                      <MatAvatar
                        type={props.config.iconType}
                        width={props.config.iconWidth}
                      >
                        {props.config.iconSource}
                      </MatAvatar>
                    </MatTableCell>
                  )
                  }

                  {props.cols.map((col, key) =>
                    Object.keys(row).map((cellKey) =>
                      col.id === cellKey ? (
                        <MatTableCell
                          className={styles.tableRow}
                          key={cellKey}
                          style={{
                            opacity: row.deleted ? "0.38" : "1",
                          }}
                        >
                          {cellKey !== "status" ? (
                            props.config.tableName === "Library" ? (
                              cellKey === "module" ? (
                                getModuleName(row[cellKey])
                              ) : cellKey === "company" ? (
                                getCompany(row[cellKey])
                              ) : cellKey === "lineOfBusiness" ? (
                                getLob(row[cellKey])?.length > 11
                                  ? (<Tooltip
                                    title={getLob(row[cellKey])}

                                    style={{ textAlign: "left", margin: "0" }} placement="right-start"
                                  >
                                    <div>
                                      {getLob(row[cellKey])}

                                    </div>

                                  </Tooltip>)
                                  : getLob(row[cellKey]
                                  )
                              ) : cellKey === "coverSheet" ? (
                                setCoversheet(row[cellKey])
                              ) : cellKey === "attachment" ? (
                                setAttachment(row[cellKey])
                              ) : cellKey === "letterName" ? (
                                // <div style={{ whiteSpace: "nowrap" }}> { }</div>
                                row[cellKey]
                              ) : (
                                row[cellKey]?.length > 11
                                  ? (<Tooltip
                                    title={row[cellKey]}

                                    style={{ textAlign: "left", margin: "0" }} placement="right-start"
                                  >
                                    <div >
                                      {row[cellKey]}


                                    </div>

                                  </Tooltip>)
                                  : row[cellKey]
                              )
                            ) : (
                              row[cellKey]
                            )
                          ) : (
                            <Chip
                              title={row?.errorMessage ? row?.errorMessage : ""}
                              label={
                                row.letterImportStatus === "REDEPLOY" ? row.letterImportStatus : row[cellKey]
                              }
                              color="primary"

                              className={defaultStatus(row.status)}
                            />
                          )}
                        </MatTableCell>
                      ) : null
                    )
                  )}

                  {(selectedAction === "Action" ||
                    ((row.deleted || row.selectAction) && Actions)) && (
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
                            onClick={(e) => {
                              props.config.actions.action(row);
                            }}
                            disabled={
                              (row.letterImportStatus === "REDEPLOY" ? true : false) ||
                              (row.deleted &&
                                props.config.actions.display === "Hide")
                            }
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
            // rowsPerPageOptions={[5, 10, 25]}
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

export default DataTable;
