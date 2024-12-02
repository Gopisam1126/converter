import DiamondIcon from '@mui/icons-material/Diamond';
import MenuIcon from '@mui/icons-material/Menu';
function Header() {
    return <>
        <nav className="main-navbar-c">
            <div className="logo-c">
                <DiamondIcon style={{
                    fontSize: "5rem"
                }}/>
            </div>
            <div className="search-bar-c">
                <input type="search" name="searchtool" id="searchtool" />
            </div>
            <div className="l-s-c">
                <div className="login-c">
                    <p className="login-txt">Login</p>
                </div>
                <div className="sign-up-c">
                    <p className="signup-txt">Sign Up</p>
                </div>
            </div>
            <div className="menu-exp-c">
                <MenuIcon/>
            </div>
        </nav>
    </>
}

export default Header;