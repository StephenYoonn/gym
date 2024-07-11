import React, {useState} from 'react';
import axios from 'axios';


//functional component which receives two props which are functions to update the parent
//component's state
const SearchExercise = ({setResults, setError}) => {

    //useState to create state variable which is initially empty and a function to update it
    const [exerciseName, setExerciseName] = useState('');


    //event handler that updates exerciseName state when input field value changes, takes
    //event e as parameter and calls setExerciseName with new value of input field
    //triggered when user types into input field -> property of event is target, value of that target element
    const handleChange = (e) => {
        setExerciseName(e.target.value);
    };

    //async event handler function for form submission, prevent default form submission: which causes page reload

    const handleSubmit = async(e) => {
        e.preventDefault();

        //get request made to url using axios and sends in params
        try{
            const response = await axios.get('http://localhost:5000/searchexercise',  {
                headers:{
                    'Content-Type': 'application/json'
                },
                params:{
                    name:exerciseName.trim().toLowerCase()
                }
            });

            //response from server checked, if message field: contains error and setResults is null and setError with error message
            //else setResults called with response data and setError cleared
            //setError and setResults are state setter functions coming from useState hook
            //from origional Exercise.js file, used for errors and results
            if (response.data.message){
                setResults(null);
                setError(response.data.message)
            } else{
                setResults(response.data);
                setError('');
            }
        } catch (error){
            //console message when catching error, setting error and results
            console.error('Error fetching exercise:', error);
            setError('There was an error fetching the exercise');
            setResults(null);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
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
    );
};

export default SearchExercise;