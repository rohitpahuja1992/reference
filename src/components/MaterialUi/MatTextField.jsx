import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";


const useTextField = makeStyles((theme) => ({
  root: {
    border: '1px solid #D6E3EB',
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#EDF2F5',
    fontSize: '15px',
    fontWeight: 500,
    color: '#5A5C66',
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background']),
    '&:hover': {
      backgroundColor: '#EDF2F5',
      borderColor: theme.palette.primary.light
    },
    '&$focused': {
      backgroundColor: '#EDF2F5',
      borderColor: theme.palette.primary.light
    },
    '&.Mui-disabled': {
      opacity: '0.7',
      backgroundColor: '#FFFFFF',
      border: '1px dotted ' + theme.palette.primary.light,
      color: '#000000',
    },
    '&.Mui-error': {
      backgroundColor: '#EDF2F5',
      borderColor: theme.palette.primary.light
    },
  },
  // error: {
  //   "&.MuiFormHelperText-root.Mui-error": {
  //     backgroundColor: '#FFFFFF',
  //   },
  // },
  focused: {},
}));

const helperTextStyles = makeStyles(theme => ({
  error: {
    "&.Mui-error": {
      backgroundColor: '#FFFFFF'
    }
  }
}));

const inputLabelTextStyles = makeStyles(theme => ({
  error: {
    "&.Mui-error": {
      backgroundColor: '#EDF2F5',
      borderColor: theme.palette.primary.light
    }
  },
  
  //Start changes
  marginDense:{
    //New changes added by Mohit for JIRA card "MHK-795"
    width:"100%!important",
    //New changes added by Mohit for JIRA card "MHK-853"
    transform: "translate(12px, 7px) scale(0.75)!important",
  }
  //End changes
}));

const MatTextField = (props) => {
  const classes = useTextField();
  const classesHelper = helperTextStyles();
  const classesInputLabel = inputLabelTextStyles();

  return (<TextField variant="filled" size="small" {...props} 
  InputLabelProps={{ ...props.InputLabelProps, classes: classesInputLabel }} 
  FormHelperTextProps={{ ...props.FormHelperTextProps, classes: classesHelper }} 
  SelectProps={{...props.SelectProps,
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      PaperProps: {
        style: {
          maxHeight: 48 * 5,
          //maxWidth: '20ch',
          //overflow: 'auto'
        }
      },
      getContentAnchorEl: null
    }
  }}
  InputProps={{ ...props.InputProps, classes, disableUnderline: true }} style={{ width: '100%' }} />);
};

export default MatTextField;