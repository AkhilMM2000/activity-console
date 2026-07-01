import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import taskViewReducer from './taskViewSlice';
import toolbarReducer from './toolbarSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    taskView: taskViewReducer,
    toolbar: toolbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
