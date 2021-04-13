import {login, logout} from '../../services/firebase'

const Header = (props) => (
    <header>
        <h1>React Dev Skills</h1>
        <ul>
            {
                props.user ? 
                <>
                <li>Welcome, {props.user.displayName}</li>
                <li><img src={props.user.photoURL} alt={props.user.displayName}/></li>
            <li className="auth-link" onClick={logout}>Logout</li>
                </>
                :
                <li className="auth-link" onClick={login}>Login</li>
            }
            
           
        </ul>
    </header>

)
    

export default Header;