import { Background } from "../css/dashboard"
import { Container } from "../css/form"
import cognitive from "../assets/cognitive.png"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"
import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { useEffect, useState } from "react"

export const Form = () => {
    const { id } = useParams()
    const [radio, setRadio] = useState(0)
    const [returnMessage, setReturnMessage] = useState(false)
    const [teamData, setTeamData] = useState([])

    const submitLoad = async () => {
        const data = {
            load: radio,
            teamId: id
        }
        return await api.post('/cognitiveloadmeter', data)
        .then(_ => setReturnMessage(true))
        .catch(error => console.log(error))
    }

    const loadTeamData = async () => {
        await api.get(`/teams/search/${id}`)
        .then(response => setTeamData(response.data))
        .catch(error => console.log(error))
    }

    useEffect(() => {
        loadTeamData()
    }, [])


    return(
        <Background>
            {!returnMessage && 
            <Container>
                <h1>Cognitive Loadometer - {teamData.name}</h1><br/>
                <img src={cognitive} width="500px" alt="Subjective Cognitive Load Scale"/>
                <RadioGroup row onChange={(e) => setRadio(e.target.value)}>
                    <FormControlLabel value="1" control={<Radio />} label="1"/>
                    <FormControlLabel value="2" control={<Radio />} label="2"/>
                    <FormControlLabel value="3" control={<Radio />} label="3"/>
                    <FormControlLabel value="4" control={<Radio />} label="4"/>
                    <FormControlLabel value="5" control={<Radio />} label="5"/>
                </RadioGroup>
                <button onClick={() => submitLoad()}>Submit</button>
            </Container>}

            {returnMessage && 
            <Container>
                <h1>Thanks for your experience!</h1>
                <h3>You can check the team info clicking <Link to={`/teams/${id}/info`}>here</Link></h3>
            </Container>}
        </Background>
    )
}