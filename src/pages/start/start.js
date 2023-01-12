import React, { Component,useState } from "react";
import {Button, Modal} from 'antd'
// import { useHistory} from "react-router";
import STRING_CONSTANTS from '../../strings';

import "./start.css";

function StartContainer() {
    // let history = useHistory();
    const [agree, setAgree] = useState(false);

    const checkboxHandler = () => {
      setAgree(!agree);
    }
  
    const routeChange = () =>{ 
      let path = '/#/Instructions'; 
      // history.push(path);
      window.location.assign(path);
      console.log('moving to instructions page')
    }

    return (
      <div className="Home">
        <div className="lander">
            <h1>{STRING_CONSTANTS.MODEL_NAME} Study</h1>
            <p> Welcome to our study! Please check the box below if you
              agree to participate in an experiment with our English Writing
              Helper prototype and allow us to collect data on your experience.
              Your participation will be anonymous. </p>

            <div>
                <input type="checkbox" id="agree" onChange={checkboxHandler} />
                <label htmlFor="agree"> I agree to the <b>terms and conditions</b></label>
            </div>

            <Button disabled={!agree} variant="btn btn-success" onClick={routeChange}>
                Continue
            </Button>
        </div>
      </div>
      );
}

export default StartContainer;