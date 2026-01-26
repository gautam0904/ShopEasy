import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch available orders (unassigned)
export const fetchAvailableOrders = createAsyncThunk('delivery/fetchAvailableOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/delivery/orders/available')
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch available orders")
    }
})

// Fetch my assigned orders
export const fetchMyAssignedOrders = createAsyncThunk('delivery/fetchMyAssignedOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/delivery/orders/mine')
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch assigned orders")
    }
})

// Fetch all orders (read-only)
export const fetchAllOrdersForDelivery = createAsyncThunk('delivery/fetchAllOrdersForDelivery', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/delivery/orders/all')
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch all orders")
    }
})

// Accept an order
export const acceptOrder = createAsyncThunk('delivery/acceptOrder', async (orderId, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/v1/delivery/order/${orderId}/accept`)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to accept order")
    }
})

// Update order status (Prepared, Shipped, Out for Delivery)
export const updateDeliveryStatus = createAsyncThunk('delivery/updateDeliveryStatus', async ({ orderId, status }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/v1/delivery/order/${orderId}/status`, { status }, config)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update order status")
    }
})

// Request completion
export const requestCompletion = createAsyncThunk('delivery/requestCompletion', async (orderId, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/v1/delivery/order/${orderId}/request-completion`)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to request completion")
    }
})

// Add delivery note
export const addDeliveryNote = createAsyncThunk('delivery/addDeliveryNote', async ({ orderId, note }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(`/api/v1/delivery/order/${orderId}/note`, { note }, config)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add delivery note")
    }
})

const deliverySlice = createSlice({
    name: 'delivery',
    initialState: {
        availableOrders: [],
        myAssignedOrders: [],
        allOrders: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        order: {}
    },
    reducers: {
        removeDeliveryErrors: (state) => {
            state.error = null
        },
        removeDeliverySuccess: (state) => {
            state.success = false
        },
        clearDeliveryMessage: (state) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        // Fetch Available Orders
        builder
            .addCase(fetchAvailableOrders.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAvailableOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.availableOrders = action.payload.orders
            })
            .addCase(fetchAvailableOrders.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch available orders'
            })

        // Fetch My Assigned Orders
        builder
            .addCase(fetchMyAssignedOrders.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchMyAssignedOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.myAssignedOrders = action.payload.orders
            })
            .addCase(fetchMyAssignedOrders.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch assigned orders'
            })

        // Fetch All Orders
        builder
            .addCase(fetchAllOrdersForDelivery.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAllOrdersForDelivery.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload.orders
            })
            .addCase(fetchAllOrdersForDelivery.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch all orders'
            })

        // Accept Order
        builder
            .addCase(acceptOrder.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(acceptOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true
                state.message = action.payload.message
                state.order = action.payload.order
            })
            .addCase(acceptOrder.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to accept order'
            })

        // Update Delivery Status
        builder
            .addCase(updateDeliveryStatus.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true
                state.message = action.payload.message
                state.order = action.payload.order
            })
            .addCase(updateDeliveryStatus.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to update order status'
            })

        // Request Completion
        builder
            .addCase(requestCompletion.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(requestCompletion.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true
                state.message = action.payload.message
                state.order = action.payload.order
            })
            .addCase(requestCompletion.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to request completion'
            })

        // Add Delivery Note
        builder
            .addCase(addDeliveryNote.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(addDeliveryNote.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true
                state.message = action.payload.message
                state.order = action.payload.order
            })
            .addCase(addDeliveryNote.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to add delivery note'
            })
    }
})

export const { removeDeliveryErrors, removeDeliverySuccess, clearDeliveryMessage } = deliverySlice.actions
export default deliverySlice.reducer
