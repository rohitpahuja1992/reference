import React, { useState } from "react";
import { useDispatch } from "react-redux";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import { Divider, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MatButton from "../MaterialUi/MatButton";
import CommentsIcon from "../../assets/images/comment-icon.svg";
import { saveComment } from "../../actions/LettersActions";


import MatCard from "../MaterialUi/MatCard";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: "16px",
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center"
  },

  iconSize: {
    fontSize: "16px",
    paddingRight: "5px",
    width: "18px"
  },

  textField: {
    padding: "12px 10px 10px 10px",
    width: "95%",
  },

  saveButton: {
    float: "right",
    margin: "10px",
    borderRadius: "4px",
    padding: "7px 15px",
    "&:hover": {
      backgroundColor: "#4054b2"
    }
  }
}));

const LetterComments = (props) => {

  const styles = useStyles();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const defaultFormObj = {
    comment: "",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const { comment } = inputs;
  
  const { handleSubmit, reset } = useForm({
    mode: "onBlur",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.value !== "") {
      setIsDisabled(false);
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setIsDisabled(true);
    }
    // const { name, value } = e.target;
    // if (name === "controlType") {
    //   setInputs((inputs) => ({ ...inputs, [name]: value }));
    // } else {
    //   setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    // }
  };

  const saveComments = (data, e) => {
    dispatch(
      saveComment(props.letterId, comment)
    );
    e.target.reset(); // reset after form submit
    // reset('', {
    //   keepValues: false,
    // })
  };


  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img src={CommentsIcon} alt={CommentsIcon + " icon"} className={styles.iconSize} /> Comments
          </Typography>
        }
      />
      <Divider />
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(saveComments)}
        id="saveComment"
      >
        <TextField
          // defaultValue={comment}
          multiline
          rows={3}
          variant="outlined"
          className={styles.textField}
          onChange={handleChange}
          name="comment"
        //label="Type your comment"
        ></TextField>
        <MatButton type="submit" className={styles.saveButton} color="primary" disabled={isDisabled}>
          Save
        </MatButton>
      </form>
    </MatCard>
  );
};

export default LetterComments;
