// Copyright (c) 2015, George Kormaris. All rights reserved.

//The bodyOffset singleton helps calculate the document's true coordinates.
//The left and top properties hold the size of the browser's elements, those that do not belong to the document.
//For example the window borders, chrome, sidebars, inspector etc.
//It's a singleton  --modified code from "Learning JavaScript Design Patterns" by Addy Osmani

var bodyOffset = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function _init() {

    // Singleton

    // Private methods and variables
    var _left = 0; //The left offset
    var _top = 0; //The top offset (chrome, addressbar etc)

    return {

      // Public methods and variables
      getLeft: function () {
        return _left;
      },

      getTop: function () {
        return _top;
      },

      setLeft: function (value) {
        _left = value;
      },

      setTop: function (value) {
        _top = value;
      }
    };

  }

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if (!instance) {
        instance = _init();
      }

      return instance;
    }

  };

})();

var bPos = bodyOffset.getInstance();

function Pin(el) {
  this._elem = el;
  this._lastX = 0;
  this._lastY = 0;
  this._running = false;
  this.options = {
    leftMin: 0.0,
    rightMin: 0.0,
    topMin: 0.0,
    bottomMin: 0.0,
    ampX: 1.0,
    ampY: 1.0,
    offsetX: 0.0,
    offsetY: 0.0,
    deadzoneX: 0.0,
    deadzoneY: 0.0
  };
  this._screenHorCenter = screen.width / 2;
  this._bodyX = window.screenLeft + bPos.getLeft();
  this._winHorCenter = (2 * this._bodyX + window.innerWidth) / 2;
  this._diffH = this._screenHorCenter - this._winHorCenter;
  this._leftCenter = window.innerWidth / 2 - this._elem.offsetWidth / 2;
  this._left = (this._leftCenter / 2 - this._diffH) * this.options.ampX + this.options.offsetX;
  //
  this._screenVerCenter = screen.height / 2;
  this._bodyY = window.screenTop + bPos.getTop();
  this._winVerCenter = (2 * this._bodyY + window.innerHeight) / 2;
  this._diffV = this._screenHorCenter - this._winHorCenter;
  this._topCenter = window.innerHeight / 2 - this._elem.offsetHeight / 2;
  this._top = this._topCenter - this._diffV * this.options.ampY + this.options.offsetY;
}


Pin.prototype.getElem = function () {
  return this._elem;
};

Pin.prototype.animation = function () {  //.transform prevents repaints
//TODO: Implement options in percentage as well (recognize units)
  this._bodyX = window.screenLeft + bPos.getLeft();
  this._winHorCenter = (2 * this._bodyX + window.innerWidth) / 2;
  this._diffH = this._screenHorCenter - this._winHorCenter;
  this._leftCenter = window.innerWidth / 2 - this._elem.offsetWidth / 2;
  this._left = this._leftCenter - this._diffH * this.options.ampX + this.options.offsetX;
  if (Math.abs(this._left - this._leftCenter) >= this.options.deadzoneX) {
    if (this._left > this.options.leftMin) { //TODO: also check against doc width edge case
      if ((this._left + this._elem.offsetWidth) < (window.innerWidth - this.options.rightMin)) {
        this._lastX = this._left;
      } else {
        this._lastX = window.innerWidth - this.options.rightMin - this._elem.offsetWidth;
      }
    } else {
      this._lastX = this.options.leftMin;
    }
  }

  this._bodyY = window.screenTop + bPos.getTop();
  this._winVerCenter = (2 * this._bodyY + window.innerHeight) / 2;
  this._diffV = this._screenVerCenter - this._winVerCenter;
  this._topCenter = window.innerHeight / 2 - this._elem.offsetHeight / 2;
  this._top = this._topCenter - this._diffV * this.options.ampY + this.options.offsetY;
  if (Math.abs(this._top - this._topCenter) >= this.options.deadzoneY) { //TODO: implement deadzone.default
    if (this._top > this.options.topMin) {
      if ((this._top + this._elem.offsetHeight) < (window.innerHeight - this.options.bottomMin)) {
        this._lastY = this._top;
      } else {
        this._lastY = window.innerHeight - this.options.bottomMin - this._elem.offsetHeight;
      }
    } else {
      this._lastY = this.options.topMin;
    }
  }
  this._elem.style.transform = 'translate(' + (this._lastX) + 'px' + ', ' + (this._lastY) + 'px)';

  if (this._running) {
    window.requestAnimationFrame(this.animation.bind(this));
  }
};

Pin.prototype.start = function () {
  this._elem.style.left = '0';
  this._elem.style.top = '0';
  this._running = true;
  window.requestAnimationFrame(this.animation.bind(this));
};

Pin.prototype.stop = function () {
  this._elem.style.left = null;
  this._elem.style.top = null;
  this._running = false;
};

function winMouseOver(event) {
  bPos.setLeft(event.screenX - event.clientX - window.screenLeft);
  bPos.setTop(event.screenY - event.clientY - window.screenTop);
  console.log("Fired");
  document.body.removeEventListener('mouseover', winMouseOver); //So it fires once.
}
