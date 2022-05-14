import React from 'react';
import logo from '../../assets/logo.png';
import brandText from '../../assets/brand_text.svg';
import Button from '../Button/Button';
import './Header.css';

function Header() {
  return (
    <div className="Header">
      <img src={logo} className="Header-logo" alt="logo" />
      <img src={brandText} className="Header-brand" alt="brand text" />
      <Button>New Deal</Button>
    </div>
  );
}

export default Header;
