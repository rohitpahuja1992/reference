import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import Checkbox from "@material-ui/core/Checkbox";
//import Radio from "@material-ui/core/Radio";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Chip from "@material-ui/core/Chip";
import CustomPagination from "./CustomPagination";
import CommonMenu from "../../components/CommonMenu";
import MatAvatar from "../../components/MaterialUi/MatAvatar";
import MatTableCell from "../../components/MaterialUi/MatTableCell";
import { Divider } from "@material-ui/core";
import HSBar from "react-horizontal-stacked-bar-chart";
//import MatCard from "../../components/MaterialUi/MatCard";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";

import { DEFAULT_PAGE_SIZE } from "../../utils/AppConstants";
import { TERM_ENVI, UNTERM_ENVI } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    paddingTop: "10px",
    paddingBottom: "8px",
    paddingLeft: "16px!important",
    paddingRight: "10px!important"
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
  noRecordsClass: {
    textAlign: "center",
  },
  ellipsis: {
    display: "block", /* Fallback for non-webkit */
    maxWidth: "400px",
    height: "26px*1.4*2", /* Fallback for non-webkit */
    margin: "0 auto",
    lineHeight: "1.4",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  stickyCol: {
    position: "sticky",
    left: "0",
    backgroundColor: "white",
    border: "dotted",
    borderWidth: "thin",
    "&:nth-of-type(even)": {
      backgroundColor: "green",
    },

  },
  stickyColRight: {
    position: "sticky",
    right: "0",
    backgroundColor: "white",
    border: "dotted",
    borderWidth: "thin",
  },
  stickyColHeader: {
    position: "sticky",
    left: "0",
    zIndex: "5",
    top: "0",
  },
  stickyColHeaderRight: {
    position: "sticky",
    right: "0",
    zIndex: "5",
    top: "0",
  },
  stickyHeader: {
    position: "-webkit-sticky",
    position: "sticky",
    top: "0",
    zIndex: "3",
    paddingTop: "10px",
    paddingBottom: "8px",
    paddingLeft: "16px!important",
    paddingRight: "10px!important"
  },
  scroll: {
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px"
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-corner": {
      background: "#888",
    },
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    // color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
  sizeSmall: {
    padding: "6px 16px 6px 16px !important"
  }
}))(MatTableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

  },
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeModule, setActiveModule] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(props.config.paginationOption === "no" ? props.rows.length : DEFAULT_PAGE_SIZE);
  const [page, setPage] = React.useState(0);
  const totalElements = props.totalElements;
  const Actions = Boolean(props.config.actions);
  let Checked = props?.config?.checked;
  const MenuActions = Boolean(props.config.menuOptions);
  const [selectedAction, setSelectedAction] = useState("");
  //const reset = useSelector((state) => state.Pagination.reset);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const roles =
    loggedInUserData && loggedInUserData.roles.map((item) => item.roleName);
  const open = Boolean(anchorEl);
  const handleClick = (event, module) => {
    setActiveModule(module);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (props.config.paginationOption === "custom")
      props.handleNextPage(newPage * rowsPerPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let pages = parseInt(event.target.value, 10);
    setRowsPerPage(pages);
    setPage(0);
    if (props.config.paginationOption === "custom")
      props.handleNextPage(0, pages);
    //dispatch(fetchListByPage(url, 0, pages, entityName));
  };

  const handleRequestSort = (event, property) => {
    if (property === "status" || property === "global")
      property = "statusDialog";
    if (property === "fieldOob") property = "oobStatus";
    if (property === "systemVariableModules") property = "systemVariableModulesSort";
    if (property === "messageConstantModules") property = "messageConstantModulesSort";
    if (property === "masterTableModules") property = "masterTableModulesSort";
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
  //   if (props.paginationOption === "custom") {
  //     if (props.startIndex === DEFAULT_START_INDEX) {
  //       setPage(DEFAULT_START_INDEX);
  //     }
  //     // else
  //     //   setPage(Math.max(0, Math.ceil(props.totalElements / rowsPerPage) - 1))
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.startIndex]);
  const checkDisabled = (row) => {
    // if (clientOobComponentData && clientOobComponentData.length > 0 && loggedInUserData.user_type === "CLIENT") {
    //   let data = clientOobComponentData.filter((row) =>(row.status === "AWAITING_SIGN_OFF" || row.status === "RETRACT"));
    //   data.length > 0?setAllDisabled(false):setAllDisabled(true);
    // }
    // if (clientOobComponentData && clientOobComponentData.length > 0 && loggedInUserData.user_type !== "CLIENT") {
    //   let data = clientOobComponentData.filter((row) =>(row.status === "SIGN_OFF"));
    //   data.length > 0?setAllDisabled(false):setAllDisabled(true);
    // }
    // if (clientOobComponentData && clientOobComponentData.length > 0 && roles?.indexOf('Configuration User Access') !== -1) {
    //   let data = clientOobComponentData.filter((row) =>(row.status === "APPROVED"));
    //   console.log(data);
    //   data.length > 0?setAllDisabled(false):setAllDisabled(true);
    // }
    // else if((props.config.checkedStatus === "workflow") && (loggedInUserData.user_type !== "CLIENT" && row.statusDialog !== "SIGN_OFF")){
    //   return true;
    // }
    if (
      loggedInUserData.user_type === "CLIENT" &&
      (row.statusDialog === "AWAITING_SIGN_OFF" ||
        row.statusDialog === "RETRACT" ||
        row.statusDialog === "CLIENT_REVIEW_NEEDED")
    ) {
      return false;
    } else if (
      roles?.indexOf("Product User Access") !== -1 &&
      (row.statusDialog === "SIGN_OFF" ||
        row.statusDialog === "PRODUCT_REVIEW_NEEDED")
    ) {
      return false;
    } else if (
      roles?.indexOf("QA User Access") !== -1 &&
      row.statusDialog === "CONFIGURED"
    ) {
      return false;
    } else if (
      roles?.indexOf("Configuration User Access") !== -1 &&
      (row.statusDialog === "APPROVED" ||
        row.statusDialog === "CONFIG_REVIEW_NEEDED")
    ) {
      return false;
    } else if (props.customCheckboxEnabled) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (Actions && MenuActions) {
      props.config.selectAction
        ? setSelectedAction("MenuAction")
        : setSelectedAction("Action");
    } else {
      props.config.menuOptions
        ? setSelectedAction("MenuAction")
        : props.config.actions
          ? setSelectedAction("Action")
          : setSelectedAction("");
    }
  }, [Actions, MenuActions, props.config]);

  return (
    <>
      <TableContainer className={styles.scroll}
        style={{ maxWidth: props.config.maxWidth ? props.config.maxWidth : "none", height: props.config.height ? props.config.height : "none" }}
      >
        <Table className={styles.table} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {props.config.tableType && (
                <StyledTableCell
                  className={props.config.headerFixed ? styles.stickyHeader : styles.tableHead}
                  style={{ width: "40px" }}></StyledTableCell>
              )}
              {Checked && (
                <StyledTableCell
                  className={props.config.headerFixed ? styles.stickyHeader : styles.tableHead,
                    props.config.firstColumnFixed ? styles.stickyColHeader : ""}
                  style={{ width: "40px" }}>
                  <Checkbox
                    checked={props.allCheckedStatus}
                    disabled={props.allCheckedDisabled}
                    onClick={() =>
                      props.updateCheckedStatus(!props.allCheckedStatus)
                    }
                  />
                </StyledTableCell>
              )}

              {props.cols.map((col, key) => (
                <StyledTableCell
                  key={key}
                  component="th"
                  className={props.config.headerFixed ? styles.stickyHeader : styles.tableHead}
                  style={{ minWidth: col.minWidth ? col.minWidth : "none" }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {!col.hasOwnProperty("isSorting") ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={order}
                      onClick={(e) => handleRequestSort(e, col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </StyledTableCell>
              ))}
              {(props.config.actions || props.config.menuOptions) && (
                <StyledTableCell
                  className={props.config.headerFixed ? styles.stickyHeader : styles.tableHead,
                    props.config.firstColumnFixed ? styles.stickyColHeaderRight : ""}
                  style={{ width: "40px" }}></StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!props.customNoRecords ? (
              <>
                {stableSort(props.rows, getComparator(order, orderBy))
                  .slice(
                    props.config.paginationOption !== "custom"
                      ? page * rowsPerPage
                      : 0,
                    page * rowsPerPage + rowsPerPage
                  )
                  //.slice(0,10)
                  .map((row, index) => (
                    <StyledTableRow className={styles.tableRow} style={{ backgroundColor: row.highLight && 'greenyellow', fontStyle: row.highLight && "italic" }} key={index}>
                      {Checked && (
                        <MatTableCell
                          className={props.config.firstColumnFixed ? styles.stickyCol : ""}>
                          <Checkbox
                            disabled={checkDisabled(row)}
                            // disabled={((props.config.checkedStatus === "workflow") && ((loggedInUserData.user_type !== "CLIENT" && row.statusDialog !== "SIGN_OFF") || (loggedInUserData.user_type === "CLIENT" && !(row.statusDialog === 'AWAITING_SIGN_OFF' || row.statusDialog === 'RETRACT'))))}
                            checked={props.checkedStatus.some(
                              (o) => o.id === row.id
                            )}
                            onClick={() => props.updateCheckedStatus(row)}
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
                      )}

                      {props.cols.map((col, key) =>
                        Object.keys(row).map((cellKey) =>
                          col.id === cellKey ? (
                            <MatTableCell
                              key={cellKey}
                              style={{
                                opacity: row.deleted
                                  ? row.deleted
                                    ? "0.38"
                                    : "1"
                                  : row.termStatus
                                    ? "0.38"
                                    : "1",
                                // color: row.deleted
                                //   ? "rgba(0, 0, 0, 0.38)"
                                //   : "inherit",
                                wordBreak: "break-word",
                              }}
                              className={col.sticky ? styles.stickyCol : ""}
                            >
                              {Array.isArray(row[cellKey]) ? (
                                cellKey !== "comparison" ? (
                                  row[cellKey].map((item, id) => (
                                    <Chip
                                      style={{ margin: "3px" }}
                                      key={id}
                                      label={item}
                                    />
                                  ))
                                ) : (
                                  <HSBar
                                    showTextIn
                                    height={20}
                                    data={row[cellKey]}
                                  />
                                )
                              ) : col.fieldType === "Check Box" ? (
                                <MatTableCell>
                                  <Checkbox
                                    disabled={true}
                                    checked={
                                      row[cellKey]
                                        ? parseInt(row[cellKey])
                                        : false
                                    }
                                  />
                                </MatTableCell>
                              ) : (
                                row[cellKey]?.length > 100
                                  ? (<Tooltip
                                    title={row[cellKey]}

                                    style={{ maxHeight: "120px", textAlign: "left", margin: "0" }} placement="right-start"
                                  >
                                    <div className={styles.ellipsis}>
                                      {row[cellKey]}

                                    </div>

                                  </Tooltip>)
                                  : row[cellKey]

                                // : (col.fieldType==="Radio Button")?(
                                //   <MatTableCell>
                                //     <Radio
                                //       disabled={true}
                                //       checked={row[cellKey]}
                                //     />
                                //   </MatTableCell>
                                //   )


                              )}
                            </MatTableCell>
                          ) : null
                        )
                      )}
                      {selectedAction === "MenuAction" &&
                        !(
                          (row.deleted || row.selectAction) &&
                          Actions &&
                          MenuActions
                        ) && (
                          <MatTableCell
                            style={{
                              opacity: row.deleted && !row?.termStatus ? "0.38" : "1",
                            }}
                            className={props.config.firstColumnFixed ? styles.stickyColRight : ""}
                          >
                            <IconButton
                              onClick={(e) => handleClick(e, row)}
                              disabled={row.deleted && !row?.termStatus}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </MatTableCell>
                        )}

                      {!!(row?.comparison === "Unable to fetch data") &&
                        !!props?.config?.actions?.disabledAction ? (
                        <MatTableCell>
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
                              style={{
                                opacity:
                                  row?.comparison === "Unable to fetch data"
                                    ? "0.38"
                                    : "1",
                              }}
                              onClick={(e) => {
                                props.config.actions.action(row);
                              }}
                              disabled={true}
                            >
                              {props.config.actions.icon}
                            </IconButton>
                          </Tooltip>
                        </MatTableCell>
                      ) : (
                        <>
                          {(selectedAction === "Action" ||
                            ((row.deleted || row.selectAction) &&
                              Actions &&
                              MenuActions)) && (
                              <MatTableCell
                                style={{
                                  opacity: row.deleted && !row?.termStatus ? "0.38" : "1",
                                }}
                              >
                                <Tooltip
                                  placement="left"
                                  arrow
                                  title={
                                    row?.termStatus
                                      ? row.deleted
                                        ? UNTERM_ENVI
                                        : TERM_ENVI
                                      : props.config.actions.tooltipText
                                        ? props.config.actions.tooltipText
                                        : ""
                                  }

                                >
                                  <IconButton
                                    onClick={(e) => {
                                      props.config.actions.action(row);
                                    }}
                                    disabled={
                                      row.deleted &&
                                      props.config.actions.display === "Hide"
                                    }
                                  >
                                    {/* {props.config.actions.icon} */}
                                    {

                                      row?.termStatus
                                        ? row.deleted
                                          ? <RestoreFromTrashIcon fontSize="small" />
                                          : <DeleteIcon fontSize="small" />
                                        : props.config.actions.icon
                                          ? props.config.actions.icon
                                          : ""
                                    }
                                  </IconButton>
                                </Tooltip>
                              </MatTableCell>
                            )}
                        </>
                      )}
                    </StyledTableRow>
                  ))}

                {selectedAction === "MenuAction" && (
                  <CommonMenu
                    anchorEl={anchorEl}
                    open={open}
                    activeRow={activeModule}
                    onClose={handleClose}
                    options={props.config.menuOptions}
                  />
                )}
              </>
            ) : (
              <MatTableCell
                className={styles.noRecordsClass}
                colSpan={props.noRecordsCols}
              >
                <CardContent className={styles.noDataCard}>
                  <Typography variant="h5">
                    {props.customNoRecordsMessage}
                  </Typography>
                </CardContent>
              </MatTableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer style={{ maxWidth: props.config.maxWidth ? props.config.maxWidth : "none", overflow: "hidden" }}>
        <Table className={styles.table} aria-label="simple table" size="small">

          {props.config.paginationOption === "custom" && (
            <CustomPagination
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />

          )}
        </Table>
      </TableContainer>
      {!props.customNoRecords && props.config.paginationOption === "no" ? null
        :
        !props.customNoRecords && props.config.paginationOption !== "custom" && (
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
