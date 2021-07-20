import React, { useRef } from "react";
import SunEditor from "suneditor-react";
import plugins from "suneditor/src/plugins";
import lang from "suneditor/src/lang";
import { ko } from "suneditor/src/lang";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const PostEditor = () => {
  return (
    <SunEditor
      lang={lang.ko}
      setOptions={{
        buttonList: [
          [
            "undo",
            "redo",
            "font",
            "fontSize",
            "formatBlock",
            "blockquote",
            "bold",
            "underline",
            "italic",
            "strike",
            "fontColor",
            "hiliteColor",
            "textStyle",
            "removeFormat",
            "outdent",
            "indent",
            "align",
            "horizontalRule",
            "list",
            "lineHeight",
            "link",
            "image",
            "fullScreen",
            "codeView",
            "preview",
            "save",
          ],
        ],
      }}
    />
  );
};

export default PostEditor;
