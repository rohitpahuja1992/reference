import React from "react";
import { withStyles, Button } from "@material-ui/core";

const CustomButton = withStyles({
    root: {
        borderRadius: '30px',
        padding: '7px 30px',
        fontSize: '15px',
        textTransform: 'capitalize',
    }
})(Button);

const MatButton = (props) => {
    return (
        <CustomButton variant="contained" color="secondary" disableElevation {...props}>
            {props.children}
        </CustomButton>
    );
}

export default MatButton;