'use client'

import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { BRAND } from '@/lib/brand'
import SectionBackground from './SectionBackground'
import SectionDivider from './SectionDivider'

export default function Story() {
  return (
    <section id="story" className="relative section-padding overflow-visible">
      <SectionBackground variant="default" />
      
      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-display section-title gradient-text text-center mb-12 sm:mb-16">
              Our Story
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <p className="text-base sm:text-lg text-muted leading-relaxed">
                  Born from a passion for exceptional desserts, {BRAND.name} began as a dream 
                  to bring artisanal donuts to Oman. Every morning, our skilled bakers wake 
                  before dawn to craft each donut with love and precision.
                </p>
                <p className="text-base sm:text-lg text-muted leading-relaxed">
                  We believe in using only the finest ingredients - from premium Belgian 
                  chocolate to fresh local dairy. Our unique flavors like Saffron Gold pay 
                  homage to Oman&apos;s rich culinary heritage while embracing international tastes.
                </p>
                <p className="text-base sm:text-lg text-muted leading-relaxed">
                  What started in a small kitchen has grown into a beloved brand, but our 
                  commitment remains the same: to create moments of joy, one donut at a time.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-24 p-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-ink mb-2">100%</div>
                  <div className="text-sm text-muted">Fresh Daily</div>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-24 p-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-ink mb-2">9+</div>
                  <div className="text-sm text-muted">Unique Flavors</div>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-green-100 to-blue-100 rounded-24 p-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-ink mb-2">Premium</div>
                  <div className="text-sm text-muted">Ingredients</div>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-24 p-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-ink mb-2">Made</div>
                  <div className="text-sm text-muted">With Love</div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}