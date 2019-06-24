class Button {
  
  constructor(back, forward) {
    
    this.backCB = back;
    this.forwardCB = forward;

    console.log('button');
    this.back = document.querySelector('#back-image');
    this.forward = document.querySelector('#forward-image');

    this._backFn = this._backFn.bind(this);
    this._forwardFn = this._forwardFn.bind(this);

    this.back.addEventListener("click", this._backFn);
    this.forward.addEventListener("click", this._forwardFn);
  }

  async _backFn() {
    //console.log("back");
    this.backCB();
  }

  async _forwardFn() {
    //console.log("forward");
    this.forwardCB();
  }

}