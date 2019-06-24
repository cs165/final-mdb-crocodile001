class DateView {
  
  constructor(UserId, Id, target, fromList) {
    
    this.prompts = ['List the things that make you feel powerful.','What is something that made you laugh today?','List the movies that you want to watch.','List the things that make you feel peaceful.','List your greatest comforts.','What is something that brightens your day?','List three things you accomplished today.','What is something you look forward to every day?','What is a game that you like to play?','What is your Sunday ritual?','List the most memorable moments of this month so far.','List some things you want to do outdoors.','If you could live anywhere you wanted, where would you live?','List what you would spend a million dollars on, just for you.','When do you feel most energized?','List the things that make you feel excited.','List your favorite snacks or treats.','What has you busy this week?','List the people you admire.','List the happiest moments of your year so far.','What hobby would you like to pick up?','List the ways you love to have fun.','Describe something you learned today','List something fun you did or will do today.','What is your dream job?','List the things that inspire you.','List something you did today that you are proud of.','Find a quote that you like and write it down here.','List something you should ignore.','Talk about something you are excited about next month.','List three traits you would like others to see in you.'];
    this.UserId = UserId;
    this.Id = Id;
    this.target = target;
    this.fromList = fromList;
    this.homeId = Id;
    this.message = '';

    this._load = this._load.bind(this);
    this._change = this._change.bind(this);
    this._load = this._load.bind(this);
    this._back = this._back.bind(this);
    this._forward = this._forward.bind(this);
    this._create = this._create.bind(this);
    this._check = this._check.bind(this);
    this._reAnimate = this._reAnimate.bind(this);

    this._load();

    this.textarea = document.querySelector('#text');
    this.textarea.addEventListener("blur", this._change);
    this.textarea.addEventListener("focus", this._check);

    this.home = document.querySelector('#home');
    this.home.addEventListener("click", this._load);

    this.date = document.querySelector('#date');
    this.prompt = document.querySelector('#prompt');

    console.log("date: " + this.UserId);
  }

  async _create(date) {

    this.date.classList.add('hidden');
    this.prompt.classList.add('hidden');
    this.textarea.classList.add('hidden');

    console.log("json is null");

    const random = this.prompts[ Math.floor(Math.random()*this.prompts.length) ];
    const params = {
      ID : this.UserId,
      date : date.toLocaleDateString(),
      prompt : random
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

    const options = { month: 'long', day: 'numeric' };
    const dateObj = document.querySelector('#date');
    dateObj.textContent = date.toLocaleDateString('en-US', options);
    const prompt = document.querySelector('#prompt');
    prompt.textContent = random;
    this.textarea.value = "";
    this.Id = json.Id;
    console.log(this.Id);


    this.date.classList.remove('hidden');
    this.prompt.classList.remove('hidden');
    this.textarea.classList.remove('hidden');
  }

  _reAnimate() {

    this.textarea.style.animation = 'none';
    this.textarea.offsetHeight; /* trigger reflow */
    this.textarea.style.animation = null; 
    this.date.style.animation = 'none';
    this.date.offsetHeight; /* trigger reflow */
    this.date.style.animation = null; 
    this.prompt.style.animation = 'none';
    this.prompt.offsetHeight; /* trigger reflow */
    this.prompt.style.animation = null; 

  }

  async _back() {

    const date = new Date(this.dateString);
    date.setDate(date.getDate() - 1);
    this.dateString = date.toLocaleDateString();


    const params = {
      ID : this.UserId,
      date : date.toLocaleDateString()
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
      this._create(date);
    }
    else{
      const options = { month: 'long', day: 'numeric' };
      const dateObj = document.querySelector('#date');
      dateObj.textContent = date.toLocaleDateString('en-US', options);
      const prompt = document.querySelector('#prompt');
      prompt.textContent = json.prompt;
      this.textarea.value = json.message;
      this.Id = json._id;
    }


    this._reAnimate();
  }

  async _forward() {

    //console.log(this.dateString);

    const date = new Date(this.dateString);
    date.setDate( date.getDate() + 1 );
    this.dateString = date.toLocaleDateString();


    const params = {
      ID : this.UserId,
      date : date.toLocaleDateString()
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
      this._create(date);
    }
    else{
      const options = { month: 'long', day: 'numeric' };
      const dateObj = document.querySelector('#date');
      dateObj.textContent = date.toLocaleDateString('en-US', options);
      const prompt = document.querySelector('#prompt');
      prompt.textContent = json.prompt;
      this.textarea.value = json.message;
      this.Id = json._id;
    }


    this._reAnimate();
  }

  async _load() {

    if(this.fromList === false){
      this.Id = this.homeId;
    }
    else{
      this.Id = this.target;
      this.fromList = false;
      console.log('target: ' + this.target);
    }

    console.log(this.Id);
    const result = await fetch(`/user/${this.UserId}/getById/${this.Id}`);
    const json = await result.json();
    console.log(json);
    this.dateString = json.date;

    const Container = document.querySelector('#status-view');
    const toString = new Date(json.date);
    const options = { month: 'long', day: 'numeric' };

    const date = Container.querySelector('#date');
    date.textContent = toString.toLocaleDateString('en-US', options);
    const prompt = Container.querySelector('#prompt');
    prompt.textContent = json.prompt;
    this.textarea.value = json.message;


    Container.classList.remove('hidden');

    this._reAnimate();
  }

  async _change() {

    this.message = this.textarea.value;
    console.log(this.message);

    const params = {
      UserId : this.UserId,
      ID : this.Id,
      message : this.message
    }
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    };
    const result = await fetch('/change', fetchOptions);
    const json = await result.json();

    console.log(json);

    this.home.classList.remove('check');
    this.home.innerHTML = "HOME";
    this.home.addEventListener("click", this._load);

    this.textarea.style.backgroundColor = "rgba(253, 245, 245, 0.5)";
    const prompt = document.querySelector('#prompt');
    prompt.style.fontSize = "12pt";

    const date = document.querySelector('#date');
    date.classList.remove('hidden');
    const back = document.querySelector('#back-image');
    back.classList.remove('hidden');
    const forward = document.querySelector('#forward-image');
    forward.classList.remove('hidden');

    this._reAnimate();
  }

  _check() {
    console.log("check");

    this.home.innerHTML = "";
    this.home.classList.add('check');
    this.home.removeEventListener("click", this._load);

    this.textarea.style.backgroundColor = "white";
    const prompt = document.querySelector('#prompt');
    prompt.style.fontSize = "18pt";

    const date = document.querySelector('#date');
    date.classList.add('hidden');
    const back = document.querySelector('#back-image');
    back.classList.add('hidden');
    const forward = document.querySelector('#forward-image');
    forward.classList.add('hidden');
  }

}