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
import { MyLocation } from '@mui/icons-material'

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
  const [saveInfo, setSaveInfo] = useState(false);
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const shippingInfoSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error('Invalid Phone number! It should be at least 10 digits', { position: 'top-center', autoClose: 3000 });
      return;
    }
    if (!address) {
       toast.error('Address is required', { position: 'top-center', autoClose: 3000 });
       return;
    }

    if (saveInfo) {
       await dispatch(saveAddress({ address, phoneNo: phoneNumber, latitude: lat, longitude: lng }));
       toast.success("Address saved to profile!");
    }

    dispatch(saveShippingInfo({ address, phoneNumber, latitude: lat, longitude: lng }));
    navigate('/order/confirm');
  };

  const selectAddress = (addr) => {
      setAddress(addr.address);
      setPhoneNumber(addr.phoneNo);
      setLat(addr.latitude);
      setLng(addr.longitude);
      toast.info("Address Selected");
  }

  const handleDeleteAddress = (id) => {
      if(window.confirm("Are you sure you want to delete this address?")) {
          dispatch(deleteAddress(id));
      }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          toast.error("Unable to retrieve your location");
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
        
        {user && user.addresses && user.addresses.length > 0 && (
            <div className="saved-addresses-section">
                <h3>Saved Addresses</h3>
                <div className="saved-addresses-list">
                    {user.addresses.map((addr) => (
                        <div key={addr._id} className="saved-address-card" onClick={() => selectAddress(addr)}>
                            <p className="saved-addr-text">{addr.address}</p>
                            <p className="saved-addr-phone">Phone: {addr.phoneNo}</p>
                            <button className="delete-addr-btn" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}>
                                <Delete fontSize="small" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
            
            <div className="shipping-form-group full-width">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="123 Main Street, Apartment 4B, Near City Mall..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="address-input"
                rows="4"
              />
            </div>

            <div className="shipping-form-group full-width">
              <label htmlFor="phoneNumber">Mobile Number</label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

          <div className="shipping-form-group full-width">
            <label>Location (Pin on Map)</label>
            <div className="map-controls">
                <button type="button" onClick={handleCurrentLocation} className="shipping-btn-small">
                <MyLocation /> Use Current Location
                </button>
                <div className="lat-lng-display">Selected: {lat.toFixed(6)}, {lng.toFixed(6)}</div>
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

          <div className="shipping-form-group">
              <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={saveInfo} 
                    onChange={(e) => setSaveInfo(e.target.checked)} 
                  />
                  Save this address for future orders
              </label>
          </div>

          <button className="shipping-submit-btn">Continue</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
