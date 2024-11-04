// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = ({ users, onDeleteUser }) => {
    // User State
    const [message, setMessage] = useState('');

    // Staff State
    const [staff, setStaff] = useState([]);
    const [staffFormData, setStaffFormData] = useState({ name: '', contacts: '', position: '' });

    // Load staff data from local storage on initial mount
    useEffect(() => {
        const storedStaff = JSON.parse(localStorage.getItem('staff')) || [];
        setStaff(storedStaff);
    }, []);

    // Handle deleting a user
    const handleDeleteUser = (username) => {
        onDeleteUser(username);
        setMessage(`User ${username} deleted successfully.`);
    };

    // Handle staff form input changes
    const handleStaffChange = (e) => {
        const { name, value } = e.target;
        setStaffFormData({ ...staffFormData, [name]: value });
    };

    // Staff submission handler
    const handleStaffSubmit = (e) => {
        e.preventDefault();
        const newStaffMember = { ...staffFormData, id: Date.now() }; // Assign a unique ID
        const updatedStaff = [...staff, newStaffMember];
        setStaff(updatedStaff);
        localStorage.setItem('staff', JSON.stringify(updatedStaff)); // Store to local storage
        setStaffFormData({ name: '', contacts: '', position: '' });
        setMessage(`Staff member ${newStaffMember.name} added successfully.`);
    };

    // Handle deleting a staff member
    const handleDeleteStaff = (id) => {
        const updatedStaff = staff.filter(member => member.id !== id);
        setStaff(updatedStaff);
        localStorage.setItem('staff', JSON.stringify(updatedStaff)); // Update local storage
        setMessage('Staff deleted successfully.');
    };

    // Handle editing a staff member
    const handleEditStaff = (id) => {
        const staffToEdit = staff.find(member => member.id === id);
        if (staffToEdit) {
            setStaffFormData(staffToEdit);
            const updatedStaff = staff.filter(member => member.id !== id);
            setStaff(updatedStaff); // Temporarily remove during editing
            localStorage.setItem('staff', JSON.stringify(updatedStaff)); // Update local storage
            setMessage('Edit the staff information and resubmit.');
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <h3>Registered Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Add Staff</h3>
            <form onSubmit={handleStaffSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={staffFormData.name}
                    onChange={handleStaffChange}
                    required
                />
                <input
                    type="text"
                    name="contacts"
                    placeholder="Contacts"
                    value={staffFormData.contacts}
                    onChange={handleStaffChange}
                    required
                />
                <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={staffFormData.position}
                    onChange={handleStaffChange}
                    required
                />
                <button type="submit">Add Staff</button>
            </form>

            <h3>Staff Management</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contacts</th>
                        <th>Position</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map(member => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.contacts}</td>
                            <td>{member.position}</td>
                            <td>
                                <button onClick={() => handleEditStaff(member.id)}>Edit</button>
                                <button onClick={() => handleDeleteStaff(member.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default UserManagement;