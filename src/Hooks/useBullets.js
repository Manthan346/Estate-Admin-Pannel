import { useState } from "react";

export function useBullets() {
  const [text, setText] = useState("");
  const [bullets, setBullets] = useState([]);

  const handleBullets = (e) => {
    const value = e.target.value;
    setText(value);

    const converted = value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    setBullets(converted);

  };

  return { text, bullets, handleBullets };
}
