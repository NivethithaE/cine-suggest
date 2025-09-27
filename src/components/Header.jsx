import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'Tamil' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ko', label: 'Korean' },
    { code: 'ja', label: 'Japanese' }
  ];

  const goToLanguage = (code) => {
    navigate(`/explore?language=${code}`);
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="logo">BehindTheScenes 🎬</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/explore">Explore</Link>

        <div
          className="dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="dropdown-toggle">🌐 Languages</span>
          <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
            {languages.map((lang) => (
              <p key={lang.code} onClick={() => goToLanguage(lang.code)}>
                {lang.label}
              </p>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
