import React from "react";

import Menu from '@material-ui/core/Menu';
import Chip from '@material-ui/core/Chip';

import MatMenuItem from "../MaterialUi/MatMenuItem";

const TableCellShowMore = (props) => {
    const { anchorEl, open, onClose, options, fieldProp,nestedFieldProp,moreItems } = props;
    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={onClose}
        >
            {options && options.map((item, index) => (index > moreItems) && (
                <MatMenuItem disabled style={{opacity: 1 }}>
                    <Chip key={index} label={nestedFieldProp?item[fieldProp][nestedFieldProp]:item[fieldProp]} />
                </MatMenuItem>
            ))}
        </Menu>
    );
}

export default TableCellShowMore;