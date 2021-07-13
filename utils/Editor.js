import React, { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

// import CodeMirror from "react-codemirror";
// import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
// import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";

const PostEditor = () => {
  const editorRef = useRef(null);
  return (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
      ref={editorRef}
      usageStatistics={false}
    />
  );
};

export default PostEditor;
