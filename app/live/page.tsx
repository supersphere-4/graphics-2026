'use client'
import Image from "next/image";
import TwitchEmbed from "./TwitchEmbed";
import MainTwitchEmbed from "./MainTwitchEmbed"
import MainTeamBanner from "./MainTeamBanner";
import TeamBanner from "./TeamBanner"
import Teams from "./data/teams_new.json"
import { Suspense } from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from 'next/navigation'

type SearchParams = {
    searchParams?: Promise<Record<string, string>>
}

export default function Live({searchParams} : SearchParams) {

    const params = useSearchParams();
    // const router = useRouter();
    console.log("search params: " + params.get("main"))
    const main = Number(params.get("main"))
    const main_team = Teams.find((team) => team.team_number == main)
    const currRuns = [6, 5, 7, 2, 0, 11, 10, 1]
    const sub_streams = Teams.map((team) => {
        return (<TwitchEmbed team={team}
                             main={main}
                             currRun={currRuns[team.team_number - 1]} 
                             key={`team-${team.team_number}-mini`}/>
        )
    })

    const banners = Teams.map((team) =>{
            return <TeamBanner main={main}
                        team={team} 
                        currRun={currRuns[team.team_number - 1]} 
                        key={`team-${team.team_number}-banner`}
                        />
    })

    return (
    <Suspense fallback={<div className="flex flex-col gap-[32px] row-start-2 items-center"><Image className="m-4" src="/logos/1545.png" alt="1545 logo" width={1000} height={1000} priority/></div>}>
        <Container className="page-feed" fluid>
            <Row className="flex m-4">
                <Col className="m-4 border-8" style={{borderColor:"transparent"}}>
                    {banners}
                </Col>
                <Col className={`m-4 main-stream border-8 ${main_team?.team_color} flex`} key={`${main_team?.team_color}-video-main`}>
                    <MainTwitchEmbed main={main_team} currRun={currRuns[Teams[main - 1].team_number - 1]} />
                    </Col>
                <Col className={`m-4 border-8 ${main_team?.team_color} flex`} key={`${main_team?.team_name} stats`}>
                    <MainTeamBanner main={main_team} currRun={currRuns[Teams[main - 1].team_number - 1]}/>
                </Col>
            </Row>
            <Row className="my-40 flex flex-wrap sub-streams justify-center gap-36">
                {sub_streams.slice(0, 4)}
            </Row>
            <Row className="my-40 flex flex-wrap sub-streams items-center justify-center gap-36">
                {sub_streams.slice(-4)}
            </Row>
        </Container>
    </Suspense>
    )
}