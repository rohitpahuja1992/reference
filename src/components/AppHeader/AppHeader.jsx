import React from "react";
//import { useDispatch } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
// import InputBase from "@material-ui/core/InputBase";
// import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
// import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
// import MailIcon from "@material-ui/icons/Mail";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { USER_LOGGED_OUT } from "../../utils/AppConstants";
import {
  CONFIRM,
  LOGOUT_MESSAGE,
  ACCOUNT_CURR_USER,
} from "../../utils/Messages";
import { VIEW_OWN_PROFILE } from "../../utils/FeatureConstants";
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  header: {
    // position: "relative", thic changed for making brder sticky by Mohit
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.025), 0px 4px 5px 0px rgba(0,0,0,0.025), 0px 1px 10px 0px rgba(0,0,0,0.025)",
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 5,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontWeight: 300,
    lineHeight: "20px",
  },
  subtitle: {
    fontWeight: 300,
    lineHeight: "14px",
    opacity: "0.8",
  },
  search: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    position: "relative",
    borderRadius: "5px",
    border: "1px solid #D6E3EB",
    backgroundColor: "#EDF2F5",
    "&:hover": {
      backgroundColor: "#EDF2F5",
      borderColor: theme.palette.primary.light,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 1.5),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1.4, 1, 1.4, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    color: "#5A5C66",
    fontWeight: 500,
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function AppHeader() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const headerData = useSelector((state) => state.Header.data);
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);
  const clientId = useSelector((state) => state.Header.entityId);
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const clearDataOnLogout = () => {
    dispatch({ type: USER_LOGGED_OUT });
    localStorage.clear();
    // if (loggedInInfo.user_type === "CLIENT") {
    //   history.push("/");
    // } else {
    //   history.push("/api/logout");
    // }
    history.push("/"); //Local Vdi
    //history.push("/api/logout"); //UAT
    window.location.reload(false);
  };

  const handleMyProfile = () => {
    if (loggedInInfo.user_type === "CLIENT") {
      history.push(`/client/user-profile/${clientId}/${loggedInInfo.id}`);
    } else {
      history.push(`/admin/user-profile/${loggedInInfo.id}`);
    }

    handleMenuClose();
  };

  const handleLogout = () => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: clearDataOnLogout,
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: LOGOUT_MESSAGE,
    };
    dispatch(showMessageDialog(messageObj));

    handleMenuClose();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {featuresAssigned.indexOf(VIEW_OWN_PROFILE) !== -1 && <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      {/* <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label={ACCOUNT_CURR_USER}
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.header}>
      <AppBar className={classes.root} position="static" color="transparent">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <div>
            {headerData.title && (
              <Typography className={classes.title} variant="h6" noWrap>
                {headerData.title}
              </Typography>
            )}

            {headerData.subtitle && (
              <Typography className={classes.subtitle} variant="caption" noWrap>
                {headerData.subtitle}
              </Typography>
            )}
          </div>

          {headerData && !headerData.title && clientInfo && (
            <Typography className={classes.title} variant="h6" noWrap>
              {clientInfo.clientName}
            </Typography>
          )}
          <div className={classes.grow} />
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div> */}
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> */}
            {/* <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              edge="end"
              aria-label={ACCOUNT_CURR_USER}
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
export default AppHeader;
