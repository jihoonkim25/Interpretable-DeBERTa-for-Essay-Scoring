import React, { useEffect, useState } from "react";
import {Button} from 'antd'
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import './style.css'

// this is how you create a separate component
function TextEditor({  }) {
    // store the prediction message to display 
    const [writing, setWriting] = useState("");
    const [highlight, setHighlight] = useState("");
    const [showTable, setShowTable] = useState(false);

    const [cohesionColor, setCohesionColor] = useState("red");
    const [syntaxColor, setSyntaxColor] = useState("yellow");
    const [vocabularyColor, setVocabularyColor] = useState("blue");
    const [phraseologyColor, setPhraseologColor] = useState("purple");
    const [grammarColor, setGrammarColor] = useState("green");
    const [conventionsColor, setConventionsColor] = useState("gray");

    const [cohesionScore, setCohesionScore] = useState(0);
    const [syntaxScore, setSyntaxScore] = useState(0);
    const [vocabularyScore, setVocabularyScore] = useState(0);
    const [phraseologyScore, setPhraseologyScore] = useState(0);
    const [grammarScore, setGrammarScore] = useState(0);
    const [conventionsScore, setConventionsScore] = useState(0);
    const [overallScore, setOverallScore] = useState(0);


    const didMount = React.useRef(false); //Necessary for useEffect()

    useEffect(() => {
        if (!didMount.current) { //Checks whether this is the first render. If so, skips
            didMount.current = true;
            return;
        }
        setHighlight(demoHighlight1);
    }, [cohesionColor, syntaxColor, vocabularyColor, phraseologyColor, grammarColor, conventionsColor])

    const updateCohesion=()=>{
        if (cohesionColor === "red") {
            setCohesionColor("clear")
        } else {
             setCohesionColor("red")
        }
    }

    const updateSyntax=()=>{
        if (syntaxColor === "yellow") {
            setSyntaxColor("clear")
        } else {
             setSyntaxColor("yellow")
        }
    }

    const updateVocabulary=()=>{
        if (vocabularyColor === "blue") {
            setVocabularyColor("clear")
        } else {
             setVocabularyColor("blue")
        }
    }

    const updatePhraseology=()=>{
        if (phraseologyColor === "purple") {
            setPhraseologColor("clear")
        } else {
             setPhraseologColor("purple")
        }
    }

    const updateGrammar=()=>{
        if (grammarColor === "green") {
            setGrammarColor("clear")
        } else {
             setGrammarColor("green")
        }
    }

    const updateConventions=()=>{
        if (conventionsColor === "gray") {
            setConventionsColor("clear")
        } else {
             setConventionsColor("gray")
        }
    }

    var demoHighlight1 = [
        {
        highlight: [[0,1],[105,112],[150,151],[197,205],[212,219]],
        className: cohesionColor
        },
        {
        highlight: [[42,47],[48,50],[90,93],[121,124]],
        className: cohesionColor
        }
    ];

    var demoHighlight2 = [
        {
        highlight: [[55,59],[132,133],[158,161],[162,166], [211,219],[260,264],[270,277],[417,419]],
        className: conventionsColor
        },
        {
        highlight: [[63,67], [81, 87], [119,123],[286,293], [299,304],[313,318]],
        className: grammarColor
        }
    ];

    var demoHighlight3 = [
        {
        highlight: [[8,9], [49,53],[115,119],[158,161],[216,217],[245,250],[301,302],[315,316]],
        className: conventionsColor
        },
        {
        highlight: [[15,17],[144,145],[220,221],[375,384],[402,405]],
        className: grammarColor
        }
    ];

        const rubricData = {
        overall: ["", 
            "Inaccuracies in grammar and usage impede communication.",
            "Inaccurate language impairs communication, with partial organization and flawed sentence structure.",
            "Language inaccuracies sometimes impede communication.",
            "Fluent language use with varied syntax, words, and grammar; occasional errors.",
            "Fluent and accurate use of language, including grammar, syntax and conventions."
        ],
        cohesion: ["",
            "Organizational structure and coherence lacking; ideas not presented clearly.", 
            "Lacking organization and logical sequencing, basic cohesion with errors or repetition.",
            "Limited variety of cohesive devices used, some mechanical or faulty use of cohesion.",
            "Ideas well connected through cohesive devices and appropriate overlap.",
            "Organizing text with effective linguistic features, such as referencing and transition words, to link ideas.",
        ],
        syntax: ["",
            "Sentence structure and word order errors causing confusion commonly occur.", 
            "Some sentence variation used; many sentence structure problems.",
            "Syntactic structures present, but range may be limited; some errors in sentence formation.",
            "Varying sentence structure, with occasional errors in formation.",
            "Using varied sentences with few minor errors.",],
        vocabulary: ["",
            "Inadequate use of language; lack of vocabulary control.", 
            "Inappropriate use of topic-related words with errors in word choice, distorting meanings.",
            "Limited vocabulary; occasional use of topic related terms; attempts to diversify.",
            "Wide-ranging vocabulary for accurate and varied expression.",
            "Skillful use of varied vocabulary to convey accurate meanings; rare mistakes in word choice.",],
        phraseology: ["",
            "Commonly used phrases are repeated and misused frequently.", 
            "Repetition of basic phrases, collocations and lexical bundles; occasional misuse.",
            "Some repeated use of same phrases, with misuse and lack of variety.",
            "Correct use of multiple phrase types, with occasional mistakes and colloquialisms.",
            "Flexible use of phrases to convey precise meanings with negligible minor inaccuracies.",],
        grammar: ["",
            "Errors in grammar and usage throughout.", 
            "Many errors in grammar and usage",
            "Some errors in grammar and usage",
            "Minimal errors in grammar and usage.",
            "Command of grammar and usage with few or no errors.",],
        conventions: ["",
            "Spelling, capitalization, and punctuation errors throughout.", 
            "Spelling, capitalization, and punctuation errors frequent and distracting.",
            "Spelling, capitalization, and punctuation that are sometimes distracting.",
            "Spelling, capitalization, and punctuation errors few and not distracting.",
            "Spelling, capitalization, and punctuation errors nonexistent or negligible.",]
    }

    const toggleTable=()=> setShowTable(true);

    const setScores=()=>{
        setCohesionScore(5);
        setSyntaxScore(5);
        setVocabularyScore(5);
        setPhraseologyScore(5);
        setGrammarScore(3);
        setConventionsScore(3);
        setOverallScore(4);
    }

    const gradeWriting=()=>{
        toggleTable();
        setScores();
        setHighlight(demoHighlight1);
    };



    const onChange = (writing) => setWriting(writing);

    return (
            <div>
                <div className="writingbox">
                    <HighlightWithinTextarea
                        highlight={highlight}
                        value={writing}
                        onChange={onChange}
                    />
                </div>
            <Button className="btn-1"  onClick={()=>{gradeWriting()}}>
                Grade Writing!
            </Button>
            {false && (
            <div>
                <br></br>
                <header>
                    <h1>Overall Grade: {overallScore}</h1>
                </header>
                <table>
                    <tr className="header-row">
                        <th className="red">
                            Cohesion <input type="checkbox" checked={cohesionColor === "red" ? true: false} onChange={()=>{updateCohesion()}} ></input>
                        </th>
                        <th className="yellow">
                            Syntax <input type="checkbox" checked={syntaxColor === "yellow" ? true: false} onChange={()=>{updateSyntax()}} ></input>
                        </th>
                        <th className="blue">
                            Vocabulary <input type="checkbox" checked={vocabularyColor === "blue" ? true: false} onChange={()=>{updateVocabulary()}}></input>
                        </th>
                        <th className="purple">                
                            Phraseology <input type="checkbox" checked={phraseologyColor === "purple" ? true: false} onChange={()=>{updatePhraseology()}}></input>
                        </th>
                        <th className="green">                
                            Grammar <input type="checkbox" checked={grammarColor === "green" ? true: false} onChange={()=>{updateGrammar()}}></input>
                        </th>
                        <th className="gray">                
                            Conventions <input type="checkbox" checked={conventionsColor === "gray" ? true: false} onChange={()=>{updateConventions()}}></input>
                        </th>
                    </tr>
                    <tr>
                        <th className="score">{cohesionScore}</th>
                        <th className="score">{syntaxScore}</th>
                        <th className="score">{vocabularyScore}</th>
                        <th className="score">{phraseologyScore}</th>
                        <th className="score">{grammarScore}</th>
                        <th className="score">{conventionsScore}</th>
                    </tr>
                    <tr>
                        <th className="rubric">{rubricData["cohesion"][cohesionScore]}</th>
                        <th className="rubric">{rubricData["syntax"][syntaxScore]}</th>
                        <th className="rubric">{rubricData["vocabulary"][vocabularyScore]}</th>
                        <th className="rubric">{rubricData["phraseology"][phraseologyScore]}</th>
                        <th className="rubric">{rubricData["grammar"][grammarScore]}</th>
                        <th className="rubric">{rubricData["conventions"][conventionsScore]}</th>
                    </tr>
                </table>
            </div>
            )}
                
            </div>
        )
}

export default TextEditor;