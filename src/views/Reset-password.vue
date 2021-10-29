<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Reset password</span>
            <div class="input-field">
                <input
                    id="email"
                    type="text"
                    v-model.trim="v$.email.$model"
                    :class="{invalid: v$.email.$invalid && v$.email.$dirty}"
                >
                <label for="email">{{$translate('registerEmail')}}</label>
                <small
                    v-if="v$.email.$invalid && v$.email.$dirty && v$.email.$model"
                    class="helper-text invalid"
                    :data-error="this.$translate('registerWrongEmail')"
                ></small>
                <small
                    v-else-if="!v$.email.$model && v$.email.$dirty"
                    class="helper-text invalid"
                    :data-error="this.$translate('registerWriteEmail')"
                ></small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                >
                    Reset password
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{ $translate('registerHaveAcc') }}
                <router-link to="/register">{{$translate('registerRegButton')}}</router-link>
            </p>
            <p class="center">
                {{this.$translate('registerHaveHadAcc')}}
                <router-link to="/login">{{this.$translate('registerLogIn')}}</router-link>
            </p>
        </div>
    </form>

</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import messages from '../utils/messages'

export default {
    name: 'Reset-password',
    setup () {
        return { v$: useVuelidate() }
    },
    data () {
        return {
            email: ''
        }
    },
    validations () {
        return {
            email: { required, email }
        }
    },
    methods: {
        async submitHandler () {
            if (this.v$.$invalid) {
                this.v$.$touch()
                return
            }
            try {
                await this.$store.dispatch('resetPassword', this.email)
                this.$router.push('/login')
                this.$message('We have send you a message to restore your password')
            } catch (e) {}
        }
    }
}
</script>

<style scoped>
.card-content {
    padding-bottom: 0;
}
</style>
