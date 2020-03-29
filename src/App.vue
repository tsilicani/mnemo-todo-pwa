<template>
    <v-app>
        <v-fab-transition>
            <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="primary" @click="toTop">
                <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list dense>
                <v-list-item link to="/">
                    <v-list-item-action>
                        <v-icon>mdi-folder-home-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link to="/todos">
                    <v-list-item-action>
                        <v-icon>mdi-file-table-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Todos</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="installBtn" @click="installer()">
                    <v-list-item-action>
                        <v-icon>mdi-file-download-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Install</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <app-title />
            <v-spacer></v-spacer>
            <template v-if="!$store.getters.userIsLoggedIn">
                <v-btn link to="login" class="mx-2" text>
                    <v-icon left>mdi-account</v-icon>Log In
                </v-btn>
                <v-btn v-if="installBtn" class="mx-2 d-none d-sm-flex" @click="installer()" light>Install</v-btn>
                <v-btn v-else link to="signup" class="mx-2 d-none d-sm-flex" light>Sign Up</v-btn>
            </template>
            <v-menu v-if="$store.getters.userIsLoggedIn" left bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-account</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item link to="/profile">
                        <v-list-item-action>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="logOut" link to="/login">
                        <v-list-item-action>
                            <v-icon>mdi-location-exit</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Log Out</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-content>
            <router-view />
            <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout">
                {{ snackbar.text }}
                <v-btn dark text @click="snackbar.visible = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-snackbar>
        </v-content>
    </v-app>
</template>
<script>
import AppTitle from './components/AppTitle'
const beep = new Audio(require('./assets/audio/beep.mp3'))

export default {
    name: 'app',
    components: { AppTitle },
    data() {
        return {
            drawer: null,
            snackbar: {
                visible: false,
                text: '',
                color: 'primary',
                timeout: 20000
            },
            installBtn: false,
            installer: undefined,
            fab: false,
            dummyInterval: null
        }
    },
    methods: {
        snackbarMessage(text) { this.$eventHub.$emit('snackbar_on', text) },
        snackbarError(err) {
            this.$eventHub.$emit('snackbar_on', err ? err : 'An error is occurred.', 'error')
        },
        logOut() {
            this.$store.dispatch('setLoggedOut')
            this.snackbarMessage('You are now logged out.')
        },
        snackbarOn(text, color = 'primary') {
            this.snackbar.visible = false
            this.snackbar = {
                visible: true,
                text: text,
                color: color
            }
        },
        playBeep() {
            beep.play()
        },
        onScroll(e) {
            if (typeof window === 'undefined') return
            const top = window.pageYOffset || e.target.scrollTop || 0
            this.fab = top > 20
        },
        toTop() {
            this.$vuetify.goTo(0).then(() => { this.$eventHub.$emit('to_top') })
        },
        launchDummyInterval() {
            this.dummyInterval = setInterval(() => {
                const date = new Date()
                if ((date.getMinutes() % 5) == 0) {
                    console.log('Dummy interval.')
                }
            }, (60 * 1000))
        },
    },
    created() {
        let installPrompt;
        window.addEventListener("beforeinstallprompt", e => {
            e.preventDefault()
            installPrompt = e
            this.installBtn = Boolean(installPrompt)
        })
        this.installer = () => {
            this.installBtn = false;
            installPrompt.prompt();
            installPrompt.userChoice.then(result => {
                if (result.outcome === "accepted") {
                    console.log("Install accepted!")
                } else {
                    console.log("Install denied!")
                }
            })
        }
        this.launchDummyInterval()
    },
    beforeMount() {
        this.$eventHub.$on('log_out', this.logOut)
        this.$eventHub.$on('snackbar_on', (message, color) => {
            this.snackbarOn(message, color)
        })
    },
    beforeDestroy() {
        clearInterval(this.dummyInterval)
    },
}
</script>