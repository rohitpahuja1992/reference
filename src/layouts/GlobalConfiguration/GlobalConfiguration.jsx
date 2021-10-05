import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
//import MatContainer from "../../components/MaterialUi/MatContainer";
import Submodules from "../Submodules";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { GLOBAL_CONF } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
}));

const GlobalConfiguration = () => {
  let { path } = useRouteMatch();
  //const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();

  useEffect(() => {
    dispatch(updateHeaderTitle(GLOBAL_CONF));
  }, [dispatch]);

  return (
    <>
      <Grid item className={styles.grow}>
        <Switch>
          <Route exact path={`${path}`} render={(props) => (
            <Submodules {...props} urlPath={'global-config'} />
          )} />
        </Switch>
      </Grid>
    </>
  );
};

export default GlobalConfiguration;
