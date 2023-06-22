import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// styles
import '../../assets/styles/scss/_login.scss';

// img
import sc_logo from '../../assets/images/logos/sc-horizontal.png';

// Service
import UserService from '../../services/UserService';
import { isValidEmail } from '../../utils/validators/email.validator';
import { isValidPassword } from '../../utils/validators/password.validator';


import slider_img from '../../assets/images/graphics/slider.png';
import bus_img from '../../assets/images/graphics/bus.gif';

import enoti_wrong from '../../assets/images/graphics/enoti-wrong.png';
import enoti_empty from '../../assets/images/graphics/enoti-empty.png';
import enoti_email_invalid from '../../assets/images/graphics/enoti-email-invalid.png';
import enoti_psw_short from '../../assets/images/graphics/enoti-psw-short.png';

const Login = () => {
    const navigate = useNavigate();

    const pswLogin = useRef(null);
    const wrongMsg = useRef(null);
    const busRef = useRef(null);
    const sliderHolderRef = useRef(null);
    const updateSuccessNotiRef = useRef(null);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    // Methods

    const updateFormValue = (key, value) => {
        // Function to update a specific form value
        setLoginForm(prevValues => ({
            ...prevValues,
            [key]: value
        }));
    };
    const showErrorNoti = (idnoti) => {
        // Get noti
        const wrong_enoti = wrongMsg.current.querySelector(`#${idnoti}`);
        if (wrong_enoti) {
            // Display noti ( display: none => display: block )
            wrong_enoti.style.display = 'block';
            // Show error noti ( visibility: visible )
            wrong_enoti.classList.add('active');
            // Undisplay noti after 3s
            setTimeout(() => {
                wrong_enoti.classList.remove('active');
                wrong_enoti.style.display = 'none';
            }, 3000);
        }
    };
    const signin = (e) => {
        // Prevent browser defalut reload page when submit
        e.preventDefault();

        // Check form valid
        if(!loginForm.email.length || !loginForm.password.length) {
            // empty error
            showErrorNoti('enoti-empty');
            return;
        }
        else if(!isValidEmail(loginForm.email)) {
            // email is not valid
            showErrorNoti('enoti-email-invalid');
            return;
        }
        else if(!isValidPassword(loginForm.password)) {
            // password is less than 6 character
            showErrorNoti('enoti-psw-short');
            return;
        }

        // No error, use UserSevice to handle login
        // Login process
        UserService.login(loginForm.email, loginForm.password)
            .then(res_code => {
                console.log("This is res_code: ", res_code)
                // Success
                if(res_code === 200) {
                    // Show success notification
                    updateSuccessNotiRef.current.classList.add('active');
    
                    setTimeout(() => {
                        navigate('/tasks');
                    }, 2500);
                }
                else {
                    // Show email or password error notification 
                    showErrorNoti("enoti-wrong")
                }
            })
            .catch(err => {
                console.log("This is err: ", err)
                console.log(err);
            })
    }
    const showPassword = (e) => {
        if (e.target.checked) {
            pswLogin.current.setAttribute("type", "text")
        } else {
            pswLogin.current.setAttribute("type", "password")
        }
    }


    return (
        <div className="login__container">
            {/* Login form */}
            <div className="login">
                <div className="login__logo">
                    <img src={sc_logo} alt="Logo" />
                </div>
                <form
                    className={`login__form`}
                    onSubmit={signin}
                    noValidate
                >
                    <h3>Login</h3>
                    <p>One more step to unlock your profile</p>
                    <div className="login__data-entry">
                        <label htmlFor="login-email-input">Email:</label>
                        <i className="fi fi-sr-circle-envelope"></i>
                        <input
                            type="email"
                            id="login-email-input"
                            placeholder="example@kyanon.digital"
                            name="email"
                            onInput={(e) => updateFormValue('email', e.target.value)}
                        />
                    </div>

                    <div className="login__data-entry">
                        <label htmlFor="login-psw-input">Password:</label>
                        <i className="fi fi-sr-lock"></i>
                        <input
                            type="password"
                            id="login-psw-input"
                            placeholder="iloveKyanonDigital"
                            name="password"
                            ref={pswLogin}
                            onInput={(e) => updateFormValue('password', e.target.value)}
                        />
                    </div>
                    <div className="login_interact">
                        <div className="login-interact__show-psw-btn">
                            <input type="checkbox" id="checkbox" name="showPswStatus" onInput={showPassword} />
                            <label htmlFor="checkbox">Show Password</label>
                        </div>
                        <button type="submit">Sign in</button>
                    </div>
                </form>
                <div className="login__bus-running-wrapper">
                    <div className="login__bus-running-container">
                        <div className="login-bus-running__slider-holder" ref={sliderHolderRef}>
                            <img
                                className={`login-bus-running__slider`}
                                src={slider_img}
                                alt="Slider start"
                            />
                            <img
                                className={`login-bus-running__slider`}
                                src={slider_img}
                                alt="Slider end"
                            />
                        </div>
                        <div className="login-bus-running__msg-container" ref={wrongMsg}>
                            <img src={enoti_wrong} className="login-bus-running__msg" id="enoti-wrong" alt="Error Notification Wrong" />
                            <img src={enoti_empty} className="login-bus-running__msg" id="enoti-empty" alt="Error Notification Empty" />
                            <img src={enoti_email_invalid} className="login-bus-running__msg" id="enoti-email-invalid" alt="Error Notification Invalid" />
                            <img src={enoti_psw_short} className="login-bus-running__msg" id="enoti-psw-short" alt="Error Notification Password Short" />
                        </div>
                        <div className="login__bus-holder">
                            <img className={`bus`} src={bus_img} ref={busRef} alt="Bus" />
                        </div>
                    </div>
                </div>
                
                <div className="update-success-noti" ref={updateSuccessNotiRef}>
                    <div className="noti">
                        
                        <p>Success</p>
                        <div className="dog"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
