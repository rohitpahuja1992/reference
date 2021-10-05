import React from "react";
import { FormControl } from "@material-ui/core"; 

const MatFormControl = (props) => {
  return (<FormControl {...props} style={{width: '100%'}}>{props.children}</FormControl>);
};

export default MatFormControl;