import React, { useState, useEffect } from 'react';

interface Product {
  id?: number;
  name: string;
  supplier_name: string;
  category_name: string;
  size_name: string;
  description: string;
  wholesale_price: number;
  customer_price: number;
  quantity: number;
  sku?: string;
}

interface DropdownOption {
  id: number;
  name: string;
}

interface ProductManagementProps {
  onBack?: () => void;
}

export default function ProductManagement({ onBack }: ProductManagementProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<DropdownOption[]>([]);
  const [categories, setCategories] = useState<DropdownOption[]>([]);
  const [sizes, setSizes] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    supplier_name: '',
    category_name: '',
    size_name: '',
    description: '',
    wholesale_price: 0,
    customer_price: 0,
    quantity: 0,
    sku: ''
  });

  const MANAGEMENT_API = 'https://hoth-management-production.up.railway.app/api';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, suppliersRes, categoriesRes, sizesRes] = await Promise.all([
        fetch(`${MANAGEMENT_API}/products`),
        fetch(`${MANAGEMENT_API}/suppliers`),
        fetch(`${MANAGEMENT_API}/categories`),
        fetch(`${MANAGEMENT_API}/sizes`)
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      }
      
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData.data || []);
      }
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
      
      if (sizesRes.ok) {
        const sizesData = await sizesRes.json();
        setSizes(sizesData.data || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${MANAGEMENT_API}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setNewProduct({
          name: '',
          supplier_name: '',
          category_name: '',
          size_name: '',
          description: '',
          wholesale_price: 0,
          customer_price: 0,
          quantity: 0,
          sku: ''
        });
        await loadData(); // Reload products
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%'
  };

  const buttonStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
            Product Management
          </h1>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Home
            </button>
          )}
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {/* Add New Product Form */}
        <div style={{ ...cardStyle, marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            Add New Product
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Supplier *
                </label>
                <input
                  type="text"
                  list="suppliers"
                  value={newProduct.supplier_name}
                  onChange={(e) => setNewProduct({ ...newProduct, supplier_name: e.target.value })}
                  style={inputStyle}
                  required
                />
                <datalist id="suppliers">
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Category *
                </label>
                <input
                  type="text"
                  list="categories"
                  value={newProduct.category_name}
                  onChange={(e) => setNewProduct({ ...newProduct, category_name: e.target.value })}
                  style={inputStyle}
                  required
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category.id} value={category.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Size *
                </label>
                <input
                  type="text"
                  list="sizes"
                  value={newProduct.size_name}
                  onChange={(e) => setNewProduct({ ...newProduct, size_name: e.target.value })}
                  style={inputStyle}
                  required
                />
                <datalist id="sizes">
                  {sizes.map(size => (
                    <option key={size.id} value={size.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Wholesale Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.wholesale_price}
                  onChange={(e) => setNewProduct({ ...newProduct, wholesale_price: parseFloat(e.target.value) || 0 })}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Customer Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.customer_price}
                  onChange={(e) => setNewProduct({ ...newProduct, customer_price: parseFloat(e.target.value) || 0 })}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  SKU
                </label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                rows={3}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ ...buttonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            Products ({products.length})
          </h2>
          
          {loading && products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No products yet. Add your first product above!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Supplier</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Size</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontWeight: '600', color: '#374151' }}>Wholesale</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontWeight: '600', color: '#374151' }}>Customer</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontWeight: '600', color: '#374151' }}>Qty</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id || index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{(product as any).supplier_name}</td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{(product as any).category_name}</td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{(product as any).size_name}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#16a34a', fontWeight: '500' }}>
                        ${product.wholesale_price.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#2563eb', fontWeight: '500' }}>
                        ${product.customer_price.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{product.quantity}</td>
                      <td style={{ padding: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        {(product as any).sku || '-'}
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
  );
}