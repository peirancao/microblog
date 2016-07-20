// fastclick
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

// event emitter
var ee = new EventEmitter();

// vue config
Vue.config.debug = true;
Vue.config.devtools = true;

// vue filters
var timeago = timeago();
Vue.filter('timeago', function (value) {
  return timeago.format(value, 'zh_CN');
});

// wilddog

var ref = new Wilddog('https://microblog.wilddogio.com/');

ref.authWithPassword({
  email: '21766691@qq.com',
  password: 'mb366524680'
}, authHandler);

function authHandler (error, authData) {
  if (error) {
    console.log('Login Failed!', error);
  } else {
    console.log('Authenticated successfully with payload:', authData);
  }
}

// ref.child('posts').push({
//   author: 'peiran',
//   title: 'title',
//   description: 'description',
//   content: 'content',
//   datetime: 'timeago'
// });

ref.child('posts').on('value', function (snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});

// media list component
Vue.component('media-list', {
  template: '#media-list',
  props: {
    medias: {
      type: Array,
      default: function () {
        return [
          {
            id: 1,
            author: '曹',
            title: '标题',
            description: '描述',
            content: '内容',
            datetime: '2016-07-20'
          }
        ];
      }
    }
  }
});

// login form component
Vue.component('login-form', {
  template: '#login-form',
  data: function () {
    return {
      defaultValid: true,
      email: '',
      emailValid: false,
      password: '',
      passwordValid: false
    };
  },
  methods: {
    close: function () {
      ee.trigger('closeLoginForm');
    },
    validateEmail: function (value) {
      var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      this.emailValid = pattern.test(value);
    },
    validatePassword: function (value) {
      var pattern =  /[a-zA-Z0-9_]{6,12}/;
      this.passwordValid = pattern.test(value);
    }
  }
});

// manager component
Vue.component('manager', {
  template: '#manager',
  created: function () {
    var self = this;
    ee.on('closeLoginForm', function () {
      self.showLoginForm = false;
    });
  },
  data: function () {
    return {
      showLoginForm: false
    };
  },
  computed: {
    auth: function () {
      return this.$root.authData;
    }
  },
  methods: {
    login: function () {
      this.showLoginForm = true;
    }
  }
});

// posts view component
Vue.component('posts-view', {
  template: '#posts-view'
});

// post view component
Vue.component('post-view', {
  template: '#post-view',
  data: function () {
    return {
      id: 1,
      author: '曹',
      title: '标题',
      blockquote: '引用',
      cite: 'https://n2x.in',
      description: '描述',
      content: '内容',
      datetime: '2016-07-20'
    };
  }
});

// root component
var Root = new Vue({
  el: '#app',
  data: {
    currentView: 'posts-view',
    authData: null,
    params: []
  }
});

// router config
var router = new Router();

router.on('posts', navigate('posts-view'));
router.on('post/:id', navigate('post-view'));

router.init();

function navigate (route) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    Root.currentView = route;
    Root.params = args;
  };
}

//fetch example
// fetch('http://101.201.149.178/FrontInfos/info_weather?sehqu=all')
//   .then(function (response) {
//     if (response.status >= 400) {
//       throw new Error("Bad response from server");
//     }
//     return response.json();
//   })
//   .then(function(data) {
//     console.log(data);
//   });
