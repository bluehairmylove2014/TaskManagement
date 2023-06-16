// Service
import { loginApi, registernApi, checkLoginApi } from './Api';
// Encode support
import { SHA256 } from "crypto-js";


/**
 * Service class for managing user accounts and authentication.
 * This service follows the Singleton design pattern to provide a single instance across the application.
 */
class UserService {
  static instance = null;
  authorizeToken = null;

  /**
   * Get the singleton instance of UserService.
   * @returns {UserService} The instance of UserService.
   */
  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Login function.
   * Sends a login request to the server and handles the server response.
   * If the login is successful, stores the user account in `currentUser`.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  login(email, password) {
    // Send login request to the server
    // Handle the server response
    // Store the user account in `currentUser` if login is successful

    let hashPsw = SHA256(password).toString();

    return new Promise((resolve, reject) => {
      loginApi(email, hashPsw)
        .then(response => response.json())
        .then(data => {
          if (data && data.code === 200) {
            this.authorizeToken = data.token;
            localStorage.setItem('authorization_token', data.token);
            resolve(data.code);
          }
          else {
            resolve(401);
          }
        })
        .catch(err => {
            reject(err);
        })
    })
  }

  /**
   * Logout function.
   * Clears the exist token.
   */
  logout() {
    this.authorizeToken = null;
    localStorage.removeItem('authorization_token');
    window.location.reload();
  }

  /**
   * Register function.
   * Sends a registration request to the server and handles the server response.
   * If the registration is successful, stores the user account in `currentUser`.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  register(email, password) {
    // Send registration request to the server
    // Handle the server response
    // Store the user account in `currentUser` if registration is successful
  }

  /**
   * Check if the user is logged in.
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  isLoggedIn() {
    return new Promise((resolve, reject) => {
      const authToken = this.getAuthToken();
      if(!authToken) {
          resolve({status_code: 403});
      } 
      else {
        checkLoginApi(authToken)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            const status = err.response && err.response.status;
            if(status === 401 || status === 403) {
                // to do to re-login
                console.log('expire token isLoggedIn')
                resolve({status_code: 403});
            }
            reject(err);
          })
      }
    });
  }

  /**
   * Get authorization token from localstorage
   * @return {string | null} string if token is exist, undefine if not
   */
  getAuthToken() {
    return this.authorizeToken ? this.authorizeToken : localStorage.getItem('authorization_token');
  }
}

export default UserService.getInstance();
