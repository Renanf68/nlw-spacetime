"use client";

import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<null | string>(null);
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    if (!files) return;
    const previewUrl = URL.createObjectURL(files[0]);
    setPreview(previewUrl);
  }
  return (
    <>
      <input
        id="media"
        name="coverUrl"
        type="file"
        accept="image/*"
        className="invisible w-0 h-0"
        onChange={onFileSelected}
      />
      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt="Preview da memória"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
}
