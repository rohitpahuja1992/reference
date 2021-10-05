import React from "react";
//import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TablePagination from "@material-ui/core/TablePagination";

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

//import { fetchListByPage } from "../../actions/PaginationActions";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const CustomPagination = (props) => {
    //const [page, setPage] = useState(0);
    //const dispatch = useDispatch();
    //const [rowsPerPage, setRowsPerPage] = useState(10);
    //const totalElements = useSelector((state) => state.Pagination.DetailsList.totalElements);
    // const url = useSelector((state) => state.Pagination.page.url);
    // const entityName = useSelector((state) => state.Pagination.page.entityName);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     let pages = parseInt(event.target.value, 10);
    //     setRowsPerPage(pages);
    //     setPage(0);
    //     dispatch(fetchListByPage(url, 0, pages, entityName));

    // };

    return (
        <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            //, { label: 'All', value: -1 }
            //colSpan={3}
            count={props.count}
            rowsPerPage={props.rowsPerPage}
            page={props.page}
            SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
            }}
            onChangePage={props.onChangePage}
            onChangeRowsPerPage={props.onChangeRowsPerPage}
            //handleNextPage={props.handleNextPage}
            ActionsComponent={TablePaginationActions}
        />
    );
};


function TablePaginationActions(props) {
    const classes = useStyles1();
    //const dispatch = useDispatch();
    const theme = useTheme();
    //const url = useSelector((state) => state.Pagination.page.url);
    //const entityName = useSelector((state) => state.Pagination.page.entityName);
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
        //props.handleNextPage(0, rowsPerPage);
        //dispatch(fetchListByPage(url, 0, rowsPerPage, entityName));
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
        //props.handleNextPage((page - 1) * rowsPerPage, rowsPerPage);
        //dispatch(fetchListByPage(url, (page - 1) * rowsPerPage, rowsPerPage, entityName));
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
        //props.handleNextPage((page + 1) * rowsPerPage, rowsPerPage);
        //dispatch(fetchListByPage(url, (page + 1) * rowsPerPage, rowsPerPage, entityName));
    };

    const handleLastPageButtonClick = (event) => {
        let pages = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
        onChangePage(event, pages);
        //props.handleNextPage(pages * rowsPerPage, rowsPerPage);
        //dispatch(fetchListByPage(url, pages * rowsPerPage, rowsPerPage, entityName));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}


export default CustomPagination;