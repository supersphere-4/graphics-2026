import Games from "./data/games.json"
import RunnerInfo from "./data/runnerinfo_new.json"
import {Container, Row, Col} from "react-bootstrap"
import Image from "next/image"
import "./MainTeamBanner.css"

// Displays the side panel to the right of the main stream.
// Contains the team's name, current runner, and either:
// Personal Best, if the runner's PB hasn't changed since submissions
// Submission PB, Current PB, League Points, if the runner's PB has changed since submissions
const MainTeamBanner = ({main, currRun, runsCompleted, info}) => {

        const name = main.schedule.runs[currRun].name;
        const run_order = main.schedule.run_order.slice(0, runsCompleted);
        const pb = main.schedule.runs[currRun].submission_pb;
        const final_pb = (main.schedule.runs[currRun].final_pb);
        const lp = (main.schedule.runs[currRun].lp);
        const run_info = (final_pb ? ["Submission PB: " + pb,"Current PB: " + final_pb,"League Points: " + lp][info % 3] : "PB: " + pb)

        let width;
        const gamesCompleted = Games.map((game) => {
                let src = "/logos/" + game[1] + ".png";
                if (game[0].includes('Mario')) {
                    width = 210
                } else {
                    width = 300
                }
                return <Col className={` ${main.team_color}`}
                            key={`team-${main.team_number}-${game[1]}`}>
                                <Image src={src} alt={`${game[0]} logo`} width={width} height={width}
                                       className={run_order.includes(Games.indexOf(game)) ? "complete" :
                                                           currRun == Games.indexOf(game) ? "in-progress" : "incomplete"}/>
                       </Col>
            }
    )

        return (
                <Container className={`main-banner ${main.team_color}-banner ${main.team_color}`}
                     key={main.team_name}
                >
                    <Row className="main-text">
                        <Col>
                            <p className="team-name">{main.team_name}</p>
                            <p className="runner-name">{name}</p>
                            <p className="runner-info">{run_info}</p>
                        </Col>
                    </Row>
                    <Row className="flex flex-wrap items-center justify-center p-8 gap-4">
                        {gamesCompleted}
                    </Row>
                   <Row>
                        <Col className="flex justify-center">
                            <Image className={`${main.team_color} curr-game m-4 py-8`} 
                                   src={'/logos/' + Games[currRun][1] + '.png'} 
                                   alt={`${Games[currRun][0]} logo`}
                                   key={`team-${main.team_number}-${Games[currRun][1]}`}
                                   id={Games[currRun][1]}
                                   width={500}
                                   height={500}

                            />
                        </Col>
                    </Row>

                </Container>

        )
};

export default MainTeamBanner;