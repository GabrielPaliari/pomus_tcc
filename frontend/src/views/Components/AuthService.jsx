import decode from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/' // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    signup(username, name, email, nusp, password) {
        var usuario =  {
            'name': name,
            'username': username,
            'email': email,
            'nusp': nusp,
            'password1': password,
            'password2': password
        };

        return fetch(`${this.domain}rest-auth/registration/`, {
            method: 'post',
            body: JSON.stringify(usuario),
            headers: {
                'Content-Type': 'application/json'
              }
          })    
          .then(response => {
            if(response.ok) {
                response.json();
                return Promise.resolve();
            }
            else {
                console.log(response);
                alert("Ocorreu algum erro no sistema.");
            }
          })
          ; 
    }

    login(username, password) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}auth/token/obtain/`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            this.setToken(res.access); // Setting the token in localStorage            
            this.setRefreshToken(res.refresh);
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            // const refreshed = decode(this.getRefreshToken());
            if (decoded.exp < Date.now() / 1000 ) { // Checking if token is expired. N)
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves access token to localStorage
        localStorage.setItem('id_token', idToken)        
    }

    setRefreshToken(refreshToken) {
      // Saves refresh token to localStorage
      localStorage.setItem('refresh_token', refreshToken)    
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    getRefreshToken() {
      // Saves refresh token to localStorage
      localStorage.getItem('refresh_token')    
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
