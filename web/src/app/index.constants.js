/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('web')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('_', window._);

})();
