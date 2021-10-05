import { withStyles, MenuItem } from "@material-ui/core";

const MatMenuItem = withStyles({
    root: {
        fontSize: '13px'
    }
})(MenuItem);

export default MatMenuItem;