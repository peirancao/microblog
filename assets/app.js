// fastclick
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

// event emitter
var ee = new EventEmitter();

// vue config
// Vue.config.debug = true;
// Vue.config.devtools = true;

// vue filters
var timeago = timeago();
Vue.filter('timeago', function (value) {
  return timeago.format(value, 'zh_CN');
});

// wilddog

var ref = new Wilddog('https://microblog.wilddogio.com/');

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

// alert component
Vue.component('alert', {
  template: '#alert',
  props: {
    type: {
      type: String,
      default: function () {
        return 'info';
      }
    },
    msg: {
      type: String,
      default: function () {
        return 'message';
      }
    }
  }
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
            author: '我',
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
      email: '',
      emailDefaultValid: true,
      emailValid: false,
      password: '',
      passwordDefaultValid: true,
      passwordValid: false,
      loading: false
    };
  },
  computed: {
    alertType: function () {
      return this.$root.alertType;
    },
    alertMsg: function () {
      return this.$root.alertMsg;
    }
  },
  methods: {
    close: function () {
      ee.trigger('closeLoginForm');
    },
    clearLoginForm: function () {
      this.email = this.password = '';
      this.emailDefaultValid = this.passwordDefaultValid = true;
      this.emailValid = this.passwordValid = false;
    },
    submit: function () {
      var self = this;
      self.loading = true;
      ref.authWithPassword({
        email: self.email,
        password: self.password
      }, function (error, authData) {
        self.loading = false;
        if (error) {
          console.error('*登录组件* 错误代码：' + error.code);
          self.$root.alert('登录失败', 'error', 3000);
        } else {
          self.$root.authData = authData;
          Cookies.set('__AUTH__DATA__', JSON.stringify(authData), { expires: 1 });
          self.$root.alert('登录成功', 'success', 3000);
          self.clearLoginForm()
          self.$root.showLoginForm = false;
        }
      });
    },
    validateEmail: function (value) {
      var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      this.emailValid = pattern.test(value);
      if (!pattern.test(value)) {
        this.emailDefaultValid = false;
      }
      if (value === '') {
        this.emailDefaultValid = true;
      }
    },
    validatePassword: function (value) {
      var pattern =  /[a-zA-Z0-9_]{6,12}/;
      this.passwordValid = pattern.test(value);
      if (!pattern.test(value)) {
        this.passwordDefaultValid = false;
      }
      if (value === '') {
        this.passwordDefaultValid = true;
      }
    }
  }
});

// manager component
Vue.component('manager', {
  template: '#manager',
  created: function () {
    var self = this;
    ee.on('closeLoginForm', function () {
      self.$root.showLoginForm = false;
    });
  },
  computed: {
    auth: function () {
      return this.$root.authData;
    },
    showLoginForm: function () {
      return this.$root.showLoginForm;
    }
  },
  methods: {
    login: function () {
      this.$root.showLoginForm = true;
    },
    logout: function () {
      this.$root.authData = null;
      Cookies.remove('__AUTH__DATA__');
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
    authData: Cookies.get('__AUTH__DATA__') ? JSON.parse(Cookies.get('__AUTH__DATA__')) : null,
    currentView: 'posts-view',
    params: [],
    showLoginForm: false,
    showAlert: false,
    alertType: 'info',
    alertMsg: 'message'
  },
  methods: {
    alert: function (msg, type, d) {
      var self = this;
      self.showAlert = true;
      self.alertMsg = msg;
      self.alertType = type;
      setTimeout(function () {
        self.showAlert = false;
      }, d);
    },
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
