import firebase from 'firebase/compat'

export default {
    actions: {
        async fetchImage ({ commit, dispatch, getters }) {
            try {
                const uid = await dispatch('getUid')
                return await firebase.storage().refFromURL(`gs://vue-vladilen-1d6dc.appspot.com/${uid}`)
                    .child(getters.info.image).getDownloadURL()
                    .then((url) => {
                        return url
                    })
                    .catch((e) => {
                        throw e
                    })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchDefaultImage ({ commit }) {
            try {
                return firebase.storage().refFromURL('gs://vue-vladilen-1d6dc.appspot.com')
                    .child('default-image.png').getDownloadURL()
                    .then((url) => {
                        return url
                    })
                    .catch((e) => {
                        throw e
                    })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async uploadImage ({ commit, dispatch }, image) {
            try {
                const uid = await dispatch('getUid')
                await dispatch('updateInfo', { image: image.name })
                await firebase.storage().ref(`/${uid}/${image.name}`).put(image)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}
