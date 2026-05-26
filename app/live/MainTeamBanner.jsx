import Games from "./data/games.json"
import RunnerInfo from "./data/runnerinfo_new.json"
import {Container, Row, Col} from "react-bootstrap"
import Image from "next/image"
import "./MainTeamBanner.css"

const MainTeamBanner = ({main, currRun}) => {

        const name = main.schedule.runs[currRun].name;
        console.log(main.schedule)
        let pronouns = RunnerInfo.find((runner) => runner.name == name).pronouns;
        if (pronouns === "") {
            pronouns = "None"
        }
        const pb = "2:17:00"
        let width = 0

        const gamesCompleted = Games.map((game) => {
                let src = "/logos/" + game[1] + ".png";
                if (game[0].includes('Mario')) {
                    width = 210
                } else {
                    width = 300
                }
                return <Col className={` ${main.team_color}`}
                            key={`team-${main.team_number}-${game[1]}`}>
                                <Image src={src} alt='Game logo' width={width} height={width}
                                       className={currRun > Games.indexOf(game) ? "complete" :
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
                            <p className="runner-info">PB: {pb}</p>
                        </Col>
                    </Row>
                    <Row className="flex flex-wrap items-center justify-center p-8 gap-4">
                        {gamesCompleted}
                    </Row>
                   <Row>
                        <Col className="flex justify-center">
                            <Image className={`${main.team_color} curr-game m-4 py-8`} 
                                   src={'/logos/' + Games[currRun][1] + '.png'} 
                                   alt='Current game logo'
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