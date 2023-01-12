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
    const [grammarColor, setGrammarColor] = useState("orange");
    const [conventionsColor, setConventionsColor] = useState("gray");

    const [cohesionScore, setCohesionScore] = useState(0);
    const [syntaxScore, setSyntaxScore] = useState(0);
    const [vocabularyScore, setVocabularyScore] = useState(0);
    const [phraseologyScore, setPhraseologyScore] = useState(0);
    const [grammarScore, setGrammarScore] = useState(0);
    const [conventionsScore, setConventionsScore] = useState(0);
    const [overallScore, setOverallScore] = useState(0);

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
        if (grammarColor === "orange") {
            setGrammarColor("clear")
        } else {
             setGrammarColor("orange")
        }
    }

    const updateConventions=()=>{
        if (conventionsColor === "gray") {
            setConventionsColor("clear")
        } else {
             setConventionsColor("gray")
        }
    }

    var demoHighlight2 = [
        {
        highlight: ["explane", "bassicly"],
        className: conventionsColor
        },
        {
        highlight: ["their", "tried", "For"],
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

    const setScores=(cScore, sScore, vScore, pScore, gScore, coScore, oScore)=>{
        setCohesionScore(cScore);
        setSyntaxScore(sScore);
        setVocabularyScore(vScore);
        setPhraseologyScore(pScore);
        setGrammarScore(gScore);
        setConventionsScore(coScore);
        setOverallScore(oScore);
    }

    const formatHighlights=(cHighlight, sHighlight, vHighlight, gHighlight, coHighlight)=>{
        var highlights = [
                {
                highlight: cHighlight,
                className: cohesionColor
                },
                {
                highlight: sHighlight,
                className: syntaxColor
                },
                {
                highlight: vHighlight,
                className: vocabularyColor
                },
                {
                highlight: gHighlight,
                className: grammarColor
                },
                {
                highlight: coHighlight,
                className: conventionsColor
                },
            ];
        return highlights;
    }

    const gradeWriting=()=>{
        console.log('getting writing feedback')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: writing })
        };
        fetch('http://localhost:8080/score', requestOptions)
            .then(response => response.json())
            .then(data => {
                toggleTable();
                setScores(data.cohesion.score, data.syntax.score, data.vocabulary.score, data.phraseology.score, data.grammar.score, data.conventions.score, data.overall.score);
                setHighlight(formatHighlights(data.words, data.words, data.words, data.words, data.words));
            });
    };


    function Table(props) {
        return (
            showTable && (
                <div>
                    <br></br>
                    <header>
                        <h1>Overall Grade: {overallScore}</h1>
                    </header>
                    <table>
                        <tr className="header-row">
                            <th className="red">
                                Cohesion
                            </th>
                            <th className="yellow">
                                Syntax
                            </th>
                            <th className="blue">
                                Vocabulary
                            </th>
                            <th className="purple">                
                                Phraseology
                            </th>
                            <th className="orange">                
                                Grammar
                            </th>
                            <th className="gray">                
                                Conventions
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
                            <th className="rubric">{rubricData["cohesion"][Math.round(cohesionScore)]}</th>
                            <th className="rubric">{rubricData["syntax"][Math.round(syntaxScore)]}</th>
                            <th className="rubric">{rubricData["vocabulary"][Math.round(vocabularyScore)]}</th>
                            <th className="rubric">{rubricData["phraseology"][Math.round(phraseologyScore)]}</th>
                            <th className="rubric">{rubricData["grammar"][Math.round(grammarScore)]}</th>
                            <th className="rubric">{rubricData["conventions"][Math.round(conventionsScore)]}</th>
                        </tr>
                    </table>
                </div>
                )
        
        );
    }


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
            <Table/>
                
            </div>
        )
}

export default TextEditor;