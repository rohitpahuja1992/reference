import React from "react";
import { makeStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import MatInputField from "../../components/MaterialUi/MatInputField";
import { SEARCH } from "../../utils/Messages";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  search: {
    width: "37px",
    height: "30px",
    position: "absolute",
    right: "15px",
    marginTop: "6px",
  },
  filterDropdown: {
    display: "flex",
    position: "relative",
    paddingRight: "10px",
    minWidth: "300px",
  },
  filterDropdown1250: {
    display: "flex",
    position: "relative",
    paddingRight: "10px",
    minWidth: "200px",
  },
}));

const Search = (props) => {
  const matches = useMediaQuery('(min-width:1250px)');
  const styles = useStyles();

  return (
    <Grid item className={matches?styles.filterDropdown:styles.filterDropdown1250}>
      <MatInputField
        value={props.searchText}
        onChange={props.handleChange}
        onKeyPress={props.handleKeyPress}
        label={SEARCH}
        name="searchBy"
      />
      <Fab color="primary" aria-label="add" className={styles.search}>
        <SearchIcon onClick={props.handleSearch} />
      </Fab>
    </Grid>
  );
};

export default Search;
