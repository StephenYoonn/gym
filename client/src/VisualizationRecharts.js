import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VisualizationRecharts = () => {
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('week');
    const [userId, setUserId] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [exercise, setExercise] = useState('');
    const [viewAll, setViewAll] = useState(false);
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        // Fetch muscle groups when the component mounts
        const fetchMuscleGroups = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getmusclegroups');
                setMuscleGroups(response.data);
            } catch (error) {
                console.error('Error fetching muscle groups:', error);
            }
        };

        fetchMuscleGroups();
    }, []);

    useEffect(() => {
        if (muscleGroup) {
            // Fetch exercises when a muscle group is selected
            const fetchExercises = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/getexercises', {
                        params: { muscle_group: muscleGroup }
                    });
                    setExercises(response.data);
                } catch (error) {
                    console.error('Error fetching exercises:', error);
                    setExercises([]);
                }
            };

            fetchExercises();
        } else {
            setExercises([]);
        }
    }, [muscleGroup]);

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handleMuscleGroupChange = (e) => {
        setMuscleGroup(e.target.value);
        setExercise(''); // Clear exercise when muscle group changes
    };

    const handleExerciseChange = (e) => {
        setExercise(e.target.value);
    };

    const fetchData = async () => {
        try {
            let endpoint;
            if (viewAll) {
                endpoint = 'http://localhost:5000/all_logs';
            } else {
                endpoint = 'http://localhost:5000/aggregate';
            }

            const params = {
                period: period,
                userid: userId
            };

            if (muscleGroup) {
                params.muscle_group = muscleGroup;
            }

            if (exercise) {
                params.exercise_name = exercise;
            }

            const response = await axios.get(endpoint, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: params
            });

            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
    };

    return (
        <div>
            <h3>Data Visualization</h3>
            <div align="center">
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={handleUserIdChange}
                    className="form-control"
                    style={{ marginBottom: '10px', width: '200px' }}
                />
                <select value={muscleGroup} onChange={handleMuscleGroupChange} className="form-control" style={{ marginBottom: '10px', width: '200px' }}>
                    <option value="">Select Muscle Group</option>
                    {muscleGroups.map((group, index) => (
                        <option key={index} value={group}>{group}</option>
                    ))}
                </select>
                {muscleGroup && (
                    <select value={exercise} onChange={handleExerciseChange} className="form-control" style={{ marginBottom: '10px', width: '200px' }}>
                        <option value="">Select Exercise</option>
                        {exercises.map((exercise, index) => (
                            <option key={index} value={exercise}>{exercise}</option>
                        ))}
                    </select>
                )}
                <select value={period} onChange={(e) => setPeriod(e.target.value)} disabled={viewAll}>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select>
                <button onClick={fetchData} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    Fetch Data
                </button>
                <button onClick={() => setViewAll(!viewAll)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                    {viewAll ? 'View Aggregated' : 'View All'}
                </button>
            </div>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
                        <XAxis dataKey="period" stroke="#000000" />
                        <YAxis stroke="#000000" />
                        <Tooltip contentStyle={{ backgroundColor: '#000000', color: '#FFFFFF' }} itemStyle={{ color: '#FFFFFF' }} />
                        <Legend wrapperStyle={{ color: '#000000' }} />
                        <Line type="monotone" dataKey="total_volume" stroke="#000000" activeDot={{ r: 8, fill: '#000000' }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p align="center">No data available</p>
            )}
        </div>
    );
};

export default VisualizationRecharts;
