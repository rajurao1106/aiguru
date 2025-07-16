'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-col  ">
      <div className=" rounded-2xl p-10 max-w-2xl w-full text-center  ">
        <h1 className="text-4xl font-bold  mb-6">
          Welcome to <span className="text-blue-600">AI Guru</span>
        </h1>
        <p className=" text-base leading-relaxed">
          Empowering educators and learners through advanced AI solutions.
          <br />
          AI Guru delivers personalized learning paths, real-time academic assistance,
          and intelligent tools designed to streamline educational workflows and
          maximize outcomes.
        </p>
        
      </div>
      <Link href={'/create'} className="px-6  py-3 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition">
          <button className='flex justify-center items-center'><Plus/> Make Digital Notebook </button>
        </Link>
    </div>
  );
}
