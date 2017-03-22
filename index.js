var isReady = false;
var forEach = Array.prototype.forEach;

function setMeasureable(el) {
  el.style.display = 'block';
  el.style.visibility = 'hidden';
  el.style.position = 'absolute';
  el.style.zIndex = -10;
}
function getTransfromString(inElement) {
  var computedStyle = getComputedStyle(inElement);
  return computedStyle.transform || computedStyle.webkitTransform || computedStyle.mozTransform;
}


function listenImgsLoad(inElement, inCallback) {
  var images = inElement.querySelectorAll('img');
  var counter = 0;

  function _imageLoad() {
    counter++;
    if (counter == images.length) {
      inCallback.call();
    }
  }

  function _iterator(image) {
    image.addEventListener('load', _imageLoad, false);
  }

  if (images.length > 0) {
    forEach.call(images, _iterator);
  } else {
    inCallback.call();
  }
}

function calcMatrix(inMatrix) {
  var wcMatrix = new WebKitCSSMatrix(inMatrix);
  return {
    scaleX: wcMatrix.m11,
    scaleY: wcMatrix.m22,
    scaleZ: wcMatrix.m33
  };
};
function imageReady(inElement, inCallback) {
  var _martrix = calcMatrix(getTransfromString(inElement));
  var _bound = inElement.getBoundingClientRect();
  inCallback.call(null, {
    width: _bound.width / _martrix.scaleX,
    height: _bound.height / _martrix.scaleY,
    left: _bound.left,
    top: _bound.top,
    right: _bound.right,
    bottom: _bound.bottom
  });
}


module.exports = function (inElement, inCallback) {
  setMeasureable(inElement);
  if (!isReady) {
    listenImgsLoad(inElement, function () {
      isReady = true;
      imageReady(inElement, inCallback);
    });
  } else {
    imageReady(inElement, inCallback);
  }
};
