import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ products, soldProducts }) => {
    const [lowStockMessages, setLowStockMessages] = useState([]);

    // Function to format currency
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') {
            return 'M0.00'; // Fallback for non-numeric values
        }
        return `M${amount.toFixed(2)}`;
    };

    // Calculate total revenue based on sold products
    const calculatedTotalRevenue = soldProducts.reduce((total, product) => {
        const sellingPricePerUnit = products.find(p => p.name === product.name)?.price || 0; // Find the price of the product
        const totalPrice = sellingPricePerUnit * product.quantity; // Calculate the total price
        return total + totalPrice; // Sum it up
    }, 0);

    // Define products to exclude
    const excludedProducts = ['Product A', 'Product B', 'sss']; // Added 'sss' to the exclusion list

    // Effect to check stock levels and set messages for low stock
    useEffect(() => {
        const messages = products
            .filter(product => product.stock < 5)
            .map(product => `${product.name} has low stock levels: ${product.stock} remaining.`);
        
        setLowStockMessages(messages);
    }, [products]); // Dependencies; runs the effect whenever `products` changes

    return (
        <div>
            <h2>Dashboard</h2>

            {/* Available Stock Table */}
            <h3>Available Stock</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price (M)</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Display low stock messages */}
            <div>
                {lowStockMessages.length > 0 && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {lowStockMessages.map((message, index) => (
                            <p key={index}>{message}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Sold Products Table */}
            <h3>Sold Products</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Revenue (M)</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(new Set(soldProducts
                        .filter(product => !excludedProducts.includes(product.name)) // Exclude specific products
                        .map(product => product.name)))
                        .map((productName, index) => {
                        
                        const productsByName = soldProducts.filter(product => product.name === productName);
                        const totalQuantity = productsByName.reduce((count, product) => count + product.quantity, 0);
                        const totalSales = productsByName.reduce((total, product) => {
                            const sellingPricePerUnit = products.find(p => p.name === product.name)?.price || 0;
                            return total + sellingPricePerUnit * product.quantity; // Calculate revenue per product
                        }, 0);

                        return (
                            <tr key={index}>
                                <td>{productName}</td>
                                <td>{totalQuantity}</td>
                                <td>{formatCurrency(totalSales)}</td>
                            </tr>
                        );
                    })}
                    {soldProducts.filter(product => !excludedProducts.includes(product.name)).length === 0 && (
                        <tr>
                            <td colSpan="3">No products sold.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3>Total Revenue: {formatCurrency(calculatedTotalRevenue)}</h3>
        </div>
    );
};

export default Dashboard;