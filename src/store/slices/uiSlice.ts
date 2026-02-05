import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface UIState {
    pageTitle: string;
}

const initialState: UIState = {
    pageTitle: 'Dashboard',
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        //Действие для смены заголовка
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.pageTitle = action.payload;
        }
    }
})

export const {setPageTitle} = uiSlice.actions;
export default uiSlice.reducer;