'use client';
import Teams from "./live/data/placeholderrelaydata.json";
import Image from "next/image";
import Link from "next/link";
import {useState, useEffect} from "react";

export default async function Home() {

  const main_stream_links = Teams.map((team) => {
      return (           
        <Link
            className={`rounded-full border border-solid transition-colors flex items-center justify-center bg-black text-background gap-4 hover:bg-[#ff0000] dark:hover:bg-[${team.color}] text-[64px] h-20 sm:h-40 px-5 sm:px-20 sm:w-auto`}
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
        <div className="flex gap-4 items-center flex-row">
          {main_stream_links}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[32px] pb-16 flex-wrap items-center justify-center">
        <Image src='/logos/sm64.png' alt='no' width={300} height={300}/>
        <Image src='/logos/sms.png' alt='no' width={300} height={300}/>
        <Image src='/logos/smg1.png' alt='no' width={300} height={300}/>
        <Image src='/logos/smg2.png' alt='no' width={300} height={300}/>
        <Image src='/logos/bk.png' alt='no' width={300} height={300}/>
        <Image src='/logos/bt.png' alt='no' width={300} height={300}/>
        <Image src='/logos/dk64.png' alt='no' width={300} height={300}/>
        <Image src='/logos/c1.png' alt='no' width={300} height={300}/>
        <Image src='/logos/c2.png' alt='no' width={300} height={300}/>
        <Image src='/logos/c3.png' alt='no' width={300} height={300}/>
        <Image src='/logos/s1.png' alt='no' width={300} height={300}/>
        <Image src='/logos/s2.png' alt='no' width={300} height={300}/>
        <Image src='/logos/s3.png' alt='no' width={300} height={300}/>
      </footer>
    </div>
  );
}
