import React from 'react';
import { makeStyles } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    section: {
        display: 'flex',
        padding: '0px 8px 8px',
        alignItems: 'center' ,
        minWidth:'700px'
    },
    heading: {
        ...theme.typography.h6,
       width: "250px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexGrow: 1,
    },
    headingSmall:
    {
        fontSize:'0.8em',
        fontWeight:'500'
    },
    subHeading:{
        fontWeight:'500!important',
        fontSize:"1.15rem"
    },
}));

const PageMultipleHeading = (props) => {
    const styles = useStyles();
    const matches = useMediaQuery('(min-width:1150px)');

    return (
        <section className={styles.section}>
            {/* <div className={matches?styles.heading:styles.headingSmall}> */}
            <div title= {props.heading} className={styles.heading}> 
            {props.heading}
                <Typography className={styles.heading}>
                {props.subHeading}
            </Typography>                  
            </div>
            <div className={styles.grow} />
                {props.action}
        </section>
    )
}

export default PageMultipleHeading;