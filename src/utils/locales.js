import store from '../store/index'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const locales = {
    'ru-RU': ru,
    'en-US': en
}

export default {
    install: (app, options) => {
        app.config.globalProperties.$translate = function (key) {
            const locale = this.$store.getters.info.locale || localStorage.getItem('language') || 'ru-RU'
            return locales[locale][key] || `localise error ${key} not found`
        }
    }
}
function translate (key) {
    const locale = store.getters.info.locale || localStorage.getItem('language') || 'ru-RU'
    return locales[locale][key] || `localise error ${key} not found`
}

export { translate }
