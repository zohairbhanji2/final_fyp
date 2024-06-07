import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import './Alternativemedicine.css';

function AlternativeMedicine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineData, setMedicineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [searched, setSearched] = useState(false);


  const cleanName = (Name) => {
    const cleanedName = Name.replace(/\s*\([^)]\)\s/g, '');
    return cleanedName.trim();
  };


  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a valid search term.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`http://192.168.1.15:5000/api/findSimilarMedicines/${searchTerm}`);
      const data = await response.json();
      console.log('Server Response:', data);
  
      if (data.similarMedicines.length > 0) {
        setMedicineData(data.similarMedicines);
        setError(null);
        setSearched(true);
        document.querySelector('.search-container').classList.add('searched');
      } else {
        setMedicineData([]);
        setError('No similar medicines found.');
        setSearched(true);
      }
    } catch (error) {
      setMedicineData([]);
      setError('An error occurred while fetching data.');
      setSearched(true);
    }
  
    setLoading(false);
    document.querySelector('.search-container').classList.add('searched');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.href = '/Home';
  };

  const toggleNavMenu = () => {
    setNavOpen(!navOpen);
  };

  const closeNavMenu = () => {
    setNavOpen(false);
  };


  return (
    <div>
      <div className="header">
        <button className="back-button" onClick={() => window.history.back()}>
            <FaArrowLeft />Back
        </button>
        <img src="Home.png"  className='logoimage' />
        <div className="navbar" onClick={toggleNavMenu} onMouseEnter={toggleNavMenu} onMouseLeave={closeNavMenu}>
            <button className="nav-button">
                {navOpen ? <FaTimes /> : <FaBars />}
            </button>
            {navOpen && (
                <div className="nav-menu">
                    <Link to="/userprofile"><button className="nav-item">User Profile</button></Link>
                    <Link to="/changepassword"><button className="nav-item">Change Password</button></Link>
                    <button className="nav-item" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
      </div>
      <div className={`search-container ${searched ? 'searched' : ''}`}>
          <input
            type="text"
            placeholder="Search medicine or alternative medicine"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {medicineData.length > 0 && (
            <div className="grid-container">
              {medicineData.map((product, index) => (
                <div key={index} className="medicine-details">
                  <p><strong>Name:</strong> {cleanName(product.Name)}</p>
                  <p><strong>Category:</strong> {product.Category}</p>
                  <p><strong>Generic Name:</strong> {product.GenericName}</p>
                  <p><strong>Manufacturer:</strong> {product.Manufacturer}</p>
                  <p><strong>Price:</strong> {product.Price}</p>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}

export default AlternativeMedicine;