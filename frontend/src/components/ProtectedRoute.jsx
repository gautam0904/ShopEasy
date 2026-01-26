import React from 'react'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader'
import {Navigate} from 'react-router-dom'

function ProtectedRoute({element, adminOnly=false, deliveryOnly=false, allowedRoles=[]}) {
    const {isAuthenticated, loading, user} = useSelector(state => state.user);
    
    if(loading){
        return <Loader/>
    }

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    
    // Check if user is blocked
    if(user.isBlocked){
        return <Navigate to="/login"/>
    }
    
    // Admin only routes
    if(adminOnly && user.role !== 'admin'){
        return <Navigate to="/"/>
    }
    
    // Delivery boy only routes
    if(deliveryOnly && user.role !== 'deliveryboy'){
        return <Navigate to="/"/>
    }
    
    // Check allowed roles if specified
    if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
        return <Navigate to="/"/>
    }
    
    return element
}

export default ProtectedRoute
