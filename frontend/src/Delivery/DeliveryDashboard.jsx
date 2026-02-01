import React, { useEffect, useState } from 'react';
import '../DeliveryStyles/DeliveryDashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAssignedOrders, fetchAllOrdersForDelivery, removeDeliveryErrors, removeDeliverySuccess, clearDeliveryMessage, acceptOrder, fetchAvailableOrders } from '../features/delivery/deliverySlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Visibility, CheckCircle, LocalShipping, Assignment } from '@mui/icons-material';

function DeliveryDashboard() {
    const [activeTab, setActiveTab] = useState('assigned');
    const { myAssignedOrders, allOrders, availableOrders, loading, error, message, success } = useSelector(state => state.delivery);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMyAssignedOrders());
        dispatch(fetchAllOrdersForDelivery());
        dispatch(fetchAvailableOrders());
    }, [dispatch]);

    const handleAcceptOrder = (orderId) => {
        dispatch(acceptOrder(orderId));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeDeliveryErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(clearDeliveryMessage());
            dispatch(fetchMyAssignedOrders());
            dispatch(fetchAvailableOrders());
        }
        if (success) {
            dispatch(removeDeliverySuccess());
        }
    }, [dispatch, error, message, success]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return '#ff9800';
            case 'Prepared': return '#2196f3';
            case 'Shipped': return '#9c27b0';
            case 'Out for Delivery': return '#00bcd4';
            case 'Delivered': return '#4caf50';
            default: return '#757575';
        }
    };

    const pendingOrders = myAssignedOrders.filter(o => o.orderStatus !== 'Delivered');
    const completedToday = myAssignedOrders.filter(o => {
        if (o.orderStatus !== 'Delivered') return false;
        const today = new Date().toDateString();
        return new Date(o.deliveredAt).toDateString() === today;
    });

    return (
        <>
            <Navbar />
            <PageTitle title="Delivery Dashboard" />
            {loading ? (<Loader />) : (
                <div className="delivery-dashboard">
                    <h1 className="dashboard-title">Delivery Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <Assignment className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-number">{pendingOrders.length}</span>
                                <span className="stat-label">Pending Orders</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <LocalShipping className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-number">{myAssignedOrders.length}</span>
                                <span className="stat-label">Total Assigned</span>
                            </div>
                        </div>
                        <div className="stat-card completed">
                            <CheckCircle className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-number">{completedToday.length}</span>
                                <span className="stat-label">Delivered Today</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
                            onClick={() => setActiveTab('assigned')}
                        >
                            My Assigned Orders ({myAssignedOrders.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                            onClick={() => setActiveTab('available')}
                        >
                            Available Orders ({availableOrders.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All System Orders ({allOrders.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 'assigned' && (
                            <div className="orders-section">
                                <h2>My Assigned Orders (Actionable)</h2>
                                {myAssignedOrders.length === 0 ? (
                                    <p className="no-orders">No orders assigned to you yet.</p>
                                ) : (
                                    <div className="orders-grid">
                                        {myAssignedOrders.map(order => (
                                            <div key={order._id} className={`order-card ${order.completionRequested ? 'completion-requested' : ''}`}>
                                                <div className="order-header">
                                                    <span className="order-id">#{order._id.slice(-8)}</span>
                                                    <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <div className="order-body">
                                                    <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                                                    <p><strong>Address:</strong> {order.shippingInfo?.address}</p>
                                                    <p><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
                                                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                                                    {order.completionRequested && (
                                                        <p className="completion-badge">⏳ Awaiting Admin Confirmation</p>
                                                    )}
                                                </div>
                                                <div className="order-actions">
                                                    {order.shippingInfo?.latitude && order.shippingInfo?.longitude && (
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${order.shippingInfo.latitude},${order.shippingInfo.longitude}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="btn-map"
                                                        >
                                                            📍 Navigate
                                                        </a>
                                                    )}
                                                    <Link to={`/delivery/order/${order._id}`} className="btn-action">
                                                        <Visibility /> Manage
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'available' && (
                            <div className="orders-section">
                                <h2>Available Orders (Accept to Start Delivery)</h2>
                                {availableOrders.length === 0 ? (
                                    <p className="no-orders">No available orders at the moment.</p>
                                ) : (
                                    <div className="orders-grid">
                                        {availableOrders.map(order => (
                                            <div key={order._id} className="order-card available">
                                                <div className="order-header">
                                                    <span className="order-id">#{order._id.slice(-8)}</span>
                                                    <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <div className="order-body">
                                                    <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                                                    <p><strong>Address:</strong> {order.shippingInfo?.address}</p>
                                                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                                                </div>
                                                <div className="order-actions">
                                                    <button
                                                        className="btn-accept"
                                                        onClick={() => handleAcceptOrder(order._id)}
                                                    >
                                                        Accept Order
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'all' && (
                            <div className="orders-section">
                                <h2>All System Orders (View Only)</h2>
                                <div className="table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Assigned To</th>
                                                <th>Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allOrders.map(order => (
                                                <tr key={order._id} className={order.completionRequested ? 'highlight-row' : ''}>
                                                    <td>#{order._id.slice(-8)}</td>
                                                    <td>{order.user?.name || 'N/A'}</td>
                                                    <td>₹{order.totalPrice}</td>
                                                    <td>
                                                        <span className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td>{order.assignedTo?.name || 'Unassigned'}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default DeliveryDashboard;
