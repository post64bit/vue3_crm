<template>
    <div class="app-page">
        <div>
            <div class="page-title">
                <h3>{{$translate('profileTitle')}}</h3>
            </div>
            <div class="form_and_img">
                <form class="form" @submit.prevent="submitHandler">
                    <p>Update your name</p>
                    <div class="input-field">
                        <input
                            id="description"
                            type="text"
                            v-model.trim="v$.name.$model"
                            :class="{invalid: v$.name.$error}"
                        >
                        <label for="description">{{ $translate('profileName') }}</label>
                        <span
                            v-if="v$.name.$error"
                            class="helper-text invalid">{{ $translate('profileMinNameLength') }}
                        {{this.name.length}}/{{this.v$.name.min.$params.min}}</span>
                    </div>
                    <p>Update your bill</p>
                    <div class="input-field">
                        <input
                            id="bill"
                            type="number"
                            v-model="newBill"
                        >
                        <label for="description">Bill</label>
<!--                        <span-->
<!--                            v-if="v$.newBill.$error"-->
<!--                            class="helper-text invalid">Minimal sum is 1</span>-->
                    </div>
                    <div class="switch">
                        <label>
                            ENG
                            <input type="checkbox" v-model="isRuLocale">
                            <span class="lever"></span>
                            RU
                        </label>
                    </div>
                    <div class="btns">
                        <button class="btn waves-effect waves-light" type="submit">
                            Save
                            <i class="material-icons right">send</i>
                        </button>
                        <button @click.prevent="this.$router.push('/update-password')"
                                class="update-pass btn waves-effect waves-light">
                            Update password
                            <i class="material-icons right">send</i>
                        </button>
                        <a class="waves-effect update-pass waves-light btn modal-trigger red" href="#modal1">
                            Delete account
                        </a>
                    </div>
                </form>
                <!-- Modal Structure -->
                <div id="modal1" class="modal">
                    <div class="modal-content">
                        <h4>Delete account</h4>
                        <p>Do you really want do delete your account? It can't be restored</p>
                    </div>
                    <div class="modal-footer">
                        <a @click="deleteAccount" href="#!"
                           class="modal-close waves-effect waves-green btn-flat red">Yes</a>
                        <a style="margin-left: 40px;" href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
                    </div>
                </div>
                <!-- Modal Structure -->
                <Loader v-if="loading"/>
                <div v-show="!loading" class="img_and_btn">
                    <div class="image_wrapper">
                          <img ref="img" src="" alt="" class="circle responsive-img">
                    </div>
                    <div class="div_btn">
                        <form action="#">
                            <div class="file-field input-field">
                                <div class="btn">
                                    <span>choose a photo</span>
                                    <input @change="loadImg" accept="image/*" type="file">
                                </div>
                                <div class="file-path-wrapper">
                                    <input class="file-path validate" type="text">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="button_and_spinner">
                        <div>
                            <button @click="loadNextImage" class="btn waves-effect waves-light" name="action">Random photo
                                <i class="material-icons right">lightbulb_outline</i>
                            </button>
                        </div>
                        <div :class="{hideSpinner: loadingForSpinner}" class="spinner"></div>
                    </div>
                    <div>
                        <button @click="upLoad" class="save_btn btn waves-effect waves-light" name="action">Save
                            <i class="material-icons right">send</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { minLength, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import firebase from 'firebase/compat'
import axios from 'axios'
import Loader from '../components/app/Loader'

export default {
    name: 'Profile',
    components: { Loader },
    data () {
        return {
            v$: useVuelidate(),
            name: '',
            isRuLocale: true,
            oldInfo: this.$store.getters.info,
            emojis: ['😄', '😃', '😀', '😊', '😉', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😁', '😌'],
            imageFile: null,
            loading: true,
            newBill: 0,
            loadingForSpinner: false
        }
    },
    validations () {
        return {
            name: { required, min: minLength(4) }
        }
    },
    async mounted () {
        this.isRuLocale = this.$store.getters.info.locale === 'ru-RU'
        this.name = this.$store.getters.info.name
        setTimeout(() => {
            M.updateTextFields()
        })
        if (this.$store.getters.info.image === 'default-image.png') {
            this.$refs.img.src = await this.$store.dispatch('fetchDefaultImage')
        } else if (this.$store.getters.info.lastUpdateIsImgUrl) {
            this.$refs.img.src = this.$store.getters.info.imgUrl
        } else {
            this.$refs.img.src = await this.$store.dispatch('fetchImage')
        }
        this.loading = false
        const elems = document.querySelectorAll('.modal')
        const instances = M.Modal.init(elems)
    },
    methods: {
        async submitHandler () {
            this.v$.$validate()
            if (!this.v$.$error) {
                if (this.newBill > 0) {
                    await this.$store.dispatch('updateInfo', {
                        bill: this.newBill
                    })
                }
                await this.$store.dispatch('updateInfo', {
                    name: this.name,
                    locale: this.isRuLocale ? 'ru-RU' : 'en-US'
                })
                this.v$.$reset()
                this.oldInfo = this.$store.getters.info
                this.name = ''
                const uid = await this.$store.dispatch('getUid')
                const locale = (await firebase.database().ref(`/users/${uid}/info/locale`).once('value')).val()
                localStorage.setItem('language', locale)
                // this.$router.go()
            } else {
                this.$message(this.$translate('profileToastWarning'))
            }
        },
        loadImg (event) {
            this.imageFile = event.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(this.imageFile)
            reader.onload = () => {
                this.$refs.img.src = reader.result
            }
        },
        async loadNextImage () {
            this.loadingForSpinner = true
            try {
                axios.defaults.headers.common['x-api-key'] = '3ee6dc37-ff49-4dc2-b187-d8e01b422cfe'
                const imageFileRandom = await axios.get('https://api.thecatapi.com/v1/images/search', {
                    params: {
                        limit: 1,
                        size: 'full'
                    }
                })
                this.imageFile = imageFileRandom.data[0]
                this.$refs.img.src = imageFileRandom.data[0].url
            } catch (e) {
                console.log(e)
            }
            function imgComplete (complete) {
                if (!complete.$refs.img.complete) {
                    setTimeout(imgComplete, 200, complete)
                } else {
                    complete.loadingForSpinner = false
                }
            }
            imgComplete(this)
        },
        async upLoad () {
            if (this.imageFile instanceof File) {
                await this.$store.dispatch('uploadImage', this.imageFile)
                await this.$store.dispatch('updateInfo', { lastUpdateIsImgUrl: false })
            } else {
                await this.$store.dispatch('updateInfo', {
                    imgUrl: this.imageFile.url,
                    lastUpdateIsImgUrl: true
                })
            }
            this.$message('Your photo is updated')
        },
        async deleteAccount () {
            this.$router.push('/login-to-del')
        }
    },
    watch: {
        'oldInfo.name': function () {
            this.$message(this.$translate('profileToastNameWasChanged') + this.emojis[Math.floor(Math.random() * this.emojis.length)])
        },
        'oldInfo.locale': function () {
            this.$message(this.$translate('profileToastLanguageWasChanged') + this.emojis[Math.floor(Math.random() * this.emojis.length)])
        }
    }
}
</script>

<style scoped>
/*spinner */
.spinner {
    margin-left: 20px;
    opacity: 0;
}
.hideSpinner {
    opacity: 1;
}

.spinner:after {
    animation: changeContent .8s linear infinite;
    display: block;
    content: "⠋";
    font-size: 30px;
}

@keyframes changeContent {
    10% { content: "⠙"; }
    20% { content: "⠹"; }
    30% { content: "⠸"; }
    40% { content: "⠼"; }
    50% { content: "⠴"; }
    60% { content: "⠦"; }
    70% { content: "⠧"; }
    80% { content: "⠇"; }
    90% { content: "⠏"; }
}
/*spinner end */

.button_and_spinner {
    display: flex;
    align-items: center;
}

.switch {
    margin-bottom: 2rem;
}
.circle {
    width: 200px;
    height: 200px;
    object-fit: cover;
}
.form_and_img {
    display: flex;
}
@media screen and (max-width: 900px) {
    .form_and_img {
        flex-direction: column;
    }
}
.form {
    width: 400px;
    margin-right: 200px;
}
.img_and_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.div_btn {
    margin-top: 10px;
}
.save_btn {
    margin-top: 20px;
}
.btns {
    display: flex;
    flex-direction: column;
    max-width: 250px;
}
.update-pass {
    margin-top: 20px;
}
</style>
