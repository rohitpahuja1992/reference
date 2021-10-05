import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import MatButton from "../../components/MaterialUi/MatButton";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import MenuItem from "@material-ui/core/MenuItem";
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.warning.main,
  },
  statusTerminated: {
    background: theme.palette.error.main,
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ParentTablePopup = (props) => {
  const styles = useStyles();
  const [parentTable, setParentTable] = useState(props.parentName || '');
  const [isSubmited, setIsSubmited] = useState(true);
  const handleCloseForm = useCallback(() => {
    props.handleClose(parentTable);
  }, [props, parentTable]);
  const handleSaveForm = useCallback(() => {
    props.handleSave(parentTable, props.childFieldName);
  }, [props, parentTable]);

  let tableList = useSelector((state) =>
    state.MasterTable.allList
  );
  tableList = tableList.filter(a => a.id !== props.parentId)
  console.log('tableList', tableList)
  const handleChange = (e) => {
    setIsSubmited(false);
    setParentTable(e.target.value)
  }
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle} onClose={handleCloseForm}>
        Set Parent Table
      </DialogTitle>

      <DialogContent dividers="true">
        <MaterialTextField
          required
          select
          value={parentTable}
          name="parentTable"
          onChange={handleChange}
        >

          {tableList.map(list => (
            <MenuItem key={list.id} value={list.tableName}>{list.tableName}</MenuItem>
          ))}
        </MaterialTextField>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleCloseForm}>
          Cancel
        </MatButton>
        <MatButton type="submit" disabled={isSubmited} onClick={handleSaveForm}>
          Save
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default ParentTablePopup;
