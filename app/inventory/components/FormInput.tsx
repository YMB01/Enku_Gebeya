'use client';

import styles from './form.module.css';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string | number | undefined; // Allow undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: { value: string | number; label: string }[];
}

export function FormInput({ label, type, name, value, onChange, required, options }: FormInputProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}</label>
      {type === 'select' && options ? (
        <select name={name} value={value ?? ''} onChange={onChange} required={required}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value ?? ''} onChange={onChange} required={required} />
      ) : (
        <input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} />
      )}
    </div>
  );
}