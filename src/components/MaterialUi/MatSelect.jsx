import React from "react";
import { withStyles, Select } from "@material-ui/core";

const CustomSelect = withStyles((theme) => ({
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
    '&.Mui-disabled': {
      opacity: '0.7',
      backgroundColor: '#FFFFFF !important',
      border: '1px dotted ' + theme.palette.primary.light,
      color: '#000000',
    },
    '& .MuiChip-root': {
      color: '#000000 !important'
    }
  },
  select: {
    borderRadius: 5,
    '&:focus': {
      borderRadius: 5,
      backgroundColor: '#EDF2F5',
      borderColor: theme.palette.primary.light
    }
  },
}))(Select);

const MatSelect = (props) => {
  return (<CustomSelect variant="filled" size="small" MenuProps={{
    ...props.MenuProps,
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
        maxHeight: 48 * 4,
        //maxWidth: '20ch',
        //overflow: 'auto'
      }
    },
    getContentAnchorEl: null
  }}
    disableUnderline {...props} style={{ width: '100%' }}>{props.children}</CustomSelect>);
};

export default MatSelect;