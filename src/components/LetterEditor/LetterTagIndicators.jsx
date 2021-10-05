import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Search from "../../components/Search";
import TagIndIcon from "../../assets/images/tagInd-icon.svg";

import MatCard from "../MaterialUi/MatCard";
import { fetchIndicators } from "../../actions/LettersActions";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
} from "../../utils/AppConstants";
const useStyles = makeStyles((theme) => ({
  statusCard: {
    flex: 1,
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },

  iconSize: {
    fontSize: "16px",
    paddingRight: "5px",
    width: "18px",
  },
  searchLCell: {
    maxWidth: "175px",
    width: "40%",
    padding: "4px 2px 4px 16px",
    display: "inline-block",
    borderBottom: "0px",
    fontSize: "13px",
    wordBreak: "break-word"
  },

  searchRCell: {
    maxWidth: "175px",
    width: "60%",
    padding: "4px 2px 4px 16px",
    display: "inline-block",
    borderBottom: "0px",
    fontSize: "13px",
  },

  suggestion: {
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "none",
    padding: "12px 2px 0px 16px",
  },

  highlightedCell: {
    borderBottom: "0px",
    padding: "8px 2px 2px 16px",
  },

  tagHeading: {
    fontWeight: "bold",
    fontSize: "15px",
    padding: "8px 2px 2px 16px",
  },

  scrollBar: {
    overflow: "auto",
    maxHeight: "150px",
    display: "flex",
    flexDirection: "column",
  },

  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.warning.main,
  },
  statusTerminated: {
    background: theme.palette.error.main,
  },
}));

const LetterTagIndicators = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  // const getApiError = useSelector((state) => state.Tag.data.getError);
  // const [apiError, setApiError] = useState(null);
  // const totalElements = useSelector(
  //   (state) => state.Tag.data.totalElements
  // );
  //const startIndex = useSelector((state) => state.Tag.page.startIndex);
  const pageSize = useSelector((state) => state.Tag.page.pageSize);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchIndicators(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchIndicators(DEFAULT_START_INDEX, pageSize, "", searchText.trim())
      );
    }
  };

  return (
    <MatCard className={styles.statusCard}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img
              src={TagIndIcon}
              alt={TagIndIcon + " icon"}
              className={styles.iconSize}
            />
            Master Tag Indicators
          </Typography>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.highlightedCell}>
                <Search
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  handleSearch={handleSearch}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.suggestion}>Suggested</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={styles.tagHeading}>
                Member Demographic Tags
              </TableCell>
            </TableRow>
            <div className={styles.scrollBar}>
              {props.tagList.map((item, index) => {
                if (item.tagType === "MEMBER_DEMOGRAPHIC") {
                  return (
                    <TableRow key={index}>
                      <TableCell className={styles.searchLCell}>
                        <label
                          draggable="true"
                          style={{ backgroundColor: "#00FEFE" }}
                        >
                          {item.name}

                        </label>
                      </TableCell>
                      <TableCell className={styles.searchRCell}>
                        {item.description}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <TableRow>
              <TableCell className={styles.tagHeading}>
                User Demographic Tags
              </TableCell>
            </TableRow>
            <div className={styles.scrollBar}>
              {props.tagList.map((item, index) => {
                if (item.tagType === "USER_DEMOGRAPHIC") {
                  return (
                    <TableRow key={index}>
                      <TableCell className={styles.searchLCell}>
                        <label
                          draggable="true"
                          style={{ backgroundColor: "#00FF00" }}
                        >
                          {item.name}
                        </label>
                      </TableCell>
                      <TableCell className={styles.searchRCell}>
                        {item.description}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <TableRow>
              <TableCell className={styles.tagHeading}>Date Tags</TableCell>
            </TableRow>
            <div className={styles.scrollBar}>
              {props.tagList.map((item, index) => {
                if (item.tagType === "DATE") {
                  return (
                    <TableRow key={index}>
                      <TableCell className={styles.searchLCell}>
                        <label
                          draggable="true"
                          style={{ backgroundColor: "#fefd00" }}
                        >
                          {item.name}
                        </label>
                      </TableCell>
                      <TableCell className={styles.searchRCell}>
                        {item.description}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </TableBody>
        </Table>
      </TableContainer>
    </MatCard>
  );
};

export default LetterTagIndicators;
