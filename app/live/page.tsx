'use client'
import Image from "next/image";
import TwitchEmbed from "./TwitchEmbed";
import MainTwitchEmbed from "./MainTwitchEmbed"
import MainTeamBanner from "./MainTeamBanner";
import {useIntervalAdvanced} from "./UseIntervalAdvanced"
import TeamBanner from "./TeamBanner"
import Teams from "./data/teams_new.json"
import Games from "./data/games.json"
import { Suspense, useState } from 'react'
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSearchParams, useRouter } from 'next/navigation'

function LiveContent() {

    const params = useSearchParams();
    const main = Number(params.get("main") ?? 1) || 1
    const main_team = Teams.find((team) => team.team_number == main)
    const initialRuns = params.getAll("currRuns").map((e) => Number(e));
    const [currRuns, setCurrRuns] = useState(initialRuns.length === Teams.length ? initialRuns : new Array(Teams.length).fill(1));
    const [teamStatus, setTeamStatus] = useState(new Array(8).fill('in progress'))
    const [numTeamsFinished, setNumTeamsFinished] = useState(0);
    const [now, setNow] = useState(0);
    const [runStartTimes, setRunStartTimes] = useState(new Array(Teams.length).fill(0));

    function parseRunTimeToSeconds(time : string | undefined) {
        if (!time) return 0;

        const cleanTime = time.trim().replace(/[^\d:.]/g, "");
        if (!cleanTime) return 0;

        const parts = cleanTime.split(":").map((part) => Number(part));
        if (parts.some((part) => Number.isNaN(part))) return 0;

        return parts.reduce((total, part) => total * 60 + part, 0);
    }

    function getSelectedRun(team : any) {
        return team.schedule.run_order[currRuns[team.team_number - 1] - 1] ?? team.schedule.run_order[0];
    }

    function getTeamProgressPercent(team : any) {
        if (isTeamFinished(team.team_number)) return 100;

        const run = team.schedule.runs[getSelectedRun(team)];
        const targetSeconds = parseRunTimeToSeconds(run?.final_pb ?? run?.submission_pb);
        const startTime = runStartTimes[team.team_number - 1];
        if (!now || !startTime || !targetSeconds) return 0;

        return Math.min(100, Math.max(0, ((now - startTime) / 1000 / targetSeconds) * 100));
    }

    function restartTeamProgress(team : any) {
        const currentTime = Date.now();
        setNow(currentTime);
        setRunStartTimes((prevStarts) => prevStarts.with(team.team_number - 1, currentTime));
    }

    // Code for displaying the small Twitch embeds below the main stream.
    const sub_streams = Teams.map((team) => {
        return (<TwitchEmbed team={team}
                             main={main}
                             currRun={team.schedule.run_order[currRuns[team.team_number - 1] - 1] | team.schedule.run_order[-1]} 
                             key={`team-${team.team_number}-mini`}
                             finished={isTeamFinished(team.team_number)}/>
        )
    })
    // Code for displaying the team banners on the left side.
    const banners = Teams.map((team) =>{
            return <TeamBanner main={main}
                        team={team} 
                        currRun={team.schedule.run_order[currRuns[team.team_number - 1] - 1] | team.schedule.run_order[-1]} 
                        key={`team-${team.team_number}-banner`}
                        finished={isTeamFinished(team.team_number)}
                        progressPercent={getTeamProgressPercent(team)}
                        />
    })

    const router = useRouter()
    const rate = 7.5; // The rate at which streams rotate in minutes, and the rate at which info in the main team's side panel rotates in seconds.
    const [time, setTime] = useState(main);
    const [info, setInfo] = useState(0);

    // Code for handling whether the given team is on their last run, finished, or simply in progress.
    function handleSwitchRuns(team : any, index : number) {
        if (index == 12) {
            console.log("Team: " + team.team_name)
            console.log("LAST RUN!")
            console.log("Closing Run: " + Games[team.schedule.run_order[12]][0])
            console.log("Closing Runner: " +  team.schedule.runs[12].name)
            setTeamStatus(teamStatus.with(team.team_number - 1, 'last run'))
            setCurrRuns(currRuns.with(team.team_number - 1, index + 1))
            restartTeamProgress(team)
        } else if (index < 13) {
            console.log("Team: " + team.team_name)
            console.log("Current Run: " + Games[team.schedule.run_order[index]][0])
            console.log("Runner:" +  team.schedule.runs[index].name)
            setCurrRuns(currRuns.with(team.team_number - 1, index + 1))
            setTeamStatus(teamStatus.with(team.team_number - 1, 'in progress'))
            restartTeamProgress(team)
        } else {
            console.log("Team: " + team.team_name)
            console.log("FINISHED!")
            console.log("Closing Run: " + Games[team.schedule.run_order[12]][0])
            console.log("Closing Runner: " +  team.schedule.runs[12].name)
            setTeamStatus(teamStatus.with(team.team_number - 1, 'finished'))
        }

    }

    // The default timer for switching streams. Disabled after a manual switch or when there is only one team remaining.
    useIntervalAdvanced(() => {
        setTime(prevTime => prevTime + 1);
        let newMain = time % 8 + 1;
        let i = 0;
        while (isTeamFinished(newMain)) {
            setTime(prevTime => prevTime + 1);
            newMain = newMain++ % 8 + 1;
            i++;
        }
        i = 0;
        let newQuery = '/live?main=' + newMain + currRuns.map((e) => '&currRuns=' + e);
        newQuery = newQuery.replaceAll(',','')
        router.replace(newQuery)
        console.log("Time: " + time)
        }, {delay: rate * 1000 * 60, enabled: teamStatus.filter((status) => status !== 'finished').length > 1 && !params.get("timer")})

    // The alternate timer for switching streams. Enabled after a manual switch. The main stream takes twice as long to cycle than the default timer.
    useIntervalAdvanced(() => {
        setTime(prevTime => prevTime + 1);
        let newMain = time % 8 + 1;
        let i = 0;
        while (isTeamFinished(newMain)) {
            setTime(prevTime => prevTime + 1);
            newMain = newMain++ % 8 + 1;
            i++;
        }
        i = 0;
        let newQuery = '/live?main=' + newMain + currRuns.map((e) => '&currRuns=' + e);
        newQuery = newQuery.replaceAll(',','')
        router.replace(newQuery)
        console.log("Time: " + time)
        }, {delay: rate * 2 * 1000 * 60, enabled: teamStatus.filter((status) => status !== 'finished').length > 1 && params.get("timer")})
    
    // The timer for cycling between info on the side panel.
    useIntervalAdvanced(() => {setInfo(prevTime => prevTime + 1)}, {delay: rate * 1000})

    // Keeps banner progress bars moving and initializes their clock when the page loads.
    useIntervalAdvanced(() => {
        const currentTime = Date.now();
        setNow(currentTime);
        setRunStartTimes((prevStarts) => (
            prevStarts.every((start) => start) ? prevStarts : prevStarts.map((start) => start || currentTime)
        ));
    }, {delay: 1000, fireOnMount: true})
    
    // Checks if the given team has finished.
    function isTeamFinished(team_number : number) {
        return teamStatus[team_number - 1] === 'finished';
    }

    // Restores a finished team to their last run so they can be shown and controlled again.
    function undoFinishTeam(team : any) {
        setTeamStatus(teamStatus.with(team.team_number - 1, 'last run'))
        setCurrRuns(currRuns.with(team.team_number - 1, team.schedule.run_order.length))
        restartTeamProgress(team)
    }

    // Code for refreshing the given team's Twitch embed.
    function refreshStream(team : any) {
        let stream = document.getElementById(`${team.team_color}-stream`) as HTMLIFrameElement;
        if (stream) {
            stream.src = stream.src;
        }
    }

    // Opens Twitch as a top-level page so Twitch can set login/Turbo cookies for this browser profile.
    function openTwitchLogin() {
        const loginWindow = window.open("https://www.twitch.tv/login", "twitch-login", "popup,width=1100,height=800");
        loginWindow?.focus();
    }

    // Refreshes every Twitch iframe after logging into Twitch in the popup.
    function refreshTwitchEmbeds() {
        document.querySelectorAll("iframe[id$='-stream']").forEach((stream) => {
            const iframe = stream as HTMLIFrameElement;
            iframe.src = iframe.src;
        })
    }

    // Switches the selected team to the main stream and pauses automatic rotation.
    function switchTeamToMain(team : any) {
        const runQuery = currRuns.map((run) => `&currRuns=${run}`).join("");
        const timerQuery = `&timer=${params.get("timer") ?? "paused"}`;
        setTime(team.team_number);
        router.replace(`/live?main=${team.team_number}${runQuery}${timerQuery}`)
    }

    // Code for handing switching between each team's respective runs.
    const team_control = Teams.map((team) => {

        const run_order = team.schedule.run_order;
        const run_order_slice = run_order.slice(0, currRuns[team.team_number - 1])
        let games = Games;
        games = games.toSorted((a, b) => run_order.indexOf(Number(a[2])) - run_order.indexOf(Number(b[2])))
        return (
            <Col className={`flex flex-wrap items-center justify-center border ${team.team_color}`}>
                {games.map 
                    ((game) => 
                        <Button className="team-control m-8"
                                disabled={isTeamFinished(team.team_number)}
                                onClick={(e) => handleSwitchRuns(team, run_order.indexOf(Number(game[2])))}
                                key={`${team.team_color}-button-${game[2]}`}>
                            <Image className={run_order_slice.includes(Number(game[2])) ? 'running' : 'not-running'}
                                src={`/logos/${game[1]}.png`}
                                alt={`${game[0]} logo`}
                                id={`${game[1]}`}
                                width={300} height={300}
                                key={`logo-${game[1]}`}
                            />
                        </Button>
                    )
                }
                <Button className={`team-control border-8 m-8 px-8 finish-button ${team.team_color}`} disabled={teamStatus[team.team_number - 1] !== 'last run'} onClick={(e) => {handleSwitchRuns(team, 13); console.log(teamStatus)}} >
                    {teamStatus[team.team_number - 1] === 'finished' ? "FINISHED!" : `GAME ${currRuns[team.team_number - 1]}`}
                </Button>
                <Button className={`team-control border-8 m-8 px-8 undo-finish-button ${team.team_color}`} disabled={!isTeamFinished(team.team_number)} onClick={(e) => {undoFinishTeam(team)}} >
                    Undo Finish
                </Button>
                <Button className={`team-control border-8 m-8 px-8 refresh-button ${team.team_color}`} disabled={teamStatus[team.team_number - 1] === 'finished'} onClick={(e) => {refreshStream(team)}} >
                    Refresh
                </Button>
                <Button className={`team-control border-8 m-8 px-8 main-switch-button ${team.team_color}`} disabled={isTeamFinished(team.team_number) || team.team_number === main} onClick={(e) => {switchTeamToMain(team)}} >
                    {team.team_number === main ? "On Main" : "Main"}
                </Button>
            </Col>
            
        )})

    return (
        <Container className="page-feed" fluid>
            <video className="background-loop" autoPlay loop muted playsInline aria-hidden="true">
                <source src="/animated-background-loop-grayscale.mp4" type="video/mp4" />
            </video>
            <div className={`background-tint background-tint-${main_team?.team_color ?? "rust"}`} aria-hidden="true" />
            <div className="broadcast-layout">
                <aside className="side-rail">
                    <div className="side-banners-panel" key={'team-banners'}>
                        {banners}
                    </div>
                    <div className={`livesplit-slot ${main_team?.team_color}`} />
                    <div className="broadcast-logo">
                        <Image src="/logos/1545.png" alt="The 1545 logo" width={400} height={160} priority/>
                    </div>
                </aside>
                <main className={`main-stream border-8 ${main_team?.team_color} flex`} key={`${main_team?.team_color}-video-main`}>
                    <MainTwitchEmbed main={main_team} currRun={Teams[main - 1].schedule.run_order[currRuns[Teams[main - 1].team_number - 1] - 1]} />
                </main>
                <section className={`main-info-panel border-8 ${main_team?.team_color} flex`} key={`${main_team?.team_name} stats`}>
                    <MainTeamBanner main={main_team} currRun={Teams[main - 1].schedule.run_order[currRuns[Teams[main - 1].team_number - 1] - 1]} runsCompleted={currRuns[Teams[main - 1].team_number - 1] - 1} info={info}/>
                </section>
                <section className="live-sub-streams">
                    {sub_streams}
                </section>
            </div>
            <Row className="team-controls">
                {team_control}
                <div className="twitch-login-controls">
                    <Button className="twitch-login-button" onClick={openTwitchLogin}>
                        Log in to Twitch
                    </Button>
                    <Button className="twitch-refresh-button" onClick={refreshTwitchEmbeds}>
                        Refresh Twitch Embeds
                    </Button>
                </div>
            </Row>
        </Container>
    )
}

export default function Live() {
    return (
        <Suspense fallback={<div className="flex flex-col gap-[32px] row-start-2 items-center"><Image className="m-4" src="/logos/1545.png" alt="1545 logo" width={1000} height={1000} priority/></div>}>
            <LiveContent />
        </Suspense>
    )
}
