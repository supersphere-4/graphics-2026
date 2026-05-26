import Games from "./data/games.json"
import RunnerInfo from "./data/runnerinfo_new.json"
import {Container, Row, Col} from "react-bootstrap"
import Image from "next/image"
import Link from "next/link"
import "./TeamBanner.css"

const TeamBanner = ({team, currRun, main}) => {

        const name = team.schedule.runs[currRun].name;
        const pronouns = RunnerInfo.find((runner) => runner.name == name).pronouns;

        return (
            <Link href={`/live?main=${team.team_number}`}>
                <Container className="flex">
                    <Row className={`${team.team_number === main ? "main": ""} p-2 side-banner ${team.team_color}-banner`}
                        key={team.team_name}>
                        <Col>
                            <Image className={team.team_color + ' curr-game'} 
                                src={'/logos/' + Games[currRun][1] + '.png'} 
                                alt='Current game logo'
                                key={`team-${team.team_number}`}
                                id={Games[currRun][1]}
                                width={500} height={500}
                                style={{float: 'left', width:'20%', margin:'1.5rem', display:'block'}} />
                        </Col>
                        <Col>
                            <p className="team-name">{team.team_name}</p>
                            <p className="runner-name">{name}</p>
                            <p className="runner-pronouns"> {pronouns} </p>
                        </Col>

                    </Row>
                </Container>
            </Link>

        )
};

export default TeamBanner;