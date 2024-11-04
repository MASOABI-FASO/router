import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const SalesManagement = ({ products, handleSellProduct }) => {
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [quantityToSell, setQuantityToSell] = useState(1);
    const [message, setMessage] = useState('');

    const sellProduct = () => {
        if (quantityToSell > 0 && quantityToSell <= products[selectedProductIndex].stock) {
            handleSellProduct(selectedProductIndex, quantityToSell);
            setMessage(`Sold ${quantityToSell} of ${products[selectedProductIndex].name}`);
            setQuantityToSell(1); // Reset quantity after sell
        } else {
            setMessage('Invalid quantity. Please check stock levels.');
        }
    };

    return (
        <div>
            <h2>Sales Management</h2>

            <h3>Product List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name || 'Unnamed Product'}</td>
                            <td>{product.description || 'No Description'}</td>
                            <td>{product.category || 'Uncategorized'}</td>
                            <td>{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</td> {/* Safely handling price */}
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => setSelectedProductIndex(index)}>Sell</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {products[selectedProductIndex] && (
                <div>
                    <h3>Sell Product: {products[selectedProductIndex].name}</h3>
                    <input
                        type="number"
                        value={quantityToSell}
                        onChange={(e) => setQuantityToSell(Number(e.target.value))}
                        min="1"
                        max={products[selectedProductIndex].stock}
                        placeholder="Quantity"
                    />
                    <button onClick={sellProduct}>Confirm Sell</button>
                </div>
            )}

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default SalesManagement;