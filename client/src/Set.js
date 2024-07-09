import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Set = () => {
    const [formData, setFormData] = useState({
        weight: '',
        reps: '',
        session_id: '',
        exercise_id: ''
    })

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.post('/sets', formData, {
                headers:{
                    'Content-Type':'application/json'
                }
            });
            setMessage(response.data.message);
        } catch (error){
            setMessage('There was an error creating this set')
            console.error('There was an error creating this set', error)
            
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
                
                <label htmlFor="weight">Weight</label>
                <select
                type="weight"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Weight"
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

export default Set;
