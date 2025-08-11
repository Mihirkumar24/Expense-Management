import { createSlice } from '@reduxjs/toolkit';

const initialState: { expenseIds: number[] } = {
    expenseIds: []
}

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense(state, action) {
            state.expenseIds.push(action.payload);
        },
        clearExpenses(state) {
            state.expenseIds = []
        },
        removeExpense(state, action) {
            state.expenseIds = state.expenseIds.filter(
                (expenseId) => expenseId !== action.payload
            );
        }
    }
});

export const {
    addExpense,
    clearExpenses,
    removeExpense
} = expensesSlice.actions;

export default expensesSlice.reducer;