import { withStyles, TableCell } from "@material-ui/core";

const MatTableCell = withStyles({
    root: {
        fontSize: '13px',
    }
})(TableCell);

export default MatTableCell;