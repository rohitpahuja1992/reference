import React from "react";

import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CLDGLetterPDF from "../../assets/Documents/CLDG_Letter_Template.pdf";
import CLDGNamingPDF from "../../assets/Documents/CLDG_Naming.pdf";
import ListNumberIcon from "../../assets/images/list_numbered-icon.svg";

import MatCard from "../../components/MaterialUi/MatCard";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center"
  },

  iconSize:{
    fontSize: "16px",
    paddingRight: "5px",
    width: "24px"
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",

    "& li":{lineHeight:"20px"}
  },

  hyperLink: {
    color: "#3e719e",
    textDecoration: "none",
    "&:active, &:hover, &:focus": {
      outline: "none",
      textDecoration: "none",
      color: "#72afd2",
    },
  },
}));

const ImportInstructions = () => {
  const styles = useStyles();

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
          <img src={ListNumberIcon} alt={ListNumberIcon + " icon"} className={styles.iconSize} />  Import Instructions & Checklist
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        <>
          <Grid item xs={12}>
            <div style={{ flex: 1, display: "flex" }}>
              <ul className={styles.cardContent}>
                <li>
                  <b>Step 1.</b> Prepare the Templates that require mail-merge
                  tags applied by using the
                  <a
                    className={styles.hyperLink}
                    href={CLDGLetterPDF}
                    target="_blank"
                  >
                    {" "}
                    Client Letter Delivery Guide [Preparing Letter Templates].
                  </a>
                </li>
                <li>
                  <b>Step 2.</b> Rename the Template file names to comply with
                  the instructions in the{" "}
                  <a
                    href={CLDGNamingPDF}
                    target="_blank"
                    className={styles.hyperLink}
                  >
                    {" "}
                    Client Letter Delivery Guide [Naming the File Name]
                  </a>
                  . .
                </li>
                <li>
                  <b>Step 3.</b> Navigate to the Import Portal and drag and drop
                  your files.
                </li>
              </ul>
            </div>
            <Divider />
          </Grid>
        </>
      </Grid>
    </MatCard>
  );
};

export default ImportInstructions;
