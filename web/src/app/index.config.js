(function() {
  'use strict';

  angular
    .module('web')
    .config(config);

  /** @ngInject */
  function config($logProvider, growlProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    //growl config
     growlProvider.globalReversedOrder(true);
     growlProvider.globalTimeToLive(5000);
     growlProvider.globalDisableIcons(true);
  }

})();
