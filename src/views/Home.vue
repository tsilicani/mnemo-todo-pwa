<template>
    <div>
        <section id="hero">
            <v-row no-gutters>
                <v-img :height="'calc(100vh - ' + $vuetify.application.top + 'px)'" src="@/assets/img/desk.jpeg">
                    <v-overlay :absolute="true" :opacity="0.8" :value="true" color="white">
                        <v-theme-provider>
                            <v-container fill-height>
                                <v-row align="center" class="mx-auto" justify="center">
                                    <v-col class="grey--text text--darken-3 text-center" cols="12" tag="h1">
                                        <span :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']" class="font-weight-black">
                                            MNEMO
                                        </span>
                                        <br>
                                        <span class="font-weight-light" :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']">
                                            TODO PROGRESSIVE WEB APP
                                        </span>
                                    </v-col>
                                    <v-btn color="grey" class="align-self-end text--darken-4" fab outlined @click="$vuetify.goTo('#about-me')">
                                        <v-icon>mdi-chevron-double-down</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </v-theme-provider>
                    </v-overlay>
                </v-img>
            </v-row>
        </section>
        <section id="about-me">
            <div class="py-12"></div>
            <v-container class="text-center grey--text text--darken-4">
                <h2 class="display-2 font-weight-bold mb-3">WHY?</h2>
                <v-responsive class="mx-auto mb-8" width="56">
                    <v-divider class="mb-1"></v-divider>
                    <v-divider></v-divider>
                </v-responsive>
                <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
                    Why use reminders and what is the difference with the calendar? Reminders are used to remember things, commissions, everything that has a deadline or that I can do in a certain place (shops, post offices, library, etc.), to free the mind from things that take up unnecessary space.
                    The commitments that I write as a reminder are NOT fixed appointments or appointments with someone, they are usually quick tasks or actions that can be both work and personal.
                </v-responsive>
                <v-avatar class="elevation-12 mb-12" size="128">
                    <v-img src="@/assets/img/time.jpg"></v-img>
                </v-avatar>
                <div></div>
                <v-btn color="grey" @click="$vuetify.goTo('#features')" outlined large>
                    <span class="grey--text text--darken-1 font-weight-bold">
                        Features
                    </span>
                </v-btn>
            </v-container>
            <div class="py-12"></div>
        </section>
        <section id="features" class="grey lighten-3">
            <div class="py-12"></div>
            <v-container class="text-center grey--text text--darken-4">
                <h2 class="display-2 font-weight-bold mb-3">FEATURES</h2>
                <v-responsive class="mx-auto mb-12" width="56">
                    <v-divider class="mb-1"></v-divider>
                    <v-divider></v-divider>
                </v-responsive>
                <v-row>
                    <v-col v-for="({ icon, title, text }, i) in features" :key="i" cols="12" md="4" class="align-lg-stretch">
                        <v-card class="py-12 px-4 fill-height" color="grey lighten-5" flat>
                            <v-theme-provider dark>
                                <div>
                                    <v-avatar color="primary" size="88">
                                        <v-icon large v-text="icon"></v-icon>
                                    </v-avatar>
                                </div>
                            </v-theme-provider>
                            <v-card-title class="justify-center font-weight-black text-uppercase" v-text="title"></v-card-title>
                            <v-card-text class="subtitle-1" v-text="text">
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <div class="py-12"></div>
        </section>
        <section id="stats">
            <v-parallax :height="$vuetify.breakpoint.smAndDown ? 700 : 500" src="@/assets/img/night.jpeg">
                <v-container class="text-center">
                    <v-row class="mx-auto mb-12">
                        <v-col v-for="[value, title] of stats" :key="title" cols="12" md="6">
                            <div class="text-center">
                                <div class="display-3 font-weight-black mb-4" v-text="value"></div>
                                <div class="title font-weight-regular text-uppercase" v-text="title"></div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-btn :class="$vuetify.breakpoint.smAndDown ? 'mt-6' : 'mt-12'" link to="/todos" color="primary" @click="$vuetify.goTo('#features')" large dark>
                        <span class="font-weight-bold">
                            Try It!
                        </span>
                    </v-btn>
                </v-container>
            </v-parallax>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        return {
            features: [{
                    icon: 'mdi-database-search',
                    title: 'Fuzzy Search',
                    text: 'Search through the approximate matching of keywords, managing to find a greater number of results within the various todo tasks.',
                },
                {
                    icon: 'mdi-responsive',
                    title: 'Responsive',
                    text: 'Today every web application needs a good look and must work perfectly on a desktop, a smartphone, a tablet and above all on any type of browser. For this reason, Mnemo has adopted the Google Material Design and the grid system to obtain these results.',
                },
                {
                    icon: 'mdi-cloud-off-outline',
                    title: 'Offline support',
                    text: 'Mnemo is a progressive web app and can be installed on your device, enjoying offline use and reduced data transmission.',
                },
            ],
            stats: [
                ['3Mb', 'Size'],
                ['Unlimited', 'Todos']
            ],
        }
    }
}
</script>