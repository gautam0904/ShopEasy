import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice';
import Loader from '../components/Loader';

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Avatar state removed
  const { user, error, success, message, loading } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Avatar update logic removed
  const updateSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email }
    dispatch(updateProfile(userData))
  }
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      toast.success(message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/profile")
    }
  }, [dispatch, success])
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      // Avatar preview logic removed
    }
  }, [user])
  return (
    <>
      {loading ? (<Loader />) : (<>
        <Navbar />
        <div className="container update-container">
          <div className="form-content">
            <form className="form" onSubmit={updateSubmit}>
              <h2>Update Profile</h2>
              {/* Avatar input removed */}
              <div className="input-group">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" />
              </div>
              <div className="input-group">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
              </div>
              <button className="authBtn">Update</button>
            </form>
          </div>
        </div>

        <Footer />
      </>)}
    </>
  )
}

export default UpdateProfile
