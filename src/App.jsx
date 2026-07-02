import { useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import {
  Trophy, FlaskConical, GraduationCap, Table2, Crosshair,
  Tv, Swords, Radar as RadarIcon, Bot,
} from 'lucide-react'
import { PERSONALITIES, TIERS } from './data/personalities'
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'
import Sidebar from './components/Layout/Sidebar'
import TierList from './components/TierList/TierList'
import TableView from './components/Table/TableView'
import Recruit from './components/Recruit/Recruit'
import MediaStyles from './components/MediaStyles/MediaStyles'
import Compare from './components/Compare/Compare'
import Radar from './components/Radar/Radar'
import Scout from './components/Scout/Scout'
import ComboAnalyser from './components/ComboAnalyser/ComboAnalyser'
import Mentoring from './components/Mentoring/Mentoring'

export const TABS = [
  { id: 'tier',      label: 'Tier List',    icon: Trophy },
  { id: 'combo',     label: 'Combo',        icon: FlaskConical },
  { id: 'mentoring', label: 'Mentor',       icon: GraduationCap },
  { id: 'table',     label: 'Tableau',      icon: Table2 },
  { id: 'recruit',   label: 'Recrutement',  icon: Crosshair },
  { id: 'media',     label: 'Médias',       icon: Tv },
  { id: 'compare',   label: 'Comparateur',  icon: Swords },
  { id: 'radar',     label: 'Radar',        icon: RadarIcon },
  { id: 'scout',     label: 'Scout IA',     icon: Bot },
]

export default function App() {
  const [tab, setTab] = useState('tier')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const counts = TIERS.reduce((acc, t) => {
    acc[t] = PERSONALITIES.filter(p => p.tier === t).length
    return acc
  }, {})

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: '#0d1117', minHeight: '100vh' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Header counts={counts} total={PERSONALITIES.length} />
          <div className="topnav">
            <Nav tabs={TABS} active={tab} onChange={setTab} />
          </div>
        </div>
        <div className="app-body">
          <Sidebar tabs={TABS} active={tab} onChange={setTab} />
          <main className="app-main">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
                {tab === 'tier'      && <TierList search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />}
                {tab === 'combo'     && <ComboAnalyser />}
                {tab === 'mentoring' && <Mentoring />}
                {tab === 'table'     && <TableView />}
                {tab === 'recruit'   && <Recruit />}
                {tab === 'media'     && <MediaStyles />}
                {tab === 'compare'   && <Compare />}
                {tab === 'radar'     && <Radar />}
                {tab === 'scout'     && <Scout />}
            </motion.div>
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}
