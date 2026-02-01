import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import '../AdminStyles/UsersList.css'
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Delete, Edit, Block, CheckCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, clearMessage, deleteUser, fetchUsers, removeErrors, removeSuccess, unblockUser } from '../features/admin/adminSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

function UsersList() {
    const {users,loading,error,message,success}=useSelector(state=>state.admin);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
    useEffect(()=>{
        dispatch(fetchUsers())
    },[dispatch])

const handleDelete=(userId)=>{
    const confirm=window.confirm('Are you sure you want to delete this user?')
    if(confirm){
        dispatch(deleteUser(userId))
    }
}

const handleBlock=(userId,userName)=>{
    const reason = window.prompt(`Enter reason for blocking ${userName}:`)
    if(reason !== null){
        dispatch(blockUser({userId, reason}))
    }
}

const handleUnblock=(userId)=>{
    const confirm = window.confirm('Are you sure you want to unblock this user?')
    if(confirm){
        dispatch(unblockUser(userId))
    }
}

useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:3000});
      dispatch(removeErrors())
    }
    if(message){
        toast.success(message,{position:'top-center',autoClose:3000});
        dispatch(clearMessage())
        dispatch(fetchUsers()) // Refresh users list
    }
    if(success){
        dispatch(removeSuccess())
    }
  },[dispatch,error,message,success])
  return (
    <>
{loading?(<Loader/>):(   <>
   <Navbar/>
   <PageTitle title="All Users"/>
    <div className="admin-dashboard">
    <Sidebar />
    <div className="admin-content">
     <div className="usersList-container">
        <h1 className="usersList-title">All Users</h1>
        <div className="usersList-table-container">
            <table className="usersList-table">
                <thead>
                    <tr>
                        <th>Sl No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user,index)=>(
                        <tr key={user._id} className={user.isBlocked ? 'blocked-user' : ''}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <span className={`role-badge role-${user.role}`}>
                                {user.role === 'deliveryboy' ? 'Delivery Boy' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </td>
                        <td>
                            {user.isBlocked ? (
                                <span className="status-blocked" title={user.blockedReason || 'No reason provided'}>
                                    Blocked
                                </span>
                            ) : (
                                <span className="status-active">Active</span>
                            )}
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                            <Link to={`/admin/user/${user._id}` }className='action-icon edit-icon'><Edit/></Link>
                            <button className="action-icon delete-icon" onClick={()=>handleDelete(user._id)}><Delete/></button>
                            {user.role !== 'admin' && (
                                user.isBlocked ? (
                                    <button 
                                        className="action-icon unblock-icon" 
                                        onClick={()=>handleUnblock(user._id)}
                                        title="Unblock User"
                                    >
                                        <CheckCircle/>
                                    </button>
                                ) : (
                                    <button 
                                        className="action-icon block-icon" 
                                        onClick={()=>handleBlock(user._id, user.name)}
                                        title="Block User"
                                    >
                                        <Block/>
                                    </button>
                                )
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </div>
    </div>

   <Footer/>
   
   </>)}
   </>
  )
}

export default UsersList
