import React, { useState } from 'react';
import styles from "./langSwitch.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { textTranslate } from "./langReducer";
import RU from "./lang/ru96.png";
import EN from "./lang/en96.png";
import UA from "./lang/ua96.png";
import FR from "./lang/fra96.png"
import DE from "./lang/ger96.png"

const LangSwitch = () => {
  const lang = useSelector((state) => state.langReducer.langague);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const langagueArr = [
    { code: "RU", src: RU },
    { code: "EN", src: EN },
    { code: "UA", src: UA },
    { code: "FR", src: FR },
    { code: "DE", src: DE },
  ];

  const visibleLangs = langagueArr.filter(l => !(l.code === "RU" && lang === "UA"));

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % visibleLangs.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? visibleLangs.length - 1 : prevIndex - 1
    );
  };

  const getDisplayedLangs = () => {
    if (visibleLangs.length === 1) return visibleLangs;
    const firstLang = visibleLangs[index];
    const secondLang = visibleLangs[(index + 1) % visibleLangs.length];
    return [firstLang, secondLang];
  };

  const displayedLangs = getDisplayedLangs();

  return (
    <div className={styles.langague_switcher}>
      <button onClick={handlePrev}>←</button>
      {displayedLangs.map((lan) => (
        <div key={lan.code} className={styles.langague}>
          <img
            src={lan.src}
            alt={lan.code}
            className={styles.langague_img}
            onClick={() => dispatch(textTranslate(lan.code))}
            draggable="false"
          />
        </div>
      ))}
      <button onClick={handleNext}>→</button>
    </div>
  );
};

export default LangSwitch;