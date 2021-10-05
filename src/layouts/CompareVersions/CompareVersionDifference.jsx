import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Divider } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";

import MatCard from "../../components/MaterialUi/MatCard";
import PageHeading from "../../components/PageHeading";

import { useParams } from "react-router-dom";
import { fetchCompareVersion } from "../../actions/OOBModuleActions";

import CompareDifferenceData from "./CompareDifferenceData";
import CompareVersionLegend from "./CompareVersionLegend";
import CompareVersionHeading from "./CompareVersionHeading";
import { RESET_FETCH_COMPARE_VERSION } from "../../utils/AppConstants";
import {
  COMP_VERSION,
  handleCompareVersionDifferenceError,
  firstVersionLabel,
  secondVersionLabel,
} from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
  },
  card: {
    overflow: "visible",
  },
  compareGrid: {
    minWidth: "calc(50% - 20px)",
    maxWidth: "calc(50% - 20px)",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    margin: "10px 8px 14px 8px",
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const CompareVersionDifference = (props) => {
  const { moduleName } = props;
  const styles = useStyles();
  const dispatch = useDispatch();
  const [panelState, setPanelState] = useState({});
  const { moduleId, firstVersion, secondVersion } = useParams();

  const compareVersionsData = useSelector(
    (state) => state.OOBModule.compareVersion.data
  );

  const getCompareVersionError = useSelector(
    (state) => state.OOBModule.compareVersion.error
  );
  const [apiError, setApiError] = useState(null);
  // const compareVersionsData = {
  //   "module": {
  //     "id": 1,
  //     "createdDate": "2021-05-31T05:35:40.000+0000",
  //     "updatedDate": "2021-06-11T13:15:58.000+0000",
  //     "updatedByUser": null,
  //     "createdByUser": null,
  //     "moduleName": "31 MAY 2021",
  //     "description": "",
  //     "status": "ACTIVE",
  //     "shortName": "MAY",
  //     "mailMergeDefinitionId": 80,
  //     "global": false,
  //     "deleted": false
  //   },
  //   "version1": "3.5.4",
  //   "version2": "3.5.3",
  //   "oobModuleMasterVersion1": {
  //     "components": {
  //       "cmp#9": {
  //         "name": "cmp#9",
  //         "type": "CMT_COMPONENT",
  //         "rows": {
  //           "fc5636e8798e379a99260ac5523d7086a91b1188": {
  //             "rowLabel": "field1",
  //             "fields": {
  //               "Hidden": "Yes",
  //               "Section": "section1",
  //               "Disabled": "Yes",
  //               "Mandatory": "Yes",
  //               "Field Name": "field1",
  //               "View Order": "1",
  //               "Description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //               "Type of Field": "Text Field"
  //             }
  //           }
  //         }
  //       },
  //       "sys#194": {
  //         "name": "sys#194",
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "96fa53873a1863d24be376b6970adcb070c617f3": {
  //             "rowLabel": "SAM",
  //             "fields": {
  //               "name": "SAM",
  //               "numcols": "0",
  //               "version": "1",
  //               "view_order": "1",
  //               "view_group_id": "Parent 1"
  //             }
  //           }
  //         }
  //       },
  //       "sys#195": {
  //         "name": "sys#195",
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "0b4733da9e61e42560c9f3310c4171d67ba4fa3f": {
  //             "rowLabel": "Parent 2",
  //             "fields": {
  //               "name": "Parent 2",
  //               "title": "Title 2",
  //               "version": "2",
  //               "view_order": "2",
  //               "view_definition_id": "Grand Parent 2"
  //             }
  //           },
  //           "31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598": {
  //             "rowLabel": "Parent 1",
  //             "fields": {
  //               "name": "Parent 1",
  //               "title": "Title 2",
  //               "version": "2",
  //               "view_order": "1",
  //               "view_definition_id": "Grand Parent 1"
  //             }
  //           },
  //           "1d218a5c2e9644959d74dfd62dbbfb34e2a83c41": {
  //             "rowLabel": "Parent 3",
  //             "fields": {
  //               "name": "Parent 3",
  //               "title": "Title 3",
  //               "version": "3",
  //               "view_order": "3",
  //               "view_definition_id": "Grand Parent 3"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     "comment": null,
  //     "status": "DRAFT"
  //   },
  //   "oobModuleMasterVersion2": {
  //     "components": {
  //       "cmp#9": {
  //         "name": "cmp#9",
  //         "type": "CMT_COMPONENT",
  //         "rows": {
  //           "fc5636e8798e379a99260ac5523d7086a91b1188": {
  //             "rowLabel": "field1",
  //             "fields": {
  //               "Hidden": "Yes",
  //               "Section": "section1",
  //               "Disabled": "Yes",
  //               "Mandatory": "Yes",
  //               "Field Name": "field1",
  //               "View Order": "1",
  //               "Description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //               "Type of Field": "Text Field"
  //             }
  //           }
  //         }
  //       },
  //       "sys#194": {
  //         "name": "sys#194",
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "96fa53873a1863d24be376b6970adcb070c617f3": {
  //             "rowLabel": "SAM",
  //             "fields": {
  //               "name": "SAM",
  //               "numcols": "0",
  //               "version": "1",
  //               "view_order": "1",
  //               "view_group_id": "Parent 1"
  //             }
  //           }
  //         }
  //       },
  //       "sys#195": {
  //         "name": "sys#195",
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "0b4733da9e61e42560c9f3310c4171d67ba4fa3f": {
  //             "rowLabel": "Parent 2",
  //             "fields": {
  //               "name": "Parent 2",
  //               "title": "Title 2",
  //               "version": "2",
  //               "view_order": "2",
  //               "view_definition_id": "Grand Parent 2"
  //             }
  //           },
  //           "31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598": {
  //             "rowLabel": "Parent 1",
  //             "fields": {
  //               "name": "Parent 1",
  //               "title": "Title 1",
  //               "version": "1",
  //               "view_order": "1",
  //               "view_definition_id": "Grand Parent 1"
  //             }
  //           },
  //           "1d218a5c2e9644959d74dfd62dbbfb34e2a83c41": {
  //             "rowLabel": "Parent 3",
  //             "fields": {
  //               "name": "Parent 3",
  //               "title": "Title 3",
  //               "version": "3",
  //               "view_order": "3",
  //               "view_definition_id": "Grand Parent 3"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     "comment": null,
  //     "status": "LABEL"
  //   },
  //   "changesVersion1": [
  //     {
  //       "key": "/components/sys#195/rows/31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598/fields/title",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "Title 1",
  //       "valueTo": "Title 2"
  //     },
  //     {
  //       "key": "/components/sys#195/rows/31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598/fields/version",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "1",
  //       "valueTo": "2"
  //     },
  //     {
  //       "key": "/components/sys#195/rows/1d218a5c2e9644959d74dfd62dbbfb34e2a83c41",
  //       "action": "REMOVE",
  //       "valueType": "object",
  //       "valueFrom": {
  //         "fields": {
  //           "name": "Parent 3",
  //           "title": "Title 3",
  //           "version": "3",
  //           "view_order": "3",
  //           "view_definition_id": "Grand Parent 3"
  //         }
  //       },
  //       "valueTo": null
  //     },
  //     {
  //       "key": "/components/sys#194",
  //       "action": "ADD",
  //       "valueType": "object",
  //       "valueFrom": null,
  //       "valueTo": {
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "96fa53873a1863d24be376b6970adcb070c617f3": {
  //             "fields": {
  //               "name": "SAM",
  //               "numcols": "0",
  //               "version": "1",
  //               "view_order": "1",
  //               "view_group_id": "Parent 1"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       "key": "/status",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "LABEL",
  //       "valueTo": "DRAFT"
  //     }
  //   ],
  //   "changesVersion2": [
  //     {
  //       "key": "/components/sys#194",
  //       "action": "REMOVE",
  //       "valueType": "object",
  //       "valueFrom": {
  //         "type": "SYSTEM_TABLE",
  //         "rows": {
  //           "96fa53873a1863d24be376b6970adcb070c617f3": {
  //             "fields": {
  //               "name": "SAM",
  //               "numcols": "0",
  //               "version": "1",
  //               "view_order": "1",
  //               "view_group_id": "Parent 1"
  //             }
  //           }
  //         }
  //       },
  //       "valueTo": null
  //     },
  //     {
  //       "key": "/components/sys#195/rows/31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598/fields/title",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "Title 2",
  //       "valueTo": "Title 1"
  //     },
  //     {
  //       "key": "/components/sys#195/rows/31dd8ff6c7d2c678ee6f8ba65060ad5b7c353598/fields/version",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "2",
  //       "valueTo": "1"
  //     },
  //     {
  //       "key": "/components/sys#195/rows/1d218a5c2e9644959d74dfd62dbbfb34e2a83c41",
  //       "action": "ADD",
  //       "valueType": "object",
  //       "valueFrom": null,
  //       "valueTo": {
  //         "fields": {
  //           "name": "Parent 3",
  //           "title": "Title 3",
  //           "version": "3",
  //           "view_order": "3",
  //           "view_definition_id": "Grand Parent 3"
  //         }
  //       }
  //     },
  //     {
  //       "key": "/status",
  //       "action": "REPLACE",
  //       "valueType": "value",
  //       "valueFrom": "DRAFT",
  //       "valueTo": "LABEL"
  //     }
  //   ],
  //   "compareStatus": {
  //     "message": "",
  //     "status": "success"
  //   }
  // }
  const versionOneData =
    compareVersionsData &&
    compareVersionsData.oobModuleMasterVersion1.components;

  const versionTwoData =
    compareVersionsData &&
    compareVersionsData.oobModuleMasterVersion2.components;

  const changesVersionOne =
    compareVersionsData && compareVersionsData.changesVersion1;

  const changesVersionTwo =
    compareVersionsData && compareVersionsData.changesVersion2;

  const handlePanelState = (path) => {
    if (panelState[path]) {
      setPanelState((states) => ({ ...states, [path]: false }));
    } else {
      setPanelState((states) => ({ ...states, [path]: true }));
    }
  };

  useEffect(() => {
    dispatch({ type: RESET_FETCH_COMPARE_VERSION });
    dispatch(fetchCompareVersion(moduleId, firstVersion, secondVersion));
  }, [dispatch, moduleId, firstVersion, secondVersion]);

  useEffect(() => {
    if (getCompareVersionError)
      setApiError(handleCompareVersionDifferenceError(getCompareVersionError));
    else
      setApiError(false);
  },
    [getCompareVersionError]
  );

  return (
    <>
      <PageHeading heading={COMP_VERSION} action={<CompareVersionLegend />} />
      {apiError ? (
        <Grid container>
          <Grid item xs={12} className={styles.error}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">{apiError.message}</Typography>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <>
          <CompareVersionHeading heading={moduleName} />
          <Grid container wrap="nowrap">
            <Grid item xs className={styles.compareGrid}>
              <MatCard className={styles.card}>
                <CardHeader
                  className={styles.cardHeading}
                  title={
                    <Typography variant="h6" className={styles.cardHeadingSize}>
                      {firstVersionLabel(firstVersion)}
                    </Typography>
                  }
                />
                <Divider />
                <div>
                  {versionOneData && (
                    <CompareDifferenceData
                      versionDataList={versionOneData}
                      versionChanges={changesVersionOne}
                      panelState={panelState}
                      handlePanelState={handlePanelState}
                      side="left"
                    />
                  )}
                </div>
              </MatCard>
            </Grid>
            <Grid item xs style={{ maxWidth: "40px" }}></Grid>
            <Grid item xs className={styles.compareGrid}>
              <MatCard className={styles.card}>
                <CardHeader
                  className={styles.cardHeading}
                  title={
                    <Typography variant="h6" className={styles.cardHeadingSize}>
                      {secondVersionLabel(secondVersion)}
                    </Typography>
                  }
                />
                <Divider />
                <div>
                  {versionTwoData && (
                    <CompareDifferenceData
                      versionDataList={versionTwoData}
                      versionChanges={changesVersionTwo}
                      panelState={panelState}
                      handlePanelState={handlePanelState}
                      side="right"
                    />
                  )}
                </div>
              </MatCard>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default CompareVersionDifference;
