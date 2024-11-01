import { configureStore, createSlice } from '@reduxjs/toolkit';
import langReducer from './langagueSwitch/langReducer';
import tutorialReducer from './tutorial/tutorialReducer';

const initialState = {
    logined: false,
    showLoginMenu: true,
    showRegisterMenu: false,
    locale: 'ru',
    username: '',
    password: '',
    message: '',
    mobileView: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLogined(state, action) {
            state.logined = action.payload;
        },
        setShowLoginMenu(state, action) {
            state.showLoginMenu = action.payload;
        },
        setShowRegisterMenu(state, action) {
            state.showRegisterMenu = action.payload;
        },
        setUsername(state, action) {
            state.username = action.payload;
        },
        setPassword(state, action) {
            state.password = action.payload;
        },
        setLocale(state, action) {
            state.locale = action.payload;
        },
        setMessage(state,action){
            state.message = action.payload;
        },
        setView(state,action){
            state.mobileView = action.payload;
        }
    }
});

export const { setLogined, setShowLoginMenu, setShowRegisterMenu, setUsername, setPassword, setLocale, setMessage, setView} = appSlice.actions;

const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        langReducer: langReducer,
        tutorialReducer: tutorialReducer,
    }
});

export default store;