"use client";

import styles from "./page.module.css";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [background, setBackground] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const captureRef = useRef<HTMLDivElement>(null);

  const handleBackgroundUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setBackground(URL.createObjectURL(file));
    }
  };

  const saveImage = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current);

    const link = document.createElement("a");

    link.download = "layout.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  return (
    <main>
      <h1 className={styles.name}>SO SO SO MUCH</h1>

      <div className={styles.top}>
        <input
          type="text"
          placeholder="タイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);

            setPhotos(
              files
                .slice(0, 4)
                .map((file) => URL.createObjectURL(file))
            );
          }}
        />

        <button onClick={saveImage}>
          画像を保存
        </button>

        <button onClick={resetPhotos}>
          写真をリセット
        </button>
      </div>

      <div
        ref={captureRef}
        className={styles.canvas}
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className={styles.layout}>
          <div className={styles.titleBox}>
            {title || "タイトル"}
          </div>

          <div className={styles.photoGrid}>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={styles.photoFrame}
              >
                {photos[index] && (
                  <img
                    src={photos[index]}
                    alt=""
                    className={styles.photo}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}