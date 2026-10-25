import { ThreeColumnLayout } from './components/layout/ThreeColumnLayout'
import { LibrarySidebar } from './components/library/LibrarySidebar'
import { OrderList } from './components/playlist/OrderList'
import { LivePanel } from './components/live/LivePanel'

function App() {
  return (
    <ThreeColumnLayout
      left={<LibrarySidebar />}
      center={<OrderList />}
      right={<LivePanel />}
    />
  )
}

export default App
