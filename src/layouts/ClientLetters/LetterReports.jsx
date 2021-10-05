import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import MatContainer from "../../components/MaterialUi/MatContainer";
import LetterAutVsInt from "../../components/LetterReports/LetterAutVsInt";
import LetterStatus from "../../components/LetterReports/LetterStatus";
import TatByLetter from "../../components/LetterReports/TatByLetter";
// import moment from 'moment';
import { updateEntityId } from "../../actions/AppHeaderActions";
import { formatDate } from "../../utils/helpers";
import { makeStyles } from "@material-ui/core";
import BreadcrumbView from "../../components/BreadcrumbView";
import {
  fetchLetStatusByClientId,
  fetchLetAutVsIntClientId,
  fetchLibraryFiles,
} from "../../actions/LettersActions";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTBY,
} from "../../utils/LettersAppConstant";
const useStyles = makeStyles((theme) => ({
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.error.main,
  },
  statusNotConfig: {
    background: "#f39c12",
  },
}));
const LetterReports = (props) => {
  // console.log("props", props)
  const history = useHistory();
  const styles = useStyles();
  //const [apiError, setApiError] = useState(null);
  const { clientId } = useParams();
  //const clientId = useSelector((state) => state.Header.entityId);
  const dispatch = useDispatch();
  const statusData = useSelector((state) => state?.Letters?.letterStatus) || {};
  const autVsIntData = useSelector((state) => state?.Letters?.autVsInt) || {};
  const totalElements = useSelector(
    (state) => state.Letters.allLibraryData.totalElements
  );
  const startIndex = useSelector((state) => state.Letters.page.startIndex);
  const handleClientStatusClass = (status) => {
    let arrStatus = status !== null ? status.split(":") : ("00:00:00").split(":");
    if (arrStatus[0] === "00") {
      return styles.statusActive;
    } else if (arrStatus[0] <= 10) {
      return styles.statusNotConfig
    } else {
      return styles.statusInactive;
    }
  };
  const filesList = useSelector((state) =>
    state.Letters?.allLibraryData?.list?.map((data, index) => {
      let blankData = {
        id: data.id,
        module: data.module?.moduleName || 1,
        delivery: data.deliveryMethod,
        type: data.letterImportType,
        letterName: data.letterName,
        importedDate: formatDate(data.importedDate)
          ? formatDate(data.importedDate)
          : "01/04/2020 18:51:00",
        dateSetActive: formatDate(data.activeDate)
          ? formatDate(data.activeDate)
          : "01/04/2020 18:51:00",
        status: (
          <div>
            {
              <Chip
                label={data.timeDifference ? data.timeDifference : "00:00:00"}
                className={handleClientStatusClass(
                  data.timeDifference ? data.timeDifference : "00:00:00"
                )}
                color="primary"
              />
            }
          </div>
        ),
        statusDialog: data.timeDifference ? data.timeDifference : "00:00:00",
      };
      return { ...data, ...blankData };
      //return { ...blankData };
    })
  );

  useEffect(() => {
    if (clientId) {
      dispatch(updateEntityId(clientId));
      dispatch(fetchLetStatusByClientId(clientId));
      dispatch(fetchLetAutVsIntClientId(clientId));
      dispatch(
        fetchLibraryFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          "",
          "",
          clientId
        )
      );
    }
  }, [dispatch, clientId]);

  const handlePageChange = (start, size) => {
    dispatch(fetchLibraryFiles(start, size, DEFAULT_SORTBY, "", "", clientId));
  };

  const handleBackButton = () => {
    history.push(`/client/letters/${clientId}/automation`);
  };
  const BreadcrumbData = [
    {
      id: "automationMetId",
      label: "Automation Metrics",
      action: handleBackButton,
    },
    {
      id: "letterReports",
      label: "Reporting and Metrics",
    },
  ];
  // useEffect(()=>{

  // })
  // useEffect(() => {
  //   if (clientId && history?.location?.myProps) {
  //     console.log("kam ban gaya...");
  //     history.push(`/client/letter-Reports/${clientId}`);
  //   } else {
  //     // do nothing..
  //   }
  // }, [clientId, history])
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
        <Grid item xs={6}>
          {/* {!apiError && clientInfo && <LetterDetails details={clientInfo} />} */}
          {/* {statusData &&
           
          } */}
          <LetterStatus statusData={statusData} />
        </Grid>
        <Grid item xs={6}>
          {autVsIntData && <LetterAutVsInt autVsIntData={autVsIntData} />}
        </Grid>
        <Grid item xs={12}>
          <TatByLetter
            rows={filesList}
            totalElements={totalElements}
            startIndex={startIndex}
            handlePageChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default LetterReports;
