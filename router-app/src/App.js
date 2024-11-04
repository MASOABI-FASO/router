import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import ProductManagement from './components/ProductManagement';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import SalesManagement from './components/SalesManagement';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Load data from local storage on initial mount
    useEffect(() => {
        const loadDataFromLocalStorage = (key, setter) => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            } else {
                setter(JSON.parse(localStorage.getItem(key)));
            }
        };

        loadDataFromLocalStorage('users', setUsers);
        loadDataFromLocalStorage('products', setProducts);
        loadDataFromLocalStorage('soldProducts', setSoldProducts);
    }, []);

    const loginUser = () => {
        setIsLoggedIn(true);
        setMessage('Logged in successfully!');
        setIsError(false);
    };

    const logoutUser = () => {
        setIsLoggedIn(false);
        setMessage('Logged out successfully!');
        setIsError(false);
    };

    const addProduct = (newProduct) => {
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    const updateProduct = (index, updatedProduct) => {
        const updatedProducts = products.map((product, idx) => 
            idx === index ? updatedProduct : product
        );
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    const deleteProduct = (index) => {
        const updatedProducts = products.filter((_, idx) => idx !== index);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    const handleSellProduct = (index, quantity) => {
        const updatedProducts = products.map((product, idx) => {
            if (idx === index) {
                return { ...product, stock: product.stock - quantity };
            }
            return product;
        });
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        const soldProduct = { ...products[index], quantity };
        setSoldProducts(prev => [...prev, soldProduct]);
        localStorage.setItem('soldProducts', JSON.stringify([...soldProducts, soldProduct]));
    };

    // Registering users function
    const handleRegister = ({ username, password }) => {
        const newUser = { username, password };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    // Function to delete a user from the array and local storage
    const handleDeleteUser = (username) => {
        const updatedUsers = users.filter(user => user.username !== username);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return (
        <Router>
            <div className="App">
                {!isLoggedIn ? (
                    <Auth onLogin={loginUser} onRegister={handleRegister} />
                ) : (
                    <div>
                        <header className="header">
                            <h2>Welcome to Wings Cafe</h2>
                            <nav className="navbar">
                                <button><Link to="/dashboard">Dashboard</Link></button>
                                <button><Link to="/productManagement">Product Management</Link></button>
                                <button><Link to="/salesManagement">Sales Management</Link></button>
                                <button><Link to="/userManagement">User Management</Link></button>
                                <button className="logout-button" onClick={logoutUser}>Logout</button>
                            </nav>
                        </header>
                        {message && <div className={isError ? 'error-message' : 'success-message'}>{message}</div>}
                        <div className="content"> {/* Content wrapper */}
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard soldProducts={soldProducts} products={products} />} />
                                <Route path="/productManagement" element={
                                    <ProductManagement 
                                        products={products} 
                                        addProduct={addProduct} 
                                        updateProduct={updateProduct}
                                        deleteProduct={deleteProduct}
                                    />
                                } />
                                <Route path="/salesManagement" element={
                                    <SalesManagement 
                                        products={products} 
                                        handleSellProduct={handleSellProduct} 
                                    />
                                } />
                                <Route path="/userManagement" element={
                                    <UserManagement 
                                        users={users} 
                                        onDeleteUser={handleDeleteUser} 
                                    />
                                } />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;