import React, { useState } from 'react';
import axios from 'axios';
import "../CSS/Login.css"
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loginMessage, setLoginMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {};
  
    if (!fields.email.trim()) {
      newErrors.email = 'Email is required';
    }
  
    if (!fields.password.trim()) {
      newErrors.password = 'Password is required';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    axios
      .post('http://localhost:4442/api/v1/auth/log-in', {
        email: fields.email,
        password: fields.password,
      })
      .then((response) => {
        if (response.data.success) {
          console.log(JSON.stringify(response.data));
          setLoginMessage('Login successful!');
          setTimeout(() => {
            setLoginMessage('');
            navigate('/dashboard');
          }, 1000);
        } else {
          setLoginMessage('Invalid email or password. Please try again.');
          setTimeout(() => {
            setLoginMessage('');
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginMessage('Error during login. Please try again.');
        setTimeout(() => {
          setLoginMessage('');
        }, 3000);
      });
  };

  return (
    < >
    <div id='login'>
    <div className="container" >
    {loginMessage && (
            <div className={`mt-3 alert position-absolute top-0 end-0 w-25 ${loginMessage.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
              {loginMessage}
            </div>
          )}
      <div className="row">
        <div className="col-md-4 border border-1 p-4 shadow-sm rounded-3 bg-white position-absolute top-50 start-50 translate-middle">
        <h1 className='mb-4 text-center fw-medium'>Student Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={fields.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={fields.password}
                onChange={handleInputChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button type="submit" className="btn me-3 text-white login">
              Login
            </button>
            <Link to="/signup" className='text-decoration-none'>
              <button className='btn signup text-white'>Sign Up</button>
            </Link>
          </form>
         
        </div>
      </div>
    </div>
    </div>
    
    </>
  );
};

export default Login;
