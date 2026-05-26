import Teams from "./live/data/placeholderrelaydata.json";
import Image from "next/image";
import Link from "next/link";
import Games from "./live/data/games.json";

export default function Home() {

  const main_stream_links = Teams.map((team) => {
      return (           
        <Link
            className={`rounded-full border border-solid transition-colors flex items-center justify-center bg-black text-background gap-4 hover:bg-[#ff0000] text-[64px] h-20 sm:h-40 px-5 sm:px-20 sm:w-auto front-page`}
            href={{
              pathname:'/live',
              query: {main: team.number}
            }}
            target="_blank"
            rel="noopener noreferrer"
            key={`team-${team.number}`}
        >
            {team.name}
        </Link>
      )
    }
  )

  return (
    <div className="grid grid-rows-[10px_6fr_10px] items-center justify-items-center min-h-screen p-12 pb-30 gap-16 sm:p-40">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          className="m-4"
          src="/logos/1545.png"
          alt="1545 logo"
          width={1200}
          height={1200}
          priority
        />
        <div className="flex gap-8 m-4 items-center flex-row">
          {main_stream_links}
        </div>
      </main>
      <div className="row-start-4 flex gap-[32px] pb-32 flex-wrap items-center justify-center">
        {Games.map((game) => <Image src={`/logos/${game[1]}.png`} alt='Game logo' width={360} height={360} key={`logo-${game[1]}`}/>)}
      </div>
    </div>
  );
}
