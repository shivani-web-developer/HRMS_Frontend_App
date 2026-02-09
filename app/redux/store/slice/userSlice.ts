import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const persistedUser = typeof window !== 'undefined' 
  ? localStorage.getItem('user')
  : null;

const initialState: UserState = persistedUser
  ? JSON.parse(persistedUser)
  : { empId: '', firstName: '', lastName: '', email: '', role: '' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      return action.payload;
    },
    clearUser: () => {
      localStorage.removeItem('user');
      return { empId: '', firstName: '', lastName: '', email: '', role: '' };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
