import React from "react";

import Menu from "@material-ui/core/Menu";
import Divider from "@material-ui/core/Divider";

import MatMenuItem from "../MaterialUi/MatMenuItem";
import MatListItemIcon from "../MaterialUi/MatListItemIcon";

const CommonMenu = (props) => {
  const { anchorEl, open, onClose, options, activeRow } = props;
  return (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={onClose}>
      {options?.map((option, key) => {

               // Override value on the fly


        if (typeof(option?.override) === 'function') {
          option?.override(option, activeRow);
        }
 
        return (
        <div key={key}>
          {option.type === "label" && <Divider />}
          
          <MatMenuItem
            onClick={() => {
              option.action(activeRow, option);
              onClose();
            }}
            disabled={option.type === "label"}
            style={{
              display:
                (option.display === "Hide" && activeRow && activeRow.deleted) || (!activeRow?.editedByClient && option?.doNotTrack)
                  ? "none"
                  : "flex",
              fontWeight: option.type === "label" ? 600 : "",
              opacity: option.type === "label" ? 1 : "",
            }}
          >
            {option.icon && <MatListItemIcon>{option.icon}</MatListItemIcon>}
            <div style={{ paddingTop: "3px", paddingBottom: "3px" }}>
              {option.label}
            </div>
          </MatMenuItem>
          {option.type === "label" && <Divider />}
        </div>
      )}
      )}
    </Menu>
  );
};

export default CommonMenu;
