import React from 'react';
import { makeStyles } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
        ...theme.typography.h6
    },
    headingSmall:
    {
        fontSize:'0.8em',
        fontWeight:'500'
    }
}));

const PageHeading = (props) => {
    const styles = useStyles();
    const matches = useMediaQuery('(min-width:1150px)');

    return (
        <section className={styles.section}>
            <div className={matches?styles.heading:styles.headingSmall}>
                {props.heading}
            </div>
            <div className={styles.grow} />
                {props.action}
        </section>
    )
}

export default PageHeading;