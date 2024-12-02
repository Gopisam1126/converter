import DiamondIcon from '@mui/icons-material/Diamond';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import "../compStyles/header.css";
function Header() {
    return <>
        <nav className="main-navbar-c flex-c ff-p txt-grey">
            <div className="logo-c flex-c">
                <DiamondIcon style={{
                    fontSize: "5rem",
                    color: "#7C00FE"
                }}/>
            </div>
            <div className="search-bar-c flex-c">
                <input
                    type="search"
                    name="searchtool"
                    id="searchtool"
                    className='sb-h'
                    placeholder='eg: img, pdf, convert'
                    autoComplete='off'
                />
                <div className="search-icon-c flex-c">
                    <SearchIcon style={{
                        fontSize: "1.8rem",
                        position: "relative",
                        left: "-3rem",
                        color: "#7C00FE",
                        cursor: "pointer"
                    }}/>
                </div>
            </div>
            <div className="l-s-c flex-c">
                <div className="login-c crsr-p transition">
                    <p className="login-txt">Login</p>
                </div>
                <div className="sign-up-c crsr-p transition">
                    <p className="signup-txt">Sign Up</p>
                </div>
            </div>
            <div className="menu-exp-c flex-c crsr-p">
                <MenuIcon style={{
                    fontSize: "2.3rem"
                }}/>
            </div>
        </nav>
    </>
}

export default Header;