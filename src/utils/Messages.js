import React from "react";
import Typography from "@material-ui/core/Typography";

export const ERROR_MESSAGE = "An error occurred. Please try again later.";
export const NO_RECORDS_MESSAGE = "No Record(s) Found";

export const NO_RECORDS_FOR_NEW_CONFIG = "No Record(s) for New Config";
export const NO_RECORDS_FOR_UPDATES = "No Record(s) for Updates";
export const NO_RECORDS_FOR_DELETIONS = "No Record(s) for Deletions";
export const NO_RECORDS_FOR_DEPLOY = "No Record(s) for Deployment";
export const NO_RECORDS_FOR_ENVIRONMENT_STATUS = "No Record(s) for Environment Status";
export const NO_RECORDS_FOR_DEPLOYMENT_HISTORY = "No Record(s) for Deployment History";
export const NO_RECORDS_FOR_DEPLOYMENT = "No Record(s) for Deployment";
export const COMMON_ERROR_MESSAGE =
  "OOPS! Something went wrong. Please try again later.";
export const DEFAULT_ERROR_MSG = "Error Occurred.";
export const ALREADY_USE_MODULE = "Can not remove the module, it is already in use.";
export const DEPLOYMENT_SCHEDULE_DOES_NOT_EXIST = "Deployment schedule does not exist";
export const DESTINATION_ENVIRONMENT_NOT_EXIST = "Destination environment not exist";
export const SCHEDULER_TIME_ALREADY_CONFIGURED = "Scheduler time already configured";
export const CLIENT_MODULE_SCHEDULER_DOES_NOT_EXISTS = "Client module scheduler does not exists";
export const DEPLOYMENT_SCHEDULER_IN_PROCESS = "Deployment scheduler in process";
export const DESTINATION_ENVIRONMENT_NOT_CONFIGURED_WITH_CLIENT = "Destination environment not configured with client";
// Client//
export const CLIENT_ALREADY_EXIST_MSG = "Client name already exists.";
export const CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED = "Cannot deploy child as parent is not deployed";
export const RELATIONSHIP_MANAGER_MANDATORY_MSG =
  "Relationship manager assignment is mandatory.";
export const ACCOUNT_STATUS_MANDATORY_MSG =
  "Account status assignment is mandatory.";
export const CODE_VERSION_MANDATORY_MSG =
  "Code version assignment is mandatory.";
export const CLIENT_NAME_MANDATORY_MSG = "Client name is mandatory.";
export const VALID_NAME_MSG = "Please enter a valid name.";
export const MAXIMUN_CHARACTER_ALLOWED_MSG = "Maximum 50 characters allowed.";
export const NO_HIERARCHY_FILE_MSG =
  "No hierarchy file uploaded, upload it using Manage Hierarchy.";

