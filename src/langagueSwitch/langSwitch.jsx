import styles from "./langSwitch.module.scss";
import { useDispatch } from "react-redux";
import { textToRu, textToEn } from "../langReducer";
import ru from "../images/lang/ru.png";
import en from "../images/lang/en.png";

const LangSwitch = () => {
  const dispatch = useDispatch();
  const switchToRu = () => {
    dispatch(textToRu());
  };

  const switchToEn = () => {
    dispatch(textToEn());
  };

  return (
    <div className={styles.langague_switcher}>
      <div className={styles.langague_ru} onClick={switchToRu}>
        <img src={ru} alt="RU" className={styles.langague_img} />
      </div>
      <div className={styles.langague_en} onClick={switchToEn}>
        <img src={en} alt="EN" className={styles.langague_img} />
      </div>
    </div>
  );
};

export default LangSwitch;
