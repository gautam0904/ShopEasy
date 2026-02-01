import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Dashboard as DashboardIcon, 
    People, 
    ShoppingCart, 
    Inventory, 
    AddBox, 
    Star,
    Message
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className="sidebar">
        <div className="logo">
            <DashboardIcon  className="logo-icon"/>
            Admin Dashboard
        </div>
        <nav className="nav-menu">
            <div className="nav-section">
                <h3>Products</h3>
                <Link to="/admin/products">
                    <Inventory className='nav-icon'/>
                    All Products
                </Link>
                <Link to="/admin/product/create">
                    <AddBox className='nav-icon'/>
                    Create Product
                </Link>
            </div>

            <div className="nav-section">
                <h3>Users</h3>
                <Link to="/admin/users">
                    <People className='nav-icon'/>
                    All Users
                </Link>
            </div>

            <div className="nav-section">
                <h3>Orders</h3>
                <Link to="/admin/orders">
                    <ShoppingCart className='nav-icon'/>
                    All Orders
                </Link>
            </div>

            <div className="nav-section">
                <h3>Reviews</h3>
                <Link to="/admin/reviews">
                    <Star className='nav-icon'/>
                    All Reviews
                </Link>
            </div>

            <div className="nav-section">
                <h3>Messages</h3>
                <Link to="/admin/contacts">
                    <Message className='nav-icon'/>
                    Contact Msgs
                </Link>
            </div>
        </nav>
    </div>
  )
}

export default Sidebar;
