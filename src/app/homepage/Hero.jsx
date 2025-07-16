import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };
  return (
    <section className="flex justify-center items-center bg-white">
      {/* Hero Section */}
      <div
        className=" py-16 md:py-24 text-left 
       flex items-center justify-center max-w-[1200px] max-lg:flex-col-reverse max-lg:text-center"
      >
        <div className="flex justify-center items-start flex-col max-lg:items-center">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight"
          >
            Transform Online Education with DigiNote’s Smart Learning Tools
          </motion.h1>
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Experience personalized learning with instant note generation, smart
            summaries, and AI-powered tools that save time, enhance
            understanding, and accelerate academic success. <br /> Instantly
            summarize YouTube videos, PDFs, audios. Create notes, and
            presentations. Supercharge your learning efficiency by 10x
          </motion.p>
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link href={'/create'} className="px-6  py-3 bg-blue-600 text-white rounded-lg text-base font-medium shadow hover:bg-blue-700 transition">
          <button className='flex justify-center items-center gap-1'><Plus/> Make Digital Notebook </button>
        </Link>
            {/* <a href="/ai-studytool">
              <button
                className="border-2 border-purple-700 text-purple-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-purple-700 hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Explore AI study tools"
              >
                Discover Tools
              </button>
            </a> */}
          </motion.div>
        </div>
        <Image
          src="/images/homepage/hero.png"
          alt="DigiNote Hero"
          width={630}
          height={475}
          className=""
        />
      </div>
    </section>
  );
}
