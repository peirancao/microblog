(function (exports) {
  
  var Types = {
    SET_AUTH_DATA: 'SET_AUTH_DATA',
    GET_AUTH_DATA: 'GET_AUTH_DATA',
    SET_ROUTE: 'SET_CURRENT_VIEW',
    GET_ROUTE: 'GET_CURRENT_VIEW',
    SET_LOGIN_FORM: 'SHOW_LOGIN_FORM',
    GET_LOGIN_FORM: 'HIDE_LOGIN_FORM',
    SET_ALERT: 'SET_ALERT_TYPE',
    GET_ALERT: 'GET_ALERT_MSG'
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
    setAlert: function (data) {
      return {
        type: Types.SET_ALERT,
        data: data
      };
    },
    getAlert: function () {
      return {
        type: Types.GET_ALERT
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
    alert: {
	    showAlert: false,
      alertType: 'info',
      alertMsg: 'message'  
    }
  };

  function auth (state, action) {
    state = state || initialState.auth;
    switch (action.type) {
      case Types.GET_AUTH_DATA:
        return state.data;
      case Types.SET_AUTH_DATA:
        state.data = action.data;
        return state.data;
    }
  }

  function route (state, action) {
    state = state || initialState.route;
    switch (action.type) {
      case Types.GET_ROUTE:
        return state.route;
      case Types.SET_ROUTE:
        state.data = action.data;
        return state.data;
    }
  }

})(window);