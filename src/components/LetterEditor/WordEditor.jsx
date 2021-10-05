/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import MatButton from "../../components/MaterialUi/MatButton";
import { makeStyles } from "@material-ui/core";
import { fetchRevertHTML } from "../../actions/LettersActions";
import { SHOW_SNACKBAR_ACTION } from "../../utils/AppConstants";
import { RESET_INVALIDTAG } from "../../utils/LettersAppConstant";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    float: "right",
    margin: "10px 0px 10px 10px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#4054b2",
    },
  },
  errorList: {
    paddingLeft: "25px",
  },
}));

function WordEditor(props) {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { letterId } = useParams();

  let { invalidTag, tagNames, htmlData } = props;
  const apiInvalidTagList = useSelector((state) => state.Letters.NewInvalidTag);
  const isInvalid = useSelector((state) => state.Letters.isInvalid);
  const [newInvalidTagList, setNewInvalidTagList] = useState([]);
  const [btnRevertDisabled, setBtnRevertDisabled] = useState(false);
  const tagNameList = tagNames.map((item) => item.replace("<", ""));
  let newInvalidTags = invalidTag.map((item) =>
    item.replace(/</g, "").replace(/>/g, "")
  );

  let replaceHtml = htmlData;
  //console.log("replaceHtml", replaceHtml.length)
  if (replaceHtml.length > 0) {
    newInvalidTags?.forEach((item, index) => {
      replaceHtml = replaceHtml?.includes(item) ? replaceHtml?.replaceAll(item, `<s>${item}</s>`) : item;
    });
  }
  const [html, setHtml] = useState(replaceHtml);
  const isReverted = useSelector((state) => state.Letters.isReverted);
  const revertedHtml = useSelector((state) => state.Letters.revertHtmlData);
  const handleSave = () => {
    var data = html.replace(/&nbsps/g, '').replace(/\n/g, '')
    data = data?.replace(/<s>/g, '').replace(/<\/s>/g, '');
    props.handleSaveLetter(data);
  };


  const handleRevert = () => {
    dispatch(fetchRevertHTML(letterId));
  };
  //console.log("isReverted", isReverted)
  useEffect(() => {
    if (isReverted && revertedHtml) {
      let CKEDITOR = window.CKEDITOR;
      CKEDITOR?.instances?.editor1?.setData(revertedHtml);
      setBtnRevertDisabled(true)
    }
  }, [isReverted, revertedHtml]);

  useEffect(() => {
    let CKEDITOR = window.CKEDITOR;
    let configuration = {
      fullPage: true,
      //readOnly: props?.readOnly,
      extraPlugins: "mentions,docprops",
      height: 440,
      allowedContent: true,
      extraAllowedContent: "span(*)",
      mentions: [{ feed: tagNameList, marker: "<", minChars: 0 }],
    };

    CKEDITOR?.replace("editor1", configuration);
    CKEDITOR?.instances?.editor1?.setData(html);

    CKEDITOR?.instances?.editor1?.on("change", () => {
      let data = CKEDITOR.instances.editor1.getData();
      //debounce(handleChangeValidTag, 600)();
      setHtml(data)
    });

  }, []);

  useEffect(() => {
    if (isInvalid && apiInvalidTagList?.length > 0) {

      console.log("apiInvalidTagList", newInvalidTagList)
      setNewInvalidTagList(apiInvalidTagList);
      dispatch({
        type: SHOW_SNACKBAR_ACTION,
        payload: {
          detail: (
            <>
              <p>Please correct the following tags:</p>
              <ul className={styles.errorList}>
                {apiInvalidTagList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ),
          severity: "error",
        },
      });
    }


    dispatch({ type: RESET_INVALIDTAG });
  }, [dispatch, apiInvalidTagList, isInvalid])

  return (
    <div style={{ border: "1px solid #ccc" }}>
      <textarea name="editor1"></textarea>

      <MatButton
        type="submit"
        className={styles.saveButton}
        //disabled={props.readOnly ? true : false}
        color="primary"
        onClick={handleSave}
      >
        Save
      </MatButton>
      <MatButton
        type="submit"
        className={styles.saveButton}
        disabled={isReverted}
        color="primary"
        onClick={handleRevert}
      >
        Revert
      </MatButton>
    </div>
  );
}

export default WordEditor;
