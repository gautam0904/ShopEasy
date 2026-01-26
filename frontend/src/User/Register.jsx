import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../features/user/userSlice';
function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })
    // Avatar state removed
    const { name, email, password } = user;
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const registerDataChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const registerSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error('Please fill out all the required fields', { position: 'top-center', autoClose: 3000 })
            return;
        }
        const userData = { name, email, password };
        dispatch(register(userData))
    }
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    useEffect(() => {
        if (success) {
            toast.success("Registration SuccessFul", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess())
            navigate('/login')
        }
    }, [dispatch, success])
    return (
        <div className="form-container container">
            <div className="form-content">
                <form className="form" onSubmit={registerSubmit}>
                    <h2>Sign Up</h2>
                    <div className="input-group">
                        <input type="text" placeholder='Username' name="name" value={name} onChange={registerDataChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder='Email' name="email" value={email} onChange={registerDataChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder='create your Password' name="password" value={password} onChange={registerDataChange} />
                    </div>
                    {/* Avatar input removed */}
                    <button className="authBtn">{loading ? 'Signing Up' : 'Sign Up'}</button>
                    <p className="form-links">
                        Already have an account?<Link to="/login">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
