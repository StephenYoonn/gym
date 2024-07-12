import React, { useState } from 'react';
import axios from 'axios';

const AddSets = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [exercise, setExercise] = useState(null);
    const [setFormData, setSetFormData] = useState({
        weight: '',
        reps: '',
        session_id: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setExerciseName(e.target.value);
    };

    const handleSetChange = (e) => {
        const { name, value } = e.target;
        setSetFormData({
            ...setFormData,
            [name]: value
        });
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/searchexercise', {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    name: exerciseName.trim().toLowerCase()
                }
            });
            if (response.data.message) {
                setExercise(null);
                setError(response.data.message);
            } else {
                setExercise(response.data);
                setError('');
            }
        } catch (error) {
            console.error('Error fetching exercise:', error);
            setError('There was an error fetching the exercise');
            setExercise(null);
        }
    };

    const handleSetSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/sets', {
                ...setFormData,
                exercise_name:exercise.name
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setError('');
            alert('Set added successfully');
        } catch (error) {
            console.error('Error adding set:', error);
            setError('There was an error adding the set');
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <div className="form-group" align="center">
                    <label htmlFor="exerciseName">Exercise Name</label>
                    <input
                        type="text"
                        id="exerciseName"
                        name="exerciseName"
                        value={exerciseName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Exercise Name"
                    />
                </div>
                <div className="form-group" align="center">
                    <button type="submit" className="btn">Search</button>
                </div>
            </form>

            {error && <p>{error}</p>}

            {exercise && (
                <div align = "center">
                    <h3>Exercise Details</h3>
                    <p><strong>Name:</strong> {exercise.name}</p>
                    <p><strong>Muscle Group:</strong> {exercise.muscle_group}</p>
                    <p><strong>Sets:</strong> {exercise.sets ? exercise.sets.length : 0}</p>

                    <form onSubmit={handleSetSubmit}>
                        <div className="form-group" align="center">
                            <label htmlFor="weight">Weight</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={setFormData.weight}
                                onChange={handleSetChange}
                                className="form-control"
                                placeholder="Enter Weight"
                                autoComplete="off"
                            />
                            <label htmlFor="reps">Reps</label>
                            <input
                                type="number"
                                id="reps"
                                name="reps"
                                value={setFormData.reps}
                                onChange={handleSetChange}
                                className="form-control"
                                placeholder="Enter Reps"
                                autoComplete="off"
                            />
                            <label htmlFor="session_id">Session ID</label>
                            <input
                                type="number"
                                id="session_id"
                                name="session_id"
                                value={setFormData.session_id}
                                onChange={handleSetChange}
                                className="form-control"
                                placeholder="Enter Session ID"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group" align="center">
                            <button type="submit" className="btn">Add Set</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddSets;
