var preferences = (function() {

/* Load preferences from cookies */
var prefDefaults = {
  'predictDistance': 800,
  'defaultFrame' : "Galactic",
  'htmlLabels' : false,
  'showNebulas' : false
};

var loadedPreferences = {};
return {
  load:function(){
    Object.keys( prefDefaults ).forEach(function( pref ) {
        if( Cookies.get( pref ) !== undefined ) {
            loadedPreferences[ pref ] = Cookies.get( pref );
        } else { loadedPreferences[ pref ] = prefDefaults[ pref ]; }

    });

    this.save();
    return 0;
  },

  /* Save Prefs to Cookies */
  save:function(){
    Object.keys( prefDefaults ).forEach(function( pref ) {
      Cookies.set( pref,  loadedPreferences[ pref ] );
    });

    return 0;
  },

  /* Grab Prefs */
  get:function( pref ) {
    return loadedPreferences[ pref ];
  },

  /* Set Preference */
  set:function( pref, value ) {
    if (prefDefaults[ pref ] !== undefined ) {
      loadedPreferences[ pref ] = value;
      this.save();
      return 0;
    }
    return -1;
  },
  list:function() {
    return Object.keys( loadedPreferences );
  }
}

}());
