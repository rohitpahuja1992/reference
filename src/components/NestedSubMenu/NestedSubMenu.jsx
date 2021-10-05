import React from "react";

import { makeStyles } from "@material-ui/core";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import MatAvatar from "../MaterialUi/MatAvatar";
import MatListItemIcon from "../MaterialUi/MatListItemIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    paddingTop: "0px",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  menuAvatar: {
    width: theme.spacing(4.1),
    height: theme.spacing(4.1),
  },
  active: {
    background: theme.palette.primary.main,
    color: "#ffffff",
    "&:hover": {
      background: theme.palette.primary.main,
    },
    "& $menuAvatar": {
      background: "rgba(0,0,0,0.3)",
    },
  },
}));

const NestedSubMenu = (props) => {
  const styles = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = (isExpandable) => {
    if (isExpandable) setOpen(!open);
  };

  const handleActiveClass = (activePages, pagePath) => {
    if (activePages) {
      let urlPath = window.location.pathname;
      let isPageActive = activePages.some((value) => {
        return (
          (pagePath === value && urlPath === value) ||
          (pagePath !== value && urlPath.indexOf(value) >= 0)
        );
      });
      return isPageActive ? styles.active : "";
    } else {
      return "";
    }
  };

  return (
    <>
      <List dense={true} component="nav" className={styles.root}>
        <ListItem
          button={props.option.isExpandable}
          onClick={() => handleClick(props.option.isExpandable)}
        >
          <ListItemText
            primary={
              <Typography variant="body2">{props.option.label}</Typography>
            }
          />
          {props.option.isExpandable &&
            (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        {props.option.children.map((menu, key) => (
          <Collapse key={key} in={open} timeout="auto" unmountOnExit>
            <List dense={true} component="div" disablePadding>
              <ListItem
                className={handleActiveClass(menu.activePages, menu.path)}
                button
                onClick={menu.action}
              >
                {menu.type === "linkWithAvatar" && menu.icon && (
                  <ListItemAvatar>
                    <MatAvatar
                      className={styles.menuAvatar}
                      type="imgIcon"
                      width="17"
                    >
                      {menu.icon}
                    </MatAvatar>
                  </ListItemAvatar>
                )}

                {menu.type === "linkWithIcon" && menu.icon && (
                  <MatListItemIcon>{menu.icon}</MatListItemIcon>
                )}

                <ListItemText
                  primary={
                    <Typography variant="body2">{menu.label}</Typography>
                  }
                  secondary={
                    menu.subText && (
                      <Typography variant="caption">{menu.subText}</Typography>
                    )
                  }
                />
              </ListItem>
            </List>
          </Collapse>
        ))}
      </List>
      <Divider />
    </>
  );
};

export default NestedSubMenu;
