/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

// import { useForm } from "react-hook-form";

import {
  Divider,
  makeStyles,
  CardContent,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import MatCard from "../MaterialUi/MatCard";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import MatSelect from "../MaterialUi/MatSelect";
import MatButton from "../MaterialUi/MatButton";
import InfoIcon from "../../assets/images/info-icon.svg";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import { updateEntityId } from "../../actions/AppHeaderActions";
import { COMMON_ERROR_MESSAGE } from "../../utils/Messages";

import {
  fetchBusinessByClientId,
  fetchModulesByClientId,
  fetchCompanyByClientId,
  fetchAttachments,
  fetchCoverSheets,
  updateFile,
  fetchLobsByCompId
} from "../../actions/LettersActions";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  card: {
    flex: 1,
  },

  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "8px",
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

  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  dialogTitle: {
    fontWeight: 300,
  },
  chip: {
    margin: "2px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "5px 10px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
  disableClick: {
    pointerEvents: "none",
  },
  linkBtn: {
    textDecoration: "none",
    color: "white",
  },
  btn: {
    borderRadius: "4px",
    margin: "8px 4px",
    padding: "7px 16px",
    "&:hover": {
      backgroundColor: "#4054b2"
    }
  },
}));

const LetterDetails = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const fileListProp = useRef();
  const { clientId, letterId, BreadCrum } = useParams();
  const [letterData, setLetterData] = useState(props?.letterData || {});
  // const letterUpdates = useSelector((state) => state.Letters.updatedFile);
  const [lobListCurrent, setLobListCurrent] = useState({});

  const moduleList = useSelector((state) =>
    state.Letters.modulesList.sort((a, b) =>
      a.moduleName > b.moduleName ? 1 : -1
    )
  );
  const businessList = useSelector(
    ({ Letters: { businessList = [] } }) =>
      businessList
  );

  const companyList = useSelector((state) =>
    state.Letters.companyList
  );
  const lobList = useSelector((state) => state.Letters.lobList);

  const attachmentList = useSelector((state) =>
    state.Letters.attachments.sort((a, b) => (a.letterName > b.letterName ? 1 : -1))
  );

  const coversheetList = useSelector((state) =>
    state.Letters.coverSheets.sort((a, b) => (a.letterName > b.letterName ? 1 : -1))
  );

  const [inputs, setInputs] = useState({
    attachment: props.letterData?.attachment ? props.letterData?.attachment?.map(item => item.id) : []
  });

  // const {attachment} = inputs;

  const [isEditable, setEditable] = useState(false);
  const [isUpdateCalled, setIsUpdateCalled] = useState(false);
  const [apiError, setApiError] = useState(null);

  const bindings = {
    company: "companyDescription",
    business: "businessLineDescription",
    deliveryMethod: "deliveryMethod",
    type: "letterImportType",
    letterName: "letterName",
    module: "moduleId",
    coverSheet: "coverSheet",
    attachment: "attachment"
  };

  const getValue = (name, value) => {
    if (name === "company") {
      return companyList?.find(item => item.id === Number(value))["description"]
    } else if (name === "business") {
      return businessList?.find(item => item.id === Number(value))["description"]
    } else {
      return value
    }
  }


  const updateValue = ({ target: { name, value } }, id) => {
    const updateData = [];
    if (name === "attachment") {
      let arrletterIds = value ? value.map(item => item) : [];
      updateData.push({
        id: Number(id),
        [bindings[name]]: arrletterIds,
      });
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }

    else {
      updateData.push({
        id: Number(id),
        [bindings[name]]:
          value === "" ? "" : getValue(name, isFinite(value) ? Number(value) : value),
        clientId: Number(clientId)
      });
    }
    if (name === "deliveryMethod" || name === "attachment") {
      setLetterData(state => ({
        ...state,
        [name]: value,
      }));
    } else if (name === "company") {
      dispatch(fetchLobsByCompId(getValue(name, isFinite(value) ? Number(value) : value), clientId, id));
      setLetterData(state => ({
        ...state,
        [name]: { id: Number(value) },
      }));
    }
    else if (name === "coverSheet") {
      setLetterData(state => ({
        ...state,
        [name]: { id: Number(value) },
      }));
    }
    else {
      setLetterData(state => ({
        ...state,
        [name]: { id: Number(value) },
      }));

    }

    dispatch(updateFile(updateData, { name, value }));

  };

  const handleSelectValue = (selected, list, type) => {
    return selected.map((selectedItem) => (
      <Chip
        key={selectedItem?.id}
        label={list.filter((data) => data?.id === selectedItem)?.[0]?.[type]}
        className={styles.chip}
      />
    ));
  };

  useEffect(() => {
    if (clientId) {
      dispatch(updateEntityId(clientId));
      dispatch(fetchModulesByClientId(clientId));
      dispatch(fetchBusinessByClientId(clientId));
      dispatch(fetchCompanyByClientId(clientId));
      dispatch(fetchAttachments(clientId, "ATTACHMENT", "LIBRARY"));
      dispatch(fetchCoverSheets(clientId, "COVERSHEET", "LIBRARY"));
    }
  }, [dispatch, clientId]);

  // useEffect(() => {
  //   if (letterUpdates[0].isAuditUpdated) {
  //     dispatch({ type: RESET_AUDIT });
  //     dispatch(fetchAudit(letterId));
  //   }
  // }, [dispatch, letterId,letterUpdates]);

  useEffect(() => {
    // setLetterData(props.letterData);
    let arrletterIds = props.letterData.attachment
      ? props.letterData.attachment.map((item) => item.id)
      : [];
    if (!_.isEqual(arrletterIds, fileListProp.current)) {
      fileListProp.current = _.cloneDeep(arrletterIds);
      setInputs({
        attachment: [...fileListProp.current],
      });
    }
  }, [props.letterData, letterData]);

  useEffect(() => {
    if (props?.letterData)
      setLetterData(props?.letterData);
    console.log("props letterData", letterData);
    console.log("coversheetlist", coversheetList)
  }, [props?.letterData, clientId])

  useEffect(() => {
    console.log("letterData", letterData);
  }, [letterData])

  useEffect(() => {
    if (lobList) {
      setLobListCurrent(lobList)
      //console.log("lobList", lobList)
    }
  }, [lobList])


  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img
              src={InfoIcon}
              alt={InfoIcon + " icon"}
              className={styles.iconSize}
            />
            Letter Details
          </Typography>
        }
        action={
          <>
            <MatButton
              className={styles.btn}
              color="primary"
              disabled={letterData.previousId === 0 ? true : false}
            >
              <Link
                className={styles.linkBtn}
                to={`/client/letter-Editor/${clientId}/${letterData.previousId}/${BreadCrum}`}
              >
                Previous
              </Link>
            </MatButton>

            <MatButton
              className={styles.btn}
              color="primary"
              disabled={letterData.nextId === 0 ? true : false}
            >
              <Link
                className={styles.linkBtn}
                to={`/client/letter-Editor/${clientId}/${letterData.nextId}/${BreadCrum}`}
              >
                Next
              </Link>
            </MatButton>
          </>
        }
      />
      <Divider />
      <CardContent>
        {apiError && isUpdateCalled ? (
          <Grid item xs={12} className={styles.col}>
            <Card className={styles.errorCard}>
              <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
            </Card>
          </Grid>
        ) : null}
        <form noValidate autoComplete="off" id="updateClientInfo">
          <Grid container className={styles.row}>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                value={letterId}
                label="Id"
                name="Id"
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Method Of Delivery</InputLabel>
                <MatSelect
                  value={letterData.deliveryMethod}
                  name="deliveryMethod"
                  onChange={(e) => updateValue(e, props.letterData.id)}
                >
                  <MenuItem value="FAX">FAX</MenuItem>
                  <MenuItem value="MAIL">MAIL</MenuItem>
                </MatSelect>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Module</InputLabel>
                <MatSelect
                  name="module"
                  value={letterData.module?.id}
                  onChange={(e) => updateValue(e, props.letterData.id)}
                >
                  {(moduleList || []).map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.moduleName}
                    </MenuItem>
                  ))}
                </MatSelect>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Company</InputLabel>
                <MatSelect
                  name="company"
                  value={letterData.company?.id}
                  onChange={(e) => {
                    updateValue(e, props.letterData.id);
                  }}
                >
                  {(companyList || []).map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.description}
                    </MenuItem>
                  ))}
                </MatSelect>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                //defaultValue={props.letterData.letterName}
                value={props.letterData.letterName}
                label="Letter Name"
                name="letterName"
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Line Of Business</InputLabel>
                <MatSelect
                  name="business"
                  value={letterData.business?.id}
                  onChange={(e) => updateValue(e, props.letterData.id)}
                >

                  {!lobListCurrent?.[letterData.id] ?
                    ((letterData?.supportedLob))?.map((item, index) =>
                      <MenuItem value={item.id} key={index}>
                        {item.description}
                      </MenuItem>
                    )
                    : ((lobListCurrent?.[letterData.id]) || businessList)?.filter((item, index) => {
                      if (!lobListCurrent?.[letterData.id]) {
                        return true
                      } else {
                        return true;
                      }

                    }).map((item, index) =>
                      <MenuItem value={item.id} key={index}>
                        {item.description}
                      </MenuItem>
                    )}
                </MatSelect>
              </MatFormControl>
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Cover Sheet</InputLabel>
                <MatSelect
                  name="coverSheet"
                  value={letterData?.coverSheet?.id}
                  onChange={(e) => updateValue(e, letterData.id)}
                >
                  {(coversheetList || []).map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.letterName}
                    </MenuItem>
                  ))}
                </MatSelect>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Letter Appendices</InputLabel>

                <MatSelect
                  multiple
                  name="attachment"
                  //value={letterData.attachment}
                  value={inputs.attachment}
                  renderValue={(selected) =>
                    handleSelectValue(selected, attachmentList, "letterName")
                  }
                  onChange={(e) => updateValue(e, props.letterData.id)}
                >
                  {(attachmentList || []).map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      <Checkbox
                        checked={inputs.attachment.some((id) => id === item.id)}
                      />
                      <ListItemText primary={item?.letterName} />
                    </MenuItem>
                  ))}
                </MatSelect>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl variant="filled" size="small">
                <InputLabel>Letter Trigger</InputLabel>
                <MatSelect value="--" name="lettertrigger">
                  <MenuItem value="--">--</MenuItem>
                  <MenuItem value="Phase 2 funcionality">
                    Phase 2 funcionality
                  </MenuItem>
                </MatSelect>
              </MatFormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default LetterDetails;
