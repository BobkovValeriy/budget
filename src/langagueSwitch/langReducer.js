import { createSlice } from "@reduxjs/toolkit";
import ru from './locales/ru.js'
import en from './locales/en.js'
import ua from './locales/ua.js'
import fr from './locales/fr.js'
import de from './locales/de.js'

const langReducer = createSlice({
    name: "texts",
    initialState: {
        langague: "EN",
    },
    reducers: {
        textTranslate(state, action) {
            const locale = action.payload; // Получаем локаль из action
            state.langague = locale;

            // Определяем, какой файл загрузить в зависимости от локали
            const texts = locale === 'RU' ? ru : 
                          locale === 'UA' ? ua :
                          locale === 'FR' ? fr : 
                          locale === 'DE' ? de :
                          en; // По умолчанию английский

            Object.keys(texts).forEach((key) => {
                state[key] = texts[key];
            });
        },
    }
});

export const { textTranslate } = langReducer.actions;

export default langReducer.reducer;
