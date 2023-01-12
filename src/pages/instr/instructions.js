import React, { Component,useState, useEffect } from "react";
import {Button, Modal, Checkbox} from 'antd'
import STRING_CONSTANTS from '../../strings';
import "./instructions.css";

function InstructionsContainer() {

    const [agree, setAgree] = useState(false);
    const [task, setTask] = useState(0);

    const checkboxHandler = () => {
        setAgree(!agree);
    }

    const routeChange = () =>{ 
        let path = '/#/Main'; 
        window.location.assign(path);
    }

    // connect with the backend to randomize the task 
    useEffect(() => {
        fetch('http://localhost:8080/setup')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log(data['task_number']);
            setTask(data['task_number']);
            // send user id as well
            localStorage.setItem('user-id', data['user_id']);
            console.log(localStorage)
        });
    }, []);


    return (
      <div className="container">
        <h1>Study Instructions</h1> 

        <div className="text"> 
            Read the following instructions to complete the study:
            <ol>
                <li> Please take on the role of an english student attempting to improve their writing </li>
                <li> For demo purposes, please copy the following block of text verbatim and pretend as if it is your own writing. </li>
            </ol> 
            <p>{STRING_CONSTANTS.DEMO_WRITING1}</p>
        </div>

        <div className="text"> 
            <Checkbox onChange={checkboxHandler} style={{fontSize:"20px", textAlign: 'left', alignSelf: 'stretch'}}>
                I copied the text and I am ready to start 
            </Checkbox> 
        </div>

        <div className="text"> 
            <Button disabled={!agree} variant="btn btn-success" onClick={routeChange}>
                Start
            </Button>
        </div>

      </div>
      );
}

export default InstructionsContainer;