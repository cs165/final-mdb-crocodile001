class MainView {
  
  constructor() {

    this.prompts = ['List the things that make you feel powerful.','What is something that made you laugh today?','List the movies that you want to watch.','List the things that make you feel peaceful.','List your greatest comforts.','What is something that brightens your day?','List three things you accomplished today.','What is something you look forward to every day?','What is a game that you like to play?','What is your Sunday ritual?','List the most memorable moments of this month so far.','List some things you want to do outdoors.','If you could live anywhere you wanted, where would you live?','List what you would spend a million dollars on, just for you.','When do you feel most energized?','List the things that make you feel excited.','List your favorite snacks or treats.','What has you busy this week?','List the people you admire.','List the happiest moments of your year so far.','What hobby would you like to pick up?','List the ways you love to have fun.','Describe something you learned today','List something fun you did or will do today.','What is your dream job?','List the things that inspire you.','List something you did today that you are proud of.','Find a quote that you like and write it down here.','List something you should ignore.','Talk about something you are excited about next month.','List three traits you would like others to see in you.'];

    this.containerElement = document.querySelector('#main-view');
    //this.btn = document.querySelector('#btn');

    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
    
    //this.btn.addEventListener("click", this._onClick);
  
    this.containerElement.classList.remove('hidden');

    this.createBtn = document.querySelector('#btn');
    this.logout = document.querySelector('#logout');
    this.createBtn.classList.remove('hidden');
    this.logout.classList.add('hidden');

    this.checkbox = document.querySelector("#temp");
    this.checkbox.addEventListener("change", this._onChange);
  }

  _onChange() {

    var Switch = document.querySelector('#Switch');

    if (this.checkbox.checked) {
      this.createBtn.classList.add('hidden');
      this.logout.classList.remove('hidden');
      Switch.innerText = "Logout Switch On";
    } 
    else {
      this.createBtn.classList.remove('hidden');
      this.logout.classList.add('hidden');
      Switch.innerText = "Logout Switch Off";
    }
  }

  async _onClick(UserId) {

    console.log("click: " + UserId);

    //event.preventDefault();

    const today = new Date();

    const params = {
      ID : UserId,
      date : today.toLocaleDateString()
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

      const params = {
        ID : UserId,
        date : today.toLocaleDateString(),
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

      window.location.href = 'user/' + UserId + '/id/' + json.Id;
      
    }
    else{
      window.location.href = 'user/' + UserId + '/id/' + json._id;
    }
  
  }

}