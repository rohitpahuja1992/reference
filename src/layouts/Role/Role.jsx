import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import MatCard from "../../components/MaterialUi/MatCard";
import ShowMorePopUp from "../../components/ShowMorePopUp";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
// import EditIcon from '@material-ui/icons/Edit';
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
//import CancelIcon from "@material-ui/icons/Cancel";
import MoreIcon from "@material-ui/icons/More";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PageHeading from "../../components/PageHeading";

import { fetchRoles } from "../../actions/RoleActions";
import { fetchFeatures } from "../../actions/FeatureActions";
import { fetchQueues } from "../../actions/QueueActions";
import { UPDATE_ROLE_PERMISSION } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
  },
  card: {
    width: "-webkit-fill-available",
  },
  cardTitle: {
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  cardCaption: {
    color: "#84858a",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  description: {
    paddingTop: "0px",
    marginTop: "-7px",
    paddingBottom: "10px !important",
  },
  accessCard: {
    padding: "7px 0 0 !important",
  },
  accessSubHeader: {
    lineHeight: "30px",
  },
  accessIconContainer: {
    minWidth: "30px",
  },
  accessListItemText: {
    margin: "0px",
    wordBreak: "break-word",
  },
  noAccess: {
    color: theme.palette.error.main,
    textDecoration: "line-through",
  },
}));

// const features = [
//     { id: 1, name: "Master List of Clients to Access", internalName: "clientListAccess", isAccess: true },
//     { id: 2, name: "Client Specific Dashboards", internalName: "clientDashboard", isAccess: true },
//     { id: 3, name: "Update Field Configuration Options", internalName: "updateFieldConfiguration", isAccess: true },
//     { id: 4, name: "Approve Requirements", internalName: "approveRequirements", isAccess: true },
//     { id: 5, name: "Remove Client Sign Off", internalName: "removeClientSignOff", isAccess: true },
//     { id: 6, name: "Add Comments", internalName: "addComments", isAccess: true },
//     { id: 7, name: "Mark as Exception", internalName: "markAsException", isAccess: true },
//     { id: 8, name: "Mark Field for Review", internalName: "markFieldForReview", isAccess: true },
//     { id: 9, name: "User Provisioning", internalName: "userProvisioning", isAccess: true },
//     { id: 10, name: "Add/Edit/Term Clients", internalName: "addEditTermClients", isAccess: true },
//     { id: 11, name: "Hierarchy File Load", internalName: "hierarchyFileLoad", isAccess: true },
//     { id: 12, name: "Module/OOB Editing Screen", internalName: "moduleOobEditingScreen", isAccess: true },
//     { id: 13, name: "Pass/Fail", internalName: "passFail", isAccess: false },
//     { id: 14, name: "Add Comments when marking Pass or Fail", internalName: "addPassFailComments", isAccess: false }
//   ];

//   const queues= [
//     { id: 1, name: "Client Queue", internalName: "clientQueue", isAccess: true },
//     { id: 2, name: "Review Queue", internalName: "reviewQueue", isAccess: true },
//     { id: 3, name: "Product Queue", internalName: "productQueue", isAccess: true },
//     { id: 4, name: "Exception Queue", internalName: "exceptionQueue", isAccess: true },
//     { id: 5, name: "Config Queue", internalName: "configQueue", isAccess: true },
//     { id: 6, name: "QA Queue", internalName: "qAQueue", isAccess: true }
//   ];

