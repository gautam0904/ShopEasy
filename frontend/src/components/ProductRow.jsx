import React from 'react';
import '../componentStyles/ProductRow.css';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function ProductRow({ product }) {
  // Calculate fake retail price for visual effect if not present
  const retailPrice = (product.price * 1.2).toFixed(2); 

  return (
    <div className="product-row">
      <div className="product-row-left">
        {/* Use a generic icon or the product image as a small icon */}
        <img 
            src={product.image && product.image[0] ? product.image[0].url : ''} 
            alt="icon" 
            className="product-row-icon"
        />
        <Link to={`/product/${product._id}`} className="product-row-name">
            {product.name}
        </Link>
        {/* Optional decorative tags */}
         <div className="product-row-tags">
            <span className="row-tag offer">SPECIAL</span>
         </div>
      </div>

      <div className="product-row-right">
        <div className="product-row-pricing">
            <span className="row-price-current">₹{product.price}/yr</span>
            <span className="row-price-retail">Retail ₹{retailPrice}/yr</span>
        </div>
        <Link to={`/product/${product._id}`}>
            <button className="row-add-cart-btn">
                <ShoppingCart fontSize="small"/> Add to cart
            </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductRow;
