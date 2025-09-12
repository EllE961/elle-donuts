'use client'

import { motion } from 'framer-motion'
import Reveal from './Reveal'
import SectionBackground from './SectionBackground'
import SectionDivider from './SectionDivider'

const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    text: 'The best donuts in Muscat! The Pistachio Drizzle is absolutely divine.',
    date: '2 weeks ago',
    accent: '#4FBF8F',
  },
  {
    id: 2,
    name: 'Ahmed K.',
    rating: 5,
    text: 'Saffron Gold is a masterpiece. Perfect blend of traditional and modern flavors.',
    date: '1 month ago',
    accent: '#FDB44E',
  },
  {
    id: 3,
    name: 'Fatima R.',
    rating: 5,
    text: 'Fresh, delicious, and beautifully presented. My go-to for special occasions!',
    date: '1 month ago',
    accent: '#FF8FA8',
  },
  {
    id: 4,
    name: 'Omar S.',
    rating: 5,
    text: 'Red Velvet is my favorite! Ordering process through WhatsApp is super convenient.',
    date: '2 months ago',
    accent: '#FF5C7C',
  },
  {
    id: 5,
    name: 'Layla B.',
    rating: 5,
    text: 'Quality ingredients and you can taste the difference. Worth every rial!',
    date: '2 months ago',
    accent: '#6366F1',
  },
  {
    id: 6,
    name: 'Hassan A.',
    rating: 5,
    text: 'The variety of flavors is amazing. Each one is unique and delicious!',
    date: '3 months ago',
    accent: '#F97316',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="relative section-padding overflow-visible">
      <SectionBackground variant="accent" />
      
      <div className="relative container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="font-display section-title gradient-text mb-6">
              Customer Love
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Join thousands of happy customers who have made our donuts part of their special moments
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.1}>
              <motion.div
                className="relative bg-surface rounded-24 p-6 shadow-soft hover:shadow-soft-lg transition-all overflow-hidden group"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Gradient accent border effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${review.accent}20 0%, transparent 100%)`,
                  }}
                />
                
                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, ${review.accent}, ${review.accent}80)`,
                  }}
                />
                
                <div className="relative">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        style={{ color: review.accent }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-muted mb-4 text-sm leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{review.name}</span>
                    <span className="text-xs text-muted/60">{review.date}</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}