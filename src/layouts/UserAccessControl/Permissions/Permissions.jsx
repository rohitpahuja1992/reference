import React from 'react';
// import { useHistory, useRouteMatch } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

import MatCard from "../../../components/MaterialUi/MatCard";
import MatButton from "../../../components/MaterialUi/MatButton";
import PageHeading from "../../../components/PageHeading";
import DataTable from "../../../components/DataTable";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ADD_NEW_PERMISSION } from '../../../utils/Messages';

const cols = [
    { id: 'name', label: 'Featrue Name' },
    { id: 'internalName', label: 'Internal Name' },
    { id: 'createdOn', label: 'Created On' },
    { id: 'createdBy', label: 'Created By' }
];

const Permissions = () => {
    // const styles = useStyles();
    const permissions = useSelector(state => state.Permission.data.list);

    const tableConfig = {
        tableType: '',
        menuOptions: [
            { type: 'link', icon: <EditIcon fontSize="small" />, label: 'Edit Feature', action: () => {} },
            { type: 'link', icon: <DeleteIcon fontSize="small" />, label: 'Delete Feature', action: () => {} }
        ]
    }

    return (
        <>
            <PageHeading 
                heading="Permissions"
                action={
                    <MatButton>{ADD_NEW_PERMISSION}</MatButton>
                }
             />
            <MatCard>
                <DataTable 
                    cols={cols} 
                    rows={permissions} 
                    config={tableConfig}
                 />
            </MatCard>
        </>
    )
}

export default Permissions;