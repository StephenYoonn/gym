import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import SearchExercise from './searchExercise';
import AddSets from './AddSets';

const Exercise = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [exercise, setExercise] = useState(null);
    const [sessionDate, setSessionDate] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [session, setSession] = useState(null);
    const [setFormData, setSetFormData] = useState({
        weight: '',
        reps: '',
       

    });
    const [error, setError] = useState('');



    useEffect(() => {
        axios.get('/getmusclegroups').then(response => {
            setMuscleGroups(response.data);
        }).catch(error => {
            console.error('There was an error fetching the muscle groups:', error);
        });
    }, []);

    const handleSessionChange = (e) => {
        setSessionDate(e.target.value);
    };

    const handleExerciseChange = (e) => {
        setExerciseName(e.target.value);
    };

    const handleSetChange = (e) => {
        const { name, value } = e.target;
        setSetFormData({
            ...setFormData,
            [name]: value
        });
    };

    const handleMuscleGroupChange = (e) => {
        setSelectedMuscleGroup(e.target.value);
    }

    const handleSessionSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/session', {
                date: sessionDate
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSession(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching or creating session:', error);
            setError('There was an error fetching or creating the session');
        }
    };

    const handleExerciseSubmit = async (e) => {
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


        let session_id;
        try {
            const sessionResponse = await axios.post('http://localhost:5000/session', {
                date: setFormData.date
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            session_id = sessionResponse.data.session_id;
        } catch (error) {
            console.error('Error fetching or creating session:', error);
            setError('There was an error fetching or creating the session');
            return;
        }

        try {
            await axios.post('/sets', {
                ...setFormData,
                exercise_name:exercise.name,
                session_id: session_id
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

    const setTodayDate = () => {
        const today = new Date().toISOString().split('T')[0];
        setSessionDate(today);
      };
    

      return (
        <div>
            <h3 align="center">Find or Create Session</h3>
            <form onSubmit={handleSessionSubmit}>
                <div className="form-group" align="center">
                    <label htmlFor="sessionDate">Session Date</label>
                    <input
                        type="date"
                        id="sessionDate"
                        name="sessionDate"
                        value={sessionDate}
                        onChange={handleSessionChange}
                        className="form-control"
                    />
                    <button type="button" onClick={setTodayDate} className="btn btn-secondary">Today</button>
                </div>
                <div className="form-group" align="center">
                    <button type="submit" className="btn">Find/Create Session</button>
                </div>
            </form>

            {session && (
                <>
                    <h3 align="center">Find or Create Exercise</h3>
                    <form onSubmit={handleExerciseSubmit}>
                        <div className="form-group" align="center">
                            <label htmlFor="exerciseName">Exercise Name</label>
                            <input
                                type="text"
                                id="exerciseName"
                                name="exerciseName"
                                value={exerciseName}
                                onChange={handleExerciseChange}
                                className="form-control"
                                placeholder="Enter Exercise Name"
                            />
                            <label htmlFor="muscle_group">Muscle Group</label>
                            <select
                                id="muscle_group"
                                name="muscle_group"
                                value={selectedMuscleGroup}
                                onChange={handleMuscleGroupChange}
                                className="form-control"
                            >
                                <option value="">Select Muscle Group</option>
                                {muscleGroups.map((group, index) => (
                                    <option key={index} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>
                     

                        

                        <div className="form-group" align="center">
                            <button type="submit" className="btn">Search Exercise</button>
                        </div>
                    </form>
                </>
            )}

            {exercise && (
                <div align="center">
                    <h3>Exercise Details</h3>
                    <p><strong>Name:</strong> {exercise.name}</p>
                    <p><strong>Muscle Group:</strong> {exercise.muscle_group}</p>

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
                        </div>
                        <div className="form-group" align="center">
                            <button type="submit" className="btn">Add Set</button>
                        </div>
                    </form>
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
};

export default Exercise;
