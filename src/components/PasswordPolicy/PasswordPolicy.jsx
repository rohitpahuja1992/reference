import React from "react";
import Typography from "@material-ui/core/Typography";
import {
  PWD_POLICY_TITLE,
  PWD_POLICY_HINT_MSG,
  PWD_POLICY_MIN_LENGTH_MSG,
  PWD_POLICY_NUM_CHAR_MSG,
  PWD_POLICY_SPECIAL_CHAR_MSG,
  PWD_POLICY_UPPER_LETTER_MSG,
  PWD_POLICY_LOWER_LETTER_MSG,
} from "../../utils/Messages";

function PasswordPolicy() {
  return (
    <>
      <Typography variant="subtitle2" gutterBottom color="inherit">
        {PWD_POLICY_TITLE}
      </Typography>
      <Typography variant="body2" color="inherit">
        {PWD_POLICY_HINT_MSG}
      </Typography>
      <ul style={{ marginTop: "10px", marginRight: "20px" }}>
        <li>{PWD_POLICY_MIN_LENGTH_MSG}</li>
        <li>{PWD_POLICY_NUM_CHAR_MSG}</li>
        <li>{PWD_POLICY_SPECIAL_CHAR_MSG}</li>
        <li>{PWD_POLICY_UPPER_LETTER_MSG}</li>
        <li>{PWD_POLICY_LOWER_LETTER_MSG}</li>
      </ul>
    </>
  );
}

export default PasswordPolicy;
