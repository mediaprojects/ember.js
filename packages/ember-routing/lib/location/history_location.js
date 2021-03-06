var get = Ember.get, set = Ember.set;

/**
  @class

  Ember.HistoryLocation implements the location API using the browser's
  history.pushState API.

  @extends Ember.Object
*/
Ember.HistoryLocation = Ember.Object.extend(
/** @scope Ember.HistoryLocation.prototype */ {

  /** @private */
  init: function() {
    set(this, 'location', get(this, 'location') || window.location);
    set(this, '_initialURL', get(this, 'location').pathname);
  },

  /**
    Will be pre-pended to path upon state change
   */
  rootURL: '/',

  /**
    @private

    Used to give history a starting reference
   */
  _initialURL: null,

  /**
    @private

    Returns the current `location.pathname`.
  */
  getURL: function() {
    return get(this, 'location').pathname;
  },

  /**
    @private

    Uses `history.pushState` to update the url without a page reload.
  */
  setURL: function(path) {
    var state = window.history.state,
        initialURL = get(this, '_initialURL');

    path = this.formatURL(path);

    if ((initialURL !== path && !state) || (state && state.path !== path)) {
      window.history.pushState({ path: path }, null, path);
    }
  },

  /**
    @private

    Register a callback to be invoked whenever the browser
    history changes, including using forward and back buttons.
  */
  onUpdateURL: function(callback) {
    var guid = Ember.guidFor(this);

    Ember.$(window).bind('popstate.ember-location-'+guid, function(e) {
      callback(location.pathname);
    });
  },

  /**
    @private

    Used when using {{action}} helper.  The url is always appended to the rootURL.
  */
  formatURL: function(url) {
    var rootURL = get(this, 'rootURL');

    if (url !== '') {
      rootURL = rootURL.replace(/\/$/, '');
    }

    return rootURL + url;
  },

  /** @private */
  willDestroy: function() {
    var guid = Ember.guidFor(this);

    Ember.$(window).unbind('popstate.ember-location-'+guid);
  }
});

Ember.Location.registerImplementation('history', Ember.HistoryLocation);
