import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
import Typography from "@material-ui/core/Typography";
import PageHeading from "../../components/PageHeading";
import ImportInstructions from "../../components/ImportInstruction";
import LetterUpload from "../../components/LetterUpload";
import ImportQueue from "../../components/ImportQueue";
// import { generateFileName } from "../../utils/helpers";

import {
  fetchBusinessByClientId,
  fetchModulesByClientId,
  fetchCompanyByClientId,
  //addFiles,
  fetchFiles,
  addFilesReset,
} from "../../actions/LettersActions";

import { stopLoading } from "../../utils/helpers";
import { COMMON_ERROR_MESSAGE, IMPORT_PORTAL } from "../../utils/Messages";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTBY,
} from "../../utils/LettersAppConstant";
import { START_SPINNER_ACTION } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",
  },
  col: {
    padding: "10px",
  },

  grow: {
    flexGrow: 1,
  },
  anchor: {
    textDecoration: "none",
  },
  button: {
    marginTop: "10px",
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
}));

const cols = [
  // { id: "sno", label: "SNo.", width: "5%" },
  { id: "id", label: "SNo.", width: "4%" },
  { id: "module", label: "Module", width: "15%" },
  { id: "delivery", label: "Delivery", width: "10%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "letterName", label: "Letter Name", width: "25%" },
  { id: "company", label: "Company", width: "10%" },
  { id: "lineOfBusiness", label: "LOB", width: "10%" },
  { id: "status", label: "Status", width: "15%" },
];

const ImportPortal = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [apiError, setApiError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [actionError, setActionError] = useState(null);
  const [pageSize, setPageSize] = useState(0);
  // const [selectAll, setSelectAll] = useState(false);
  const clientId = useSelector((state) => state.Header.entityId);
  const totalElements = useSelector(
    (state) => state.Letters.allFilesData.totalElements
  );
  const startIndex = useSelector((state) => state.Letters.page.startIndex);
  //const pageSize = useSelector((state) => state.Letters.page.pageSize);
  //const addApiError = useSelector(state => state.MasterSection.addError);

  const filesList = useSelector((state) =>
    state.Letters?.allFilesData?.list?.map((data) => {
      let blankData = {
        id: data.id,
        module: data.module?.id,
        delivery: data.deliveryMethod,
        type: data.letterImportType,
        letterName: data.letterName,
        lineOfBusiness: data.business?.id || 0,
        company: data.company?.id || 0,
        supportedLob: data.supportedLob ? data.supportedLob : [],
        duplicateLetterName: data.duplicateLetterName,
        status: data.letterImportStatus,
        statusDialog: data.letterImportStatus,
      };
      // return { ...data, ...blankData };
      return { ...blankData };
    })
  );

  const filesRowDataError = (
    useSelector((state) => state.Letters.fileData) || []
  ).filter((item) => {
    return item?.responseMessage?.toLowerCase() !== "success" && item.error;
  });

  //console.log("file error", filesRowDataError);
  // const filterValues = {
  //   moduleList: useSelector((state) => state.Letters.modulesList),
  //   lobList: useSelector((state) => state.Letters.businessList),
  //   companyList: useSelector((state) => state.Letters.companyList),
  //   deliveryTypeList: ["MAIL", "FAX"],
  // };

  // const getModuleId = () => {
  //   let moduelId = filterValues?.moduleList?.find(o => o.moduleName === "GLOBAL")?.id;
  //   return !moduelId ? 0 : moduelId
  // }

  // const handleFileName = (fileName) => {
  //   let count = 0,
  //     r = /[\\/:*?"<>]/gi;
  //   dispatch({ type: START_SPINNER_ACTION });
  //   fileName.forEach(({ originalFileName, blobFileName }) => {
  //     const fileData = generateFileName(originalFileName, filterValues);
  //     let letterName = fileData.letterName
  //       ? fileData.letterName
  //       : originalFileName;
  //     dispatch(
  //       addFiles(
  //         {
  //           clientId: clientId,
  //           businessLineDescription: fileData.businessLineDescription,
  //           companyDescription: fileData.companyDescription,
  //           deliveryMethod: fileData.deliveryMethod,
  //           effectiveDate: new Date().toISOString(),
  //           letterName: letterName,
  //           importStoragePath: "",
  //           originalStoragePath: blobFileName,
  //           letterImportStatus:
  //             letterName === "" || r.test(letterName) ? "NOT_READY" : "READY",
  //           letterImportType: "LETTER",
  //           libraryStoragePath: "string",
  //           moduleId: !fileData.moduleId ? getModuleId() : fileData.moduleId,
  //           originalFileName: originalFileName,
  //         },
  //         clientId,
  //         () => {
  //           count = count + 1;
  //           if (fileName.length === count) {
  //             //LetterUpload.closepopUP();
  //             dispatch(
  //               fetchFiles(
  //                 DEFAULT_START_INDEX,
  //                 pageSize,
  //                 DEFAULT_SORTBY,
  //                 clientId,
  //                 "",
  //                 ""
  //               )
  //             );
  //             if (!filesRowDataError.length) {
  //               LetterUpload?.closepopUP();

  //             } else {
  //               resetFileData();

  //             }
  //             //setSelectAll(false);
  //             stopLoading(dispatch);
  //           }
  //         }
  //       )
  //     );
  //   });
  // };

  const handlePageChange = (start, size, DEFAULT_SORTBY, clientId) => {
    setPageSize(size);
    dispatch(fetchFiles(start, size, DEFAULT_SORTBY, clientId, "", ""));
  };

  const resetFileData = () => {
    dispatch(addFilesReset());
  };

  const afterFilesUpload = () => {

    dispatch(
      fetchFiles(
        DEFAULT_START_INDEX,
        pageSize,
        DEFAULT_SORTBY,
        clientId,
        "",
        ""
      )
    );

    if (!filesRowDataError.length) {
      //LetterUpload?.closepopUP();

    } else {
      resetFileData();

    }
    stopLoading(dispatch);
  }


  useEffect(() => {
    if (clientId) {
      dispatch(fetchModulesByClientId(clientId));
      dispatch(fetchBusinessByClientId(clientId));
      dispatch(fetchCompanyByClientId(clientId));
      dispatch(
        fetchFiles(
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          DEFAULT_SORTBY,
          clientId,
          "",
          ""
        )
      );
    }
  }, [dispatch, clientId]);

  return (
    <>
      <MatCard>
        <CardHeader
          className={styles.cardHeading}
          title={
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Import Templates
            </Typography>
          }
        />
        <Divider />
        {apiError && (
          <>
            <PageHeading heading={IMPORT_PORTAL} />
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">{apiError}</Typography>
              </Card>
            </Grid>
          </>
        )}
        {!apiError && (
          <>
            {actionError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={styles.errorCard}>
                  <Typography variant="body2">{actionError}</Typography>
                </Card>
              </Grid>
            )}

            <Grid container>
              {false && (
                <Grid item xs={12} className={styles.error}>
                  <Card className={styles.errorCard}>
                    <Typography variant="body2">
                      {COMMON_ERROR_MESSAGE}
                    </Typography>
                  </Card>
                </Grid>
              )}
              <Grid item xs={12}>
                <ImportInstructions />
              </Grid>
              <Grid item xs={12}>
                {clientId &&
                  <LetterUpload
                    clientId={clientId}
                    resetFileData={resetFileData}
                    errorData={filesRowDataError}
                    onUploadSuccess={afterFilesUpload}
                  />
                }
              </Grid>

              <Grid item xs={12}>
                {filesList?.length > 0 && (
                  <ImportQueue
                    cols={cols}
                    rows={filesList}
                    totalElements={totalElements}
                    startIndex={startIndex}
                    handlePageChange={handlePageChange}
                  //setSelectAll={setSelectAll}
                  />
                )}
              </Grid>
            </Grid>
          </>
        )}
      </MatCard>
    </>
  );
};

export default ImportPortal;
