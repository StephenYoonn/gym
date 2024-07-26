import React, { useState, useEffect } from 'react';
import axios from 'axios';


const LogSession = () =>{
    const[notes, setNotes] = useState('');
    const[date, setDate] = useState('');
    const[message, setMessage] = useState('');

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };
    const setTodayDate = () => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
      };

    const handleSessionSubmit = async (e) => {
            e.preventDefault();
        
        try{
            const response = await axios.post('http://localhost:5000/log',{
                date: date,
                notes: notes
            }, {headers: {'Content-Type':'application/json'}}
        ); setMessage(response.data.message);
        } catch(error){
            console.error('Error logging session: ',error);
            setMessage('Error loggin session');
        }
    };

    return (
        <div>
            <h3 align= "center">Log Session Notes</h3>
            <form onSubmit = {handleSessionSubmit}>
                <div className = "form-group" align = "center">
                    <label htmlFor="date"> Date </label>
                    <input  
                        type = "date"
                        id = "date"
                        name="date"
                        value = {date}
                        onChange = {handleDateChange}
                        className="form-control"
                        
                    />
                    <button type="button" onClick={setTodayDate} className="btn btn-secondary">Today</button>

                    <br></br>
                
                    <label htmlFor="notes"> Session Notes </label>
                    <textarea  
                        type = "text"
                        id = "notes"
                        name="notes"
                        value = {notes}
                        onChange = {handleNotesChange}
                        className="form-control"
                        placeholder="Enter Session Notes"
                        rows ="10"
                        cols="50"
                        
                        style={{ resize:"vertical",width: '50%', height: '200px' ,whiteSpace: 'pre-wrap',overflowWrap: 'break-word'}}
                        wrap="soft"
                    />

                </div>
                <div className="form-group" align="center">
                    <button type="submit" className="btn btn-primary">Log Session</button>
                </div>

            </form>
            {message && <p align="center">{message}</p>}
        </div>
    )
}

export default LogSession;