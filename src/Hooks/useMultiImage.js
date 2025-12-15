import { useState } from "react";

export function useMultiImage() {
  const [images, setImages] = useState({});

  const handleImage = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImages(prev => ({
      ...prev,
      [key]: {
        file,
        preview
      }
    }));
  };

  return { images, handleImage , setImages};
}
