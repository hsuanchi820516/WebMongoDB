import Questions from "./components/Questions";
import { Col, Row, Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup';
import React from 'react';
import { useState, useEffect} from "react";
import { CSVLink } from "react-csv";

function App() {

  const [isStart, setisStart] = useState(false);
  const [selected, setSelected] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    const downloading = async () => {
      const res = await fetch('http://localhost:5000/findall');
      const data = await res.json();
      console.log(data);
      const new_csvdata = [];
      new_csvdata.push([
        "First Name", "Last Name", "Q1", "A1", "Q2", "A2", "Q3", "A3",
        "Q4", "A4", "Q5", "A5", "Q6", "A6", "Q7", "A7", "Q8", "A8",
        "Q9", "A9", "Q10", "A10"
      ]);

      for (let i = 0; i < data.length; i++) {
        let ans = [];
        let a = data[i].Answers;
        // push all 10 response
        for (let j = 0; j < 10; j++) {
          ans.push(a[j][0]); // quesiton
          ans.push(a[j][1]); // answer
        }
        new_csvdata.push([data[i].FirstName, data[i].LastName, ...ans]);
      }
    

      console.log(new_csvdata);
      setCsvData(new_csvdata);
      setDownloading(false);
    }

    downloading();
    
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const submitSurvey = (e) => {
    e.preventDefault();

    if (selected.length !== 10) {
      alert("Must answer all questions!!!");
      return;
    }

    setisStart(!isStart);

    // sort the question by its questio number 
    selected.sort((a, b) => a[2] - b[2]);

    
    let new_data = [firstName, lastName];
    // updata new response  to csvData
    for (let i = 0; i < 10; i++) {
      new_data.push(selected[i][0]); // quesiton
      new_data.push(selected[i][1]); // answer
    }

    csvData.push(new_data);
    setCsvData(csvData);
    console.log(csvData);
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ FirstName: firstName, LastName: lastName, Answers: selected})
    };


    fetch('http://localhost:5000/add', requestOptions)
    .then((res) => {
      console.log(res.json());
      setFirstName("");
      setLastName("");
      setSelected([]);
    })
    .catch(err => console.log(err));
  }

  // const handleOnChange = (e) => {
  //   console.log(e.target.value);
  // }


  return (

    <div className="container">
      <Form onSubmit={handleSubmit}>
        <div className="w-50">
          <InputGroup>
            <Form.Group as={Row} className="mb-3" controlId="first_name">
              <Form.Label column sm="4">First Name</Form.Label>
              <Col sm="8">
                <Form.Control value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Enter First Name" required/>
              </Col>
            </Form.Group>
          </InputGroup>
          <InputGroup>
            <Form.Group as={Row} className="mb-3" controlId="last_name">
                <Form.Label column sm="4">Last Name</Form.Label>
                <Col sm="8">
                  <Form.Control value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Enter Last Name" required/>
                </Col>
            </Form.Group>
          </InputGroup>
          {!isStart && <Button variant="outline-primary" size="md" type="button" onClick={() => {
            if (firstName === "" || lastName === "") {
              alert("Must fill out your name!!!");
              return;
            }
            setisStart(!isStart);
          }}>Start</Button>}
          { !isStart && 
              <CSVLink data={csvData} filename={"mongo-response.csv"} className="btn btn-outline-primary" target="_blank" >
                  {downloading ? 'Loading csv...' : 'Download me'}
              </CSVLink>
          }
          
        </div>
        {isStart && <Questions selected={selected} setSelected={setSelected}/>}
        {isStart && <Button variant="outline-primary" size="lg" type="submit" onClick={submitSurvey}>Submit</Button>}

      </Form>
    </div>
  );
}

export default App;


// 
//

// "first name"
// "last name"
// "Response": [[q, a], [], [], .....]
// "time"