export const handleClientByIdMsg = (clientName, responseCode) => {
  if (responseCode === "2014")
    return {
      message: "Client id does not exist. Please try with another one.",
      messageType: "error",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

// MasterSubmodule//
export const handleMasterSubmoduleTerm = (
  submoduleName,
  responseCode,
  error
) => {
  if (responseCode === "200")
    return {
      message: `Component ${submoduleName} successfully deleted.`,
      messageType: "success",
    };
  else if (responseCode === "2244")
    return {
      message: `Can not delete the component "${submoduleName}", it is associated with oob.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterTableTerm = (tableName, responseCode, error) => {
  if (responseCode === "200")
    return {
      message: `Table ${tableName} successfully termed.`,
      messageType: "success",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

// MasterControl//
export const handleMasterControlTerm = (controlName, responseCode, error) => {
  if (responseCode === "200")
    return {
      message: `Control ${controlName} successfully termed.`,
      messageType: "success",
    };
  else if (responseCode === "2054")
    return {
      message: `Can not term the control "${controlName}", it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

//master module
export const handleAddModuleError = (moduleName, Error) => {
  if (Error.responseCode === "201") {
    return {
      message: `Module ${moduleName} successfully added.`,
      messageType: "success",
    }
  }
  else if (Error.responseCode === "2033") {
    return {
      message: Error.responseMessage,
      messageType: "warning",
    }
  }
  else { return { message: ERROR_MESSAGE, messageType: "error" } };
};

//Tag Indicator
export const handleTagsError = (Error) => {
  return { message: ERROR_MESSAGE, messageType: "error" };
};

export const handleAddTagError = (tagName, Error) => {
  if (Error.responseCode === "201")
    return {
      message: `Control ${tagName} successfully added.`,
      messageType: "success",
    };
  else if (Error.responseCode === "2216")
    return {
      message: `Can not add the tag "${tagName}", it is already added.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

export const handleTagTerm = (tagName, responseCode, error) => {
  if (responseCode === "200")
    return {
      message: `Control ${tagName} successfully termed.`,
      messageType: "success",
    };
  else if (responseCode === "2216")
    return {
      message: `Can not term the tag "${tagName}", it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateTag = (tagName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Tag " + tagName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

// Environment//
export const ENVIRONMENT_MANDATORY_MSG = "Environment is mandatory.";
export const VALID_ENVIRONMENT_NAME_MSG = "Enter valid environment name.";
export const ENVIRONMENT_ALREADY_EXIST_MSG = "Environment already exists.";

export const handleEnvironmentAddMsg = (environmentName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Environment ${environmentName} successfully added.`,
      messageType: "success",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleEnvironmentTermMsg = (environmentName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Environment ${environmentName} successfully termed.`,
      messageType: "success",
    };
  else if (responseCode === "2162")
    return {
      message: `Can not term the ${environmentName}, it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};
export const handleEnvironmentunTermMsg = (environmentName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Environment ${environmentName} successfully untermed.`,
      messageType: "success",
    };
  else if (responseCode === "2162")
    return {
      message: `Can not unterm the ${environmentName}, it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

// Code Version//
export const VERSION_TYPE_MANDATORY_MSG = "Version type is mandatory.";
export const CODEVERSION_MANDATORY_MSG = "Code version is mandatory.";
export const VALID_CODEVERSION_MSG = "Enter valid code version.";
export const CODEVERSION_ALREADY_EXIST_MSG = "Code version already exists.";

export const handleCodeVersionAddMsg = (codeVersionName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Code version ${codeVersionName} successfully added.`,
      messageType: "success",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleCodeVersionTermMsg = (codeVersionName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Code version ${codeVersionName} successfully termed.`,
      messageType: "success",
    };
  else if (responseCode === "2172")
    return {
      message: `Can not term the code version ${codeVersionName}, it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};
export const handleCodeVersionUntermMsg = (codeVersionName, responseCode) => {
  if (responseCode === "200")
    return {
      message: `Code version ${codeVersionName} successfully untermed.`,
      messageType: "success",
    };
  else if (responseCode === "2172")
    return {
      message: `Can not unterm the code version ${codeVersionName}, it is already in use.`,
      messageType: "warning",
    };
  else return { message: ERROR_MESSAGE, messageType: "error" };
};

// Login Flow
export const LOGIN_WRONG_CREDENTIALS_TITLE = "Wrong Credentials!";
export const LOGIN_WRONG_CREDENTIALS_DETAIL_MSG =
  "Invalid username or password.";
export const LOGIN_USER_NOTEXIST_TITLE = "Account Not Found!";
export const LOGIN_USER_NOTEXIST_MSG = "User does not exist.";
export const LOGIN_USER_PASSWORD_EXPIRE_TITLE = "Password Expired!";
export const LOGIN_USER_PASSWORD_EXPIRE_MSG =
  "Sorry, your password is expired. Please ";
export const RESET_PASSWORD_MSG = "reset your password";
export const LOGIN_USER_INACTIVE_TITLE = "Account Deactivated!";
export const LOGIN_USER_TERMINATED_TITLE = "Account Terminated!";
export const LOGIN_USER_INACTIVE_MSG =
  "Seems like your account has been disabled. Please contact adminstrator.";
export const LOGIN_SOMETHING_WRONG_TITLE = "Something Went Wrong!";
export const LOGIN_SOMETHING_WRONG_DETAIL_MSG =
  "Please try again later or contact to administrator.";
export const LOGIN_LOGO_ALTERNATIVE_TEXT = "MHK Logo";
export const LOGIN_PAGE_HEADING = "Sign in to your account";
export const LOGIN_EMAIL_MANDATORY_MSG = "Email is mandatory.";
export const LOGIN_VAILD_EMAIL_MSG = "Please enter a valid email.";
export const LOGIN_USERNAME_LABEL = "Email";
export const LOGIN_PASSWORD_MANDATORY_MSG = "Password is mandatory.";
export const LOGIN_PASSWORD_LABEL = "Password";
export const LOGIN_FORGOT_PASSWORD_LINK_TEXT = "Forgot Password?";
export const LOGIN_SIGN_IN_BUTTON_TEXT = "Sign In";
export const LOGIN_SUCCESSFULLY_MSG = "Successfully Signed In!";
export const PASSWORD_UPDATED_SUCCESSFULLY_MSG =
  "Password Updated Successfully!";

// Forgot Password Flow
export const FORGET_PWD_TITLE = "Forgot Password?";
export const FORGET_PWD_RESET_PWD_TITLE = "Reset Password";
export const FORGET_PWD_EMAIL_MANDATORY_MSG = "Email address is mandatory.";
export const FORGET_PWD_VALID_EMAIL_MSG = "Please enter a valid email address.";
export const FORGET_PWD_OTP_CODE_INFO_MSG =
  "Confirmation code will be sent on email to reset password.";
export const FORGET_PWD_EMAIL_ADDRESS_LABEL = "Email Address";
export const FORGET_PWD_CHECK_EMAIL_INFO_MSG =
  "Check your email for the verification code.";
export const FORGET_PWD_OTP_CODE_MANDATORY_MSG =
  "Verification code is mandatory.";
export const FORGET_PWD_OTP_CODE_LABEL = "Verification Code";
export const FORGET_PWD_NEW_PWD_MANDATORY_MSG = "New password is mandatory.";
export const FORGET_PWD_VALID_NEW_PWD_MSG = "Please enter a valid password.";
export const FORGET_PWD_NEW_PWD_LABEL = "New Password";
export const FORGET_PWD_CONFIRM_PWD_MANDATORY_MSG =
  "Confirm password is mandatory.";
export const FORGET_PWD_CONFIRM_PWD_NOT_MATCH_MSG =
  "The password do not match.";
export const FORGET_PWD_CONFIRM_PWD_LABEL = "Confirm Password";
export const FORGET_PWD_CANCEL_BUTTON_TEXT = "Cancel";
export const FORGET_PWD_RESET_PWD_BUTTON_TEXT = "Reset Password";
export const FORGET_PWD_SUBMIT_BUTTON_TEXT = "Submit";
export const handleResetPasswordError = (responseCode, email) => {
  if (responseCode === "9129")
    return {
      message:
        "Sorry, we couldn't find an account with that username. Please enter a valid username.",
      messageType: "error",
    };
  else if (responseCode === "2201")
    return {
      message: "MHK user not allowed to change password form CMT.",
      messageType: "error",
    };
  else if (responseCode === "2202")
    return {
      message: "First time users are not allowed to use forgot password.",
      messageType: "error",
    };
  else if (responseCode === "2091")
    return {
      message: `An account with the e-mail ${email} does not exist.`,
      messageType: "error",
    };
  else if (responseCode === "2203")
    return {
      message: `An account with the e-mail ${email} is inactive or terminated`,
      messageType: "error",
    };
  else
    return {
      message: COMMON_ERROR_MESSAGE,
      messageType: "error",
    };
};

export const handleForgotPasswordError = (responseCode) => {
  if (responseCode === "9134")
    return {
      message: "Invalid verification code provided, Please try again!",
      messageType: "error",
    };
  else
    return {
      message: COMMON_ERROR_MESSAGE,
      messageType: "error",
    };
};

// Password Policy
export const PWD_POLICY_TITLE = "Password Policy";
export const PWD_POLICY_HINT_MSG = "Your password should contain:";
export const PWD_POLICY_MIN_LENGTH_MSG = "Minimum length of 8 characters";
export const PWD_POLICY_NUM_CHAR_MSG = "Numerical characters (0-9)";
export const PWD_POLICY_SPECIAL_CHAR_MSG = "Special characters";
export const PWD_POLICY_UPPER_LETTER_MSG = "Uppercase letter";
export const PWD_POLICY_LOWER_LETTER_MSG = "Lowercase letter";

// Change Password Flow
export const CHANGE_PWD_INCORRECT_PWD_MSG =
  "The current password you entered is incorrect.";
export const CHANGE_PWD_LIMIT_EXCEEDED_MSG =
  "You have reached the limit for requesting password change. Please try after sometime.";
export const CHANGE_PWD_SUCCESSFULLY_TITLE = "Password Changed!";
export const CHANGE_PWD_SUCCESSFULLY_MSG =
  "Your password has been changed successfully.";
export const CHANGE_PWD_RESET_PWD_TITLE = "Reset Your Password";
export const CHANGE_PWD_TITLE = "Change Your Password";
export const CHANGE_PWD_MANDATORY_MSG = "Current password is mandatory.";
export const CHANGE_PWD_VALIDATION_MSG = "Please enter a valid password.";
export const CHANGE_PWD_CURRENT_PWD_LABEL = "Current Password";
export const CHANGE_PWD_NEW_PWD_MANDATORY_MSG = "New password is mandatory.";
export const CHANGE_PWD_VALID_NEW_PWD_MSG = "Please enter a valid password.";
export const CHANGE_PWD_NEW_PWD_LABEL = "New Password";
export const CHANGE_PWD_CONFIRM_PWD_MANDATORY_MSG =
  "Confirm password is mandatory.";
export const CHANGE_PWD_CONFIRM_PWD_NOT_MATCH_MSG =
  "The password do not match.";
export const CHANGE_PWD_CONFIRM_PWD_LABEL = "Confirm Password";
export const CHANGE_PWD_CANCEL_BUTTON_TEXT = "Cancel";
export const CHANGE_PWD_BUTTON_TEXT = "Change Password";
export const CHANGE_PWD_RESET_BUTTON_TEXT = "Reset Password";

// Admin Home Page
export const adminHomeWelcomeMessage = (firstName, lastName) => {
  return `Hello! ${firstName} ${lastName}`;
};

export const adminHomeDescription = () => {
  return (
    <>
      It is a dashboard for client user/Admin user /Product user/ MHK user. Data
      will load based on user roles, permissions, and login. Data will be
      different for different users.
      <br />
      <br />
      In the dashboard section client and MHK user can view all information
      related to modules, changes performed, approved and rejected the request,
      and can view recent activities, etc.
      <br />
      <br />
      Some main features are:
      <br />
      <ul>
        <li>Graph Indicating Percentage of Overall Completion</li>
        <li>
          Graph indication Percentage of Items in which are in queue/state
        </li>
        <li>
          Graph Indicating Percentage of Client Specified OOB Configuration
          Versions
        </li>
        <li>Summarized List of Items Pending Review</li>
        <li>Summarized List of Client Specified</li>
      </ul>
    </>
  );
};

// Main menu Label
export const CLIENTS = "Clients";
export const USERS = "Users";
export const ROLE_AND_PERMISSION = "Role & Permission";
export const OUT_OF_BOX_CONF = "Out-of-the-box Configuration";
export const GLOBAL_CONF = "Global Configuration";
export const APP_SETTINGS = "Application Settings";
// export const GO_BACK_TO_ADMIN = "Go Back to Admin Panel";
export const GO_BACK_TO_ADMIN = "Go Back to Home";
export const CLIENT_DASH = "Client Dashboard";
export const CLIENT_PROF = "Client Profile";
export const CLIENT_HIERARCHY = "Client Hierarchy";
export const MODULES = "Modules";
export const GLOBAL_MODULES = "Global Modules";
export const CONF_DEPLOYMENT = "Configuration Deployment";
export const LETTERS = "Letters";

// App Header
export const CONFIRM = "Confirm";
export const LOGOUT_MESSAGE = "Are you sure you want to logout?";
export const ACCOUNT_CURR_USER = "account of current user";

// Client List Label
export const CLIENT_NAME = "Client Name";
export const CODE_VERSION = "Code Version";
export const REL_MANAGER = "Relationship Manager";
export const STATUS = "Status";
export const TERM_CLIENT_MSG = "Are you sure you want to term client";
export const VIEW_UPDATE = "View & Update Details";
export const TERM_CLI = "Term Client";

// User Label
export const ADD_NEW_CLIENT = "Add New Client User";
export const USER_PROFILE = "User Profile";
export const MY_PROFILE = "My Profile";

// User Configuration Label
export const ROLES = "Roles";
export const FEATURES = "Features";
export const QUENES = "Queues";

// Modules
export const MODULE_NAME = "Module Name";
export const ADD_MODULE = "Add New Module";
export const CUR_VERSION = "Current Version";
export const SUBMODULE_COUNT = "Number of Components";
export const VIEW_SUBMODULE = "View Control Panel";
// export const submoduleCount = (label) => {
//   return `Number of ${label} Components`;
// };
// export const SubmoduleLabel = (label) => {
//   return `View ${label} Component`;
// };
// export const moduleLabel = (label) => {
//   return `Term ${label} Module`;
// };
export const VER_HISTORY = "Version History";
export const WARNING = "Warning";
export const moduleWarningMessage = (moduleName, Version) => {
  return `${moduleName} module with version ${Version} is LABELED, cannot term.`;
};
export const termModuleMessage = (moduleName, version) => {
  return `Are you sure you want to term module ${moduleName} ${version} ?`;
};
export const addNewModule = (moduleName) => {
  return `Add New ${moduleName} Module`;
};

// Search
export const SEARCH = "Search...";

export const MODULE_ASSI_MAND = "Module assignment is mandatory.";
export const VALUE_MESSAGE = "The value must be at least 1";
export const VERSION_ALREADY_EXIST =
  "The draft version already exists. Please discard or label to create a new version.";
export const CRE_VERSION = "Create Version";
export const MAJOR_VER_MANDATORY = "Major version is mandatory.";
export const VALID_VERSION_MES = "Please enter a valid major version.";
export const MINOR_VER_MANDATORY = "Minor version is mandatory.";
export const ENTER_VALID_MIN_VERSION = "Please enter a valid minor version.";
export const PATCH_VER_MANDATORY = "Patch version is mandatory.";
export const VALID_PAT_VERSION = "Please enter a valid patch version.";
export const PATCH_VER = "Patch version";

// Role Status
export const ROLE_AND_FEATURE = "Role & Feature Association";
export const EDIT_ROLE_FEATURE = "Edit Role & Feature Association";
export const CANCEL = "Cancel";
export const SAVE_ROLE_FEATURE = "Save Role & Feature Association";

//Update role
export const ROLE_DETAILS = "Role Details";
export const ROLE_NAME_MANDATORY = "Role name is mandatory.";
export const ENTER_VALID_ROLE_NAME = "Please enter a valid role name.";
export const ROLE_NAME = "Role Name";
export const ROLE_TYPE_MANDATORY = "Role type is mandatory.";
export const ROLE_TYPE = "Role Type";
export const ROLE_STATUS_MANDATORY = "Role status is mandatory.";
export const ROLE_STATUS = "Role Status";
export const DESC_IS_MANDATORY = "Decription is mandatory.";
export const DESCRIPTION = "Description";
export const EDIT_DETAILS = "Edit Details";
export const SAVE_DETAILS = "Save Details";

// Queues
export const VIEW_AND_UPDATE = "View & Update";

// Update Feature
export const FEATURE_DETAIL = "Feature Details";
export const FEATURE_NAME = "Feature Name";
export const FEATURE_STATUS_MANDATORY = "Feature status is mandatory.";
export const FEATURE_INT_NAME = "Feature Internal Name";
export const FEATURE_STATUS = "Feature Status";

// feature detail
export const UPDATED_BY = "Updated By:";
export const UPDATED_AT = "Updated At:";
export const CREATED_BY = "Created By:";
export const CREATED_AT = "Created At:";

// Compare version
export const FIRST_VER_MANDATORY = "First version is mandatory.";
export const SECOND_VER_MANDATORY = "Second version is mandatory.";
export const COMP_VERSION = "Compare Versions";
export const SEL_FIRST_VERSION = "Select First Version";
export const VER_REC_NOT_FOUND = "Version record(s) not found.";
export const SEL_SECOND_VERSION = "Select Second Version";
export const COMP_SELCTED_VER = "Compare Selected Versions";

// Home
export const HOME = "Home";

// Add User
export const ROLE_ASSI_MANDATORY = "Role assignment is mandatory.";
export const ADD_NEW_CLIENT_USER = "Add New User";
export const FIRST_NAME_MANDATORY = "First name is mandatory.";
export const FIRST_NAME = "First Name";
export const LAST_NAME_MANDATORY = "Last name is mandatory.";
export const LAST_NAME = "Last Name";
export const EMAIL_ADDRESS_MANDATORY = "Email address is mandatory.";
export const ENTER_VALID_EMAIL = "Please enter a valid email address.";
export const MAX_256_CHARACTER_ALLOW = "Maximum 256 characters allowed";
export const EMAIL_WILL_USERNAME = "Email address will be username for login.";
export const EMAIL_ADD = "Email Address";
export const ENTER_VALID_CONTACT_NUM = "Please enter a valid contact number.";
export const CONTACT_NUM_MES =
  "E.g: (XXX)-000-XXXX, XXX-000-XXXX, XXXXXX-0000, XXX000XXXX";
export const CONTACT_NUM = "Contact Number";
export const FILL_EMAIL_FIRST_ROLE =
  "Please fill the email first then assign the role.";
export const FILL_EMAIL_FIRST_CLIENT =
  "Please fill the email first then assign client.";

// User Profile detail
export const CLIENT_ASSI_MANDATORY = "Client assignment is mandatory.";

// User Access detail
export const USER_DETAIL_STATUS_TERMINATION =
  "After termination you can't change user details & user account status. Also users will not have access for this account.";
export const USER_ACCESS_ROLE = "User Access & Role";
export const ACCESS_ROLE = "Access & Role";
export const ACCOUNT_STATUS = "Account Status:";
export const ROLE = "Role(s):";
export const EDIT_ACCESS_ROLE = "Edit Access & Role";
export const SAVE_ACCESS_ROLE = "Save Access & Role";

// User Status detail
export const STATUS_1 = "Status:";
export const LAST_ACTIVE = "Last Active On:";

// Role Access
export const ROLE_QUEUE_ASSOCIATION = "Role & Queue Association";
export const EDIT_ROLE_QUEUE_ASSOCIATION = "Edit Role & Queue Association";
export const SAVE_ROLE_QUEUE_ASSOCIATION = "Save Role & Queue Association";

export const TERM_FIELD = "Term Field";
export const VIEW_FIELD_DETAIL = "View Field Details";
export const FieldTermMessage = (label, value) => {
  return `Are you sure you want to term field with ${label ? label : ""
    } ${value}?`;
};
export const SEARCH_FIELD_TYPE = "Search by field type...";
export const SELECT_SECTION = "Select Section";
export const SELECT_STATUS = "Select Status";
export const FIRST_ADD_MASTER = "First add a master control.";
export const ADD_NEW_FIELD = "Add New Field";
export const modulesLabel = (label) => {
  return label + " Modules";
};

// left Drawer
export const menuLabel = (moduleName, version) => {
  return moduleName + " (Version: " + version + ")";
};
export const SUBMODULE = "Components";
export const versionsLabel = (moduleName) => {
  return moduleName + " Version(s)";
};

// compare version Diff
export const firstVersionLabel = (versionName) => {
  return `First Version: ${versionName}`;
};

export const secondVersionLabel = (versionName) => {
  return `Second Version: ${versionName}`;
};

// Oob Field Comment
export const TYPE_YOUR_COMMENT = "Type your comment...";
export const COMMENT_IS_MANDATORY = "Comment is mandatory.";
export const SAVE = "Save";

// Oon Field Timeline
export const fieldCreated = (createdByUser) => {
  return `${createdByUser} created field`;
};
export const clientCreated = (createdByUser) => {
  return `${createdByUser} created client`;
};
export const fieldDeleted = (createdByUser) => {
  return `${createdByUser} deleted field`;
};
export const approvedOnField = (createdByUser) => {
  return `${createdByUser} approved this field`;
};
export const configuredOnField = (createdByUser) => {
  return `${createdByUser} configured this field`;
};
export const validatedOnField = (createdByUser) => {
  return `${createdByUser} passed and validated this field`;
};
export const fieldRetracted = (createdByUser) => {
  return `${createdByUser} retracted this field`;
};
export const fieldSignOff = (createdByUser) => {
  return `${createdByUser} signed off this field`;
};
export const fieldProdRev = (createdByUser) => {
  return `${createdByUser} marked this field for product review`;
};
export const fieldClientRev = (createdByUser) => {
  return `${createdByUser} marked this field for client review`;
};
export const fieldFailedConfigRev = (createdByUser) => {
  return `${createdByUser} failed this field and marked it for config review`;
};
export const fieldConfigRev = (createdByUser) => {
  return `${createdByUser} marked this field for config review`;
};
export const fieldModified = (createdByUser) => {
  return `${createdByUser} made changes to the details`;
};
export const TIMELINE = "Timeline";
export const configChanges = (createdByUser) => {
  return createdByUser + " made changes to configuration mapping";
};

export const userMadeChanges = (createdByUser) => {
  return createdByUser + " made changes to the details";
};

export const userCommented = (createdByUser) => {
  return createdByUser + " commented";
};

// Oob Section
export const SEARCH_BY_SECTION = "Search by section name...";
export const BACK_TO_GRIEVANCE = "Back to Grievance Module";
export const GRIVANCE_CUR_VERSION = "Grievance (Current Version: v1.2.6)";
export const IMAGE_INTAKE = "Image Intake - Component Menu";
export const FIELDS = "Fields";
export const SECTIONS = "Sections";
export const CONTROLS = "Controls";
export const SWITCH_TO_OTHER = "Switch to Other Version(s)";
export const IMG_INTAKE_SECTION = "Image Intake - Sections";
export const SEARCH_FILTER = "Search or Filter By";
export const ADD_NEW_SEC = "Add New Section";

// oob control
export const SEARCH_BY_CONTROL = "Search by control type...";
export const FIRST_ADD_CONTROL = "First add a control.";
export const IMG_INTAKE_CONTROL = "Image Intake's Control";
export const GOOD_CAUSE_EXT = "Good Cause Extension";
export const EXPEDITED_CRITERIA = "Expedited Criteria";
export const ADD_NEW_CONTROL = "Add New Control";
export const ADD_NEW_TAG = "Add New Tag";

// oob control group
export const VIEW_ADD_FIELD = "View & Add Fields";
export const ADD_NEW_FIELDS = "Add New Fields";

// oob Submodules
export const IMPLEMENT_QUESTIONS = "Implementation Questions";
export const IMG_INTAKE = "Image Intake";
export const GRIEVANCE_UI_DESC = "Grievance UI Descriptions";
export const UI_REQU = "UI Requirements";
export const ADD_NEW_FORM_CON = "Add New Form Control";
export const ADD_NEW_SUBMODULE = "Add New Component";

// application settings
export const MASTER_MODULE = "Master Module";
export const MASTER_SUBMODULE = "Master Component";
export const MASTER_CONTROL = "Master Control";
export const MASTER_TABLE = "Master Table";
export const MASTER_MESSAGE_CONSTANTS = "Master Message Constants";
export const MASTER_SYSTEM_VARIABLES = "Master System Variables";
export const TAG_INDICATORS = "Master Tag Indicators";
export const ENVIRONMENT = "Environment";
export const JIRATICKET = "Jira Ticket";
export const SESSION_TIME = "Session Time";

// Master Sub Module
export const termSubmoduleMessage = (submoduleName) => {
  return "Are you sure you want to term component " + submoduleName + "?";
};
export const deleteMessageConstantMessage = (submoduleName) => {
  return "Are you sure you want to delete message constant " + submoduleName + "?";
};
export const deleteSystemVariable = (submoduleName) => {
  return "Are you sure you want to delete system variable " + submoduleName + "?";
};
//Master Component
export const COMPONENT_NAME_MANDATORY_MSG = "Component name is mandatory";
export const COMPONENT_ALREADY_EXIST = "Component already exists";

//Master Table
export const ADD_NEW_TABLE = "Add New Table";
export const UPDATE_TABLE = "Set Table Column Visibility";
export const termTableMessage = (tableName) => {
  return "Are you sure you want to term Table " + tableName + "?";
};
export const ENTER_VALID_TABLE = "Enter valid table name";
export const MASTERTABLE_NAME_MANDATORY = "Table name is mandatory";
export const TABLE_LABEL_MANDATORY = "Table label is mandatory";
export const ENTER_VALID_LABEL = "Enter a valid label name";
export const LABEL_VALUE_MISSING = "Table label cannot be empty";

//Master System Variables
export const ADD_SYSTEM_CONST = "Add System Variable";
export const ADD_SYSTEM_VARIABLE = "System Variable Definition";
export const CONTROL_PROPERTY_MANDATORY = "Control property is mandatory";
export const systemVariableMessage = (tableName) => {
  return "Are you sure you want to system variable " + tableName + "?";
};

//Master Message Constant
export const ADD_MESSAGE_CONST = "Add Message Constant";
export const ADD_MESSAGE_DIALOG = "Message Constant Definition";
export const MSGCONST_MANDATORY = "Message constant is mandatory";
export const MSGCONST_ALREADY_EXIST = "Message constant already exists";
export const CODE_NAME_EXIST = "System variable code already exists";
export const SHORT_DESC_EXIST = "Short description already exists";
export const MIN_CODE_VERSION_MANDATORY_MSG =
  "Minimum code version is mandatory";
//export const ENTER_VALID_TABLE = "Enter valid table name";
export const SYSVARIABLECODE_MANDATORY = "System variable code is mandatory";
export const SYSVARIABLEDESC_MANDATORY = "Short description is mandatory";
export const SYSVARIABLEUNIQUE_MANDATORY = "Primary column is mandatory";

// control
export const termControlMessage = (name) => {
  return "Are you sure you want to term control " + name + "?";
};
export const VIEW_ADD_PROP = "View & Add Properties";
export const VIEW_UPDATE_SUB = "View & Update Component";
export const TERM_CONTROL = "Term Control";
export const DELETE_TAG = "Delete Tag";
export const DELETE_COMPONENT = "Delete Component";
export const DELETE_MSG_CONSTANT = "Delete Message Constant";
export const DELETE_SYS_VAR = "Delete System Variable";
// control Group
export const WARNIG = "Warning";
export const defaultPropertyCantDelete = (fieldLabel) => {
  return `${fieldLabel} is a default property. You cannot delete.`;
};
export const deletePropertyMessage = (fieldLabel) => {
  return `Are you sure you want to term "${fieldLabel}" property?`;
};

// Code Version
export const TERM_CODE_VER = "Term Code Version";
export const UNTERM_CODE_VER = "Unterm Code Version";
export const codeTermVersionMessage = (codeVersion) => {
  return "Are you sure you want to term code version " + codeVersion + "?";
};
export const codeUntermVersionMessage = (codeVersion) => {
  return "Are you sure you want to unterm code version " + codeVersion + "?";
};
export const ADD_NEW_CODE_VER = "Add New Code Version";

// add code version
export const ADD_CODE_VERSION = "Add Code Version";

// environment
export const TERM_ENVI = "Term Environment";
export const UNTERM_ENVI = "Unterm Environment";
export const termEnvironmentMessage = (environmentName) => {
  return "Are you sure you want to term environment " + environmentName + "?";
};
export const untermEnvironmentMessage = (environmentName) => {
  return "Are you sure you want to unterm environment " + environmentName + "?";
};
export const ADD_NEW_ENV = "Add New Environment";
export const ADD_ENV = "Add Environment";

// category
export const TERM_CATEGORY = "Term Category";
export const termCategoryMessage = (categoryName) => {
  return "Are you sure you want to term category " + categoryName + "?";
};
export const ADD_NEW_CATEGORY = "Add New Category";

// session Info
export const SESSION_TIMEOUT_DETAIL = "Session Timeout Details";
export const SESSION_TIMEOUT_MANDATORY = "Session Timeout is mandatory.";
export const MIN_TIMEOUT_VALUE_MES = "The value must be at least 3 minutes.";
export const MAX_TIMEOUT_VALUE_MES =
  "The value can't be more than 480 minutes.";
export const ENTER_VALID_VALUE = "Please enter a valid value.";
export const SESSION_TIMEOUT = "Session Timeout (In Minutes) ";

//jira ticket
export const JIRATICKET_DETAIL = "Jira Ticket Details";

// Client Module
export const removeAssociateModule = (name, version, moduleVersion) => {
  return (
    <>
      Are you sure you want to remove association of module {name} version{" "}
      {version ? version : moduleVersion}?
      <br /> <br />
      <strong>Note: </strong>All the OOB information will be lost.
    </>
  );
};
export const EDIT_MODULE_ASSIGNMENT = "Edit Module Assignment";
export const DONE = "Done";

// module analystics
export const COMPANY = "Company";
export const LINE_OF_BUSINESS = "Line of Business";
export const ELIGIBILITY_PLAN = "Eligibility Plan";
export const ELIGIBILITY_GROUP = "Eligibility Group";
export const MANAGE_HIERARCHY = "Manage Hierarchy";

export const DOESNOT_EXIST = "does not Exist . Please try with another one.";
export const DELETE_HIERARCHY_FILE =
  "Are you sure you want to delete hierarchy file ?";
export const DELETE_HIERARCHY = "Delete Hierarchy";
export const UPLOAD_HIERARCHY = "Upload Hierarchy";
export const DRAG_AND_DROP_EXCEL = "Drag and drop an Excel Sheet here or click";
export const fileSuccessAdded = (filename) => {
  return "File " + filename + " successfully added.";
};
export const fileRemoved = (filename) => {
  return "File " + filename + " removed.";
};
export const fileRejectedError = (filename) => {
  return "File " + filename + " was rejected. File type not supported.";
};
export const DOWNLOAD_SAMPLE = "Download Sample File";
export const SEARCH_BY_CREATED = "Search by created by...";
export const termSectionMessage = (sectionName) => {
  return "Are you sure you want to term section " + sectionName + "?";
};
export const TERM_SECTION = "Term Section";
export const VIEW_UPDATE_SECTION = "View & Update Section";
export const UPDATE_MODULE = "Update Module";
export const VIEW_DETAILS = "View Details";
export const TERM_MODULE = "Term Module";
export const DELETE_MODULE = "Delete Module";
export const UNTERM_MODULE = "UnTerm Module";

export const ADD_NEW_MOD = "Add New Module";

export const removeAssociateEnv = (envName) => {
  return (
    "Are you sure you want to remove association of Environment " +
    envName +
    " ?"
  );
};
export const EDIT_ENV_ASSIGN = "Edit Environment Assignment";
export const DOMAIN_NAME_MANDATORY = "Domain name is mandatory";
export const DOMAIN_NAME = "Domain Name";

export const READY_TO_SIGNOFF = "Ready to sign off?";
export const SIGN_OFF_CONFIRM = `Please click on "Sign Off" to confirm your approval.`;
export const RETRACT_CONFIRM = "Are you sure you want to retract?";
export const PRODUCT_REVIEW_CONFIRM =
  "Are you sure you want to get reviwed by product user?";
export const CONFIG_REVIEW_CONFIRM =
  "Are you sure you want to get reviwed by config user?";
export const REVIEW_DIALOG_TITLE = "Needs Review Comment";
export const QUEUE_MANDATORY = "Queue name is mandatory";
export const RETRY_CONFIRM = "Are you sure you want to retry?";
export const READY_TO_CONFIGURE = "Ready to configure?";
export const CONFIGURE_CONFIRM = `Please click on "Configure" to confirm your approval.`;
export const READY_TO_VALIDATE = "Ready to validate?";
export const VALIDATE_CONFIRM = `Please click on "Validate" to confirm your approval.`;

// Add category
export const CAT_ALREADY_EXIST = "Category already exists";
export const CAT_MANDATORY = "Category is mandatory";
export const ENTER_VALID_CAT = "Enter Valid Category Name";

// Add mater module
export const MODULE_ALREADY_EXIST = "Module name already exists";
export const MODULE_NAME_MANDATORY = "Module name is mandatory";
export const VAL_MODULENAME = "Enter valid module name";
export const MAX_4000_CHAR_ALLOWED = "Maximum 4000 characters allowed";

// Add master section
export const SEL_NAME_ALREADY_EXIST = "Section name already exists";
export const SEL_NAME_MANADTORY = "Section name is mandatory";
export const ENTER_VALID_SEC = "Enter valid section name";
export const MASTER_SEC = "Master Section";

// Add master submodule
export const SUB_NAME_EXIST = "Component name already exists";
export const SUB_NAME_MANDATORY = "Component name is mandatory";
export const ENTER_VALID_SUB = "Enter valid component name";
export const SUBMOD_NAME = "Component Name";

// Add Modules
export const MOD_ALREADY_EXISTS = "Module already exists";
export const SUB_ASSOCIATE_OOB =
  "Component associated with OOB. You cannot update the component.";
export const NO_MODULE_AVAILABLE = "No module available with label version";

export const SUB_ASSIGNMENT_MANDATORY = "Component assignment is mandatory.";
export const CONTROL_ASSIGNMENT_MANDATORY =
  "Control type assignment is mandatory.";

export const CON_ASSIGNMENT_MANDATORY = "Control assignment is mandatory.";
//export const SUB_ALREADY_ASSOCIATE = "Submodule is already associated";

//Label Version
export const NO_CONTROL_ERROR =
  "Can not label the version as this OOB module does not have control data.";
export const NO_SUBMODULE_ERROR =
  "Can not label the version as this OOB module does not have component.";

// Oob Field Detail
export const VALUE_ALREADY_EXIST = "The value already exists.";

export const termPropertyConfMapping = (fieldProperty) => {
  return `Are you sure you want to term property ${fieldProperty} from configuration mapping?`;
};

export const FIELD_PROP_MAP_NOT_FOUND =
  "Field property mapping record(s) not found";
export const COLUM_IS_MANDATORY = "Column is mandatory.";
export const PROP_IS_MANDATORY = "Property is mandatory.";
export const TABLE_IS_MANDATORY = "Table is mandatory";

export const QUENE_NAME_IS_MANDATORY = "Queue name is mandatory.";
export const QUEUE_STATUS_MANDATORY = "Queue status is mandatory.";

// Category Action
export const handleCategoryTerm = (categoryName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Category " + categoryName + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleHierarchyTerm = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Hierarchy file successfully deleted.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleHierarchyUpdaload = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Hierarchy file successfully uploaded.",
      messageType: "success",
    };
  }
};

export const handleUpdateClientControl = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "The field successfully updated.",
      messageType: "success",
    };
  }
};

export const handleChangeSingleFieldStatus = (
  responseCode,
  statusLabel,
  fieldName
) => {
  console.log("message", responseCode, statusLabel, fieldName);
  if (responseCode === "201") {
    return {
      message: `The field ${fieldName} successfully ${statusLabel}.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddMasterControl = (name, responseCode) => {
  if (responseCode === "201") {
    return {
      message: `Control ${name} successfully added.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleRestoreOobSingleField = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: `field successfully Restored.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleBulkFieldStatus = (statusLabel, responseCode) => {
  if (responseCode === "201") {
    return {
      message: `The field successfully ${statusLabel}.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddControlField = (fieldLabel, responseCode) => {
  if (responseCode === "201") {
    return {
      message: `Property "${fieldLabel}" successfully added.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteControlField = (propertyName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: `The property "${propertyName}" successfully termed.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteMasterControl = (controlName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Control " + controlName + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateControlComment = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Commented successfully.",
      messageType: "success",
    };
  }
};

export const FEATURE_SUCC_UPDATED = "Feature successfully updated.";

export const handleAddMasterModule = (moduleName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Module " + moduleName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterModule = (moduleName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Module " + moduleName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteMasterModule = (moduleName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Module " + moduleName + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddMasterSection = (sectionName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Section " + sectionName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterSection = (name, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Section " + name + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteMasterSection = (name, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Section " + name + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddMasterMessage = (msgName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Message Constant " + msgName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddMasterSystem = (code, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "System variable " + code + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddMasterSubmodule = (SubModuleName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Component " + SubModuleName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterSubmodule = (SubModuleName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Component " + SubModuleName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterMessage = (MessageName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Message constant " + MessageName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterSystem = (code, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "System variable " + code + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateMasterTable = (tableName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Table " + tableName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateSessionTimeout = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Session Timeout successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateJiraTicket = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Jira Ticket successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: responseCode.message,
      messageType: "error",
    };
  }
};

export const handleDeleteOobSubmodule = (submoduleName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Component " + submoduleName + " successfully termed.",
      messageType: "success",
    };
  } else if (responseCode === "2072") {
    return {
      message: `Can not term ${submoduleName}, it is already in use.`,
      messageType: "warning",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddOobSubmodule = (SubModuleName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Component " + SubModuleName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddModule = (moduleName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Module " + moduleName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateModule = (moduleName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Module " + moduleName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteModule = (moduleName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Module " + moduleName + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddOobControl = (fieldName, responseCode) => {
  if (responseCode === "201") {
    return {
      message: `The field ${fieldName} successfully added.`,
      messageType: "success",
    };
  }
  if (responseCode === "2272") {
    return {
      message: `This component doesn't exist.`,
      messageType: "warning",
    };
  }
  else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateOobControl = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: `The field successfully updated.`,
      messageType: "success",
    };
  }
  if (responseCode === "201") {
    return {
      message: `The field successfully updated.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddOobControlConfigMapping = (
  fieldProperty,
  responseCode
) => {
  if (responseCode === "201") {
    return {
      message: `The field property ${fieldProperty} successfully mapped.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteOobControlConfigMapping = (
  fieldProperty,
  responseCode
) => {
  if (responseCode === "201") {
    return {
      message: `The ${fieldProperty} property successfully termed from configuration mapping.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteOOBModule = (
  currentVersion,
  moduleName,
  responseCode
) => {
  if (responseCode === "200") {
    return {
      message:
        "Module " +
        moduleName +
        " version " +
        currentVersion +
        " successfully deleted.",
      messageType: "success",
    };
  }
  else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddOOBModule = (
  version,
  label,
  moduleName,
  responseCode
) => {
  if (responseCode === "201" && label === "version") {
    return {
      message: "Version " + version + " successfully added.",
      messageType: "success",
    };
  } else if (responseCode === "201") {
    return {
      message: "Module " + moduleName + "(" + version + ") successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteOOBControl = (controlName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: `The field successfully termed.`,
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateOOBModule = (version, responseCode) => {
  if (responseCode === "201") {
    return {
      message: "Version " + version + " successfully labeled.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleProcessLetter = (data) => {
  if (data.Failure.length > 0 && data.Success.length === 0) {
    return {
      message: `Letter name has duplicate value or same letter name is already exist.`,
      messageType: "error",
    };
  }
  if (data.Failure.length > 0 && data.Success.length > 0) {
    return {
      message: `${data.Success.length} file${data.Success.length > 1 ? "s" : ''} imported successfully and ${data.Failure.length} file${data.Success.length > 1 ? "s" : ''} has duplicate letter name or already exist issue.`,
      messageType: "warning",
    };
  } else {
    return {
      message: `${data.Success.length} file${data.Success.length > 1 ? "s" : ''} imported successfully`,
      messageType: "success",
    };
  }
};

export const PRO_SUCCESS_UPDATED = "Profile successfully updated.";
export const USER_ADDED = "User successfully added.";
export const ROLE_UPDATED = "Role successfully updated";
export const SCHEDULE_DEPLOYMENT_UPDATED = "Schedule successfully updated";
export const QUEUE_UPDATED = "Queue successfully updated.";
//Configuration Mapping
export const ADD_NEW_MAPPING = "Add New Mapping";

// control group
export const TERM_PROP = "Term Property";

// controls
export const VIEW_PROP = "View Properties";

//Master System Variable
export const TERM_TABLE = "Term Table";
export const MASTER_SYS_VAR_LIST = "Master System Variables List";

// Client dashboard
export const MOD_DASHBOARD = "Module Dashboard";
export const GLOBAL_MODULE_DASH = "Global Module Dashboard";

// Business Line
export const CLIENT_NOT_EXIST = "Client doesn't exists.";
export const CLIENT_HIERARCHY_FILE_NOT =
  "Client Hierarchy File doesnot exists.";
export const BUS_LINE = "Business Line";

// Compare diff Date
export const REC_NOT_AVIALABLE = "Record(s) not available.";

// COmpare version legend
export const LEGEND = "Legend:";
export const ADDED = "Added";
export const REMOVED = "Removed";
export const CHANGED = "Changed";
export const NOTPRESENT = "Not Present";

// Home
export const ROLE_BASED_USER_TRE = "Role Based User Trends";
export const TOT_NO_ACT_USERS = "Total no of Active Users";

export const ADMIN = "Administrator";
export const PROD_USER_ACC = "Product User Access";
export const CONF_USER_ACC = "Configuration User Access";
export const QA_USER_ACC = "QA User Access";
export const CLIENT_USER_ACC = "Client User Access";

export const MOD_USERS_TRE = "Module Uses Trends";

export const approveCustReqReady = (environment) => {
  return "Approved custom requests ready for deployment to: " + environment;
};

export const READY_TO_APROV = "Ready to approve?";
export const PLEASE_CLICK_APROVE = `Please click on "Approve" to confirm your approval`;
export const SIGN_OFF = "Sign Off";
export const APPROVE = "Approve";

export const CUST_CONF = "Custom Configuration";
export const OUT_OF_BOX = "Out-of-the-Box";
export const SAVE_MOD_ASSIGNMENT = "Save Module Assignment";
export const IMG_INTAKE_CONTROLS = "Image Intake - Controls";
export const IMP_MASTER_CONTROLS = "Import Master Controls";

export const VIEW_UPDATE_FIELD = "View & Update Field Details";
export const ADD_NEW_QUE = "Add New Question";
export const ADD_NEW_PERMISSION = "Add New Permission";
export const VIEW_PROFILE = "View Profile";
export const VIEW_UPDATE_PROFILE = "View & Update Profile";
export const LABEL_VERSION = "Label Version";
export const ADD_NEW_VERSION = "Add New Version";

export const handleAddCategories = (formData, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Category " + formData + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddClientEnvironment = (responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Environment(s) successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleAddClientProfile = (clientName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Client " + clientName + " successfully added.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleDeleteClient = (clientName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Client " + clientName + " successfully termed.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateClientProfile = (clientName, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Client " + clientName + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};
export const handleAddClientModules = (addFor, responseCode) => {
  if (addFor && responseCode === "200") {
    return {
      message: "Module(s) successfully updated.",
      messageType: "success",
    };
  } else if (responseCode === "200") {
    return {
      message: "Module(s) successfully assigned.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const OBBPropertyTerm = (controlName) => {
  return `${controlName} control associated with OOB. You cannot term its property.`;
};

export const OBBModuleTerm = (moduleName, e) => {
  if (e?.responseCode === "2264") {
    return {
      message: `Module name ${moduleName} is assigned to client.`
    };
  }
  else {
    return {
      message: ERROR_MESSAGE,
    };
  }
};

export const CON_TYPE_MANDATORY = "Control type is mandatory.";
export const CON_NAME_EXIST = "Control name already exists";
export const CON_NAME_MANDATORY = "Control name is mandatory.";
export const ENTER_VALID_CON = "Enter valid control name";
export const ENTER_VALID_TEXT = "Enter valid text value";
export const CON_NAME = "Control Name";
export const CON_TYPE = "Control Type";
export const OTH_CONTENT = "Other Content";
export const ADD_CON = "Add Control";
export const NO_OPT_AVAILABLE = "No options available.";
export const SEC_NAME = "Section Name";
export const ADD_SEC = "Add Section";
export const NO_OF_COL = "Number of Column";
export const NO_OF_ROW = "Number of Row";
export const PROP_NAME_EXIST = "The property name already exists.";
export const ADD_NEW_OPT = "Add New Option List";
export const PROP_NAME_MANDATORY = "Property name is mandatory.";
export const ENTER_VALID_PROP = "Enter valid property name";
export const PROP_NAME = "Property Name";
export const REQUIRED = "Required";
export const NO_SPACE_ALPHANUMERIC = "No Space Alphanumeric";
export const NO_SPACE_ALPHA = "No Space Alphabetic";
export const VALUE_AT_LEAST = "The value must be at least 0.";
export const VALUE_CANT_MORE = "The value can't be more than 1000.";
export const MIN_CHAR_LEN = "Minimum Character Length";
export const MAX_CHAR_LEN = "Maximum Character Length";
export const USER_ALREADY_EXIST = "User account already exists with";
export const PLEASE_TRY_OTHER = "email. Please try with another one.";
export const SEL_USER_TYPE = "Select User Type";
export const ATTEMPT_TO_SAVE_OUT_OF_BOX_CONF = `You are attempting to save changes which deviate from the suggested Out-of-the-Box configuration settings. Some changes may require additional documentation.`;
export const PLEASE_ACKN = "Please Acknowledge";
export const CAMPARISON_DATA_NOT_AVAILABLE = "You are attempting to set paired environment, but camparison data is not available for this environment.";
export const MSG_SYS_VAR_ALREADY_AVAILABLE = "You are attempting to set message constant or system variable, which is already in use";
export const SYS_VAR_ALREADY_AVAILABLE = "You are attempting to set system variable, which is already in use";
export const MSG_CONST_ALREADY_AVAILABLE = "You are attempting to set message constant, which is already in use";
export const RESTORE_OUT_OF_BOX_CONF = `If you restore to the Out-of-the-Box configuration settings, you will lose the values previously saved.`;
export const NO_FIELD_AVAILABLE = "No field(s) available";
export const PROPS_VAL_MAP = "Property's value map with column";
export const PROPER_INTEGER_TYPE = "This value must be whole number.";

export const isMandatory = (fieldLabel) => {
  return `${fieldLabel} is mandatory.`;
};
export const TABLE_NAME_IS_MANDATORY = `Table name is mandatory.`;
export const CON_IS_MANDATORY = `Context is mandatory.`;
export const LIST_CAT_MANDATORY = `List category is mandatory.`;
export const CONF_METHOD_MANDATORY = `Config Method is mandatory.`;

// Client letters
export const IMPORT_TEMPLATES = "Import Templates";
export const IMPORT_PORTAL = "Import Portal";
export const AUTOMATION = "Automation";
export const TEMPLATE_LIBRARY = "Template Library";
export const CLIENT_LETTERS = "Client Letters";

export const handleAddControlError = (Error) => {
  // if (responseCode === "2053")
  //   return {
  //     message: `Control already exist.`,
  //     messageType: "warning",
  //   }; else
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddDynamicFieldsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddOptionFormError = (Error, activeControl) => {
  if (Error.responseCode && Error.responseCode === "2054")
    return {
      message: `${activeControl.name} control associated with OOB. Now you cannot add a new property to this control.`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddSelectFormError = (Error, activeControl) => {
  if (Error.responseCode && Error.responseCode === "2054")
    return {
      message: `${activeControl.name} control associated with OOB. Now you cannot add a new property to this control.`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddTextboxFormError = (Error, activeControl) => {
  if (Error.responseCode && Error.responseCode === "2054")
    return {
      message: `${activeControl.name} control associated with OOB. Now you cannot add a new property to this control.`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddUsersError = (Error, email) => {
  if (Error.responseCode && Error.responseCode === "9123")
    return {
      message: (
        <>
          An account with the e-mail
          <Typography variant="subtitle2" component="span">
            {" "}
            "{email}"{" "}
          </Typography>
          has been terminated.
        </>
      ),
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "9124")
    return {
      message: (
        <>
          An account with the e-mail
          <Typography variant="subtitle2" component="span">
            {" "}
            "{email}"{" "}
          </Typography>
          already exists.
        </>
      ),
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "9125")
    return {
      message: (
        <>
          An account with the e-mail
          <Typography variant="subtitle2" component="span">
            {" "}
            "{email}"{" "}
          </Typography>
          is inactive.
        </>
      ),
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "9126")
    return {
      message: `User does not exist in the active directory.`,
      // (
      //   <>
      //     User does not exist in azure with
      //     <Typography variant="subtitle2" component="span">
      //       {" "}
      //       "{email}"{" "}
      //     </Typography>
      //     email. Please try with another one.
      //   </>
      // ),
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleChangePasswordError = (Error) => {
  if (Error.responseCode && Error.responseCode === "9999")
    return {
      message: `The current password you entered is incorrect.`,
      messageType: "error",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientFieldDetails = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientInfoError = (Error) => {
  //Error.responseCode
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddCodeVersionError = (Error) => {
  //Error.responseCode
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddEnvironmentError = (Error) => {
  //Error.responseCode
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleAddMasterSubmoduleError = (Error) => {
  //Error.responseCode
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateMasterSubmoduleError = (Error, submoduleName) => {
  if (Error.responseCode && Error.responseCode === "2044")
    return {
      message: `Component ${submoduleName} associated with OOB. You cannot update the component.`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateMasterCode = (formData, responseCode) => {
  if (responseCode === "200") {
    return {
      message: "Code Version " + formData + " successfully updated.",
      messageType: "success",
    };
  } else {
    return {
      message: ERROR_MESSAGE,
      messageType: "error",
    };
  }
};

export const handleUpdateCodeVersionError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateMasterMessageError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateTagError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2216")
    return {
      message: `Tag name is already exist.`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateMasterTableError = (Error, tableName) => {
  // if (Error.responseCode && Error.responseCode === "201") {
  //   return {
  //     message: "Table " + TableName + " successfully updated.",
  //     messageType: "success",
  //   };
  // } else {
  return {
    message: ERROR_MESSAGE,
    messageType: "error",
  };
  //}
};

export const handleTabAddClientError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleTabAssignModulesError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleTabUploadFileError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2024")
    return {
      message: "Please verify Level 1 sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2025")
    return {
      message: "Please verify Level 2 sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2026")
    return {
      message: "Please verify Eligibility Plan sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2027")
    return {
      message: "Please verify Eligibility Group sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2002")
    return {
      message: "Level 1 Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2003")
    return {
      message: "Level 1 Ext Id is incorrect.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2004")
    return {
      message: "Level 2 Ext Id is incorrect.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2005")
    return {
      message: "Level 2 Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2006")
    return {
      message: "Eligibility Plan Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2007")
    return {
      message: "Eligibility Group Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2009")
    return {
      message: "Please verify filename for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2011")
    return {
      message: "Please verify date format for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2012")
    return {
      message:
        "Please verify character length of fields should not exceed its limit.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageModuleError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2068")
    return {
      message: `Could not create a lower version, please try with a different version`,
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2069")
    return {
      message: `Version already exists, please try with a different version`,
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2070")
    return {
      message: `Could not create a version lower than 3.5.0, please try with a different version`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageSubmoduleError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2252")
    return {
      message: `System Table is already associated`,
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2251")
    return {
      message: `CMT Component is already associated`,
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleOobFieldCommentsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleOobFieldDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleRoleFeatureAccessError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleRoleQueueAccessError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateFeatureDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateRoleDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUserAccessDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUserProfileDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleCodeVersionError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleEnvironmentError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterModuleError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterSubmoduleError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterMessageError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterSystemError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleControlsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleSessionsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientDashboardError = (
  OOBModuleError,
  GlobalModuleError
) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleBusinessLineError = (Error, clientId, feature) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature !== -1
  )
    return {
      message: "No hierarchy file uploaded, upload it using Manage Hierarchy.",
      messageType: "warning",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature === -1
  )
    return {
      message: "No hierarchy file uploaded.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleCompanyError = (Error, clientId, feature) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature !== -1
  )
    return {
      message: "No hierarchy file uploaded, upload it using Manage Hierarchy.",
      messageType: "warning",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature === -1
  )
    return {
      message: "No hierarchy file uploaded.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleEligibilityGroupError = (Error, clientId, feature) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature !== -1
  )
    return {
      message: "No hierarchy file uploaded, upload it using Manage Hierarchy.",
      messageType: "warning",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature === -1
  )
    return {
      message: "No hierarchy file uploaded.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleEligibilityPlanError = (Error, clientId, feature) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature !== -1
  )
    return {
      message: "No hierarchy file uploaded, upload it using Manage Hierarchy.",
      messageType: "warning",
    };
  else if (
    Error.responseCode &&
    Error.responseCode === "2019" &&
    feature === -1
  )
    return {
      message: "No hierarchy file uploaded.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageHierarchyError = (Error, clientId) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else if (Error.responseCode && Error.responseCode === "2019")
    return {
      message: "No hierarchy file uploaded, upload it using Manage Hierarchy.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageHierarchyActionError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2024")
    return {
      message: "Please verify Level 1 sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2025")
    return {
      message: "Please verify Level 2 sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2026")
    return {
      message: "Please verify Eligibility Plan sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2027")
    return {
      message: "Please verify Eligibility Group sheet name for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2002")
    return {
      message: "Level 1 Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2003")
    return {
      message: "Level 1 Ext Id is incorrect.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2004")
    return {
      message: "Level 2 Ext Id is incorrect.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2005")
    return {
      message: "Level 2 Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2006")
    return {
      message: "Eligibility Plan Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2007")
    return {
      message: "Eligibility Group Ext Id already exists.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2009")
    return {
      message: "Please verify filename for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2011")
    return {
      message: "Please verify date format for correctness.",
      messageType: "warning",
    };
  else if (Error.responseCode && Error.responseCode === "2012")
    return {
      message:
        "Please verify character length of fields should not exceed its limit.",
      messageType: "warning",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientListError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientProfileError = (Error, clientId) => {
  if (Error.responseCode && Error.responseCode === "2014")
    return {
      message: (
        <>
          Client Id
          <Typography variant="subtitle2" component="span">
            {" "}
            {clientId}{" "}
          </Typography>
          does not Exist . Please try with another one.
        </>
      ),
      messageType: "error",
    };
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleCompareVersionDifferenceError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleCompareVersionsError = (oobModuleIdError, moduleIdError) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientConfigAnalyticsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientConfigError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientEnvironmentError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientFieldsError = (
  oobControlIdError,
  oobSubmoduleError
) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientModulesError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleIndividualClientSubmodulesError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageClientFieldError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleManageOobFieldError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleModulesError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleClientModulesError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleOobFieldMappingError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleOobFieldsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleSubmoduleDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleSubmodulesError = (oobModuleIdError, moduleIdError) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleFeatureDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleRoleDetailsError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUserProfileError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUsersError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleUpdateVersionLabelError = (Error) => {
  if (Error.responseCode && Error.responseCode === "2067") {
    return {
      message:
        "Can not label the version as this OOB module does not have component.",
      messageType: "warning",
    };
  } else if (Error.responseCode && Error.responseCode === "2074") {
    return {
      message:
        "Can not label the version as this OOB module does not have control data.",
      messageType: "warning",
    };
  } else if (Error.responseCode === "2261") {
    return {
      message: "Oob do not have any component.",
      messageType: "warning",
    };

  }
  else if (Error.responseCode === "2262") {
    return {
      message: "Oob component does not have any data.",
      messageType: "warning",
    };
  }
  else return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleVersionHistoryError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};

export const handleMasterTableError = (Error) => {
  return { message: COMMON_ERROR_MESSAGE, messageType: "error" };
};
