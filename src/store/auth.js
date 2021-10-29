import firebase from 'firebase/compat'

export default {
    actions: {
        async login ({ dispatch, commit, getters }, { email, password }) {
            try {
                const userCred = await firebase.auth().signInWithEmailAndPassword(email, password)
                if (userCred.user.emailVerified === false) {
                    await firebase.auth().signOut()
                }
                return userCred.user.emailVerified
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async register ({ dispatch, commit }, { email, password, name }) {
            try {
                const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password)
                await userCred.user.sendEmailVerification()
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    image: 'default-image.png',
                    name
                })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async resetPassword ({ commit }, email) {
            try {
                await firebase.auth().sendPasswordResetEmail(email)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async deleteAccount ({ commit }) {
            try {
                await firebase.auth().currentUser.delete()
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updatePassword ({ dispatch, commit }, newPassword) {
            try {
                await firebase.auth().currentUser.updatePassword(newPassword)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        getUid () {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        },
        async logout ({ commit }) {
            await firebase.auth().signOut()
            commit('clearInfo')
        }
    }
}