const Role = () => {
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [popUpAnchorEl, setPopUpAnchorEl] = React.useState(null);
  const [popUpOptions, setPopUpOptions] = React.useState(null);
  const [popUpSelectedOptions, setPopUpSelectedOptions] = React.useState(null);
  const [popUpListName, setPopUpListName] = React.useState(null);
  const [popUpStartFrom, setPopUpStartFrom] = React.useState(0);
  const isPopUpOpen = Boolean(popUpAnchorEl);
  const roles = useSelector((state) => state.Role.data.list);
  const featuresAssigned = useSelector(
    (state) => state.User.features 
  );
  
  //const features = useSelector((state) => state.Feature.data.list);
  //const queues = useSelector((state) => state.Queue.data.list);

  const handlePopUpClick = (event, data, startFrom, listName, selectedData) => {
    setPopUpStartFrom(startFrom);
    setPopUpOptions(data);
    setPopUpListName(listName);
    setPopUpSelectedOptions(selectedData);
    setPopUpAnchorEl(event.currentTarget);
  };

  const handlePopUpClose = () => {
    setPopUpAnchorEl(null);
  };

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchFeatures());
    dispatch(fetchQueues());
  }, [dispatch]);

  return (
   
    <>
      <PageHeading
        heading="Roles"
      // action={
      //     <MatButton>Add New Role</MatButton>
      // }
      />
      <section className={styles.clientList}>
        <Grid container>
          {roles.map((prop, key) => (
            <Grid item xs={12} sm={4} key={key} >
              <MatCard className={styles.card}>
                <CardHeader
                  // avatar={
                  //     <Avatar aria-label="recipe" className={styles.avatar}>
                  //       {prop.role[0]}
                  //     </Avatar>
                  //   }
                  action={
                    featuresAssigned.indexOf(UPDATE_ROLE_PERMISSION) !== -1 ?
                      <Tooltip placement="left" arrow title="View &amp; Update">
                        <IconButton
                          aria-label="settings"
                          onClick={() =>
                            history.push(
                              `/admin/access-control/role-details/${prop.id}`
                            )
                          }
                        >
                          <RateReviewIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      :
                      <Tooltip placement="left" arrow title="View Details">
                        <IconButton
                          aria-label="settings"
                          onClick={() =>
                            history.push(
                              `/admin/access-control/role-details/${prop.id}`
                            )
                          }
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                  }
                  title={
                    <Typography
                      className={styles.cardTitle}
                      variant="subtitle1"
                    >
                      {prop.roleName}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      className={styles.cardCaption}
                      variant="caption"
                      display="block"
                    >
                      Role Type: {prop.roleType}
                    </Typography>
                  }
                />
                <CardContent className={styles.description}>
                  <Typography variant="body2">{prop.roleDesc}</Typography>
                </CardContent>
                <Divider />
                <CardContent className={styles.accessCard}>
                  <List
                    dense={true}
                    subheader={
                      <ListSubheader className={styles.accessSubHeader}>
                        Features
                      </ListSubheader>
                    }
                  >
                    {prop.features.length > 0 ? (
                      prop.features.map(
                        (feature, index) =>
                          index < 4 && (
                            <ListItem>
                              <ListItemIcon
                                className={styles.accessIconContainer}
                              >
                                <CheckCircleIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              </ListItemIcon>
                              <ListItemText primary={feature.featureName} />
                            </ListItem>
                          )
                      )
                    ) : (
                        <Typography
                          variant="body2"
                          style={{ marginLeft: "15px" }}
                        >
                          No Feature Associated With {prop.roleName} Role
                        </Typography>
                      )}

                    {prop.features.length > 4 && (
                      <ListItem
                        button
                        onClick={(e) =>
                          handlePopUpClick(
                            e,
                            prop.features,
                            3,
                            "featureName",
                            prop.features
                          )
                        }
                      >
                        <ListItemIcon className={styles.accessIconContainer}>
                          <MoreIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          className={styles.accessListItemText}
                          primary="More"
                        />
                      </ListItem>
                    )}

                    {/* {features.map(
                      (feature, index) =>
                        index < 4 && (
                          <ListItem>
                            <ListItemIcon
                              className={styles.accessIconContainer}
                            >
                              {prop.features.some(
                                (list) => list.id === feature.id
                              ) ? (
                                <CheckCircleIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              ) : (
                                <CancelIcon color="error" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              className={`${styles.accessListItemText} ${
                                !prop.features.some(
                                  (list) => list.id === feature.id
                                ) && styles.noAccess
                              }`}
                              primary={feature.featureName}
                            />
                          </ListItem>
                        )
                    )} */}

                    {/* {features.length > 4 && (
                      <ListItem
                        button
                        onClick={(e) =>
                          handlePopUpClick(
                            e,
                            features,
                            3,
                            "featureName",
                            prop.features
                          )
                        }
                      >
                        <ListItemIcon className={styles.accessIconContainer}>
                          <MoreIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          className={styles.accessListItemText}
                          primary="More"
                        />
                      </ListItem>
                    )} */}
                  </List>
                </CardContent>
              {/* Temporary removed Queues later we can enable it.... */}
              {/*  <Divider />
                 <CardContent className={styles.accessCard}>
                  <List
                    dense={true}
                    subheader={
                      <ListSubheader className={styles.accessSubHeader}>
                        Queues
                      </ListSubheader>
                    }
                  >
                    {prop.queues.length > 0 ? (
                      prop.queues.map(
                        (queue, index) =>
                          index < 3 && (
                            <ListItem>
                              <ListItemIcon
                                className={styles.accessIconContainer}
                              >
                                <CheckCircleIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              </ListItemIcon>
                              <ListItemText primary={queue.name} />
                            </ListItem>
                          )
                      )
                    ) : (
                        <Typography
                          variant="body2"
                          style={{ marginLeft: "15px" }}
                        >
                          No Queue Associated With {prop.roleName} Role
                        </Typography>
                      )}

                    {prop.queues.length > 3 && (
                      <ListItem
                        button
                        onClick={(e) =>
                          handlePopUpClick(
                            e,
                            prop.queues,
                            2,
                            "name",
                            prop.queues
                          )
                        }
                      >
                        <ListItemIcon className={styles.accessIconContainer}>
                          <MoreIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          className={styles.accessListItemText}
                          primary="More"
                        />
                      </ListItem>
                    )}
                    {/* {queues.map(
                      (queue, index) =>
                        index < 3 && (
                          <ListItem>
                            <ListItemIcon
                              className={styles.accessIconContainer}
                            >
                              {prop.queues.some(
                                (list) => list.id === queue.id
                              ) ? (
                                  <CheckCircleIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                ) : (
                                  <CancelIcon color="error" fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                              className={`${styles.accessListItemText} ${
                                !prop.queues.some(
                                  (list) => list.id === queue.id
                                ) && styles.noAccess
                                }`}
                              primary={queue.name}
                            />
                          </ListItem>
                        )
                    )} */}

                    {/* {queues.length > 3 && (
                      <ListItem
                        button
                        onClick={(e) =>
                          handlePopUpClick(e, queues, 2, "name", prop.queues)
                        }
                      >
                        <ListItemIcon className={styles.accessIconContainer}>
                          <MoreIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          className={styles.accessListItemText}
                          primary="More"
                        />
                      </ListItem>
                    )} 
                  </List>
                  </CardContent> */}
              </MatCard>
            </Grid>
          ))}
        </Grid>
        <ShowMorePopUp
          anchorEl={popUpAnchorEl}
          open={isPopUpOpen}
          onClose={handlePopUpClose}
          startFrom={popUpStartFrom}
          selectedOptions={popUpSelectedOptions}
          listName={popUpListName}
          options={popUpOptions}
        />
      </section>
    </>
  );
};

export default Role;
