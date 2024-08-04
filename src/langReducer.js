import { createSlice } from "@reduxjs/toolkit";
import ru from './locales/ru.js'
import en from './locales/en.js'

const langReducer = createSlice({
    name: "texts",
    initialState: {
        langague: "ru",
    },
    reducers: {
        textToRu(state, action) {
            console.log("Russian")
            state.langague = "ru"
            Object.keys(ru).forEach((key) => {
                state[key] = ru[key];
            });
        },
        textToEn(state, action) {
            console.log("English")
            state.langague = "ru"
            Object.keys(en).forEach((key) => {
                state[key] = en[key];
            });
        },
    }
});

export const { textToRu, textToEn } = langReducer.actions;

export default langReducer.reducer;