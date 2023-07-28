import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_score_fish_mind_reading_list = createAsyncThunk(
  "fishGameTrials/api_v1_score_fish_mind_reading_list",
  async payload => {
    const response = await apiService.api_v1_score_fish_mind_reading_list(
      payload
    )
    return response.data
  }
)
export const api_v1_score_fish_mind_reading_create = createAsyncThunk(
  "fishGameTrials/api_v1_score_fish_mind_reading_create",
  async payload => {
    const response = await apiService.api_v1_score_fish_mind_reading_create(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const fishGameTrialsSlice = createSlice({
  name: "fishGameTrials",
  initialState,
  reducers: {},
  extraReducers: {
    [api_v1_score_fish_mind_reading_list.pending]: (state, action) => {
      if (state.api.loading === "idle") {
        state.api.loading = "pending"
      }
    },
    [api_v1_score_fish_mind_reading_list.fulfilled]: (state, action) => {
      if (state.api.loading === "pending") {
        state.entities = action.payload
        state.api.loading = "idle"
      }
    },
    [api_v1_score_fish_mind_reading_list.rejected]: (state, action) => {
      if (state.api.loading === "pending") {
        state.api.error = action.error
        state.api.loading = "idle"
      }
    },
    [api_v1_score_fish_mind_reading_create.pending]: (state, action) => {
      if (state.api.loading === "idle") {
        state.api.loading = "pending"
      }
    },
    [api_v1_score_fish_mind_reading_create.fulfilled]: (state, action) => {
      if (state.api.loading === "pending") {
        state.entities.push(action.payload)
        state.api.loading = "idle"
      }
    },
    [api_v1_score_fish_mind_reading_create.rejected]: (state, action) => {
      if (state.api.loading === "pending") {
        state.api.error = action.error
        state.api.loading = "idle"
      }
    }
  }
})
export default {
  api_v1_score_fish_mind_reading_list,
  api_v1_score_fish_mind_reading_create,
  slice: fishGameTrialsSlice
}
