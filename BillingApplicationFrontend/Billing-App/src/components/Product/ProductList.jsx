import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/api.js';

function ProductList({ role, onAddToCart = null }) {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([{ id: '', name: '', description: '', price: '', image: '' }]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        setErrorMessage('Error fetching products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const invalidProduct = newProducts.find(
      (product) => !product.id || !product.name || !product.price || parseFloat(product.price) <= 0
    );
    if (invalidProduct) {
      setErrorMessage('Each product must have a valid ID, Name, and positive Price.');
      return;
    }

    setLoading(true);
    try {
      const response = await Promise.all(newProducts.map((product) => addProduct(product)));
      setProducts([...products, ...response.map((res) => res.data)]);
      setNewProducts([{ id: '', name: '', description: '', price: '', image: '' }]);
      setErrorMessage('');
      alert('Products added successfully.');
    } catch (error) {
      setErrorMessage('Failed to add products. Please try again.');
      console.error('Error adding products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewProductField = () => {
    setNewProducts([...newProducts, { id: '', name: '', description: '', price: '', image: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = newProducts.map((product, idx) =>
      idx === index ? { ...product, [field]: value } : product
    );
    setNewProducts(updatedProducts);
  };

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      alert('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct || parseFloat(editProduct.price) <= 0) {
      setErrorMessage('Price must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProduct(editProduct.id, editProduct);
      setProducts(products.map((p) => (p.id === editProduct.id ? response.data : p)));
      setEditProduct(null);
      alert('Product updated successfully.');
    } catch (error) {
      setErrorMessage('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Description: {product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Product ID: {product.id}</p>

              {role === 'customer' && onAddToCart && (
                <button onClick={() => onAddToCart(product)} disabled={loading}>Add to Cart</button>
              )}
              {role === 'admin' && (
                <>
                  <button onClick={() => setEditProduct(product)} disabled={loading}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} disabled={loading}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {role === 'admin' && (
        <div>
          <h3>Add New Products</h3>
          {newProducts.map((product, index) => (
            <div key={index} className="product-form">
              <input
                placeholder="Product ID"
                value={product.id}
                onChange={(e) => handleProductChange(index, 'id', e.target.value)}
              />
              <input
                placeholder="Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              />
              <input
                placeholder="Description"
                value={product.description}
                onChange={(e) => handleProductChange(index, 'description', e.target.value)}
              />
              <input
                placeholder="Price"
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              />
              <input
                placeholder="Image URL"
                value={product.image}
                onChange={(e) => handleProductChange(index, 'image', e.target.value)}
              />
            </div>
          ))}
          <button onClick={addNewProductField}>Add Another Product</button>
          <button onClick={handleAddProduct}>Add Products</button>
        </div>
      )}

      {editProduct && (
        <div>
          <h3>Edit Product</h3>
          <input
            placeholder="Name"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={editProduct.description}
            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
          />
          <button onClick={handleUpdateProduct}>Update Product</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

ProductList.propTypes = {
  role: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductList;
