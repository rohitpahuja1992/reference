import React from "react";

import { makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import MatCard from "../MaterialUi/MatCard";
import MatListItemIcon from "../MaterialUi/MatListItemIcon";

import NestedSubMenu from "../NestedSubMenu";

const useStyles = makeStyles((theme) => ({
  menuCard: {
    background: theme.palette.primary.light,
    width: "240px",
    height: "calc(100vh - 100px)",
    overflow: "auto",
    marginTop: "0",
    marginBottom: "0",
    [theme.breakpoints.down("md")]: {
      height: "auto",
    },
  },
  menuHeading: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
}));

const SideSubMenu = (props) => {
  const styles = useStyles();

  return (
    <MatCard className={styles.menuCard}>
      {props.options.map((option, key) => (
        <div key={key}>
          {option.type === "linkToBack" && (
            <List component="nav" className={styles.menuHeading}>
              <ListItem button onClick={option.action}>
                <MatListItemIcon>
                  <ArrowBackIcon />
                </MatListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">{option.label}</Typography>
                  }
                />
              </ListItem>
              <Divider />
            </List>
          )}

          {option.type === "menu" && <NestedSubMenu option={option} />}
        </div>
      ))}
    </MatCard>
  );
};

export default SideSubMenu;
