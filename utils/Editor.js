import React, { useRef } from "react";
import SunEditor from "suneditor-react";
import plugins from "suneditor/src/plugins";
import lang from "suneditor/src/lang";
import { ko } from "suneditor/src/lang";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const PostEditor = (props) => {
  const { onChange, ...rest } = props;
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
            "paragraphStyle",
            "blockquote",
            "bold",
            "underline",
            "italic",
            "strike",
            "subscript",
            "superscript",
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
            "table",
            "link",
            "image",
            "fullScreen",
            "showBlocks",
            "codeView",
            "preview",
            "save",
            "template",
          ],
        ],
      }}
      onChange={(content) => {
        onChange(content);
      }}
    />
  );
};

export default PostEditor;
