
import React from 'react';

interface EditableTextProps {
  isAdmin: boolean;
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const EditableText: React.FC<EditableTextProps> = ({ 
  isAdmin, 
  value, 
  onChange, 
  className = "", 
  as: Tag = 'span' 
}) => {
  if (!isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`${className} outline-dashed outline-1 outline-blue-400 outline-offset-4 cursor-text hover:bg-blue-50/50 rounded px-1 transition-colors`}
      onBlur={(e) => onChange(e.currentTarget.innerText)}
    >
      {value}
    </Tag>
  );
};

export default EditableText;
