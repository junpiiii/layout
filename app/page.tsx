"use client";

import styles from "./page.module.css";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [background, setBackground] = useState("/bg-yellow.png");
  const [photos, setPhotos] = useState<string[]>([]);

  const captureRef = useRef<HTMLDivElement>(null);

  const saveImage = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current,{scale:4,});

    const link = document.createElement("a");

    link.download = "layout.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  return (
  <main className={styles.container}>
    <h1 className={styles.name}>SO SO SO MUCH</h1>

    <div className={styles.top}>
      <div className={styles.topButton}>  
        <label className={styles.uploadButton}>
          +PHOTO
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              const files = Array.from(e.target.files || []);

              setPhotos(
                files
                  .slice(0, 4)
                  .map((file) => URL.createObjectURL(file))
              );
            }}
          />
        </label>

      <div className={styles.backgroundButton}>
        <button onClick={() => setBackground("/bg-yellow.png")}>
          黄
        </button>

        <button onClick={() => setBackground("/bg-green.jpg")}>
          緑
        </button>

        <button onClick={() => setBackground("/bg-purple.jpg")}>
          紫
        </button>
      </div>
    </div>

    <div className={styles.saveButton}>    
      <button onClick={saveImage}>
          画像を保存
      </button>

      <button onClick={resetPhotos}>
          写真をリセット
      </button>
    </div>
  </div>

    <div
      ref={captureRef}
      className={styles.canvas}
      style={{backgroundImage: `url(${background})`,}}>
        <div className={styles.layout}>
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