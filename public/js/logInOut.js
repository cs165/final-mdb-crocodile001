class logInOut {
  constructor(_onClick) {

    this._onClick = _onClick;

    this._onCreate = this._onCreate.bind(this);
    this._onLoginChanged = this._onLoginChanged.bind(this);
    this._onLogout = this._onLogout.bind(this);
    this._updateMenu = this._updateMenu.bind(this);

    this.loginMenu = document.querySelector('#login-menu');
    this.mainMenu = document.querySelector('#btn-menu');
    this.toggle = document.querySelector('#toggle');

    this.newButton = document.querySelector('#btn');
    this.newButton.addEventListener('click', this._onCreate);
    this._getLoggedIn();
  }

  async _getLoggedIn() {
    await LoginUtils.initialize();
    await this._setupLoginLogout();
    await this._updateMenu();
  }

  async _updateMenu() {
    const result = await LoginUtils.getSignedInUser();
    //console.log(result.idToken);
    if (result.loggedIn) {
      this.loginMenu.classList.add('hidden');
      this.mainMenu.classList.remove('hidden');
      this.toggle.classList.remove('hidden');
    } else {
      this.mainMenu.classList.add('hidden');
      this.toggle.classList.add('hidden');
      this.loginMenu.classList.remove('hidden');
    }
  }

  async _setupLoginLogout() {
    await LoginUtils.initialize();
    // Login button: Use Google's API for login.
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(this._onLoginChanged);
    const loginButton = document.querySelector('#login');
    auth2.attachClickHandler(loginButton);

    // Log out button: Attach click handler.
    const logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', this._onLogout);
  }

  _onLoginChanged(isLoggedIn) {
    this._updateMenu();
  }

  _onLogout() {
    // Special Google API call to sign out.
    gapi.auth2.getAuthInstance().signOut();

    const createBtn = document.querySelector('#btn');
    const logout = document.querySelector('#logout');
    const Switch = document.querySelector('#Switch');
    const toggle = document.querySelector('#temp');
    createBtn.classList.remove('hidden');
    logout.classList.add('hidden');
    Switch.innerText = "Logout Switch Off";
    toggle.checked = false;
  }

  async _onCreate() {
    await LoginUtils.initialize();
    const user = await LoginUtils.getSignedInUser();
    const data = { idToken: user.idToken };
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const response = await fetch('/login', fetchOptions);
    const result =  await response.json();
    //console.log(result.id);

    this._onClick(result.id);
  }
}
