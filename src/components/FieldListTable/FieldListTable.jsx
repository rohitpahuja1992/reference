import React from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Chip from "@material-ui/core/Chip";
import CommonMenu from "../../components/CommonMenu";
import MatAvatar from "../../components/MaterialUi/MatAvatar";
import MatTableCell from "../../components/MaterialUi/MatTableCell";

const useStyles = makeStyles((theme) => ({
  //   table: {
  //     minWidth: 650
  //   },
  tableHead: {
    paddingTop: "10px",
    paddingBottom: "8px",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.primary.light,
    // color: theme.palette.common.white,
    fontSize: "14px",
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

const FieldListTable = (props) => {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeModule, setActiveModule] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      <TableContainer
        style={{ maxWidth: props.maxWidth ? props.maxWidth : "none" }}
      >
        <Table className={styles.table} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {props.config.tableType && (
                <StyledTableCell style={{ width: "40px" }}></StyledTableCell>
              )}

              {props.cols.map((col, key) => (
                <StyledTableCell
                  key={key}
                  component="th"
                  className={styles.tableHead}
                  style={{ minWidth: col.minWidth ? col.minWidth : "none" }}
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
              {(props.config.actions || props.config.menuOptions) && (
                <StyledTableCell style={{ width: "40px" }}></StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(props.rows, getComparator(order, orderBy))
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow key={index}>
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
                            opacity: row.deleted ? "0.38" : "1",
                            // color: row.deleted
                            //   ? "rgba(0, 0, 0, 0.38)"
                            //   : "inherit",
                            wordBreak: "break-word",
                            paddingTop: "0px",
                            paddingBottom: "0px",
                          }}
                        >
                          {Array.isArray(row[cellKey])
                            ? row[cellKey].map((item, id) => (
                                <Chip
                                  style={{ margin: "3px" }}
                                  key={id}
                                  label={item}
                                />
                              ))
                            : row[cellKey]}
                        </MatTableCell>
                      ) : null
                    )
                  )}

                  {props.config.menuOptions && (
                    <MatTableCell
                      style={{
                        opacity: row.deleted ? "0.38" : "1",
                        paddingTop: "0px",
                        paddingBottom: "0px",
                      }}
                    >
                      <IconButton
                        onClick={(e) => handleClick(e, row)}
                        //disabled={row.deleted}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </MatTableCell>
                  )}

                  {props.config.actions && (
                    <MatTableCell
                      style={{
                        opacity: row.deleted ? "0.38" : "1",
                        paddingTop: "0px",
                        paddingBottom: "0px",
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
                            row.deleted &&
                            props.config.actions.display === "Hide"
                          }
                        >
                          {props.config.actions.icon}
                        </IconButton>
                      </Tooltip>
                    </MatTableCell>
                  )}
                </StyledTableRow>
              ))}

            {props.config.menuOptions && (
              <CommonMenu
                anchorEl={anchorEl}
                open={open}
                activeRow={activeModule}
                onClose={handleClose}
                options={props.config.menuOptions}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
  );
};

export default FieldListTable;
