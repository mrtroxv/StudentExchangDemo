// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"
import { GET_USER } from "./constants"

export const getAllData = createAsyncThunk("appUsers/getAllData", async () => {
  const response = await axios.get("http://localhost:3500/admin/get-all-data", {
    headers: {
      authorization: JSON.parse(localStorage.getItem("accessToken"))
    }
  })
  return response.data
})

export const getData = createAsyncThunk("appUsers/getData", async (params) => {
  const response = await axios.get("/api/users/list/data", params)
  return {
    params,
    data: response.data.users,
    totalPages: response.data.total
  }
})

export const getUser = createAsyncThunk("appUsers/getUser", async (id) => {
  try {
    console.log(id)
    const response = await axios.get(`http://localhost:3500/admin/get-user`, {
      params: {
        userId: id
      },
      headers: {
        authorization: JSON.parse(localStorage.getItem("accessToken"))
      }
    })
    console.log(response)

    return response.data
  } catch (error) {
    console.log(error)
  }
})

export const addUser = createAsyncThunk(
  "appUsers/addUser",
  async (user, { dispatch, getState }) => {
    await axios.post("/apps/users/add-user", user)
    await dispatch(getData(getState().users.params))
    await dispatch(getAllData())
    return user
  }
)

export const deleteUser = createAsyncThunk(
  "appUsers/deleteUser",
  async (id, { dispatch, getState }) => {
    await axios.delete("/apps/users/delete", { id })
    await dispatch(getData(getState().users.params))
    await dispatch(getAllData())
    return id
  }
)

export const appUsersSlice = createSlice({
  name: "appUsers",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null,
    isLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
        state.isLoading = false
      })
      .addCase(getAllData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  }
})

export default appUsersSlice.reducer
