"use client"
import { motion } from 'framer-motion';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const Cards = ({card,index}) => {
  return (
    <>
      <Link href={"/orders"} className='min-w w-full md:col-span-4 custh' key={index}>
        <motion.div
          className="border-2 custh  rounded-2xl p-3 sm:px-8"
          key={index}
          initial={{ opacity: 0, y: 50 }}  // Start with opacity 0 and slightly below the final position
          whileInView={{ opacity: 1, y: 0 }}  // Fade in and slide to the final position
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}  // Stagger the animation
        >
          <div className="flex items-center justify-between gap-6 pt-6">
            <div className="flex flex-col gap-6">
              <p className="p1 text-grey">{card.title}</p>
              <h1 className="font-bold text-5xl">{card.count}</h1>
            </div>
            <div
              className="bg-no-repeat bg-cover bg-center w-77 w-[77] h-[77] flex justify-center items-center"
              style={{ backgroundImage: `url(${card.bg})` }}
            >
              <Image src={card.icon} width={index === 0 ? 39 : 60} height={39} alt="" />
            </div>
          </div>
          <div className="flex py-4 pe-14 items-center gap-4 flex-wrap">
            <Image src={card.statusIcon} width={12} height={12} alt={card.title} />
            <span className="text-primary">8.5%</span>
            <p className="p11 text-grey">{card.time}</p>
          </div>
        </motion.div>
      </Link>
    </>
  )
}

export default Cards
