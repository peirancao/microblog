(function (window) {
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
  var timeago = window.timeago();
  Vue.filter('timeago', function (value) {
    return timeago.format(value, 'zh_CN');
  });

  // custom elements
  Vue.component('h-char', {
    template: '<span><slot></slot></span>'
  });

    Vue.component('h-inner', {
    template: '<span><slot></slot></span>'
  });

  // wilddog

  var ref = new Wilddog('https://microblog.wilddogio.com/');

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
  Vue.component('posts-list', {
    template: '#posts-list',
    data: function () {
      return {
        loading: false,
        posts: {}
      };
    },
    computed: {
      params: function () {
        return this.$root.params;
      },
      auth: function () {
        if (this.$root.authData !== null) {
          return true;
        }
        return false;
      }
    },
    watch: {
      'params': function (val, oldVal) {
        var self = this;
        if (val.length && /^-/.test(val[0])) {
          var postsRef = ref.child('posts');
          postsRef.orderByChild('nid').equalTo(val[0]).on('value', function (snapshot) {
            var _data = snapshot.val();
            if (_data) {
              var _res = [];
              
              for (var key in _data) {
                var _obj = _data[key];
                var _new = _.assign({}, _obj, { id: key });
                _res.push(_new);
              }

              self.posts = _.sortBy(_res, function (o) {
                return -o.datetime;
              });
            } else  {
              self.posts = {};
            }
          });
        } else {
          self.loadAll();
        }
      }
    },
    created: function () {
      this.loadAll();
    },
    methods: {
      loadAll: function () {
        var self = this;
        self.loading = true;
        ref.child('posts').on('value', function (snapshot) {
          var _data = snapshot.val();
          var _res = [];
          
          for (var key in _data) {
            var _obj = _data[key];
            var _new = _.assign({}, _obj, { id: key });
            _res.push(_new);
          }

          self.posts = _.sortBy(_res, function (o) {
            return -o.datetime;
          });
          self.loading = false;
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
          self.loading = false;
        });
      },
      removePost: function (id) {
        var postRef = ref.child('posts/' + id);
        postRef.remove();
        this.loadAll();
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
        if (this.$root.authData) {
          return true;
        } else {
          return false;
        }
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
        window.location.href = '/';
      },
      showReplayBox: function () {
        ee.trigger('showReplay');
      }
    }
  });

  // nav component
  Vue.component('main-nav', {
    template: '#main-nav',
    data: function () {
      return {
        nodes: []
      };
    },
    created: function () {
      var self = this;
      var nodesRef = ref.child('nodes');
      nodesRef.on('value', function (snapshot) {
        self.nodes = snapshot.val();
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
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
        post: {
          nid: 1,
          node: 'default',
          author: '我',
          title: '标题',
          blockquote: '引用',
          cite: 'https://n2x.in',
          description: '描述',
          content: '内容',
          datetime: '2016-07-20',
        },
        loading: false
      };
    },
    activated: function () {
      var self = this;
      self.loading = true;
      var nid = this.$root.params[0];
      var postRef = ref.child('posts/' + nid);
      postRef.on('value', function (snapshot) {
        if (snapshot.val()) {
          self.post = snapshot.val();
        }
        self.loading = false;
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
        self.loading = false;
      });
    }
  });

  // comments component
  Vue.component('comments', {
    template: '#comments',
    data: function () {
      return {
        showReplay: false,
        replayContent: '',
        postContent: '',
        comments: {}
      };
    },
    computed: {
      params: function () {
        return this.$root.params;
      },
      auth: function () {
        if (this.$root.authData) {
          return true;
        } else {
          return false;
        }
      },
      id: function () {
        return this.$root.params[0];
      }
    },
    watch: {
      'params': function (val, oldVal) {
        var self = this;
        if (val.length && /^-/.test(val[0])) {
          var commentsRef = ref.child('posts/' + val[0] + '/comments');
          commentsRef.on('value', function (snapshot) {
            if (snapshot.val()) {
              self.comments = snapshot.val();
            } else {
              self.comments = {};
            }
            self.postContent = self.replayContent = '';
          });
        }
      }
    },
    created: function () {
      var self = this;
      ee.on('showReplay', function () {
        self.showReplay = !self.showReplay ;
      });
      var commentsRef = ref.child('posts/' + this.id + '/comments');
      commentsRef.on('value', function (snapshot) {
        if (snapshot.val()) {
          self.comments = snapshot.val();
        }
        self.postContent = self.replayContent = '';
      });
    },
    methods: {
      removeComment: function (key) {
        var self = this;
        var commentRef = ref.child('posts/' + self.id + '/comments/' + key);
        commentRef.remove();
      },
      postComment: function (e, type) {
        if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
          e.preventDefault();
          var self = this;
          var commentsRef = ref.child('posts/' + this.id);
          commentsRef.child('comments').push({
            content: self.postContent,
            author: '主',
            datetime: (new Date()).getTime()
          });
        }
      },
      postReplayComment: function (e, type) {
        if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
          e.preventDefault();
          var self = this;
          var commentsRef = ref.child('posts/' + this.id);
          commentsRef.child('comments').push({
            content: self.replayContent,
            author: '宾',
            datetime: (new Date()).getTime()
          });
        }
      }
    }
  });

  // compose view component
  Vue.component('compose', {
    template: '#compose',
    data: function () {
      return {
        showSelectNode: true,
        showNewNode: false,
        node: '生活',
        nid: '',
        newNode: '',
        postTitle: '',
        postDescription: '',
        postContent: '',
        postQuote: '',
        postCite: '',
        viewLoading: false,
        loading: false,
        nodes: [],
        action: 'add'
      };
    },
    activated: function () {
      var self = this;
      var params = self.$root.params;
      if(params.length) {
        self.action = 'update';
        var id = params[0];
        var postRef = ref.child('posts/' + id);
        postRef.on('value', function (snapshot) {
          var post = snapshot.val();
          self.node = post.node;
          self.postTitle = post.title;
          self.postQuote = post.blockquote;
          self.postCite = post.cite;
          self.postContent = post.content;
          self.postDescription = post.description;
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
          self.viewLoading = false;
        });
      }
      var nodesRef = ref.child('nodes');
      this.viewLoading = true;
      nodesRef.on('value', function (snapshot) {
        self.nodes = snapshot.val();
        self.viewLoading = false;
        nodesRef.orderByChild('name').equalTo(self.node).on('value', function (snapshot2) {
          self.nid = _.keys(snapshot2.val())[0];
          self.viewLoading = false;
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
          self.viewLoading = false;
        });
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
        self.viewLoading = false;
      });
    },
    methods: {
      clearForm: function (node) {
        this.showSelectNode = true;
        this.showNewNode = false;
        this.node = node;
        this.newNode = '';
        this.postTitle = '';
        this.postDescription = '';
        this.postContent = '';
        this.postQuote = '';
        this.postCite = '';
        this.loading = false;
      },
      submit: function () {
        this.loading = true;
        var nodesRef = ref.child('nodes');
        var postsRef = ref.child('posts');
        var self = this;
        var node = this.node;
        if (this.showNewNode) {
          node = this.newNode;
        } else {
          node = this.node;
        }
        postsRef.once('child_added', function (snapshot) {
          self.loading = false;

          self.$root.alert('发布成功', 'success', 3000);
          setTimeout(function() {
            self.clearForm(node);
          }, 0);
        }, function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
          self.loading = false;
        });

        if (self.action === 'add') {
          if (this.showNewNode) {
            var newNodeRef = nodesRef.push({
              name: node
            });
            nodesRef.once('child_added', function (snapshot) {
              var post = {
                  nid: newNodeRef.key(),
                  node: self.newNode,
                  author: '我',
                  title: self.postTitle,
                  blockquote: self.postQuote,
                  cite: self.postCite,
                  description: self.postDescription,
                  content: self.postContent,
                  datetime: (new Date()).getTime()
              };

              self.addPost(postsRef, post);
            }, function (errorObject) {
              console.log('The read failed: ' + errorObject.code);
              self.loading = false;
            });
          } else {
            var post = {
                nid: self.nid,
                node: self.node,
                author: '我',
                title: self.postTitle,
                blockquote: self.postQuote,
                cite: self.postCite,
                description: self.postDescription,
                content: self.postContent,
                datetime: (new Date()).getTime()
            };
            self.addPost(postsRef, post);
          }
        } else if (self.action === 'update') {
          var _post = {
                nid: self.nid,
                node: self.node,
                author: '我',
                title: self.postTitle,
                blockquote: self.postQuote,
                cite: self.postCite,
                description: self.postDescription,
                content: self.postContent,
                datetime: (new Date()).getTime()
            };
            var _id = self.$root.params[0];
            var _postRef = ref.child('posts/' + _id);
            _postRef.update(_post);
        }
      },
      addPost: function (ref, post) {
        ref.push(post);
      },
      selectNode: function (e) {
        var node = e.target.value;
        if (node === '创建新节点') {
          this.showSelectNode = false;
          this.showNewNode = true;
        } else {
          if (node) {
            var nid = e.target.querySelector('option:checked').id;
            this.nid = nid;
          }
        }
      },
      goSelectNode: function () {
        this.node = '生活';
        this.showSelectNode = true;
        this.showNewNode = false;
      }
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

  router.on('posts/:id', navigate('posts-view'));
  router.on('post/:id', navigate('post-view'));
  router.on('compose', navigate('compose', true));
  router.on('compose/:id', navigate('compose', true));

  router.init();

  function requireAuth (route) {
    var _list = ['compose'];
    return _list.indexOf(route) > -1;
  }

  function navigate (route, auth) {
    return function (_route) {
      return function () {
        if (auth && requireAuth(_route) && !Root.authData) {
          window.location.href = '/';
          return false;
        }
        var args = Array.prototype.slice.call(arguments);
        Root.currentView = _route;
        Root.params = args;
      };
    }(route);
  }

  // fetch example
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

})(this);