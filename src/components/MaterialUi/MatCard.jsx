import { withStyles, Card } from "@material-ui/core";

const MatCard = withStyles({
    root: {
        margin: '8px',
        boxShadow: '0 1px 10px rgba(34,39,83,.08)'
    }
})(Card);

export default MatCard;