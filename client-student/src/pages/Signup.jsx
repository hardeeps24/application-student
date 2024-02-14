import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Signup.css';

function Signup() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!fields.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!fields.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!fields.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const checkEmailResponse = await axios.post('http://localhost:4442/api/v1/auth/check-email', {
        email: fields.email,
      });

      if (checkEmailResponse.data.exists) {
        setErrors({ email: 'Email already in use' });
        toast.error('Account already registered');
        return;
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    }

    let data = JSON.stringify({
      name: fields.name,
      email: fields.email,
      password: fields.password,
    });

    const response = await postApi(data);

    if (response.code === 200) {
      toast.success(response.message);
      setFields({
        name: '',
        email: '',
        password: '',
      });
      setErrors({});
    } else {
      setErrors(response.message);
      toast.error('Account already registered');
    }
  };

  const postApi = async (data) => {
    let config = {
      method: 'post',
      url: 'http://localhost:4442/api/v1/auth/sign-up',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  return (
    <div id="signup">
      <div className="container">
        <div className="row">
          <div className="col-md-6 m-auto border p-4 rounded-3 shadow-sm bg-white position-absolute top-50 start-50 translate-middle">
            <h1 className="mb-4 text-center">Signup</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={fields.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={fields.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="exampleInputPassword1"
                  name="password"
                  value={fields.password}
                  onChange={handleInputChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="d-flex justify-content-around">
                <button type="submit" className="btn btn-danger w-50" disabled={errors.email === 'Email already in use'}>
                  Submit
                </button>
              </div>
            </form>
            <p className="text-center mt-3">
              Already have an account? <Link to="/" className='text-decoration-none text-primary' >Login here.</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
