import "./Header.css"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
function Header(){
    
    return(
        <nav className="nav-box">
            <div className="section">
            <Link to="/" onClick={window.location.reload}><div className="title">無障礙櫃檯操作服務</div></Link>
            </div>
        </nav>                
    )
}
export default Header;
