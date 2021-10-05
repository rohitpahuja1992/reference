import React from "react";
import { emphasize, withStyles, makeStyles } from "@material-ui/core";
//import Menu from '@material-ui/core/Menu';
import Chip from "@material-ui/core/Chip";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
// import HomeIcon from '@material-ui/icons/Home';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MenuItem from '@material-ui/core/MenuItem';

const styles = makeStyles((theme) => ({
  activeChip: {
    color: theme.palette.primary.main + "!important",
  },
}));

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);

export default function BreadcrumbView(props) {
  const classes = styles();
  return (
    <Breadcrumbs
      style={{ marginBottom: "8px" }}
      aria-label="breadcrumb"
      separator="//"
    >
      {props.options.map((option, key) => (
        <StyledBreadcrumb
          className={option.action && classes.activeChip}
          label={option.label}
          onClick={option.action}
          key={key}
        />
      ))}
    </Breadcrumbs>
  );
}
