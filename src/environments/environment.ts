// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBP196irDbj3NgzWnTggEV_5XQJlNhRL5k",
    authDomain: "test-firebase-597da.firebaseapp.com",
    databaseURL: "https://test-firebase-597da.firebaseio.com",
    projectId: "test-firebase-597da",
    storageBucket: "test-firebase-597da.appspot.com",
    messagingSenderId: "344609221856"
  },
  cloudinary: {
    url: 'http://res.cloudinary.com/msn/image/upload/'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
