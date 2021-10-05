import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//import ReactPaginate from "react-paginate";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import listStyles from "./ListTableStyle.module.scss";
import { LIST_PAGE_SIZE } from "../../utils/AppConstants";
import { fetchOOBSubmodulesByOOBModuleId } from "../../actions/OOBSubmoduleActions";
import CommonMenu from "../../components/CommonMenu";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    wordBreak: "break-word",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
}));

const ListTable = (props) => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [perPage] = useState(4);
  const [pageCount, setPageCount] = useState(0);
  const { moduleId, versionId } = useParams();
  //const styles = useStyles();
  const styles = useStyles();
  const totalElements = useSelector(
    (state) => state.OOBSubmodule.getSubmodules.totalElements
  );
  const startIndex = useSelector((state) => state.OOBSubmodule.page.startIndex || 0);
  const [page, setPage] = useState(startIndex / LIST_PAGE_SIZE + 1);
  const [activeModule, setActiveModule] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const Actions = Boolean(props.config.actions);
  const MenuActions = Boolean(props.config.menuOptions);
  const open = Boolean(anchorEl);

  const getData = () => {
    const res = props?.data;
    //const data = res?.data;
    const slice = res.slice(offset, offset + perPage);
    const postData = slice.map((pd) => (
      <div className={listStyles.listitem} key={pd.submoduleId}>
        <span className={styles.cardTitle}>{pd.submoduleName}</span>
        <p>{pd.controlCount}</p>
        {selectedAction === "MenuAction" && (
          <IconButton
            onClick={(e) => handleClickBox(e, pd)}
            className={listStyles.iconBtn}
          >
            <MoreVertIcon />
          </IconButton>
        )}

        {selectedAction === "Action" && (
          // &&
          // Actions &&
          // MenuActions) && (
          <Tooltip
            placement="top"
            arrow
            title={
              props.config.actions.tooltipText
                ? props.config.actions.tooltipText
                : ""
            }
          >
            <IconButton
              className={listStyles.iconBtn}
              onClick={(e) => {
                props.config.actions.action(pd);
              }}
            >
              {props.config.actions.icon}
            </IconButton>
          </Tooltip>
        )}
      </div>
    ));
    setData(postData);
    setPageCount(Math.ceil(data.length / perPage));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickBox = (event, module) => {
    setActiveModule(module);
    setAnchorEl(event.currentTarget);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
    dispatch(
      fetchOOBSubmodulesByOOBModuleId(
        moduleId,
        versionId,
        (page - 1) * LIST_PAGE_SIZE,
        LIST_PAGE_SIZE
      )
    );
    // const selectedPage = e.selected;
    // setOffset(selectedPage + 1);
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

  useEffect(() => {
    getData();
  }, [props.data]);

  useEffect(() => {
    setPage(startIndex / LIST_PAGE_SIZE + 1);
  }, [startIndex]);

  return (
    <>
      <div className={listStyles.componentList}>{data}</div>
      <Grid
        container
        style={{
          width: "auto",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingTop: "8px",
        }}
      >
        {LIST_PAGE_SIZE * (page - 1) + 1}
        {"-"}
        {LIST_PAGE_SIZE * page > totalElements
          ? totalElements
          : LIST_PAGE_SIZE * page}
        {" of "}
        {totalElements}
        <Pagination
          count={Math.ceil(totalElements / 4)}
          page={page}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Grid>
      {selectedAction === "MenuAction" && (
        <CommonMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          options={props.config.menuOptions}
          activeRow={activeModule}
        />
      )}
      {/* <ReactPaginate
     previousLabel={"prev"}
     nextLabel={"next"}
     breakLabel={"..."}
     breakClassName={"break-me"}
     pageCount={pageCount}
     marginPagesDisplayed={2}
     pageRangeDisplayed={5}
     onPageChange={handlePageClick}
     containerClassName={listStyles.pagination}
     subContainerClassName={"pages pagination"}
     activeClassName={"active"}
   /> */}
    </>
  );
};

export default ListTable;
