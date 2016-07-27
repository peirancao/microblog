window.app = window.app || {};
(function (exports) {
  
  var Types = {
    SET_AUTH_DATA: 'SET_AUTH_DATA',
    GET_AUTH_DATA: 'GET_AUTH_DATA',
    SET_ROUTE: 'SET_CURRENT_VIEW',
    GET_ROUTE: 'GET_CURRENT_VIEW',
    SET_LOGIN_FORM: 'SHOW_LOGIN_FORM',
    GET_LOGIN_FORM: 'HIDE_LOGIN_FORM',
    SET_MESSAGE: 'SET_MESSAGE_TYPE',
    GET_MESSAGE: 'GET_MESSAGE_MSG'
  };

  var Actions = {
    setAuthData: function (data) {
      return {
        type: Types.SET_AUTH_DATA,
        data: data
      };
    },
    getAuthData: function () {
      return {
        type: Types.GET_AUTH_DATA
      };
    },
    setRoute: function (data) {
      return {
        type: Types.SET_ROUTE,
        data: data
      };
    },
    getRoute: function () {
      return {
        type: Types.GET_ROUTE
      };
    },
    setMessage: function (data) {
      return {
        type: Types.SET_MESSAGE,
        data: data
      };
    },
    getMessage: function () {
      return {
        type: Types.GET_MESSAGE
      };
    },
    setLoginForm: function (data) {
      return {
        type: SET_LOGIN_FORM,
        data: data
      };
    },
    getLoginForm: function () {
      return {
        type: GET_LOGIN_FORM
      };
    }
  };

  var initialState = {
    auth: {
      authData: null
    },
    route: {
      currentView: 'posts-view',
      params: []
    },
    loginForm: {
      showLoginForm: false
    },
    message: {
	    showMessage: false,
      messageType: 'info',
      messageMsg: 'message'  
    }
  };

  function auth (state, action) {
    state = state || initialState.auth;
    switch (action.type) {
      case Types.GET_AUTH_DATA:
        return state;
      case Types.SET_AUTH_DATA:
        return _.assign({}, state, action.data);
      default:
        return state;
    }
  }

  function route (state, action) {
    state = state || initialState.route;
    switch (action.type) {
      case Types.GET_ROUTE:
        return state;
      case Types.SET_ROUTE:
        return _.assign({}, state, action.data);
      default:
        return state;
    }
  }

  function loginForm (state, action) {
    state = state || initialState.loginForm;
    switch (action.type) {
      case Types.GET_LOGIN_FORM:
        return state;
      case Types.SET_LOGIN_FORM:
        return _.assign({}, state, action.data);
      default:
        return state;
    }
  }

  function message (state, action) {
    state = state || initialState.message;
    switch (action.type) {
      case Types.GET_MESSAGE:
        return state;
      case Types.SET_MESSAGE:
        return _.assign({}, state, action.data);
      default:
        return state;
    }
  }

  var combineReducers = Redux.combineReducers;
  var createStore = Redux.createStore;
  
  var appReducers = combineReducers({
    auth: auth,
    route: route,
    loginForm: loginForm,
    message: message
  });

  var store = createStore(appReducers);
  exports.actions = exports.actions || Actions;
  exports.store = exports.store || store;
})(window.app);

