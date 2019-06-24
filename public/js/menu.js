class Menu {

	constructor(UserId, Id) {
    
    this.UserId = UserId;
    this.Id = Id;
    this.start = 0;
    this.prompts = ['List the things that make you feel powerful.','What is something that made you laugh today?','List the movies that you want to watch.','List the things that make you feel peaceful.','List your greatest comforts.','What is something that brightens your day?','List three things you accomplished today.','What is something you look forward to every day?','What is a game that you like to play?','What is your Sunday ritual?','List the most memorable moments of this month so far.','List some things you want to do outdoors.','If you could live anywhere you wanted, where would you live?','List what you would spend a million dollars on, just for you.','When do you feel most energized?','List the things that make you feel excited.','List your favorite snacks or treats.','What has you busy this week?','List the people you admire.','List the happiest moments of your year so far.','What hobby would you like to pick up?','List the ways you love to have fun.','Describe something you learned today','List something fun you did or will do today.','What is your dream job?','List the things that inspire you.','List something you did today that you are proud of.','Find a quote that you like and write it down here.','List something you should ignore.','Talk about something you are excited about next month.','List three traits you would like others to see in you.'];

    this._clickMenu = this._clickMenu.bind(this);
    this._onClick = this._onClick.bind(this);
    this._getLoggedOut = this._getLoggedOut.bind(this);
    this._load = this._load.bind(this);
    this._onBack = this._onBack.bind(this);
    this._onForward = this._onForward.bind(this);
    this._onBackDate = this._onBackDate.bind(this);
    this._onGoto = this._onGoto.bind(this);
    this._onBackGoTo = this._onBackGoTo.bind(this);
    this._onGo = this._onGo.bind(this);

    this.menuDiv = document.querySelector(".menu");
    this.menuDiv.classList.remove('hidden');

    this.menu = document.querySelector("#menu-open");
    this.menu.addEventListener("change", this._clickMenu);
    this.status = document.querySelector("#status-view");
    this.status.addEventListener("click", this._onClick);


    this.backMenu = document.querySelector(".green");
    this.backMenu.addEventListener("click", this._onBackMenu);

    this.listMenu = document.querySelector(".purple");
    this.listMenu.addEventListener("click", this._load);


    this.listView = document.querySelector('#list-view');
    this.listView.addEventListener("click", this._onClick);

    this.back = document.querySelector('#back-page');
    this.back.addEventListener("click", this._onBack);

    this.forward = document.querySelector('#forward-page');
    this.forward.addEventListener("click", this._onForward);


    this.gotoView = document.querySelector('#goto-view');
	this.gotoView.addEventListener("click", this._onClick);

    this.goto = document.querySelector('.orange');
    this.goto.addEventListener("click", this._onGoto);

    this.go = document.querySelector('.signUpBtn');
    this.go.addEventListener("click", this._onGo);

    this._getLoggedOut();
  }

  async _getLoggedOut() {
    await LoginUtils.initialize();
    await this._setupLogout();
  }

  async _setupLogout() {
    await LoginUtils.initialize();
    // Login button: Use Google's API for login.
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(this._onLoginChanged);

    // Log out button: Attach click handler.
    const logoutButton = document.querySelector('.red');
    logoutButton.addEventListener('click', this._onLogout);
  }

  _onLogout() {
    // Special Google API call to sign out.
    gapi.auth2.getAuthInstance().signOut();
    window.location.href = "/";
  }

  _onBackMenu() {
    window.location.href = "/";
  }

  _onBackDate() {
  	this.backMenu.removeEventListener("click", this._onBackDate);
  	this.backMenu.addEventListener("click", this._onBackMenu);
  	window.location.href = '/user/' + this.UserId + '/id/' + this.Id;
  }

  _onBackGoTo() {
  	this.backMenu.removeEventListener("click", this._onBackGoTo);
  	this.backMenu.addEventListener("click", this._onBackMenu);
  	window.location.href = '/user/' + this.UserId + '/id/' + this.Id;
  }

  _onClick() {
    this.status.classList.remove('blur');
    this.listView.classList.remove('blur');
    this.gotoView.classList.remove('blur');
    this.menu.checked = false;
  }

  _clickMenu() {
    if (this.menu.checked) {
      this.status.classList.add('blur');
      this.listView.classList.add('blur');
      this.gotoView.classList.add('blur');
    } 
    else {
      this.status.classList.remove('blur');
      this.listView.classList.remove('blur');
      this.gotoView.classList.remove('blur');
    }
  }

  async _load() {



    const result = await fetch(`/find/${this.UserId}`);
    const json = await result.json();
    var datas = JSON.parse(json);

    console.log(datas);

    var myNode = document.querySelector("#append");
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}

    var count = 2;
    var listLength = 0;
    datas = datas.sort(function (a, b) {
	 return a.date > b.date ? 1 : -1;
	});

	if(this.start < 0 || datas.length < 5)
		this.start = 0;
	if(this.start > datas.length - 1)
		this.start = datas.length - 5;
    for(var i = this.start; i < datas.length; i++){
	    if(datas[i].message != ''){
	    	listLength++;
			var dupNode = document.querySelector('#cb1').cloneNode(true);
			var dupNode2 = document.querySelector('#clone').cloneNode(true);
		    dupNode.id = 'cb' + count;
		    dupNode2.querySelector('.box-title').htmlFor = 'cb' + count;
		    dupNode2.querySelector('.box-title').innerText = datas[i].date;

		    var a = document.createElement('a');
		    a.innerText = datas[i].message;
		    a.href = '/user/' + this.UserId + '/id/' + this.Id + '/target/' + datas[i]._id;
		    dupNode2.querySelector('div').innerText = '';
		    dupNode2.querySelector('div').appendChild(a);

		    var append = document.querySelector('#append');
		    append.appendChild(dupNode);
		    append.appendChild(dupNode2); 
	    	count++;
	    	console.log(datas[i].message);

	    	if(listLength == 5)
	    		break;
	    }
	}

    this._onClick();
    this.backMenu.removeEventListener("click", this._onBackMenu);
    this.backMenu.addEventListener("click", this._onBackDate);
    const dateView = document.querySelector('#status-view');
    dateView.classList.add('hidden');
    this.gotoView.classList.add('hidden');
    this.listView.classList.remove('hidden');
  }

  _onBack() {
  	this.start -= 5;
  	this._load();
  }

  _onForward() {
  	this.start += 5;
  	this._load();
  }

  _onGoto() {
  	this._onClick();
    this.backMenu.removeEventListener("click", this._onBackMenu);
    this.backMenu.addEventListener("click", this._onBackGoTo);
  	this.gotoView.classList.remove('hidden');
    this.listView.classList.add('hidden');
    this.status.classList.add('hidden');
  }

  async _onGo() {

  	event.preventDefault();
  	document.querySelector("#gotoWarn").innerText = '';

  	const input = document.querySelector("#user").value;
  	console.log(input);

  	const params = {
      ID : this.UserId,
      date : input
    }
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    };
    const result = await fetch('/getByDate', fetchOptions);
    const json = await result.json();

    if(json == null){

		const res = this._isExistDate(input)
		console.log(res);

		if(res==true){
		  const params = {
		    ID : this.UserId,
		    date : input,
		    prompt : this.prompts[ Math.floor(Math.random()*this.prompts.length) ]
		  }
		  const fetchOptions = {
		    method: 'post',
		    headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(params)
		  };
		  const result = await fetch('/create', fetchOptions);
		  const json = await result.json();

		  window.location.href = '/user/' + this.UserId + '/id/' + this.Id + '/target/' +  json.Id;
		}
		else{
			document.querySelector("#gotoWarn").innerText = 'Invalid Input';
			console.log('invalid');
		}
      
    }
    else{
      window.location.href = '/user/' + this.UserId + '/id/' + this.Id + '/target/' + json._id;
    }
  }

  _isExistDate(dateStr) { // yyyy/mm/dd
	  var dateObj = dateStr.split('/');

	  //列出12個月，每月最大日期限制
	  var limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	  var theYear = parseInt(dateObj[0]);
	  var theMonth = parseInt(dateObj[1]);
	  var theDay = parseInt(dateObj[2]);
	  var isLeap = new Date(theYear, 1, 29).getDate() === 29; // 是否為閏年?

	  if(isLeap) { // 若為閏年，最大日期限制改為 29
	    limitInMonth[1] = 29;
	  }

	  // 比對該日是否超過每個月份最大日期限制
	  return theDay <= limitInMonth[theMonth - 1]
	}

}