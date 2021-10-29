import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import locales from './utils/locales'
import router from './router'
import store from './store'
import tooltipDirective from './directives/tooltip.directive.js'
import messagePlugin from './utils/message.plugin.js'
import dateFormat from './utils/dateFormat.plugin'
import 'materialize-css/dist/js/materialize.min'
import Loader from './components/app/Loader'

import firebase from 'firebase/compat'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: 'AIzaSyAZrQ5Qanhw57QgBuiQOzHim4vjh3z4hpc',
    authDomain: 'vue-vladilen-1d6dc.firebaseapp.com',
    projectId: 'vue-vladilen-1d6dc',
    storageBucket: 'vue-vladilen-1d6dc.appspot.com',
    messagingSenderId: '354579624587',
    appId: '1:354579624587:web:b01ec282ecd3b71b8fda8e',
    measurementId: 'G-2GSX64JFPP',
    databaseURL: 'https://vue-vladilen-1d6dc-default-rtdb.europe-west1.firebasedatabase.app'
}
firebase.initializeApp(firebaseConfig)
let app
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)
            .use(messagePlugin)
            .use(dateFormat)
            .use(locales)
            .use(store)
            .use(router)
            .directive('tooltip', tooltipDirective)
            .component('Loader', Loader)
            .mount('#app')
    }
})
