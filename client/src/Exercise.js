import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const Exercise = () => {
    const [formData, setFormData] = useState({
        name: '',
        muscle_group: '',
        sets: ''
    })

    const [message, setMessage] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([])
    const navigate = useNavigate();

    useEffect(() =>  {
        axios.get('/getmusclegroups').then(response => {
            setMuscleGroups(response.data)
        });
    }, []);



    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/exercise', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
        } catch (error){
            setMessage('There was an error adding this exercise')
            console.error('There was an error creating this exercise', error);
        }
    };

    return (
        <div>
            <form onSubmit = {handleSubmit}>
            <h3 align="center">Add Exercise</h3>
            <div className="form-group" align = "center">
                <label htmlFor="name">Name</label>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Name"
                autoComplete="off"
                />
                
                <label htmlFor="muscle_group">Muscle Group</label>
                <select
                type="muscle_group"
                id="muscle_group"
                name="muscle_group"
                value={formData.muscle_group}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Muscle Group"
                autoComplete="off"
                >
                <option value = "">Select Muscle Group</option>
                {muscleGroups.map((group, index) => (
                        <option key = {index} value = {group}>{group}</option>
                    ))
                }
                </select>



                <label htmlFor="sets">Sets</label>
                    <input
                    type="sets"
                    id="sets"
                    name="sets"
                    value={formData.sets}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter sets (optional)"
                    autoComplete="off"
                />


                <br />
                <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', gap: '20px', align:'center' }}>
                
                <button className="btn btn-primary" type="submit">Enter Exercise</button>

                </div>
            </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Exercise;