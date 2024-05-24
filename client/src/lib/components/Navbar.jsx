import Button from '@/lib/components/Button';
import { useNavigate } from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';
import React from 'react';
import { position } from '@chakra-ui/react';
const Navbar = ({ onLogout, menus }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const navbarStyle = {
        backgroundColor: 'white',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        width: '100vw',
        position: 'absolute',
      };
    
      const buttonStyle = {
        marginRight: '10px',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
      };
    
      const addButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#f3f3f3',
        color: 'black',
      };
    
      const loginButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'black',
        color: 'white',
      };
    useEffect(() => {
        
    }, []);

    return (
        <div style={navbarStyle}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Instant Studio</h1>
          </div>
          <div>
            <button style={addButtonStyle}>Ajouter votre établissement</button>
            <button style={loginButtonStyle}>Se connecter</button>
          </div>
        </div>
      );
};

export default Navbar;