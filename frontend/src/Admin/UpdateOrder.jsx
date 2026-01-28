import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateOrder.css'
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/order/orderSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { confirmDelivery, removeErrors, removeSuccess, updateOrderStatus, clearMessage } from '../features/admin/adminSlice';

function UpdateOrder() {
    const [status,setStatus]=useState("")
    const {orderId}=useParams();
    const {order,loading:orderLoading}=useSelector(state=>state.order);
    const {success,loading:adminLoading,error,message}=useSelector(state=>state.admin);
    const loading=orderLoading || adminLoading
    const dispatch=useDispatch();
    useEffect(()=>{
        if(orderId){
        dispatch(getOrderDetails(orderId))
        }
    },[dispatch,orderId]);

    const {
        shippingInfo={},
        orderItems=[],
        paymentInfo={},
        orderStatus,
        totalPrice,
        assignedTo,
        deliveryNotes=[],
        completionRequested
    }=order
    // For COD orders, payment will be collected on delivery
    const paymentMethod = paymentInfo?.method || 'COD';
    const paymentStatus = paymentInfo?.status === 'succeeded' ? 'Paid' : (paymentMethod === 'COD' ? 'Cash on Delivery' : 'Not Paid');
    // Don't mark COD orders as cancelled - show actual order status
    const finalOrderStatus = orderStatus || 'Processing';
    
    const handleStatusUpdate=()=>{
        if(!status){
            toast.error('Please select a status',{position:'top-center',autoClose:3000})
            return
        }
        dispatch(updateOrderStatus({orderId,status}))
    }
    
    const handleConfirmDelivery=()=>{
        const confirm = window.confirm('Are you sure you want to confirm this delivery as completed?');
        if(confirm){
            dispatch(confirmDelivery(orderId))
        }
    }
    
    useEffect(()=>{
        if(error){
          toast.error(error,{position:'top-center',autoClose:3000});
          dispatch(removeErrors())
        }
        if(success){
            toast.success(message || "Order Status updated successfully",{position:'top-center',autoClose:3000});
            dispatch(removeSuccess())
            dispatch(clearMessage())
            dispatch(getOrderDetails(orderId))
        }
      },[dispatch,error,success,message,orderId])
      
  return (
   <>
   <Navbar/>
   <PageTitle title="Update Order"/>
{loading?(<Loader/>):(   <div className="order-container">
    <h1 className="order-title">Update Order</h1>
    
    {/* Completion Request Banner */}
    {completionRequested && (
        <div className="completion-request-banner">
            🚚 <strong>Delivery Boy Requested Completion!</strong> The delivery boy has delivered this order and is waiting for your confirmation.
            <button className="btn-confirm-delivery" onClick={handleConfirmDelivery}>
                ✓ Confirm Delivery
            </button>
        </div>
    )}
    
    <div className="order-details">
        <h2>Order Information</h2>
        <p><strong>Order ID: </strong>{orderId}</p>
        <p><strong>Shipping Address:</strong> {shippingInfo.address}</p>
        <p><strong>Phone: </strong>{shippingInfo.phoneNo}</p>
        <p><strong>Location: </strong>
             {shippingInfo.latitude && shippingInfo.longitude ? (
                 <a href={`https://www.google.com/maps/search/?api=1&query=${shippingInfo.latitude},${shippingInfo.longitude}`} target="_blank" rel="noreferrer" style={{color: 'blue'}}>
                    View on Map ({shippingInfo.latitude.toFixed(4)}, {shippingInfo.longitude.toFixed(4)})
                 </a>
              ) : "N/A"}
        </p>
        <p><strong>Order Status: </strong>
            <span className={`status-badge status-${finalOrderStatus?.toLowerCase().replace(/\s/g, '-')}`}>
                {finalOrderStatus}
            </span>
        </p>
        <p><strong>Payment Status: </strong>{paymentStatus}</p>
        <p><strong>Total Price: </strong>₹{totalPrice}</p>
        {assignedTo && (
            <p><strong>Assigned To: </strong>{assignedTo.name || 'Unknown Delivery Boy'}</p>
        )}
    </div>

    {/* Delivery Notes Section */}
    {deliveryNotes && deliveryNotes.length > 0 && (
        <div className="delivery-notes-section">
            <h2>Delivery Notes</h2>
            <div className="notes-list">
                {deliveryNotes.map((note, index) => (
                    <div key={index} className="note-item">
                        <p>{note.note}</p>
                        <small>{new Date(note.addedAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    )}

    <div className="order-items">
        <h2>Order Items</h2>
        <table className="order-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
               { orderItems.map((item)=>(
                <tr key={item._id}>
                    <td>
                        <img src={item.image} alt={item.name} className='order-item-image' />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                </tr>
               ))}
            </tbody>
        </table>
    </div>

    <div className="order-status">
        <h2>Update Status</h2>
        <select className="status-select" value={status} onChange={(e)=>setStatus(e.target.value)} disabled={loading || orderStatus==='Delivered'}>
            <option value="">Select Status</option>
            <option value="Processing">Processing</option>
            <option value="Prepared">Prepared</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
        </select>
        <button className="update-button" onClick={handleStatusUpdate}disabled={loading || !status|| orderStatus==='Delivered'}>Update Status</button>
    </div>
   </div>)}
   <Footer/>
   </>
  )
}

export default UpdateOrder
