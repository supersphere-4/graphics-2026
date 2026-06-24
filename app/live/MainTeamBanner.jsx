import Games from "./data/games.json"
import {Container} from "react-bootstrap"
import Image from "next/image"
import "./MainTeamBanner.css"

// Displays the lower banner for the main team.
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

        const gamesCompleted = Games.map((game) => {
                let src = "/logos/" + game[1] + ".png";
                return <div className={`main-game-mark ${main.team_color}`}
                            key={`team-${main.team_number}-${game[1]}`}>
                                <Image src={src} alt={`${game[0]} logo`} width={160} height={90}
                                       className={run_order.includes(Games.indexOf(game)) ? "complete" :
                                                           currRun == Games.indexOf(game) ? "in-progress" : "incomplete"}/>
                       </div>
            }
    )

        return (
                <Container className={`main-banner ${main.team_color}-banner ${main.team_color}`}
                     key={main.team_name}
                >
                    <div className="main-text">
                        <p className="team-name">{main.team_name}</p>
                        <p className="runner-name">{name}</p>
                        <p className="runner-info">{run_info}</p>
                    </div>
                    <div className="main-games-strip">
                        {gamesCompleted}
                    </div>

                </Container>

        )
};

export default MainTeamBanner;
