import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

export const createLike = createAsyncThunk(
    'like/createLike', async (like, { rejectWithValue }) => {
        try {
            const response = await MyAxios.post('/like', like);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getLikesByUserId = createAsyncThunk(
    'like/getLikesByUserId', async (userId, { rejectWithValue }) => {
        try {
            const response = await MyAxios.get(`/like/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getSmashLikesByUserId = createAsyncThunk(
    'like/getSmashLikesByUserId', async (userId, { rejectWithValue }) => {
        try {
            const response = await MyAxios.get(`/like/user/smash/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteLike = createAsyncThunk(
    'like/deleteLike', async (likeId, { rejectWithValue }) => {
        try {
            await MyAxios.delete(`/like/${likeId}`);
            return likeId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteLikeUser = createAsyncThunk(
    'like/deleteLikeUser', async (userId, { rejectWithValue }) => {
        try {
            await MyAxios.delete(`/like/user/${userId}`);
            return userId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const smashSlice = createSlice({
    name: 'smash',
    initialState: {
        likes: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        removeLike: (state, action) => {
            state.likes = state.likes.filter(like => like.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likes.push(action.payload);
            })
            .addCase(createLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getLikesByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getLikesByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likes = action.payload;
            })
            .addCase(getLikesByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getSmashLikesByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getSmashLikesByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likes = action.payload;
            })
            .addCase(getSmashLikesByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likes = state.likes.filter(like => like.id !== action.payload);
            })
            .addCase(deleteLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteLikeUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLikeUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likes = state.likes.filter(like => like.userId !== action.payload);
            })
            .addCase(deleteLikeUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default smashSlice.reducer;


