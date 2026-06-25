"use client"

import Games from "./data/games.json"
import {Container} from "react-bootstrap"
import Image from "next/image"
import "./MainTeamBanner.css"
import {useCallback, useLayoutEffect, useRef, useState} from "react"

const AutoFitText = ({children, className, maxSize, minSize = 14}) => {
        const textRef = useRef(null);
        const [fontSize, setFontSize] = useState(maxSize);

        const fitText = useCallback(() => {
                const text = textRef.current;
                if (!text) return;

                let low = minSize;
                let high = maxSize;
                let best = minSize;

                while (low <= high) {
                        const nextSize = Math.floor((low + high) / 2);
                        text.style.fontSize = `${nextSize}px`;

                        if (text.scrollWidth <= text.clientWidth) {
                                best = nextSize;
                                low = nextSize + 1;
                        } else {
                                high = nextSize - 1;
                        }
                }

                text.style.fontSize = `${best}px`;
                setFontSize(best);
        }, [maxSize, minSize]);

        useLayoutEffect(() => {
                fitText();

                const text = textRef.current;
                if (!text) return;

                const observer = new ResizeObserver(fitText);
                observer.observe(text);

                return () => observer.disconnect();
        }, [children, fitText]);

        return (
                <p className={className} ref={textRef} style={{fontSize}}>
                        {children}
                </p>
        )
}

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
                        <AutoFitText className="team-name" maxSize={64} minSize={28}>{main.team_name}</AutoFitText>
                        <AutoFitText className="runner-name" maxSize={52} minSize={24}>{name}</AutoFitText>
                        <AutoFitText className="runner-info" maxSize={40} minSize={20}>{run_info}</AutoFitText>
                    </div>
                    <div className="main-games-strip">
                        {gamesCompleted}
                    </div>

                </Container>

        )
};

export default MainTeamBanner;
