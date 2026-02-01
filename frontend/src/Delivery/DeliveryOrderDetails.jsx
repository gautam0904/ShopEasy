import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import '../DeliveryStyles/DeliveryDashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/order/orderSlice';
import { updateDeliveryStatus, requestCompletion, addDeliveryNote, removeDeliveryErrors, removeDeliverySuccess, clearDeliveryMessage } from '../features/delivery/deliverySlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

function DeliveryOrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');
    
    const { order, loading: orderLoading } = useSelector(state => state.order);
    const { loading: deliveryLoading, error, message, success } = useSelector(state => state.delivery);
    const loading = orderLoading || deliveryLoading;
    const dispatch = useDispatch();

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderId]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        assignedTo,
        deliveryNotes = [],
        completionRequested
    } = order;

    const paymentStatus = paymentInfo.status === 'succeeded' ? 'Paid' : 'Not Paid';

    const handleStatusUpdate = () => {
        if (!status) {
            toast.error('Please select a status', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(updateDeliveryStatus({ orderId, status }));
    };

    const handleRequestCompletion = () => {
        const confirm = window.confirm('Are you sure you want to request admin to mark this order as delivered?');
        if (confirm) {
            dispatch(requestCompletion(orderId));
        }
    };

    const handleAddNote = () => {
        if (!note.trim()) {
            toast.error('Please enter a note', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(addDeliveryNote({ orderId, note }));
        setNote('');
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeDeliveryErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(clearDeliveryMessage());
            dispatch(getOrderDetails(orderId));
        }
        if (success) {
            dispatch(removeDeliverySuccess());
        }
    }, [dispatch, error, message, success, orderId]);

    const allowedStatuses = ['Prepared', 'Shipped', 'Out for Delivery'];
    const canUpdateStatus = orderStatus !== 'Delivered' && !completionRequested;
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    if (loadError) return <div className="error-message">Error loading maps: {loadError.message}</div>;
    if (!isLoaded) return <Loader />;

    const canRequestCompletion = orderStatus !== 'Delivered' && !completionRequested && orderStatus === 'Out for Delivery';

    return (
        <>
            <Navbar />
            <PageTitle title="Order Details" />
            {loading ? (<Loader />) : (
                <div className="delivery-order-container">
                    <div className="order-header-section">
                        <h1>Order Details</h1>
                        <button className="btn-back" onClick={() => navigate('/delivery/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>

                    {completionRequested && (
                        <div className="completion-banner">
                            ⏳ Completion request submitted. Waiting for admin confirmation.
                        </div>
                    )}

                    <div className="order-details-grid">
                        {/* Order Info */}
                        <div className="detail-card">
                            <h2>Order Information</h2>
                            <p><strong>Order ID:</strong> #{order._id?.slice(-8)}</p>
                            <p><strong>Status:</strong> <span className={`status-${orderStatus?.toLowerCase().replace(/\s/g, '-')}`}>{orderStatus}</span></p>
                            <p><strong>Payment Status:</strong> {paymentStatus}</p>
                            <p><strong>Total Price:</strong> ₹{totalPrice}</p>
                            <p><strong>Order Date:</strong> {order.createdAt && new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Shipping Info */}
                        <div className="detail-card">
                            <h2>Delivery Address</h2>
                            <p><strong>Address:</strong> {shippingInfo.address}</p>
                            <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
                            {shippingInfo.latitude && shippingInfo.longitude && (
                                <div className="delivery-map-container" style={{ marginTop: '15px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Exact Location Pin</h3>
                                    <GoogleMap
                                        zoom={16}
                                        center={{ lat: shippingInfo.latitude, lng: shippingInfo.longitude }}
                                        mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '8px' }}
                                    >
                                        <Marker position={{ lat: shippingInfo.latitude, lng: shippingInfo.longitude }} />
                                    </GoogleMap>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${shippingInfo.latitude},${shippingInfo.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-map-large"
                                        style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}
                                    >
                                        📍 Start Navigation
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="detail-card full-width">
                        <h2>Order Items</h2>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <img src={item.image} alt={item.name} className="item-image" />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Status Update Section */}
                    {canUpdateStatus && (
                        <div className="detail-card full-width">
                            <h2>Update Status</h2>
                            <div className="status-update-form">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="status-select"
                                >
                                    <option value="">Select Status</option>
                                    {allowedStatuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <button className="btn-update" onClick={handleStatusUpdate}>
                                    Update Status
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Request Completion */}
                    {canRequestCompletion && (
                        <div className="detail-card full-width">
                            <h2>Complete Delivery</h2>
                            <p>Once you've delivered the order, request admin verification to mark it as completed.</p>
                            <button className="btn-complete" onClick={handleRequestCompletion}>
                                🚚 Request Completion Verification
                            </button>
                        </div>
                    )}

                    {/* Delivery Notes */}
                    <div className="detail-card full-width">
                        <h2>Delivery Notes</h2>
                        {deliveryNotes.length === 0 ? (
                            <p className="no-notes">No delivery notes yet.</p>
                        ) : (
                            <div className="notes-list">
                                {deliveryNotes.map((n, index) => (
                                    <div key={index} className="note-item">
                                        <p>{n.note}</p>
                                        <small>{new Date(n.addedAt).toLocaleString()}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                        {orderStatus !== 'Delivered' && (
                            <div className="add-note-form">
                                <input
                                    type="text"
                                    placeholder="Add a delivery note..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="note-input"
                                />
                                <button className="btn-add-note" onClick={handleAddNote}>
                                    Add Note
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default DeliveryOrderDetails;
