import React from 'react';

import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { Divider, makeStyles } from '@material-ui/core';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MatCard from '../MaterialUi/MatCard';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: '16px'
    },
    cardHeading: {
        paddingTop: '12px',
        paddingBottom: '10px'
    },
    cardHeadingSize: {
        fontSize: '18px'
    },
    timelineItem: {
        minHeight: '40px',
        '&::before': {
            display: 'none'
        }
    },
    paper: {
        padding: '6px 10px 8px',
        boxShadow: 'none',
        background: theme.palette.action.hover,
        marginBottom: '15px'
    },
    timelineContent: {
        paddingRight: '0px',
        paddingLeft: '10px'
    },
    timeTypo: {
        opacity: '0.8',
        fontSize: '11px'
    },
    oppContent: {
        flex: 'inherit',
        paddingLeft: '0px',
        paddingTop: '1px',
        paddingRight: '10px'
    },
    timelineText: {
        fontSize: '13px'
    },
    dateLabel: {
        padding: '0px 10px',
        marginBottom: '10px',
        color: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark,
        fontWeight: 500
    },
    accessIconContainer: {
        minWidth: '25px'
    },
    accessListItemText: {
        margin: '0px'
    },
    timelineList: {
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    timelineListItem: {
        padding: '0px'
    }
}));


const TimelineDetails = (props) => {

    const styles = useStyles();

    return (
        <MatCard className={styles.card}>
            <CardHeader className={styles.cardHeading}
                title={
                    <Typography variant="h6" className={styles.cardHeadingSize}>
                        Timeline
                    </Typography>
                }
            />
            <Divider />
            <Timeline align="left">
                <TimelineItem className={styles.timelineItem}>
                    <Chip
                        label="June 15, 2020"
                        className={styles.dateLabel}
                        color="primary"
                        variant="outlined"
                    />
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <TimelineOppositeContent className={styles.oppContent}>
                        <Typography variant="caption" className={styles.timeTypo}>03:25 PM</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent className={styles.timelineContent}>
                        <Paper className={styles.paper}>
                            <Typography variant="body2" className={styles.timelineText}>
                                <Typography variant="subtitle2" component="span">Admin </Typography>
                                made changes to the details.
                            </Typography>
                            <List dense={true} className={styles.timelineList}>
                                <ListItem className={styles.timelineListItem}>
                                    <ListItemIcon className={styles.accessIconContainer}>
                                        <ArrowRightIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText className={styles.accessListItemText} primary={
                                        <Typography variant="caption">
                                            Changed user's first name to {props.details.firstName}.
                                        </Typography>
                                    } />
                                </ListItem>
                                <ListItem className={styles.timelineListItem}>
                                    <ListItemIcon className={styles.accessIconContainer}>
                                        <ArrowRightIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText className={styles.accessListItemText} primary={
                                        <Typography variant="caption">
                                            Changed user's last name to {props.details.lastName}.
                                        </Typography>
                                    } />
                                </ListItem>
                            </List>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <TimelineOppositeContent className={styles.oppContent}>
                        <Typography variant="caption" className={styles.timeTypo}>06:57 AM</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent className={styles.timelineContent}>
                        <Paper className={styles.paper}>
                            <Typography variant="body2" className={styles.timelineText}>
                                <Typography variant="subtitle2" component="span">Admin </Typography>
                                enable the user's access.
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <TimelineOppositeContent className={styles.oppContent}>
                        <Typography variant="caption" className={styles.timeTypo}>06:45 AM</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        {/* <TimelineConnector /> */}
                    </TimelineSeparator>
                    <TimelineContent className={styles.timelineContent}>
                        <Paper className={styles.paper}>
                            <Typography variant="body2" className={styles.timelineText}>
                                <Typography variant="subtitle2" component="span">Admin </Typography>
                                reset the user's password.
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <Chip
                        label="May 10, 2020"
                        className={styles.dateLabel}
                        color="primary"
                        variant="outlined"
                    />
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <TimelineOppositeContent className={styles.oppContent}>
                        <Typography variant="caption" className={styles.timeTypo}>06:00 PM</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent className={styles.timelineContent}>
                        <Paper className={styles.paper}>
                            <Typography variant="body2" className={styles.timelineText}>
                                <Typography variant="subtitle2" component="span">Admin </Typography>
                                disabled the user's access.
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem className={styles.timelineItem}>
                    <TimelineOppositeContent className={styles.oppContent}>
                        <Typography variant="caption" className={styles.timeTypo}>10:00 AM</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        {/* <TimelineConnector /> */}
                    </TimelineSeparator>
                    <TimelineContent className={styles.timelineContent}>
                        <Paper className={styles.paper}>
                            <Typography variant="body2" className={styles.timelineText}>
                                <Typography variant="subtitle2" component="span">Admin </Typography>
                                created the user profile.
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
                               
            </Timeline>
        </MatCard>
    );
}

export default TimelineDetails;