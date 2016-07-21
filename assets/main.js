// timeago
Do.add('nzh', { path: 'assets/nzh/nzh.js?v=0.0.2', type: 'js' });
Do.add('timeago', { path: 'assets/timeago.js?v=0.0.1', type: 'js', requires: ['nzh'] });

// fetch
Do.add('es6-promise', { path: 'assets/es6-promise/es6-promise.min.js?v=3.2.2', type: 'js' });
Do.add('fetch', { path: 'assets/fetch/fetch.js?v=1.0.0', type: 'js', requires: ['es6-promise'] });

Do.add('director', { path: 'assets/director/director.min.js?v=1.2.7', type: 'js' });
Do.add('EventEmitter', { path: 'assets/EventEmitter.min.js', type: 'js' });
Do.add('fastclick', { path: 'assets/fastclick.js?v=1.0.6', type: 'js' });
Do.add('js.cookie', { path: 'assets/js.cookie.js?v=2.1.2', type: 'js' });
Do.add('wilddog', { path: 'https://cdn.wilddog.com/js/client/current/wilddog.js', type: 'js' });

Do.add('vue', { path: 'assets/vue.min.js?v=2.0.0-beta.2', type: 'js' });

Do.add('app', { path: 'assets/app.js?v=0.0.1', type: 'js', requires: ['vue', 'fastclick', 'EventEmitter', 'timeago', 'wilddog', 'js.cookie', 'director', 'fetch'] });

Do('app');