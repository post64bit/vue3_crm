export default {
    install: (app, options) => {
        app.config.globalProperties.$dateFormat = function (jsonTime) {
            const options = {
                day: '2-digit',
                year: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }
            return new Intl.DateTimeFormat(this.$store.getters.info.locale || 'ru-RU', options)
                .format(new Date(jsonTime))
        }
    }
}
