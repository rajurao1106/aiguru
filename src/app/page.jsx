'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-col px-4 py-10">
      <div className=" rounded-2xl w-full text-center  ">
        <h1 className="text-4xl font-bold  mb-6">
          Welcome To The <br className='hidden max-lg:block'/> <span className="text-blue-500">AI Guru</span>
        </h1>
        <p className=" text-base leading-relaxed mb-8">
          Empowering educators and learners through advanced AI solutions.
          <br />
          AI Guru delivers personalized learning paths, real-time academic assistance,
          and intelligent tools designed to streamline educational workflows and
          maximize outcomes.
        </p>
        
      </div>
      <Link href={'/create'} className="px-6  py-3 bg-blue-600 text-white rounded-lg text-base font-medium shadow hover:bg-blue-700 transition">
          <button className='flex justify-center items-center gap-1'><Plus/> Make Digital Notebook </button>
        </Link>
    </div>
  );
}
