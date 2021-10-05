/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import UploadIcon from "../../assets/images/cloud_upload-icon.svg";
import MatCard from "../MaterialUi/MatCard";
import ProgressCircular from "../../components/ProgressCircular";
// import S3 from "react-aws-s3";
import {
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION
} from "../../utils/AppConstants";
import { UPLOAD_MULTIFILE_API_URL } from "../../utils/LettersAppConstant";
import { setRequestHeader, stopLoading } from "../../utils/helpers";
import ddStyles from "./DropZone.module.scss";

const useStyles = makeStyles((theme) => ({
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
  },

  cardContent: {
    display: "inline-block",
    listStyle: "none",
    fontSize: "13px",
    paddingLeft: "20px",

    "& li": { lineHeight: "20px" },
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

const LetterUpload = (props) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const fileInputRef = useRef();
  let filesLength = useRef(0);
  let uploadedLength = useRef(0);
  const clientId = props.clientId;
  const dispatch = useDispatch();

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length) {
      //handleFiles(files);
      handleOnDrop(files);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  // Trigger onChange input upload...
  const filesSelected = () => {
    //alert("test")
    if (fileInputRef.current.files.length) {
      handleOnDrop(fileInputRef.current.files);
    }
  };

  const closeProgressDialog = () => {
    setOpen(false);
    props.resetFileData();
  };

  const [uploadSize, setUploadSize] = useState(0);

  const handleOnDrop = (files) => {
    let fileType =
      files[0].name.includes(".doc") || files[0].name.includes(".docx");
    if (fileType) {
      uploadFiles(files);
    }
  };


  // const uploadFiles = async (files) => {
  //   const arrUploadedFiles = [];
  //   let len = 0,
  //     fileName = "";
  //   setOpen(true);
  //   setUploadSize({
  //     current: 0,
  //     size: files.length,
  //   });

  //   for (const currentfile of files) {
  //     fileName = currentfile.name.split(".docx")[0];
  //     // fileName = `${fileName}_GUID_${generateGUID()}.docx`;
  //     const formData = new FormData();
  //     formData.append("file", currentfile);
  //     formData.append("clientId", clientId);
  //     fetch(UPLOAD_FILE_API_URL, {
  //       method: "post",
  //       body: formData,
  //       headers: {
  //         ...setRequestHeader("upload"),
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         len = len + 1;
  //         fileName = data.responseObject.path.split("_GUID")[0]
  //         arrUploadedFiles.push({
  //           originalFileName: fileName,
  //           blobFileName: data.responseObject.path,
  //         });
  //         setUploadSize((state) => ({
  //           ...state,
  //           current: len,
  //         }));

  //         if (len === files.length) {
  //           LetterUpload.closepopUP();
  //           props.onUploadSuccess(arrUploadedFiles);
  //         }
  //         stopLoading(dispatch);
  //       })
  //       .catch((e) => {
  //         console.log(e.message);
  //       });
  //   }
  // };


  const sendBatchFiles = async (formData) => {
    let response = await fetch(UPLOAD_MULTIFILE_API_URL, {
      method: "post",
      body: formData,
      headers: {
        ...setRequestHeader("upload"),
      }
    });
    try {
      let data = await response.json();
      if (data && data.responseCode === "201") {
        uploadedLength.current = uploadedLength.current + data.responseObject.length
        setUploadSize(uploadSize => uploadSize + data.responseObject.length);
      }
      else if (
        data.responseCode === "2303" || data.responseCode === 2303
      ) {
        LetterUpload.closepopUP();
        dispatch({
          type: SHOW_SNACKBAR_ACTION,
          payload: {
            detail: `${data.responseMessage}. Please configure paired environment first.`,
            severity: "error",
          },
        });
        stopLoading(dispatch);
      }
      else if (
        data.responseCode === "2223" || data.responseCode === 2223
      ) {
        LetterUpload.closepopUP();
        dispatch({
          type: SHOW_SNACKBAR_ACTION,
          payload: {
            detail: `${data.responseMessage}.`,
            severity: "error",
          },
        });
        stopLoading(dispatch);
      }
    }
    catch (err) {
      LetterUpload.closepopUP();
      dispatch({
        type: SHOW_SNACKBAR_ACTION,
        payload: {
          detail: err,
          severity: "error",
        },
      });
    }
  }

  let promises = {};
  const mapResolveToPromise = (res) => {
    console.log("res", res);

    res.map((item) => {
      console.log("item", Object.values(item)[1])
      sendBatchFiles(Object.values(item)[1])
    })
  };
  //var t0 = 0;
  const uploadFiles = (files) => {

    //t0 = performance.now();
    filesLength.current = files.length;
    setUploadSize(0);
    let batchLength = 0;

    if (filesLength.current <= 20) {
      batchLength = 2
    }
    else if (filesLength.current <= 50) {
      batchLength = 5
    } else {
      batchLength = 10
    }

    for (var i = 0; i < filesLength.current; i += batchLength) {
      const formData = new FormData();
      let batch = Object.values(files)?.slice(i, i + batchLength)
      //console.log("batch", batch)
      for (var j = 0; j < batch.length; j++) {
        formData.append("file", batch[j]);
      }
      formData.append("clientId", clientId);
      promises[`promise${i}`] = formData;

      //console.log("formData", formData);
      //sendBatchFiles(formData);
    }
    setOpen(true);
    console.log("promises", Object.values(promises));
    Promise.allSettled(Object.values(promises))
      .then(mapResolveToPromise)
      .then((res) => {
        console.log("final res", res);
      });
  }

  LetterUpload.closepopUP = () => {
    setTimeout(() => setOpen(false), 500);
    console.log("popup closed...");
  }

  const calcPercentage = (uploadSize) => {
    if (!filesLength.current) {
      return 0;
    }
    const percentage = ((uploadSize / filesLength.current) * 100).toFixed(0);
    return percentage;
  };

  useEffect(() => {
    //console.log("filesLength", filesLength.current)

    if (uploadSize === filesLength.current) {
      //var t1 = performance.now();
      // console.log(`Call to doSomething took ${t1 - t0} seconds.`);
      console.log("fileUpload Response", uploadSize)
      LetterUpload.closepopUP();
      stopLoading(dispatch);
      props.onUploadSuccess();
    }
  }, [uploadSize, dispatch])

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            <img
              src={UploadIcon}
              alt={UploadIcon + " icon"}
              className={styles.iconSize}
            />{" "}
            Import Portal
          </Typography>
        }
      />
      <Divider />
      <Grid container>
        <>
          {/* {false && (
              <Grid item xs={12} className={styles.error}>
                <Card className={styles.errorCard}>
                  <Typography variant="body2">
                    {COMMON_ERROR_MESSAGE}
                  </Typography>
                </Card>
              </Grid>
            )} */}
          <Grid item xs={12}>
            <div
              style={{ flex: 1, display: "flex" }}
              className={styles.cardContent}
            >
              <div className="content">
                <div className={ddStyles.dzContainer}>
                  <div
                    className={ddStyles.dropContainer}
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}
                  >
                    <div className={ddStyles.dropMessage}>
                      <div className={ddStyles.uploadIcon}></div>
                      Drag & Drop files here or click to upload
                      <br />
                      <span>(File Type Supported: DOCX)</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      className={ddStyles.fileinput}
                      type="file"
                      accept=".docx"
                      multiple
                      onChange={filesSelected}
                    />
                  </div>
                  <div className={ddStyles.filedisplaycontainer}></div>
                </div>
              </div>
            </div>
            <Divider />
          </Grid>
        </>
      </Grid>
      {!!open && (
        <>
          <ProgressCircular
            handleClose={closeProgressDialog}
            open={open}
            value={calcPercentage(uploadSize)}
            current={uploadSize}
            total={filesLength.current}
            errorData={props.errorData}
          />
        </>
      )}
    </MatCard>
  );
};

export default LetterUpload;
