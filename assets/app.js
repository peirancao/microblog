Vue.config.debug = true;
Vue.config.devtools = true;

var ref = new Wilddog("https://microblog.wilddogio.com/");

ref.authWithPassword({
    email    : '21766691@qq.com',
    password : 'mb366524680'
}, authHandler);

function authHandler (error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
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
    console.log("The read failed: " + errorObject.code);
});

Vue.component('media-list', {
  template: '#media-list',
  props: {
    medias: {
      type: Array,
      default: function () {
        return [
          {
            id: 1,
            avatarholder: 'p',
            heading: 'heading',
            content: 'content'
          }
        ];
      }
    }
  }
});

Vue.component('card', {
  template: '#card',
  props: {
    title: {
      type: String,
      default: function () {
        return 'title';
      }
    },
    content: {
      type: String,
      required: true,
      default: function () {
        return 'content';
      }
    }
  }
});

Vue.component('main-view', {
  template: '#main-view'
});

Vue.component('article-view', {
  template: '#article-view'
});

var Root = new Vue({
  el: '#app',
  data: {
    currentView: 'main-view',
    params: []
  }
});

var router = new Router();

router.on('main', navigate('main-view'));
router.on('article/:id', navigate('article-view'));

router.init();

function navigate (route) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    Root.currentView = route;
    Root.params = args;
    console.log(Root.currentView);
  };
}

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
