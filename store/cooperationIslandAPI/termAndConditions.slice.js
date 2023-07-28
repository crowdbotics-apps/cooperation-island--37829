import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_terms_conditions_list = createAsyncThunk(
  "termAndConditions/api_v1_terms_conditions_list",
  async payload => {
    const response = await apiService.api_v1_terms_conditions_list(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const termAndConditionsSlice = createSlice({
  name: "termAndConditions",
  initialState,
  reducers: {},
  extraReducers: {
    [api_v1_terms_conditions_list.pending]: (state, action) => {
      if (state.api.loading === "idle") {
        state.api.loading = "pending"
      }
    },
    [api_v1_terms_conditions_list.fulfilled]: (state, action) => {
      if (state.api.loading === "pending") {
        state.entities = action.payload
        state.api.loading = "idle"
      }
    },
    [api_v1_terms_conditions_list.rejected]: (state, action) => {
      if (state.api.loading === "pending") {
        state.api.error = action.error
        state.api.loading = "idle"
      }
    }
  }
})
export default { api_v1_terms_conditions_list, slice: termAndConditionsSlice }
