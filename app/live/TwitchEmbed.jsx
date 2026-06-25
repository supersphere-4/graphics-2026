import {Col, Row} from "react-bootstrap";
import Image from "next/image";
import RunnerInfo from "./data/runnerinfo_new.json"

// Displays the given team's small Twitch embed, or the team's emote in its place if the team is currently on the main stream.
const TwitchEmbed = ({team, main, currRun, finished}) => {

        const teamEmotePaths = [
            '/logos/team_emotes/rusty_bucket_babes.png',
            '/logos/team_emotes/grape_apes.png',
            '/logos/team_emotes/silly_willies.png',
            '/logos/team_emotes/peach_and_co.png',
            '/logos/team_emotes/mintallyinsane.png',
            '/logos/team_emotes/hot.png',
            '/logos/team_emotes/green_tea_m.png',
            '/logos/team_emotes/gaslight.png'
        ]

        const name = team.schedule.runs[currRun].name;
        const twitch = RunnerInfo.find((runner) => runner.name == name).twitch;
        const src = `https://player.twitch.tv/?channel=${twitch ?? name}&parent=${location.hostname}&autoplay=true&muted=true`;
        

        const scale = 1.
        const width = 640 * scale
        const height = 360 * scale

        if (team.team_number == main | finished) {
            return (
                    <Col className={`border-8 flex ${team.team_color} team-placeholder`} key={team.team_name}>
                        <Image className={`${team.team_color}`} 
                                src={teamEmotePaths[team.team_number - 1]} 
                                alt='1545 Team Logo' key={`team-${team.team_number}`} 
                                fill
                                style={{objectFit:"contain"}}
                              />
                    </Col>
        )}
        return (
                <Col className={`border-8 flex ${team.team_color} team-sub-stream`} key={team.team_name}>
                    <iframe src={src} width={width} height={height} id={`${team.team_color}-stream`}/>
                </Col>
        )
};

export default TwitchEmbed;