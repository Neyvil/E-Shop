import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DescriptionBox.css';

const DescriptionBox = ({ title, description, setDescription }) => {
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="description-box">
      <label htmlFor="description" className="description-title">
        {title}
      </label>
      <ReactQuill
        id="description"
        theme="snow"
        value={description}
        onChange={setDescription}
        modules={modules}
        formats={formats}
        placeholder="Enter the product description here..."
        className="description-editor text-slate-300"
      />
    </div>
  );
};

export default DescriptionBox;
