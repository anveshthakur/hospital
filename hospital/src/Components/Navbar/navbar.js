import React from 'react';
import './navbar.css';
// import Logo from './logo.jpg';

const Navbar=(props) => {
  const [scrolled,]=React.useState(false);

  let x=['navbar'];
  if(scrolled){
    x.push('scrolled');
  }
  return (
    <header className={x.join(" ")}>
        <div className="logo">
          <ul style = {{paddingTop: '13px',listStyle: 'none', color : '#325288', fontWeight: '500'}}><li>Payment Address: {props.feeAccount}</li></ul>
        </div>

        <nav className="navigation">
            <ul>
              <li style = {{marginRight: '20px'}}><a href="#post1">Account: {props.userAccount}</a></li>
            </ul>
        </nav>

    </header>
  )
};

export default Navbar;