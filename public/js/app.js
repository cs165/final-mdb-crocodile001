class App {
  
  constructor() {

    const urlPathString = window.location.pathname;
    const parts = urlPathString.split('/');
    
    if (parts.length > 4 && parts[1] === 'user' && parts[3] === 'id') {
      var target;
      var fromList;
      if(parts.length > 6 && parts[5] === 'target'){
        target = parts[6];
        fromList = true;
      }
      else
        fromList = false;
      const UserId = parts[2];
      const Id = parts[4];
      this._showView(UserId, Id, target, fromList);
    }
    else {
      this._showMainPage();
    }

  }

  _showMainPage() {
    const mainView = new MainView();
    const loginout = new logInOut(mainView._onClick);
  }

  _showView(UserId, Id, target, fromList) {
    const dateView = new DateView(UserId, Id, target, fromList);
    const btn = new Button(dateView._back, dateView._forward);
    const menu = new Menu(UserId, Id);
  }


}