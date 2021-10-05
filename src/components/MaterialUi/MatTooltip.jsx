import { withStyles, Tooltip } from "@material-ui/core";

const MatTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.secondary.light,
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 280,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid ' + theme.palette.secondary.main,
    },
    arrow: {
        color: theme.palette.secondary.main,
    },
}))(Tooltip);

export default MatTooltip;