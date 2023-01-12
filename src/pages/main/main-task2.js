import React, { Component, useState, useEffect } from "react";
import { Button, Modal } from 'antd'
import TextEditor3 from '../../components/textEditorDescRubric'
import "antd/dist/antd.css";
import "./main.css";

function Main2Container() {
    /* RUBRIC AND DESCRIPTIVE */
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

    let totalImages = 3;
    const baseImgUrl = "./";

    const routeChange = () =>{ 
        let path = '/#/Survey'; 
        window.location.assign(path);

    }

    const onChangeInput = e => {
        setText(e.target.value);
    };

    const handleDisplayInfo=()=>{
        console.log('opening popup')
        setVisible(true);
    };
    
    const handleCancel = () => {
        setVisible(!visible);
    };


    const nextChange = () =>{
        if (text==="") {
            alert("Please make sure to complete all the fields!");
        } else {
            let count = imageCount + 1;
            if (count >= totalImages) {
                console.log('done with images')
                setMoveToSurvey(true);
            } else {
                // reinitialize variables
                console.log("moving to next image")
                setText(""); 
                setImageCount(count);
                setCurrentImage(imageData[count].name);
                setCurrentPrediction(imageData[count].label);
                setTaskTime(Date.now())
            }
        }
    }

    // testing communication with backend
    useEffect(() => {
        fetch('http://0.0.0.0:8080/time').then(res => 
        res.json()).then(data => {
            setCurrentTime(data.time);
            console.log(data.time)
            setRender(true)
        });
        }, []);
    

    // initialize image


    return (
      <>
       {render ?

            <div className="container">
            <div className="title">English Writing Helper</div>
            <div className="interface">
            <head>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </head>
            <TextEditor3 
                    currentPrediction={""}
            />
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

export default Main2Container;