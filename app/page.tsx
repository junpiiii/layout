"use client";

import styles from "./page.module.css";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [background, setBackground] = useState("/FG.png");
  const [photos, setPhotos] = useState<string[]>([]);
  const [imageNumber, setImageNumber] = useState(1000);
  const [inputNumber, setInputNumber] = useState("1000");
  const [copies, setCopies] = useState("1");

  const captureRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
  if (!captureRef.current) return;

  const canvas = await html2canvas(captureRef.current, {
    scale: 4,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  if (!blob) return;

  const safeCopies = Number(copies) > 0 ? copies : "1";
  const fileName = `${imageNumber}_${safeCopies}.png`;

  const link = document.createElement("a");
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  link.click();

  URL.revokeObjectURL(link.href);
};

  useEffect(() => {
    const saved = localStorage.getItem("imageNumber");
    if (saved) {
      setImageNumber(Number(saved));
      setInputNumber(saved);
    } else {
      localStorage.setItem("imageNumber", "1000");
    }
  }, []);

  const shareImage = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current, {
      scale: 4,
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (!blob) return;

    const safeCopies = Number(copies) > 0 ? copies : "1";
    const fileName = `${imageNumber}_${safeCopies}.png`;

    const file = new File([blob], fileName, {
      type: "image/png",
    });

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }

      const next = imageNumber + 1;

      setImageNumber(next);
      setInputNumber(String(next));
      localStorage.setItem("imageNumber", String(next));

      setPhotos([]);
      setCopies("1");
    } catch (e) {
      console.log("共有がキャンセルされました");
    }
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  const changeNumber = () => {
    const num = Number(inputNumber);

    if (isNaN(num)) return;

    setImageNumber(num);
    localStorage.setItem("imageNumber", String(num));
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.name}>SO SO SO MUCH</h1>

      <div className={styles.numberCard}>
        <div className={styles.numberTitle}>現在の番号</div>

        <div className={styles.number}>{imageNumber}</div>

        <div className={styles.numberEdit}>
          <input
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
          />

          <button onClick={changeNumber}>変更</button>
        </div>
      </div>

      <div className={styles.copyCard}>
        <div className={styles.numberTitle}>印刷部数</div>

        <input
          type="number"
          min="1"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
          className={styles.copyInput}
        />
      </div>

      <div className={styles.top}>
        <div className={styles.topButton}>
          <label className={styles.uploadButton}>
            + PHOTO
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                setPhotos(
                  files.slice(0, 4).map((file) => URL.createObjectURL(file))
                );
              }}
            />
          </label>

          <div className={styles.backgroundButton}>
            <button onClick={() => setBackground("/FG.png")}>📖</button>
            <button onClick={() => setBackground("/momi.png")}>💚</button>
            <button onClick={() => setBackground("/blue.jpg")}>💙</button>
            <button onClick={() => setBackground("/red.jpg")}>💖</button>
            <button onClick={() => setBackground("/yellow.jpg")}>💛</button>
          </div>
        </div>

        <div className={styles.saveButton}>
          <button onClick={shareImage}>📤 Google Driveへ共有</button>
          <button onClick={resetPhotos}>♻ リセット</button>
          <button onClick={downloadImage}>💾 ダウンロード</button>
        </div>
      </div>

      <div
        ref={captureRef}
        className={`${styles.canvas} ${
          background === "/momi.png" ? styles.momi : ""
        }`}
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className={styles.layout}>
          <div className={styles.printNumber}>No.{imageNumber}</div>

          <div className={styles.photoGrid}>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`${styles.photoFrame} ${
                  styles[`photo${index}` as keyof typeof styles]
                }`}
              >
                {photos[index] && (
                  <img src={photos[index]} alt="" className={styles.photo} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}