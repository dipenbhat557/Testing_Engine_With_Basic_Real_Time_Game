import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  accept?: string;
  required?: boolean;
  isTextarea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  accept,
  required,
  isTextarea = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-[20px]">{label}</label>
      {isTextarea ? (
        <textarea
          className="px-4 py-2 border border-slate-400 rounded"
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          className="px-4 py-2 border border-slate-400 rounded"
          type={type}
          value={value}
          onChange={onChange}
          accept={accept}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
