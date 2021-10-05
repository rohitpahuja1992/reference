import React from "react";

import Dialog from "@material-ui/core/Dialog";

import AddTextboxForm from "../AddTextboxForm";
import AddSelectForm from "../AddSelectForm";
import AddOptionForm from "../AddOptionForm";

const AddControlFieldDialog = (props) => {
  const { formType, handleClose, open } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={
        // formType === "textbox" ||
        // formType === "textarea" ||
        // formType === "option" ||
        // formType === "systemGeneratedText" ||
        // formType === "select" ?
        "sm"
        // : "md"
      }
      disableBackdropClick
      disableEscapeKeyDown
    >
      {(formType === "textbox" ||
        formType === "textarea" ||
        formType === "systemGeneratedText") && (
        <AddTextboxForm formType={formType} handleCloseForm={handleClose} />
      )}

      {formType === "select" && (
        <AddSelectForm formType={formType} handleCloseForm={handleClose} />
      )}

      {formType === "option" && (
        <AddOptionForm formType={formType} handleCloseForm={handleClose} />
      )}
    </Dialog>
  );
};

export default AddControlFieldDialog;
