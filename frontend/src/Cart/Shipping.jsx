import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { saveShippingInfo } from "../features/cart/cartSlice";
import { saveAddress, deleteAddress } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Delete } from '@mui/icons-material';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { MyLocation, Close } from '@mui/icons-material'

const libraries = ["places"];

function Shipping() {
  const { shippingInfo } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
  const [lat, setLat] = useState(shippingInfo.latitude || 23.0225); 
  const [lng, setLng] = useState(shippingInfo.longitude || 72.5714);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const shippingInfoSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Invalid Phone Number! Please enter a valid 10-digit mobile number.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (!address) {
       toast.error('Address is required', { position: 'top-center', autoClose: 3000 });
       return;
    }

    await dispatch(saveAddress({ address, phoneNo: phoneNumber, latitude: lat, longitude: lng }));
    
    dispatch(saveShippingInfo({ address, phoneNumber, latitude: lat, longitude: lng }));
    navigate('/order/confirm');
  };

  const selectAddress = (addr) => {
      setAddress(addr.address);
      setPhoneNumber(addr.phoneNo);
      setLat(addr.latitude);
      setLng(addr.longitude);
      setIsFormVisible(false);
      setSelectedAddressId(addr._id);
      setIsAddressModalOpen(false); // Close modal on selection
      toast.info("Address Selected");
  }

  const useLastAddress = () => {
    if (shippingInfo && shippingInfo.address) {
        setAddress(shippingInfo.address);
        setPhoneNumber(shippingInfo.phoneNumber);
        setLat(shippingInfo.latitude || 23.0225);
        setLng(shippingInfo.longitude || 72.5714);
        setIsFormVisible(false);
        setSelectedAddressId('last_used'); 
        toast.info("Using last used address");
    }
  };

  const handleAddNewAddress = () => {
    setAddress("");
    setPhoneNumber("");
    setLat(23.0225); 
    setLng(72.5714);
    setIsFormVisible(true);
    setSelectedAddressId(null);
    setIsAddressModalOpen(false); // Close modal if open
  };

  const handleDeleteAddress = (id) => {
      if(window.confirm("Are you sure you want to delete this address?")) {
          dispatch(deleteAddress(id));
      }
  }

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          toast.success("Location detected!");
        },
        async (error) => {
            console.error(error);
            toast.info("Using approximate location...");
            try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              if (data.latitude && data.longitude) {
                setLat(data.latitude);
                setLng(data.longitude);
                toast.success("Approximate location set. Please adjust the pin if needed.");
              } else {
                toast.error("Could not determine location. Please pin manually on the map.");
              }
            } catch (fallbackError) {
              console.error(fallbackError);
              toast.error("Location detection failed. Please pin manually on the map.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const onMapClick = (e) => {
    if (e.latLng) {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
    }
  };

  if (!isLoaded) return <div className="loading-map">Loading Maps...</div>;

  return (
    <>
      <PageTitle title="Shipping Info" />
      <Navbar />
      <CheckoutPath activePath={0} />
      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping Details</h1>
     
        {shippingInfo && shippingInfo.address && isFormVisible && (
            <div className="last-address-suggestion">
                <div className="suggestion-content">
                    <span className="suggestion-label">Last Used Address:</span>
                    <span className="suggestion-text">{shippingInfo.address.substring(0, 50)}...</span>
                </div>
                <button type="button" className="use-last-addr-btn" onClick={useLastAddress}>
                    Use This Address
                </button>
            </div>
        )}
        
        {user && user.addresses && user.addresses.length > 0 && (
            <div className="saved-addresses-actions">
                 <button 
                    type="button" 
                    className="view-saved-addr-btn"
                    onClick={() => setIsAddressModalOpen(true)}
                >
                    Choose from Saved Addresses ({user.addresses.length})
                </button>
            </div>
        )}

        {/* Address Selection Modal */}
        {isAddressModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Select Address</h3>
                        <button className="close-modal-btn" onClick={() => setIsAddressModalOpen(false)}>
                            <Close />
                        </button>
                    </div>
                    <div className="saved-addresses-list">
                    {user.addresses.map((addr) => (
                        <div 
                            key={addr._id} 
                            className={`saved-address-card ${selectedAddressId === addr._id ? 'selected' : ''}`} 
                            onClick={() => selectAddress(addr)}
                        >
                            <p className="saved-addr-text">{addr.address}</p>
                            <p className="saved-addr-phone">Phone: {addr.phoneNo}</p>
                            <button className="delete-addr-btn" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}>
                                <Delete fontSize="small" />
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        )}

        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
            
            {isFormVisible ? (
                <>
                    <div className="shipping-form-group full-width">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="123 Main Street, Apartment 4B, Near City Mall..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required={isFormVisible}
                        className="address-input"
                        rows="4"
                      />
                    </div>

                    <div className="shipping-form-group full-width">
                      <label htmlFor="phoneNumber">Mobile Number</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val) && val.length <= 10) {
                                setPhoneNumber(val);
                            }
                        }}
                        required={isFormVisible}
                      />
                    </div>

                  <div className="shipping-form-group full-width">
                    <label>Location (Pin on Map)</label>
                    <div className="map-controls">
                        <button type="button" onClick={handleCurrentLocation} className="shipping-btn-small">
                        <MyLocation /> Use Current Location
                        </button>
                        <div className="lat-lng-display">Selected: {lat.toFixed(3)}, {lng.toFixed(3)}</div>
                    </div>
                    
                    <div className="map-container">
                        <GoogleMap
                            zoom={15}
                            center={{ lat, lng }}
                            mapContainerStyle={{ width: '100%', height: '350px', borderRadius: '8px' }}
                            onClick={onMapClick}
                        >
                            <Marker position={{ lat, lng }} />
                        </GoogleMap>
                    </div>
                  </div>
                </>
            ) : (
                <div className="selected-address-summary">
                    <div className="summary-row">
                        <div className="summary-header">
                            <h4>Delivering to:</h4>
                            <button type="button" className="change-address-btn" onClick={() => setIsFormVisible(true)}>Change</button>
                        </div>
                        <p>{address}</p>
                        <p><strong>Phone:</strong> {phoneNumber}</p>
                        <p className="location-pin-text">
                           <MyLocation fontSize="small" style={{verticalAlign: 'bottom'}}/> Location pinned
                        </p>
                    </div>
                    <div className="payment-option-section">
                        <h4>Payment Option</h4>
                        <div className="payment-option-card selected">
                            <input type="radio" checked readOnly />
                            <span>Cash on Delivery (COD)</span>
                        </div>
                    </div>
                </div>
            )}



          <button className="shipping-submit-btn">Continue</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
