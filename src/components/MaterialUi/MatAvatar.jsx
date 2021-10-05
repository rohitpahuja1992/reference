import React from "react";
import { withStyles, Avatar } from "@material-ui/core";

const CustomAvatar = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
    }
}))(Avatar);

const MatAvatar = (props) => {
    return (
        <CustomAvatar {...props}>
            { props.type === 'imgIcon' ? (
                <img src={props.children} width={props.width} alt={props.type} />
            ) : (props.children) }
        </CustomAvatar>
    );
}

export default MatAvatar;