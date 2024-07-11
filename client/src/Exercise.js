import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import SearchExercise from './searchExercise';
import AddSets from './AddSets';

const Exercise = () => {
    const [formData, setFormData] = useState({
        name: '',
        muscle_group: '',
        sets: []
    });

    const [message, setMessage] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/getmusclegroups').then(response => {
            setMuscleGroups(response.data);
        }).catch(error => {
            console.error('There was an error fetching the muscle groups:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSetChange = (index, e) => {
        const { name, value } = e.target;
        const newSets = formData.sets.map((set, i) => {
            if (i === index) {
                return { ...set, [name]: value };
            }
            return set;
        });
        setFormData({ ...formData, sets: newSets });
    };

    const addSet = () => {
        setFormData({
            ...formData,
            sets: [...formData.sets, { weight: '', reps: '', session_id: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/exercise', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('There was an error adding this exercise');
            console.error('There was an error creating this exercise', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3 align="center">Add Exercise</h3>
                <div className="form-group" align="center">
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
                        id="muscle_group"
                        name="muscle_group"
                        value={formData.muscle_group}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Muscle Group</option>
                        {muscleGroups.map((group, index) => (
                            <option key={index} value={group}>{group}</option>
                        ))}
                    </select>

                    <br />
                    <br />

                    <label htmlFor="sets">Sets &#40;Optional&#41;</label>
                    {formData.sets.map((set, index) => (
                        <div key={index} className="form-group">
                            <label htmlFor={`weight-${index}`}>Weight</label>
                            <input
                                type="number"
                                id={`weight-${index}`}
                                name="weight"
                                value={set.weight}
                                onChange={(e) => handleSetChange(index, e)}
                                className="form-control"
                                placeholder="Enter Weight"
                                autoComplete="off"
                            />
                            <label htmlFor={`reps-${index}`}>Reps</label>
                            <input
                                type="number"
                                id={`reps-${index}`}
                                name="reps"
                                value={set.reps}
                                onChange={(e) => handleSetChange(index, e)}
                                className="form-control"
                                placeholder="Enter Reps"
                                autoComplete="off"
                            />
                            <label htmlFor={`session_id-${index}`}>Session ID</label>
                            <input
                                type="number"
                                id={`session_id-${index}`}
                                name="session_id"
                                value={set.session_id}
                                onChange={(e) => handleSetChange(index, e)}
                                className="form-control"
                                placeholder="Enter Session ID"
                                autoComplete="off"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addSet} className="btn btn-secondary">Add Set</button>

                    <br />

                    <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', gap: '20px', align: 'center' }}>
                        <button className="btn btn-primary" type="submit">Enter Exercise</button>
                    </div>
                </div>
            </form>
            {message && <p>{message}</p>}

            <div>
                <h3 align="center">Search for Existing Exercises</h3>
                <SearchExercise setResults={setResults} setError={setError} />
                <div id="results" align="center">
                    {error && <p>{error}</p>}
                    {results && (
                        <>
                            <h3>Exercise Details</h3>
                            <p><strong>Name:</strong> {results.name}</p>
                            <p><strong>Muscle Group:</strong> {results.muscle_group}</p>
                            <p><strong>Sets:</strong> {results.sets ? results.sets.length : 0}</p>
                        </>
                    )}
                </div>
            </div>
            <div>
                <h3 align="center">Add Sets to an Existing Exercise</h3>
                <AddSets setResults={setResults} setError={setError} />
            </div>
        </div>
    );
};

export default Exercise;
