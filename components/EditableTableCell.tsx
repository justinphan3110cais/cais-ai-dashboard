"use client";

import React, { useState } from "react";

interface EditableTableCellProps {
  value: number | null | undefined;
  onSave: (newValue: number | null) => void;
  isEditable: boolean;
  isGrayedOut?: boolean;
}

export const EditableTableCell = ({ value, onSave, isEditable, isGrayedOut }: EditableTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");

  const formatValue = (val: number | null | undefined) => {
    if (isGrayedOut) return "";
    if (val === null || val === undefined) return "-";
    return val.toFixed(1);
  };

  const handleSave = () => {
    const numValue = editValue === "" || editValue === "-" ? null : parseFloat(editValue);
    onSave(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditable) {
    return (
      <span className="font-mono text-sm">
        {formatValue(value)}
      </span>
    );
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="font-mono text-sm w-16 px-1 py-0.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
        placeholder="-"
      />
    );
  }

  return (
    <span
      className="font-mono text-sm cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {formatValue(value)}
    </span>
  );
};