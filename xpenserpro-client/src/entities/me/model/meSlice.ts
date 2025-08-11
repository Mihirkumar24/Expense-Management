import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {}
}

const meSlice = createSlice({
    name: 'me',
    initialState,
    reducers: {
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
});

export const {
    setIsAuthenticated,
    setIsLoading,
    setUser
} = meSlice.actions;

export default meSlice.reducer;