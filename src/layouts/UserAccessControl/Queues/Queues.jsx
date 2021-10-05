import React, { useEffect } from "react";
// import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MatCard from "../../../components/MaterialUi/MatCard";
// import MatButton from "../../../components/MaterialUi/MatButton";
import PageHeading from "../../../components/PageHeading";
import DataTable from "../../../components/DataTable";
import RateReviewIcon from "@material-ui/icons/RateReview";
import { fetchQueues } from "../../../actions/QueueActions";
import Chip from "@material-ui/core/Chip";
import { formatDate } from "../../../utils/helpers";
import { VIEW_AND_UPDATE } from "../../../utils/Messages" 
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.warning.main,
  },
}));

const cols = [
  { id: "name", label: "Queue Name" },
  { id: "internalName", label: "Internal Name" },
  { id: "updated_date", label: "Updated On" },
  { id: "updatedByUser", label: "Updated By" },
  { id: "status", label: "Status" },
];

const Queues = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();

  const handleQueueStatusClass = (status) => {
    if (status === "INACTIVE") {
      return styles.statusInactive;
    } 
    if (status === "ACTIVE") {
      return styles.statusActive;
    }
  };
  const queues = useSelector((state) =>
    state.Queue.data.list.map((data) => {
      let QueueData = {
        id: data.id,
        name: data.name,
        internalName: data.internalName,
        updatedByUser: data.updatedByUser,
        status: (<div>{<Chip
          label={data.status}
          className={handleQueueStatusClass(data.status)}
          color="primary"
        />}</div>),
        statusDialog:data.status,
        updated_date: formatDate(data.updatedDate),
      };
      return { ...QueueData };
    })
  );
  // const queues = useSelector((state) =>
  //   state.Queue.data.list.map((data) => {
  //     data.status =<div><Chip
  //       label={data.status}
  //       className={handleQueueStatusClass(data.status)}
  //       //color="primary"
  //      /></div>;
  //       data.updated_date = formatDate(data.updated_date);
  //     return data;
  //   })
  // );

  const tableConfig = {
    tableType: "",
    actions: {
      icon: <RateReviewIcon color="primary" />,
      tooltipText: VIEW_AND_UPDATE,
      action: (data) => {
        history.push(`/admin/access-control/queue-details/${data.id}`);
      },
    },
  };

  useEffect(() => {
    dispatch(fetchQueues());
  }, [dispatch]);

  return (
    <>
      <PageHeading
        heading="Queues"
      // action={
      //     <MatButton>Add New Queue</MatButton>
      // }
      />
      <MatCard>
        <DataTable cols={cols} rows={queues} config={tableConfig} />
      </MatCard>
    </>
  );
};

export default Queues;
