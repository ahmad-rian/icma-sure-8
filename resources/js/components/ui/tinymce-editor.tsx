import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function TinyMCEEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter content here...', 
  height = 400 
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey="6l3mc89b9bg7kns6j44lu6y0d9tsdq0kd4dgqoeffrtcli9z"
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        resize: false,
        statusbar: false
      }}
    />
  );
}

export { TinyMCEEditor };