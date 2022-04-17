import React, { useState, useEffect} from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


// import PropTypes from 'prop-types'

const Questions = ({selected, setSelected}) => {
    
    const [questions, setData] = useState([]); 
    const url = "http://localhost:5000/questions";

    
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        }

        getData();
    }, []);

    const addAns = (item_id, ans_idx, index) => {
        // filter result 
        let new_selected = selected.filter((q) => q[2] !== index);
        // new_selected = new_selected.filter((q) => q[2] !== index);
        // new_selected.push([item_id, ans_idx, index]);
        setSelected([...new_selected, [item_id, ans_idx, index]]);
        // console.log("selected", new_selected);
        // console.log("selected", selected);
    }


    return (
        <div className="question-container">
            {questions.map((item, index) => (
                <Form.Group className={`mb-4 ${item.id}`} key={index}>
                    <Form.Text className="qt mx-2 fw-bold" style={{fontSize:"20px", color: "black"}}>
                        {index + 1}. {item.question}
                    </Form.Text>
                    <InputGroup>
                        {item.options.map((opt, idx) =>(
                            <div className="d-flex mx-2" key={idx}>
                                <InputGroup.Radio value={idx} name={`${item.id}`} aria-label="Radio" onClick={() => addAns(item.id, opt, index + 1)} /> 
                                <InputGroup.Text>{opt}</InputGroup.Text>
                            </div>
                        ))}
                    </InputGroup>
                </Form.Group>
                
            ))}
        </div>
    )
}

// Questions.propTypes = {}

export default Questions