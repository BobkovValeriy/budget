import styles from "./AppMessage.module.scss";

function AppMessage({message}){
    return(
    <div className={styles.message__wrapper}>
        {message}
    </div>
    )
}
export default AppMessage
