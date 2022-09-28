import './App.css';
import {Button, Grid, useThemeProps} from "@mui/material";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Typography from '@mui/material/Typography';

function App() {

  const [requestType, setRequest] = React.useState('');
  const [difficultyType, setDifficulty] = React.useState('');
  const [uuid, setUuid] = React.useState('');
  const [response, setResponse] = React.useState('Request response appears here!');
  const [weatherResponse , setWeatherResponse] = React.useState('Weather at Clementi from Serverless Function Appears Here');

  React.useEffect(() => {
    if (requestType == "GET") {
      setDifficultyEnabled(true);
      setUuidEnabled(false);
    } else if (requestType == "DELETE") {
      setDifficultyEnabled(false);
      setUuidEnabled(true);
    } else if (requestType == "PUT" || "POST") {
      setDifficultyEnabled(true);
      setUuidEnabled(true);
    }
  }, [requestType])

  const [isDifficultyEnabled, setDifficultyEnabled] = React.useState(true);
  const [isUuidEnabled, setUuidEnabled] = React.useState(true);


  const handleChange = (event) => {
    setRequest(event.target.value);
  };

  const handleDifficulty = (event) => {
    setDifficulty(event.target.value);
  };

  const handleUuid = (event) => {
    setUuid(event.target.value)
  }

  const handleGetWeatherButton = (event) => {
    axios.get(`https://lr4a2fqr2zb4mmfjzejnxgx2fm0tvjpz.lambda-url.ap-southeast-1.on.aws/`).then(function (response) {
      console.log(response);
      setWeatherResponse(JSON.stringify(response.data));
    }).catch(function (error) {
      console.log(error);
      setResponse(error.toString());
    })
  }

  const handleSubmitButton = (event) => {
    if (requestType == "GET") {
      axios.get(`http://cs3219ototb-env.eba-dmnv2pwc.ap-southeast-1.elasticbeanstalk.com/waiting/${difficultyType}`)
      .then(function (response) {
        console.log(response.data.toString());
        setResponse(JSON.stringify(response.data));
      }).catch(function (error) {
          console.log(error);
          setResponse(error.toString());
      })
    } else if (requestType == "POST") {
      axios.post(`http://cs3219ototb-env.eba-dmnv2pwc.ap-southeast-1.elasticbeanstalk.com/waiting/${uuid}/${difficultyType}`)
      .then(function (response) {
        console.log(response.data);
        setResponse(JSON.stringify(response.data));
      }).catch(function (error) {
          console.log(error);
          setResponse(error.toString());
      })
    } else if (requestType == "PUT") {
      axios.post(`http://cs3219ototb-env.eba-dmnv2pwc.ap-southeast-1.elasticbeanstalk.com/waiting/${uuid}/${difficultyType}`)
      .then(function (response) {
        console.log(response.data);
        setResponse(JSON.stringify(response.data));
      }).catch(function (error) {
          console.log(error);
          setResponse(error.toString());
      })
    } else if (requestType == "DELETE") {
      axios.delete(`http://cs3219ototb-env.eba-dmnv2pwc.ap-southeast-1.elasticbeanstalk.com/waiting/${uuid}`)
      .then(function (response) {
        console.log(response.data);
        setResponse(JSON.stringify(response.data));
      }).catch(function (error) {
          console.log(error);
          setResponse(error.toString());
      })
    }
  }

  return (
    <Grid
    container
    direction="column"
    justifyContent="space-evenly"
    alignItems="center"
    style={{ minHeight: "100vh" }}
  >
    <Grid item xs = {8}>
        <FormControl style = {{minWidth: 200}}>
            <InputLabel id="http-request-type-label">HTTP Request Type</InputLabel>
            <Select
              labelId="http-request-type-label"
              id="request-type-label"
              value={requestType}
              label="HTTP Request Type"
              onChange={handleChange}
            >
              <MenuItem value={"GET"}>GET</MenuItem>
              <MenuItem value={"PUT"}>PUT</MenuItem>
              <MenuItem value={"POST"}>POST</MenuItem>
              <MenuItem value={"DELETE"}>DELETE</MenuItem>
            </Select>
          </FormControl>
    </Grid>

    <Grid item xs = {8}>
        <FormControl style = {{minWidth: 200}} disabled = {!isDifficultyEnabled}>
          <InputLabel id="difficulty-type-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-type-label"
            id="difficulty-label"
            value={difficultyType}
            label="Difficulty"
            onChange={handleDifficulty}
          >
            <MenuItem value={"easy"}>Easy</MenuItem>
            <MenuItem value={"medium"}>Medium</MenuItem>
            <MenuItem value={"hard"}>Hard</MenuItem>
          </Select>
        </FormControl>
    </Grid>

    <TextField style = {{minWidth: 200}} id="filled-required" label="Unique ID" variant="filled" onChange = {handleUuid} disabled = {!isUuidEnabled}/>
    <Button
      onClick = {handleSubmitButton}
    >
      Submit Request
    </Button>

    <Typography>{response}</Typography>

    <Button
      onClick = {handleGetWeatherButton}
    >
      Get Weather At Clementi
    </Button>

    <Typography>{weatherResponse}</Typography>
  </Grid>
  );
}

export default App;
