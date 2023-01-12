import React, { Component, useState, useEffect, Form } from "react";
import { Button, Modal } from 'antd'
import TextEditor from '../../components/textEditor'
import CorrectionsEditor from '../../components/correctionsEditor'
import "antd/dist/antd.css";
import "./main.css";

function Main() {
    /* RUBRIC ONLY */
    const [text, setText] = useState("");
    const [imageData, setImageData] = useState([]);
    const [currentImage, setCurrentImage] = useState("");
    const [currentPrediction, setCurrentPrediction] = useState("");
    const [visible, setVisible] = useState(false);
    const [imageCount, setImageCount] = useState(0);
    const [taskTime, setTaskTime] = useState((Date.now() + 1000 * 1000));
    const [currentTime, setCurrentTime] = useState(0);
    const [moveToSurvey, setMoveToSurvey] = useState(false);
    const [render, setRender] = useState(false);
    const [modelVersion, setModelVersion] = useState("score");

    // testing communication with backend
    useEffect(() => {
        fetch('http://0.0.0.0:8080/time').then(res => 
        res.json()).then(data => {
            setCurrentTime(data.time);
            console.log(data.time)
            setRender(true);
        });
        }, []);
    
        

    return (
      <>
       {render ?

            <div className="container">
                <div className="radio">
                <label>
                <input type="radio" label="Score" checked={modelVersion === 'score'} value="score" onClick={() => setModelVersion('score')} />
                Score
                </label>
                <label>
                    <input type="radio" label="Corrections" checked={modelVersion === 'corrections'} value="corrections" onClick={() => setModelVersion('corrections')} />
                    Corrections
                </label>
            </div>
            <div className="title">English Writing Helper</div>
            <div className="interface">
            {modelVersion === "score" &&
                            <TextEditor 
                            currentPrediction={""}
                    />
            }
            {modelVersion === "corrections" &&
                            <CorrectionsEditor 
                            currentPrediction={""}
                    />
            }
            </div>
            
            </div>

        :
            <> 
            <h1> Loading ...</h1>
            </>
        }
      </>
       
      );
}

export default Main;