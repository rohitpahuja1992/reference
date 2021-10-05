import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";


const useTextField = makeStyles((theme) => ({
  root: {
    border: '1px solid ' + theme.palette.primary.light,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.08) inset',
    fontSize: '15px',
    fontWeight: 500,
    color: '#5A5C66',
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background']),
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: theme.palette.primary.light
    },
    '&$focused': {
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: theme.palette.primary.light
    },
  },
  focused: {},
}));

const MatInputField = (props) => {
  const classes = useTextField();

  return (<TextField variant="filled" size="small" {...props} SelectProps={{...props.SelectProps,
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
          maxHeight: 48 * 8,
          //maxWidth: '20ch',
          //overflow: 'auto'
        }
      },
      getContentAnchorEl: null
    }
  }}
    InputProps={{ ...props.InputProps, classes, disableUnderline: true }} style={{ width: '100%' }} />);
};

export default MatInputField;