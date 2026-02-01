import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../AdminStyles/Dashboard.css';
import '../AdminStyles/ContactList.css'; 
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import axios from 'axios';
import Loader from '../components/Loader';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/contacts');
            setContacts(data.contacts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this message?");
        if (confirm) {
            try {
                await axios.delete(`/api/v1/admin/contact/${id}`);
                toast.success("Message Deleted Successfully", { position: 'top-center', autoClose: 3000 });
                fetchContacts();
            } catch (error) {
                toast.error(error.response?.data?.message || "Error deleting message", { position: 'top-center', autoClose: 3000 });
            }
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <>
            <Navbar />
            <PageTitle title="Contact Messages" />
            <div className="admin-dashboard">
                <Sidebar />
                <div className="admin-content">
                    <div className="contactList-container">
                        <h1 className="contactList-title">Contact Messages</h1>
                        {loading ? <Loader /> : (
                            <div className="contactList-table-container">
                                <table className="contactList-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((contact, index) => (
                                            <tr key={contact._id}>
                                                <td>{index + 1}</td>
                                                <td>{contact.name}</td>
                                                <td>{contact.email}</td>
                                                <td style={{ whiteSpace: 'normal', maxWidth: '300px' }}>{contact.message}</td>
                                                <td>{new Date(contact.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <button 
                                                        className="action-icon delete-icon" 
                                                        onClick={() => handleDelete(contact._id)}
                                                        title="Delete Message"
                                                    >
                                                        <Delete />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ContactList;
