import Navbar from './Navbar';
import axios from 'axios';
import '../CSS/Dashboard.css';
import React, { useState, useEffect } from 'react';

const Dashboard = () => {

    const [students, setStudents] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        roll_no: '',
        name: '',
        email: '',
        standard: '',
    });

    // get students data from api 
    const fetchStudents = async () => {
        try {
            const result = await getService();
            if (result.code === 200) {
                setStudents(result.body);
            } else {
                console.error('Error in getting students list:', result.message);
            }
        } catch (error) {
            console.error('Error in fetching students:', error);
        }
    };

    const getService = async () => {
        try {
            const config = {
                method: 'get',
                url: "http://localhost:4442/api/v1/auth/student-data",
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            console.error('Error in getService:', error);
            throw error;
        }
    };
    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    // post request to add students 
    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.standard) {
            setErrorMessage('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        let data = JSON.stringify({
            "name": formData.roll_no,
            "name": formData.name,
            "email": formData.email,
            "standard": formData.standard
        });

        try {
            const response = await postApi(data);
            if (response.code === 200) {
                setSuccessMessage(response.message);
                setFormData({
                    roll_no: '',
                    name: '',
                    email: '',
                    standard: '',
                });
                fetchStudents();
                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            } else {
                setErrorMessage(response.message);
                setTimeout(() =>{
                    setErrorMessage("");
                },2000)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('An error occurred while submitting the form');
        }
    };

    const postApi = async (data) => {
        try {
            const config = {
                method: 'post',
                url: 'http://localhost:4442/api/v1/auth/new-student',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <div className="container-fluid p-0" id="dashBoard">
                <Navbar />
                <div className="row px-3 px-sm-0">
                    <div className="col-md-8 m-auto mt-3">
                        <button type="button" className="btn border border-1 shadow-sm float-end" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            New Student
                        </button>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                                            Application Form
                                        </h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="standard" className="form-label">
                                                    Standard
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="standard"
                                                    name="standard"
                                                    placeholder="Standard"
                                                    value={formData.standard}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* table data */}
                    <div className="col-md-8 m-auto mt-4 bg-white">
                        <div className="p-3 border rounded-2">
                            <h2 className="mb-4">Student Data</h2>
                            <div className="table-responsive">
                                <table className="table text-center">
                                    <thead className='border-0'>
                                        <tr>
                                            <th scope="col">Roll_No</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Standard</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={index}>
                                                <td>{student.roll_no}</td>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>{student.standard}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
