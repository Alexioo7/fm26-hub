import { useState } from 'react'
import { PERSONALITIES, TIERS } from './data/personalities'
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'
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
  { id: 'tier',      label: '🏅 Tier List' },
  { id: 'combo',     label: '🔬 Combo' },
  { id: 'mentoring', label: '🧑‍🏫 Mentor' },
  { id: 'table',     label: '📊 Tableau' },
  { id: 'recruit',   label: '🎯 Recrutement' },
  { id: 'media',     label: '📺 Médias' },
  { id: 'compare',   label: '⚔️ Comparateur' },
  { id: 'radar',     label: '📡 Radar' },
  { id: 'scout',     label: '🤖 Scout IA' },
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
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <Header counts={counts} total={PERSONALITIES.length} />
        <Nav tabs={TABS} active={tab} onChange={setTab} />
      </div>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '16px 12px' }}>
        {tab === 'tier'      && <TierList search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />}
        {tab === 'combo'     && <ComboAnalyser />}
        {tab === 'mentoring' && <Mentoring />}
        {tab === 'table'     && <TableView />}
        {tab === 'recruit'   && <Recruit />}
        {tab === 'media'     && <MediaStyles />}
        {tab === 'compare'   && <Compare />}
        {tab === 'radar'     && <Radar />}
        {tab === 'scout'     && <Scout />}
      </main>
    </div>
  )
}