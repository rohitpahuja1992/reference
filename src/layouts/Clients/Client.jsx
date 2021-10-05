// import React, {useEffect}from 'react';
// import {useDispatch} from 'react-redux';
// import { Switch, Route, useRouteMatch } from 'react-router-dom';

// import ClientList from "./ClientList";
// import ClientProfile from "./ClientProfile";
// import {fetchModule} from '../../actions/ModuleActions';
// import {fetchEnvironment} from '../../actions/EnvironmentActions';
// import {fetchCodeVersion} from '../../actions/CodeVersionActions';
// import {fetchUsers} from '../../actions/UserActions';
// import {fetchClientsProfile} from '../../actions/ClientActions';


// const Client = () => {
//     let { path } = useRouteMatch();
//     const dispatch = useDispatch();

//     useEffect(() => {
//             dispatch(fetchClientsProfile());
//             dispatch(fetchModule());
//             dispatch(fetchEnvironment());
//             dispatch(fetchCodeVersion());
//             dispatch(fetchUsers());
//          },
//              [dispatch]
//         );

//     return (
//         <Switch>
//             <Route exact path={`${path}`} component={ClientList} />
//             <Route exact path={`${path}/client-profile/:clientId`} component={ClientProfile} />
//         </Switch>
//     )
    
// }

// export default Client;