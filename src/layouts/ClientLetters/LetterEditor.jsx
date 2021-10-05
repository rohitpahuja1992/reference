import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatContainer from "../../components/MaterialUi/MatContainer";
import LetterDetails from "../../components/LetterEditor/LetterDetails";
import LetterStatus from "../../components/LetterEditor/LetterStatus";
import LetterTagIndicators from "../../components/LetterEditor/LetterTagIndicators";
import LettersTimelineDetails from "../../components/LetterEditor/LettersTimelineDetails";
import WordEditor from "../../components/LetterEditor/WordEditor";
import LetterComments from "../../components/LetterEditor/LetterComments";
// import { updateEntityId } from "../../actions/AppHeaderActions";
// import Card from "@material-ui/core/Card";
import MatCard from "../../components/MaterialUi/MatCard";
import BreadcrumbView from "../../components/BreadcrumbView";
//import MatButton from "../../components/MaterialUi/MatButton";
import PreviewIcon from "../../assets/images/preview-icon.svg";
import {
  fetchFileByLetterId,
  fetchIndicators,
  updateLetterDoc,
  fetchAudit,
} from "../../actions/LettersActions";
import {
  //SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  // DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import {
  RESET_AUDIT,
  RESET_LETTERAUDIT_IS_DONE,
  RESET_LETTERDATE_IS_DONE,
} from "../../utils/LettersAppConstant";
const useStyles = makeStyles((theme) => ({
  statusCard: {
    flex: 1,
    minHeight: "610px",
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
  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",
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

  saveButton: {
    float: "right",
    margin: "10px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#4054b2",
    },
  },
  // btn: {
  //   borderRadius: "4px",
  //   margin: "8px 4px",
  //   padding: "7px 16px",
  //   "&:hover":{
  //     backgroundColor:"#4054b2"
  //   }
  // },
}));

const LetterEditor = () => {
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { letterId, clientId, BreadCrum } = useParams();
  const letterStage = BreadCrum === "Template-Library" ? "library" : "";
  const auditDetails = useSelector((state) => state.Letters.auditDetails);
  // const getApiError = useSelector((state) => state.Tag.data.getError);
  // const [apiError, setApiError] = useState(null);

  //const letterId = location.search?.split('=')[1];
  const letterData = useSelector((state) => state.Letters.letterData) || {};
  const letterUpdates = useSelector((state) => state.Letters.updatedFile);

  const htmlData = useSelector((state) => state.Letters.htmlData) || "";
  const invalidTag = useSelector((state) => state.Letters.InvalidTag) || [];

  const tagList =
    useSelector((state) =>
      state.Tag.data.list.map((data) => {
        let blankData = {
          id: data.id,
          tagName: data.name,
          tagType: data.tagType,
          description: data.description,
        };
        return { ...data, ...blankData };
      })
    ) || [];

  const tagNames = tagList.map((data) => {
    return data.name;
  });

  const handleBackButton = () => {
    if (BreadCrum === "Automation") {
      history.push(`/client/letters/${clientId}/${BreadCrum}`);
    } else {
      history.push(`/client/letters/${clientId}/${BreadCrum}`);
    }
  };
  const BreadcrumbData = [
    {
      id: "templateId",
      label: BreadCrum,
      action: handleBackButton,
    },
    {
      id: "letterEditor",
      label: "Letter Configuration Editor",
    },
  ];

  useEffect(() => {
    if (letterId) {
      dispatch({ type: RESET_AUDIT });
      dispatch(fetchAudit(letterId));
      dispatch(fetchIndicators(DEFAULT_START_INDEX, 100));
    }
  }, [dispatch, letterId]);

  useEffect(() => {
    if (tagList.length === 0) {
      dispatch(fetchIndicators(DEFAULT_START_INDEX, 100));
    }
  }, [tagList.length, dispatch]);

  const handleSaveLetter = (htmlData) => {
    dispatch(updateLetterDoc(letterId, htmlData));
  };

  useEffect(() => {
    if (letterUpdates[0].isAuditUpdated) {
      dispatch({ type: RESET_LETTERAUDIT_IS_DONE });
      dispatch({ type: RESET_AUDIT });
      dispatch(fetchAudit(letterId));
    }
  }, [dispatch, letterId, letterUpdates]);

  useEffect(() => {
    if (letterUpdates[0].isDateUpdated) {
      dispatch({ type: RESET_LETTERDATE_IS_DONE });
    }
  }, [dispatch, letterUpdates]);

  useEffect(() => {
    dispatch(fetchFileByLetterId(letterId, letterStage));
  }, [dispatch, letterId, letterStage]);

  // useEffect(() => {
  //   if (clientId) {
  //     dispatch(updateEntityId(clientId));
  //   }
  // }, [clientId, dispatch])

  return (
    <MatContainer>
      {/* {apiError && !clientInfo && (
        <Grid item xs={12} className={styles.col}>
          <Card className={styles.errorCard}>
            <Typography variant="body2">{apiError}</Typography>
          </Card>
        </Grid>
      )} */}
      {/* {!apiError && clientInfo && (
        <PageHeading heading={clientInfo.clientName + `'s Profile`} />
      )} */}
      <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
      <Grid container>
        <Grid item xs={8}>
          {/* {!apiError && clientInfo && <LetterDetails details={clientInfo} />} */}
          {letterData.id && <LetterDetails letterData={letterData} />}
        </Grid>
        <Grid item xs={4}>
          {!!letterData.id && (
            <LetterStatus
              letterData={letterData}
              letterUpdates={letterUpdates[0]}
              letterStage={letterStage}
            //  letterStatus={letterUpdates[0].details}
            />
          )}
        </Grid>
        <Grid item xs={8}>
          <MatCard className={styles.statusCard}>
            <CardHeader
              className={styles.cardHeading}
              title={
                <Typography variant="h6" className={styles.cardHeadingSize}>
                  <img
                    src={PreviewIcon}
                    alt={PreviewIcon + " icon"}
                    className={styles.iconSize}
                  />
                  Letter Preview
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              {/* htmlData */}
              {tagNames.length > 0 && htmlData && letterData.id && (
                <WordEditor
                  tagNames={tagNames}
                  htmlData={htmlData}
                  invalidTag={invalidTag}
                  readOnly={letterStage === "library" ? true : false}
                  handleSaveLetter={handleSaveLetter}
                // handleRevertLetter={handleRevertLetter}
                />
              )}
            </CardContent>
            {/* <MatButton
              type="submit"
              className={styles.saveButton}
              color="primary"
              onClick={handleSaveLetter}
            >
              Save
            </MatButton> */}
          </MatCard>
        </Grid>
        <Grid item xs={4}>
          <Grid item xs={12}>
            {letterData && <LetterTagIndicators tagList={tagList} />}
          </Grid>
          <Grid item xs={12}>
            {letterData?.id &&
              <LetterComments letterId={letterData.id} letterComments={letterData.comment} />
            }
          </Grid>
          <Grid item xs={12}>
            {auditDetails.length > 0 && (
              <LettersTimelineDetails auditDetails={auditDetails} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default LetterEditor;
