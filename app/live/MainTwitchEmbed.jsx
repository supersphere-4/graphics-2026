import RunnerInfo from "./data/runnerinfo_new.json"

// The main team's Twitch Embed, occupying the top center of the viewport.
const MainTwitchEmbed = ({main, currRun}) => {

    const name = main.schedule.runs[currRun].name;
    const twitch = RunnerInfo.find((runner) => runner.name == name).twitch;
    const scale = 5.;
    const width = 640 * scale;
    const height = 360 * scale;
    const src = `https://player.twitch.tv/?channel=${twitch ?? name}&parent=${location.hostname}&autoplay=true&muted=false`;

    return (
        <iframe src={src} width={width} height={height} id={`${main.team_color}-stream`} allow="autoplay; fullscreen"/>
    )
};

export default MainTwitchEmbed;
