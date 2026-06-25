import Games from "./data/games.json"
import RunnerInfo from "./data/runnerinfo_new.json"
import {Container, Row, Col} from "react-bootstrap"
import Image from "next/image"
import Link from "next/link"
import "./TeamBanner.css"
import {useSearchParams} from "next/navigation"

// Renders the given team's banner on the left side, displaying the team name, 
// current runner, pronouns (if given), the current game logo, and the team's emote as the background.
const TeamBanner = ({team, currRun, main, finished, progressPercent = 0}) => {
        
        const searchParams = useSearchParams();
        let url = new URLSearchParams(searchParams)
        if (!url.get('timer')) {
            url.append('timer', 'paused')
        }
        url.set('main', team.team_number);
        const name = team.schedule.runs[currRun].name;
        const pronouns = RunnerInfo.find((runner) => runner.name == name).pronouns;
        const progressWidth = `${Math.max(0, Math.min(100, Number(finished ? 100 : progressPercent) || 0))}%`;
        
        if (finished) {
            return (
                <Link href={{pathname: '/live', query: url.toString()}} className="finished" shallow replace>
                    <Container className="flex">
                        <Row className={`${team.team_number === main ? "main": ""} p-2 side-banner ${team.team_color}-banner`}
                            key={team.team_name}>
                            <Col className="banner-logo">
                                <Image className={team.team_color + ' curr-game'} 
                                    src={`/logos/${Games[currRun][1]}.png`} 
                                    alt={`${Games[currRun][0]} logo`}
                                    key={`team-${team.team_number}`}
                                    id={Games[currRun][1]}
                                    width={500} height={500}
                                    style={{float: 'left', width:'20%', margin:'1.5rem', display:'block'}} />
                            </Col>
                            <Col className="banner-text">
                                <p className="team-name">{team.team_name}</p>
                                <p className="runner-name">FINISHED!</p>
                            </Col>
                            <div className="team-progress-track" aria-hidden="true">
                                <div className="team-progress-fill" style={{width: progressWidth}} />
                            </div>

                        </Row>
                    </Container>
                </Link>
        )

        }
        return (
            <Link href={{pathname: '/live', query: url.toString()}} shallow replace>
                <Container className="flex">
                    <Row className={`${team.team_number === main ? "main": ""} p-2 side-banner ${team.team_color}-banner`}
                        key={team.team_name}>
                        <Col className="banner-logo">
                            <Image className={team.team_color + ' curr-game'} 
                                src={`/logos/${Games[currRun][1]}.png`} 
                                alt={`${Games[currRun][0]} logo`}
                                key={`team-${team.team_number}`}
                                id={Games[currRun][1]}
                                width={500} height={500}
                                style={{float: 'left', width:'20%', margin:'1.5rem', display:'block'}} />
                        </Col>
                        <Col className="banner-text">
                            <p className="team-name">{team.team_name}</p>
                            <p className="runner-name">{name}</p>
                            <p className="runner-pronouns"> {pronouns} </p>
                        </Col>
                        <div className="team-progress-track" aria-hidden="true">
                            <div className="team-progress-fill" style={{width: progressWidth}} />
                        </div>

                    </Row>
                </Container>
            </Link>

        )
};

export default TeamBanner;
