import React from "react";
import DOMPurify from "dompurify";

export default function RichText(props) {
  const sanitizedHTML = DOMPurify.sanitize(props.children);

  return (
    <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} data-element="rich-text" style={props.style}/>
  );
}