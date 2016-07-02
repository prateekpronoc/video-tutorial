(function() {
  'use strict';

  angular
    .module('web')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('main.profile', {
        url: '/profile',
        templateUrl: 'app/partical/profile.html'
      })
      .state('main.libary', {
        url: '/libary',
        templateUrl: 'app/partical/libary.html'
      })
      .state('main.myCourses', {
        url: '/myCourses',
        templateUrl: 'app/partical/myCourses.html'
      })
      .state('main.myLessons', {
        url: '/myLessons',
        templateUrl: 'app/partical/myLessons.html'
      })
      .state('main.createCourse', {
        url: '/addCourse',
        templateUrl: 'app/partical/createCourse.html'
      })
      .state('main.editCourse', {
        url: '/editCourse',
        templateUrl: 'app/partical/createCourse.html'
      })
      .state('main.courses', {
        url: '/courses',
        templateUrl: 'app/partical/courses.html'
      })
      .state('main.lessons', {
        url: '/lessons',
        templateUrl: 'app/partical/lessons.html'
      })
      .state('main.editLesson', {
        url: '/editLesson',
        templateUrl: 'app/partical/createLesson.html'
      })
      .state('main.createLesson', {
        url: '/addLesson',
        templateUrl: 'app/partical/createLesson.html'
      })
      .state('main.instructors', {
        url: '/instructors',
        templateUrl: 'app/partical/users.html'
      })
      .state('main.students', {
        url: '/students',
        templateUrl: 'app/partical/users.html'
      })
      .state('main.createUser', {
        url: '/addUser',
        templateUrl: 'app/partical/profile.html'
      })
      .state('main.editUser', {
        url: '/editUser',
        templateUrl: 'app/partical/profile.html'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
