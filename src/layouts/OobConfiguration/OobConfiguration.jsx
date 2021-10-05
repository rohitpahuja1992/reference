import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Modules from "../Modules";
import Submodules from "../Submodules";
import CompareVersions from "../CompareVersions";

import OobSubmodule from "../OobSubmodule";
import OobQuestions from "../OobQuestions";
import OobForms from "../OobForms";
import OobSections from "../OobSections";
import OobFields from "../OobFields";
import OobTables from "../OobTables";
import OobControls from "../OobControls";
import OobControlGroup from "../OobControlGroup";
import ManageOobField from "../ManageOobField";
// import { fetchOOBModule } from "../../actions/OOBModuleActions";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { fetchMasterModule } from "../../actions/MasterModuleActions";
import {
  RESET_DUPLICATE_ERROR,
  RESET_DEFAULTVERSION,
} from "../../utils/AppConstants";
import {
  OUT_OF_BOX_CONF,
  //GLOBAL_CONF,
} from "../../utils/Messages";


const OobConfiguration = () => {
  const dispatch = useDispatch();
  let { path } = useRouteMatch();

  useEffect(() => {
    // if (path === "/admin/global-config") {
    //   // dispatch(fetchOOBModule("global"));
    //   dispatch(updateHeaderTitle(GLOBAL_CONF));
    //   dispatch(fetchMasterModule("global"));
    // } else {
      // dispatch(fetchOOBModule("oob"));
      dispatch(updateHeaderTitle(OUT_OF_BOX_CONF));
      dispatch(fetchMasterModule());
    //}
    dispatch({ type: RESET_DUPLICATE_ERROR });
    dispatch({ type: RESET_DEFAULTVERSION });
  }, [dispatch]);

  return (
    <Switch>
      <Route exact path={`${path}`} component={Modules} />
      <Route
        exact
        path={`${path}/components/:moduleId/:oobModuleId/:versionId`}
        component={Submodules}
      />
      <Route
        exact
        path={`${path}/version-history/:moduleId/:oobModuleId/:versionId`}
        component={Submodules}
      />
      <Route
        exact
        path={`${path}/compare-versions/:moduleId/:oobModuleId/:versionId`}
        component={CompareVersions}
      />
      <Route
        exact
        path={`${path}/two-version-difference/:moduleId/:oobModuleId/:versionId/:firstVersion/:secondVersion`}
        component={CompareVersions}
      />

      <Route
        exact
        path={`${path}/fields/:moduleId/:oobModuleId/:versionId/:submoduleId/:oobSubmoduleId`}
        component={OobFields}
      />
      <Route
        exact
        path={`${path}/field-details/:moduleId/:oobModuleId/:versionId/:submoduleId/:oobSubmoduleId/:oobControlId`}
        component={ManageOobField}
      />

      <Route exact path={`${path}/sections`} component={OobSections} />
      <Route exact path={`${path}/controls`} component={OobControls} />
      <Route
        exact
        path={`${path}/control-group/:controlId`}
        component={OobControlGroup}
      />
      <Route exact path={`${path}/fields-sections`} component={OobSubmodule} />
      <Route exact path={`${path}/questions`} component={OobQuestions} />
      <Route exact path={`${path}/forms`} component={OobForms} />
      <Route exact path={`${path}/tables`} component={OobTables} />
    </Switch>
  );
};

export default OobConfiguration;
