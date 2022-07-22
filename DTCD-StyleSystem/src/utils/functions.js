/**
 * Function that determines whether to set an attribute (required, disabled, etc.) or not.
 * @param {string} attrVal Value of the attribute HTML element.
 * @returns True of false.
 */
function getBoolFromAttrVal(attrVal) {
  if (attrVal) {
    if (attrVal == 'false') return false;
    else return true;
  }
  else {
    if (attrVal == '') return true;
    else return false;
  }
}

export {
  getBoolFromAttrVal,
}