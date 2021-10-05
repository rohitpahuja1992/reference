import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";


const usePaper = makeStyles((theme) => ({
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

const MatPaper = (props) => {
  const classes = usePaper();

  return (<Paper variant="filled" size="small" {...props} 
    InputProps={{ ...props.InputProps, classes, disableUnderline: true }} style={{ width: '100%' }} />);
};

export default MatPaper;