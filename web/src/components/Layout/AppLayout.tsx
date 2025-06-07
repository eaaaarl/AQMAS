import { Outlet } from 'react-router-dom'
import FullScreenToggle from '../FullScreenToggle'

function AppLayout() {
    return (
        <div>
            <FullScreenToggle />
            <Outlet />
        </div>
    )
}

export default AppLayout