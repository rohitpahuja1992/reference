import {
  FETCH_USERAUDIT_COMPLETE,
  FETCH_USERAUDIT_FAILURE,
  RESET_USERAUDIT
} from "../utils/AppConstants";

const initState = {
  userAuditDetails: [],
  totalElements:0,
  //   {
  //     id: 259,
  //     createdDate: "2020-07-24T12:28:58.000+0000",
  //     updatedDate: "2020-08-28T13:39:24.000+0000",
  //     updatedByUser: "Nirbhay Sharma",
  //     createdByUser: "Creese Donna",
  //     changes: [
  //       {
  //         valueTo: "Sharma2",
  //         key: "/last_name",
  //         valueFrom: "Sharma1",
  //         action: "REPLACE",
  //       },
  //     ],
  //     action: "UPDATE",
  //     controlData:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598621964000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"sharma2","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //     controlDataPrevious:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598620000000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"sharma1","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //   },
  //   {
  //     id: 259,
  //     createdDate: "2020-07-24T12:28:58.000+0000",
  //     updatedDate: "2020-08-28T13:06:40.000+0000",
  //     updatedByUser: "Nirbhay Sharma",
  //     createdByUser: "Creese Donna",
  //     changes: [
  //       {
  //         valueTo: "Sharma1",
  //         key: "/last_name",
  //         valueFrom: "Kumar1",
  //         action: "REPLACE",
  //       },
  //     ],
  //     action: "UPDATE",
  //     controlData:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598620000000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"sharma1","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //     controlDataPrevious:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598533600000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"kumar1","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //   },
  //   {
  //     id: 259,
  //     createdDate: "2020-07-24T12:28:58.000+0000",
  //     updatedDate: "2020-08-27T13:06:40.000+0000",
  //     updatedByUser: "Nirbhay Sharma",
  //     createdByUser: "Creese Donna",
  //     changes: [
  //       {
  //         valueTo: "Kumar1",
  //         key: "/last_name",
  //         valueFrom: "Sharma",
  //         action: "REPLACE",
  //       },
  //     ],
  //     action: "UPDATE",
  //     controlData:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598533600000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"kumar1","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //     controlDataPrevious:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598447200000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"sharma","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //   },
  //   {
  //     id: 259,
  //     createdDate: "2020-07-24T12:28:58.000+0000",
  //     updatedDate: "2020-08-26T13:06:40.000+0000",
  //     updatedByUser: "Nirbhay Sharma",
  //     createdByUser: "Creese Donna",
  //     changes: [
  //       {
  //         valueTo: "Nirbhay Sharma",
  //         key: "/updatedByUser",
  //         valueFrom: null,
  //         action: "REPLACE",
  //       },
  //       {
  //         valueTo: "Sharma",
  //         key: "/last_name",
  //         valueFrom: "Kumar",
  //         action: "REPLACE",
  //       },
  //       {
  //         valueTo: "111-000-5555",
  //         key: "/phone_number",
  //         valueFrom: "111-000-6666",
  //         action: "REPLACE",
  //       },
  //     ],
  //     action: "UPDATE",
  //     controlData:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":1598447200000,"updatedByUser":"Nirbhay Sharma","createdByUser":"Creese donna","first_name":"nirbhay","last_name":"sharma","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-5555","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //     controlDataPrevious:
  //       '{"id":259,"createdDate":1595593738000,"updatedDate":null,"updatedByUser":null,"createdByUser":"Creese donna","first_name":"nirbhay","last_name":"kumar","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-6666","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"roles":[],"clients":[],"_confirmed":false,"_enabled":true,"_deleted":false}',
  //   },
  //   {
  //     id: 259,
  //     createdDate: "2020-07-24T12:28:58.000+0000",
  //     updatedDate: null,
  //     updatedByUser: null,
  //     createdByUser: "Creese Donna",
  //     changes: [],
  //     action: "ADD",
  //     controlData:
  //       '{"id":259,"updatedByUser":null,"createdByUser":"Creese donna","first_name":"nirbhay","last_name":"kumar","email":"maggie_mhk@aainaarora93gmail.onmicrosoft.com","phone_number":"111-000-6666","active_role_id":0,"registration_date":null,"end_date":null,"last_login_time":null,"username":"maggie_mhk","password":null,"status":"ACTIVE","user_type":"MHK","cognito_user_id":"05f7b180-f0d0-4490-85a0-7069ba2913b3","accountNonLocked":false,"accountNonExpired":false,"credentialsNonExpired":false,"_confirmed":false,"_enabled":true,"_deleted":false}',
  //     controlDataPrevious: "",
  //   },
  // ],
  getError: "",
};

export const UserTimelineReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_USERAUDIT_COMPLETE:
      return {
        ...state,
        userAuditDetails: action.payload.oobComponents,
        totalElements:action.payload.totalElements,
        getError: "",
      };

    case FETCH_USERAUDIT_FAILURE:
      console.log("Failure");
      return {
        ...state,
        userAuditDetails: [],
        totalElements:0,
        getError: action.payload,
      };
    case RESET_USERAUDIT:
      console.log("Reset");
      return {
        ...state,
        userAuditDetails: [],
        totalElements:0,
        getError: "",
      };
    default:
      return { ...state };
  }
};
