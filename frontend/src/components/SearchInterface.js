"use client";

import { Search, Utensils, Zap, ChefHat, Sparkles, Loader2, X, Clock, Scale, Flame, Droplets, Dumbbell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function SearchInterface({ initialResults = [] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(initialResults)
  const [chefRecommendation, setChefRecommendation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        setChefRecommendation(data.chefRecommendation || '')
      } else {
        setError(data.error || 'Something went wrong')
        setResults([])
        setChefRecommendation('')
      }
    } catch (err) {
      setError('Could not reach server')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getNutrient = (text, type) => {
    const regex = new RegExp(`(\\d+\\.?\\d*)\\s*g?\\s*${type}`, 'i')
    const match = text.match(regex)
    return match ? match[1] : '--'
  }

  const cleanTitle = (title) => {
    return title.split(':')[0].replace(/#\d+/g, '').trim()
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl glass flex items-center p-2 pl-6 gap-4 shadow-2xl">
        <Search className="text-slate-500" size={24} />
        <input 
          type="text" 
          placeholder="High protein snacks, keto ideas, or specific ingredients..."
          className="flex-1 bg-transparent border-none text-white text-lg focus:outline-none placeholder:text-slate-600"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-food-accent text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2 shadow-lg shadow-orange-500/20 relative overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" size={20} />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Finding Food...
              </motion.span>
            </div>
          ) : 'Find Food'}
        </button>
      </form>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chef's Recommendation (BART) */}
      <AnimatePresence mode="wait">
        {chefRecommendation && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl bg-orange-500/5 border border-orange-500/10 rounded-3xl p-6 flex items-start gap-4 shadow-xl"
          >
            <div className="bg-food-accent/20 p-3 rounded-2xl text-food-accent mt-1">
              <ChefHat size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xs font-black text-food-accent uppercase tracking-[0.2em]">Chef's Recommendation</h4>
                <Sparkles size={14} className="text-orange-300" />
              </div>
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "{chefRecommendation}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <AnimatePresence>
          {loading && [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`skeleton-${i}`} className="glass p-6 flex flex-col gap-4 h-64 animate-pulse">
              <div className="flex justify-between">
                <div className="bg-white/5 w-20 h-6 rounded-full"></div>
                <div className="bg-white/5 w-6 h-6 rounded-full"></div>
              </div>
              <div className="bg-white/5 w-3/4 h-8 mt-2 rounded-lg"></div>
              <div className="bg-white/5 w-full h-12 mt-2 rounded-lg"></div>
              <div className="flex gap-2 mt-auto">
                <div className="bg-white/5 w-16 h-6 rounded-md"></div>
                <div className="bg-white/5 w-12 h-6 rounded-md"></div>
              </div>
            </div>
          ))}

          {!loading && results.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass glass-hover p-6 flex flex-col gap-4 cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex justify-between items-center">
                <div className="bg-orange-500/10 text-food-accent border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap size={12} fill="currentColor" />
                  {Math.round(item.confidence * 100)}% Match
                </div>
                <ChefHat className="text-slate-600 group-hover:text-food-accent transition-colors" size={20} />
              </div>
              
              <h3 className="text-xl font-bold leading-tight line-clamp-2">
                {cleanTitle(item.text)}
              </h3>
              
              <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                {item.text.split(':')[1]?.split('. Ingredients')[0]}
              </p>
              
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                  <Flame size={12} className="text-orange-500/50" />
                  {getNutrient(item.text, 'kcal')} kcal
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                  <Dumbbell size={12} className="text-blue-500/50" />
                  {getNutrient(item.text, 'protein')}g protein
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-3xl glass max-h-[90vh] overflow-y-auto relative p-8 md:p-12 flex flex-col gap-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-slate-400 hover:text-white"
                onClick={() => setSelectedItem(null)}
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="bg-orange-500/10 text-food-accent border border-orange-500/20 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 w-fit uppercase tracking-widest">
                  <Zap size={16} fill="currentColor" />
                  {Math.round(selectedItem.confidence * 100)}% Match
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  {cleanTitle(selectedItem.text)}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/10">
                <div className="flex flex-col gap-1 items-center md:items-start">
                  <div className="flex items-center gap-2 text-food-accent">
                    <Flame size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Energy</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{getNutrient(selectedItem.text, 'kcal')} <span className="text-sm font-medium text-slate-500">kcal</span></span>
                </div>
                
                <div className="flex flex-col gap-1 items-center md:items-start">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Dumbbell size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Protein</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{getNutrient(selectedItem.text, 'protein')} <span className="text-sm font-medium text-slate-500">g</span></span>
                </div>

                <div className="flex flex-col gap-1 items-center md:items-start">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Droplets size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Fat</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{getNutrient(selectedItem.text, 'fat')} <span className="text-sm font-medium text-slate-500">g</span></span>
                </div>

                <div className="flex flex-col gap-1 items-center md:items-start">
                  <div className="flex items-center gap-2 text-green-400">
                    <Scale size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Per</span>
                  </div>
                  <span className="text-2xl font-bold text-white">100 <span className="text-sm font-medium text-slate-500">grams</span></span>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <section>
                  <h4 className="text-xs font-bold text-food-accent uppercase tracking-[0.2em] mb-4">Summary</h4>
                  <p className="text-xl text-slate-300 leading-relaxed italic">
                    "{selectedItem.text.split(':')[1]?.split('. Ingredients')[0].trim()}"
                  </p>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-food-accent uppercase tracking-[0.2em] mb-4">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedItem.metadata.ingredients.split(',').map((ing, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 capitalize">
                        {ing.trim()}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="bg-white/5 rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <ChefHat className="text-food-accent" size={20} />
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Usage Suggestions</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    This ingredient is versatile! Consider incorporating it into balanced meals where {getNutrient(selectedItem.text, 'protein')}g of protein and {getNutrient(selectedItem.text, 'kcal')} kcal fits your dietary goals. Ideal for health-conscious recipes.
                  </p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
