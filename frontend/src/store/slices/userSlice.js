import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getAllUsers();
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
  }
});
export const updateUserRole = createAsyncThunk('users/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await adminService.updateUserRole(id, role);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update user role');
  }
});
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await adminService.deleteUser(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
  }
});
const initialState = {
  usersList: [],
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.usersList.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.usersList[index] = action.payload;
        }
        toast.success('User role updated');
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersList = state.usersList.filter((u) => u._id !== action.payload);
        toast.success('User deleted successfully');
      });
  },
});
export default userSlice.reducer;
