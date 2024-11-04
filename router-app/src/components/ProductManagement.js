import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const ProductManagement = ({ products, addProduct, updateProduct, deleteProduct }) => {
    const [productDetails, setProductDetails] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showInventory, setShowInventory] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const price = parseFloat(productDetails.price);
        const stock = parseInt(productDetails.stock, 10);

        if (isNaN(price) || isNaN(stock)) {
            alert('Price and Stock must be valid numbers.');
            return;
        }

        const newProduct = {
            ...productDetails,
            price,
            stock
        };

        if (editIndex === null) {
            addProduct(newProduct);
        } else {
            updateProduct(editIndex, newProduct);
            setEditIndex(null);
        }
        resetProductDetails();
    };

    const resetProductDetails = () => {
        setProductDetails({ name: '', description: '', category: '', price: '', stock: '' });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setProductDetails(products[index]);
    };

    const handleSearch = () => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(results);
    };

    const handleClear = () => {
        setSearchQuery('');
        setFilteredProducts([]);
    };

    return (
        <div>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productDetails.name}
                    onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={productDetails.description}
                    onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={productDetails.category}
                    onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={productDetails.price}
                    onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Stock Level"
                    value={productDetails.stock}
                    onChange={(e) => setProductDetails({ ...productDetails, stock: e.target.value })}
                    required
                />
                <button type="submit">{editIndex === null ? 'Add Product' : 'Update Product'}</button>
            </form>

            <button onClick={() => setShowInventory(!showInventory)}>
                {showInventory ? 'Hide Inventory' : 'View Inventory'}
            </button>

            {showInventory && (
                <>
                    <h3>Inventory</h3>
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
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category}</td>
                                        <td>{typeof product.price === 'number' ? product.price.toFixed(2) : ''}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button onClick={() => handleEdit(index)}>Edit</button>
                                            <button onClick={() => deleteProduct(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">No products in inventory.</td></tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}

            <div>
                <input
                    type="text"
                    placeholder="Search Product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClear}>Clear</button>
            </div>

            {filteredProducts.length > 0 ? (
                <div>
                    <h3>Search Results</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{typeof product.price === 'number' ? product.price.toFixed(2) : ''}</td>
                                    <td>{product.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : searchQuery && (
                <div>
                    <p>No products found matching your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;