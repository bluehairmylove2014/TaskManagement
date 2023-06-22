
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import '../../assets/styles/scss/_header.scss';

// Helpers
import {
    toggleClass
} from '../../utils/helpers/ToggleClass';

// Service
import UserService from '../../services/UserService';

// logo
import Logo from '../../assets/images/logos/sc-horizontal.png';

const Header = () => {
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        UserService.isLoggedIn()
            .then(res => {
                if(res.status_code === 401 || res.status_code === 403) {
                    setLoginStatus(false);
                }
                else {
                    setLoginStatus(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <header className='header'>
            {/* This div tag is used to support the header using justify:space-evenly
            to align the layout into 3 columns horizontally and stretch evenly */}
            <div></div> 
            {/* Search box at the center */}
            
            <div className="header__logo">
                <img src={Logo} alt="logo" />
            </div>

            {/* User interaction include notification, login logout button
            and user dropdown to click and show interaction button */}
            <div className="header__user-interact">
                <button className="header__notification">
                    <i className="fi fi-rs-bell"></i>
                    <div className="header-notification__badge"></div>
                </button>
                {/* Show if user hasn't logged in yet */}
                <Link to='/login' className={`header__user-login-btn ${ !loginStatus && 'active' }`}>
                    Sign In
                </Link>
                <Link to='/login' className={`header__user-joinus-btn ${ !loginStatus && 'active' }`}>
                    Join us!
                </Link>
                {/* Only show if user was logged in*/}
                <div className={`header__user-dropdown-wrapper ${ loginStatus && 'active' }`}>
                    <Link to='/profile' data-testid={'avatar'}>
                        <img src="https://rialloer.sirv.com/Sunrise-Continent/Users/IMG_0615-min%20(1).jpg?w=500&h=500" alt="user-avatar" />
                    </Link>
                    <div className="header__user-dropdown">
                        <button data-testid='user-interaction-btn' onClick={e => toggleClass(e.target.parentNode, 'active')}>
                            <i className="fi fi-rr-angle-small-down"></i>
                        </button>
                        <ul className="header-user-dropdown__content">
                            <li>
                                <Link to='/profile'>
                                    <i className="fi fi-rr-user"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/setting'>
                                    <i className="fi fi-rr-settings"></i>
                                    <span>Setting</span>
                                </Link>
                            </li>
                            <li>
                                <button data-testid={'logout-btn'} onClick={() => UserService.logout()}>
                                    <i className="fi fi-rr-power"></i>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
