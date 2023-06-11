import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'

// Style
import '../../assets/styles/scss/_sidebar.scss';

const Sidebar = () => {
    const navigateBtnRef = useRef([]);
    const location = useLocation();
    useEffect (() => {
        navigateBtnRef.current.forEach(btn => {
            if(location.pathname.includes(btn.id)) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        })
    }, [location])

    return (
        <aside className='sidebar'>
            <nav className="sidebar__navigation">
                <ul>
                    <li className='sidebar__navigation-item'>
                        <Link to='/dashboard' ref={el => navigateBtnRef.current[0] = el} id='dashboard'>
                            <i className="fi fi-rr-apps"></i>
                        </Link>
                    </li>
                    <li className='sidebar__navigation-item'>
                        <Link to='/timeline' ref={el => navigateBtnRef.current[1] = el} id='timeline'>
                            <i className="fi fi-rr-list-timeline"></i>
                        </Link>
                    </li>
                    <li className='sidebar__navigation-item'>
                        <Link to='/tasks' ref={el => navigateBtnRef.current[2] = el} id='tasks'>
                            <i className="fi fi-rr-note"></i>
                        </Link>
                    </li>
                    <li className='sidebar__navigation-item'>
                        <Link to='/setting' ref={el => navigateBtnRef.current[3] = el} id='setting'>
                            <i className="fi fi-rr-settings"></i>
                        </Link>
                    </li>
                    <li className='sidebar__navigation-item'>
                        <Link to='/files' ref={el => navigateBtnRef.current[4] = el} id='files'>
                            <i className="fi fi-rr-add-folder"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
