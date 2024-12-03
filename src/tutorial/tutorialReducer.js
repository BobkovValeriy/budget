import { createSlice } from '@reduxjs/toolkit';

const tutorialReducer = createSlice({
    name: "tutorial",
    initialState: {
        tutorialStepsMobile: 0,
        tutorialStepsFullScreen: 0,
        tutorialRefs: {

        }
    },
    reducers: {
        // Увеличение шага для мобильной версии
        tutorialStepsMobileGrow(state) {
            state.tutorialStepsMobile += 1;
        },
        // Уменьшение шага для мобильной версии
        tutorialStepsMobileDecrease(state) {
            if (state.tutorialStepsMobile > 0) {
                state.tutorialStepsMobile -= 1;
            }
        },
        // Увеличение шага для полной версии
        tutorialStepsFullScreenGrow(state) {
            state.tutorialStepsFullScreen += 1;
        },
        // Уменьшение шага для полной версии
        tutorialStepsFullScreenDecrease(state) {
            if (state.tutorialStepsFullScreen > 0) {
                state.tutorialStepsFullScreen -= 1;
            }
        },
        // Сброс шагов обучения
        resetTutorialStepsMobile(state) {
            state.tutorialStepsMobile = 0;
        },
        resetTutorialStepsFullScreen(state) {
            state.tutorialStepsFullScreen = 0;
        },
        // Установка шагов обучения для загрузки из базы данных
        setTutorialSteps(state, action) {
            const { tutorialStepsMobile, tutorialStepsFullScreen } = action.payload;
            state.tutorialStepsMobile = tutorialStepsMobile;
            state.tutorialStepsFullScreen = tutorialStepsFullScreen;
        },
    },
});

export const { 
    tutorialStepsMobileGrow, 
    tutorialStepsMobileDecrease, 
    tutorialStepsFullScreenGrow, 
    tutorialStepsFullScreenDecrease, 
    resetTutorialStepsMobile, 
    resetTutorialStepsFullScreen,
    setTutorialSteps 
} = tutorialReducer.actions;

export default tutorialReducer.reducer;
