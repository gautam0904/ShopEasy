import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css'
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import NoProducts from '../components/NoProducts';
import Pagination from '../components/Pagination';
import { Search, CheckCircle, ShoppingCart, DoneAll, LocalOffer } from '@mui/icons-material';
import ProductRow from '../components/ProductRow';
import { Link } from 'react-router-dom';

function Products() {
    const {loading,error,products,resultsPerPage,productCount}=useSelector(state=>state.product);
    const dispatch=useDispatch();
    const location=useLocation();
   const searchParams= new URLSearchParams(location.search);
   const keyword=searchParams.get("keyword")
   const category=searchParams.get("category")
   const pageFromURL=parseInt(searchParams.get("page"),10) ||1
   const [currentPage,setCurrentPage]=useState(pageFromURL);
   const navigate=useNavigate();
   const categories=["Vegetable", "Fruit", "Grocery", "Cooking Oil", "Masala", "Ready-to-Eat Food"];
   
      useEffect(()=>{
        dispatch(getProduct({keyword,page:currentPage,category}))
      },[dispatch,keyword,currentPage,category])
        useEffect(()=>{
          if(error){
            toast.error(error.message,{position:'top-center',autoClose:3000});
            dispatch(removeErrors())
          }
        },[dispatch,error])
        const handlePageChange=(page)=>{
          if(page!==currentPage){
            setCurrentPage(page);
            const newSearchParams=new URLSearchParams(location.search);
            if(page===1){
              newSearchParams.delete('page')
            }else{
              newSearchParams.set('page',page)
            }
            navigate(`?${newSearchParams.toString()}`)
          }
        }

        const handleCategoryClick=(category)=>{
          const newSearchParams=new URLSearchParams(location.search);
          newSearchParams.set('category',category)
          newSearchParams.delete('page')
          navigate(`?${newSearchParams.toString()}`)
        }
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      if(searchTerm.trim()) {
          navigate(`/products?keyword=${searchTerm}`);
      } else {
          navigate('/products');
      }
  }

  const [searchTerm, setSearchTerm] = useState(keyword || "");

  // Update local search term when URL keyword changes
  useEffect(() => {
      setSearchTerm(keyword || "");
  }, [keyword]);


  return (
    <>
    {loading ? (<Loader/>) : (
       <>
       <Navbar/>
       <div className="products-layout">
            
            {/* Search Hero Section */}
            <div className="search-hero-section">
                <form className="search-bar-container" onSubmit={handleSearchSubmit}>
                    <Search className="search-icon-large" style={{fontSize: 30}} />
                    <input 
                        type="text" 
                        className="main-search-input" 
                        placeholder="Find your groceries..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </form>

                {/* Hero Result - The First Match */}
                {products && products.length > 0 ? (
                    <div className="hero-result-card">
                        <div className="hero-left">
                            <CheckCircle className="hero-check-icon" />
                            <Link to={`/product/${products[0]._id}`} style={{textDecoration:'none'}}>
                                <h2 className="hero-name">
                                    {products[0].name} 
                                    <span className="hero-tag">NEW</span>
                                </h2>
                            </Link>
                        </div>
                        <div className="hero-right">
                            <div className="hero-pricing">
                                <span className="hero-price-main">₹{products[0].price}/yr</span>
                                <span className="hero-price-retail">Retail ₹{(products[0].price * 1.2).toFixed(2)}/yr</span>
                            </div>
                            <Link to={`/product/${products[0]._id}`}>
                                <button className="hero-add-btn">
                                    <ShoppingCart /> Add to cart
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Suggested Results List */}
            <div className="suggested-section">
                
                {/* Visual Controls / Tabs */}
                <div className="suggested-controls">
                    <div className="status-pill active"><DoneAll fontSize="small"/> Available</div>
                    <div className="status-pill"><LocalOffer fontSize="small"/> On Sale</div>
                </div>

                <div className="suggested-header-row">
                    <span className="suggested-title">Suggested Results</span>
                </div>

                <div className="results-list-container">
                   {products.length > 0 ? (
                        <>
                        {/* Skip the first one as it is the Hero */}
                        {products.slice(1).map((product) => (
                            <ProductRow key={product._id} product={product} />
                        ))}
                        {products.length === 1 && (
                            <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                                No other similar products found.
                            </div>
                        )}
                        </>
                   ) : (
                      <NoProducts keyword={keyword}/>
                   )}
                </div>

                {products.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

       </div>
       </>
    )}
    </>
  )

}

export default Products
