import { useEffect, useState } from "react"
import api from "../../services/api"
import { Analytics } from "../analytics"
import { CircleChart } from "../circle chart";

export const ManageTeams = ({ userData }) => {
    const [teamsData, setTeamsData] = useState([])
    const [inputOpt, setInputOpt] = useState('')
    const [loadometerData, setLoadometerData] = useState([])

    const [findTeam, setFindTeam] = useState({})

    let data = []
    let categories = []

    const loadTeams = async () => {
        await api.get(`/teams/${userData?.user?.id}`, {
            headers: {
                Authorization: `Bearer ${userData?.token}`
            }
        }).then(response => setTeamsData(response.data)).catch(error => console.log(error))
    }

    const loadLoadometer = async (response) => {
        await api.get(`/cognitiveloadmeter/${response.id}`)
        .then(response => setLoadometerData(response.data))
        .catch(error => console.log(error))
    }

    useEffect(() => {
        loadTeams()
    }, [])

    let date = ''
    let loadometer = 0
    let mult = 0

    // PERCORRENDO O ARRAY
    for(let i = 0; i < loadometerData.length; i++) {
        loadometer = loadometer + loadometerData[i].load
        date = loadometerData[i].createdat
        mult++
        
        if (loadometerData[i+1]?.createdat !== date) {
            categories.push(loadometerData[i].createdat)
            loadometer = loadometer / mult
            data.push(loadometer.toFixed(2))
            loadometer = 0
            mult = 0
        }
    }

    const onSubmit = () => {
        const response = teamsData.find(team => team.name === inputOpt)
        setFindTeam(response)
        loadLoadometer(response)
    }

    return (
        <>
            <h3>Search by team name:</h3>
            <select onChange={(e) => setInputOpt(e.target.value)}>
                <option selected></option>
                {teamsData?.map(team => (
                    <option value={team.name} key={team.id}>{team.name}</option>
                )
                )}
            </select>
            <button onClick={() => onSubmit()}>Submit</button>
            <div>
                <h1>Total of Loads: {loadometerData.length}</h1>
                <h2>Average of Loads:</h2>
                <CircleChart loadometerData={loadometerData}/>
            </div>

            <Analytics data={data} categories={categories}/>
        </>
    )
}