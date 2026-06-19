import RunnerInfo from "./data/runnerinfo_new.json"

const MainTwitchEmbed = ({ main, currRun}) => {

    const name = main.schedule.runs[currRun].name;
    const scale = 5.;
    const width = 640 * scale;
    const height = 360 * scale;
    let src = "https://player.twitch.tv/?channel=" + main.schedule.runs[currRun].name + "&parent=localhost&muted=false";
    const twitch = RunnerInfo.find((runner) => runner.name == name).twitch;
    if (twitch) {
        src = "https://player.twitch.tv/?channel=" + twitch + "&parent=localhost&autoplay=true&muted=true";
    }

    return (
        <iframe src={src} width={width} height={height} id={`${main.team_color}-stream`}/>
    )
};

export default MainTwitchEmbed;