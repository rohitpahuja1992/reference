import React from "react";
import { makeStyles } from "@material-ui/core";

import Menu from "@material-ui/core/Menu";

import MatMenuItem from "../MaterialUi/MatMenuItem";
import MatListItemIcon from "../MaterialUi/MatListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  noAccess: {
    color: theme.palette.error.main,
    textDecoration: "line-through",
  },
}));

const ShowMorePopUp = (props) => {
  const {
    anchorEl,
    open,
    onClose,
    options,
    startFrom,
    selectedOptions,
    listName,
  } = props;
  const styles = useStyles();
  return (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={onClose}>
      {options &&
        options.map(
          (item, index) =>
            index > startFrom && (
              <MatMenuItem
                key={index}
                disabled
                style={{ opacity: 1, paddingTop: "1px", paddingBottom: "1px" }}
              >
                <MatListItemIcon>
                  {selectedOptions.some((list) => item.id === list.id) ? (
                    <CheckCircleIcon color="primary" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </MatListItemIcon>
                <ListItemText
                  className={
                    !selectedOptions.some((list) => item.id === list.id)
                      ? styles.noAccess
                      : ""
                  }
                  primary={
                    <Typography
                      variant="body2"
                      style={{ wordBreak: "break-word" }}
                    >
                      {item[listName]}
                    </Typography>
                  }
                />
              </MatMenuItem>
            )
        )}
    </Menu>
  );
};

export default ShowMorePopUp;
