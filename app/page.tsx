'use client'
import Teams from "./live/data/teams_new.json";
import Image from "next/image";
import Link from "next/link";
import Games from "./live/data/games.json";
import { useEffect, useState } from "react";
import { Col, Button } from "react-bootstrap";

export default function Home() {

  const [currRuns, setCurrRuns] = useState([1, 1, 1, 1, 
                                            1, 1, 1, 1]);

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

  const main_stream_links = Teams.map((team) => {
      let currRun = currRuns[team.team_number - 1]
      return (           
        <Link
            className={`border ${team.team_color} border-solid transition-colors flex flex-wrap items-center justify-center bg-black text-background p-8 hover:bg-[#ff0000] front-page`}
            href={{
              pathname:'/live',
              query: {
                        main: team.team_number,
                        currRuns: currRuns
                     }
            }}
            target="_blank"
            rel="noopener noreferrer"
            key={`team-${team.team_number}`}
        >
            <Image src={`${teamEmotePaths[team.team_number - 1]}`} alt={`${team.team_name} logo`} width={300} height={300}/>
            <Image src={`/logos/${Games[team.schedule.run_order[currRun - 1]][1]}.png`} alt={`${Games[team.schedule.run_order[currRun - 1]][0]} logo`} width={200} height={200}/>
        </Link>
      )
    }
  )

  function handleSwitchRuns(team : any, index : number) {
    console.log("Current Run:" + team.schedule.run_order[index + 1])
    setCurrRuns(currRuns.with(team.team_number - 1, index + 1))
  }

  const team_control = Teams.map((team) => {

        const run_order = team.schedule.run_order;
        const run_order_slice = run_order.slice(0, currRuns[team.team_number - 1])
        let games = Games;
        games = games.toSorted((a, b) => run_order.indexOf(Number(a[2])) - run_order.indexOf(Number(b[2])))
        console.log(games)
        return (
            <Col className={`flex flex-wrap items-center justify-center border ${team.team_color}`}>
                {games.map((game) => 
                <Button className="team-control m-8" onClick={(e) => handleSwitchRuns(team, run_order.indexOf(Number(game[2])))} key={`${team.team_color}-button-${game[2]}`}>
                    <Image className={run_order_slice.includes(Number(game[2])) ? 'running' : 'not-running'}
                        src={`/logos/${game[1]}.png`}
                        alt={`${game[0]} logo`}
                        id={`${game[1]}`}
                        width={300} height={300}
                        key={`logo-${game[1]}`}
                    />
                </Button>
                )}
            </Col>
            
        )})

  return (
    <div className="grid grid-rows-[10px_6fr_10px] items-center justify-items-center min-h-screen p-12 gap-16 sm:p-30">
      <main className="flex flex-col gap-[24px] row-start-2 items-center">
        <Image
          className="m-4"
          src="/logos/1545.png"
          alt="1545 logo"
          width={1000}
          height={1000}
          priority
        />
        <div className="flex gap-8 m-12 items-center flex-row">
          {main_stream_links}
        </div>
        <div className="flex gap-4 m-24 items-center flex-row">
          {team_control}
        </div>
      </main>
      <div className="row-start-4 flex gap-16 py-12 items-center justify-center">
        {Games.map((game) => <Image src={`/logos/${game[1]}.png`} alt={`${game[0]} logo`} width={300} height={300} key={`logo-${game[1]}`}/>)}
      </div>
    </div>
  );
}
