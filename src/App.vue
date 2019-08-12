<template>
  <div id="app">
    <div class="container">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-half">
          <player
            ref="player"
            :rtspSrc="rtspSrc"/>
        <form>
          <b-field>
              <b-autocomplete
                class="player-url"
                v-model="rtspSrc"
                :data="serverList"
                placeholder="rtsp://..."
                icon-pack="fas"
                icon="video"
                @select="option => selected = option">
              </b-autocomplete>
            <p class="control">
              <b-button
                v-if="$refs.player"
                @click="$refs.player.isPlaying ? $refs.player.stopStream() : $refs.player.startStream()"
                icon-pack="fas"
                :icon-right="$refs.player.isPlaying ? 'stop' :  'play'"
                :type="$refs.player.isPlaying ? 'is-dark' : 'is-success'" />
            </p>
          </b-field>
        </form>

        </div>
        <div class="column">
        </div>
      </div>


      <div
        v-if="$route.query.debug"
        class="columns">
        <div class="column logs-panel" ref="consolePanel">
          <b-tabs
            expanded
            v-model="logTabsActive">
            <b-tab-item
              v-for="(logType) in ['debug', 'error', 'info']"
              :key="logType"
              :label="logType">
                <div
                  :class="logType"
                  class="logs-panel-scroll">
                  <template
                    v-for="(log, key) in console[logType]">
                    <p
                      class="log-item"
                      :key="key"
                      :class="log.type">
                      <b-tag
                        :type="`is-${logsTypeClasses[log.type]}`"
                        @close="isTag2Active = false">
                          {{log.type}}
                      </b-tag>
                      {{log.message}}
                    </p>
                  </template>
                </div>
              </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import player from './components/AppPlayer.vue'

export default {
  name: 'app',
  components: {
    player
  },
  data: () => ({
    appConsole: [],
    // rtspSrc: 'rtsp://camproxy.ru:8554/bars',
    showLogs: false,
    logTabsActive: 0,
    logsTypeClasses: {
      debug: 'dark',
      error: 'danger',
      info: 'info'
    },
    selected: null
  }),
  watch:{
    console(val){
      this.$refs.consolePanel.scrollTop = this.$refs.consolePanel.scrollHeight
    }
  },
  computed: {
    rtspSrc: {
      get(){
        return this.$store.state.activeRTSPUrl
      },
      set(value){
        this.$store.commit('SET_RTSP_SERVER_LIST', value)
      }
    },
    serverList:{
      get(){
        return this.$store.state.RTSPServerList
      },
      set(value){
        this.$store.commit('SET_RTSP_SERVER_LIST', value)
      }
    },
    console:{
      get(){
        return this.$store.state.logs
      },
      set(value){
        this.$store.commit('SET_LOG', value)
      }
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
  @import "bulma/sass/utilities/initial-variables.sass";
  @import "bulma/sass/utilities/derived-variables.sass";
  .player{
    display: block;
    width: 100%;
    height: auto;
    min-height: 420px;
    background: gray;
    padding: 0;
    margin: 0;
  }
  .player-url{
    width: 100%;
  }
  form{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  .logs-panel{

    &-scroll{
      overflow-y: scroll;
      height: 200px;
    }
    .log-item{
      margin-bottom: 5px;
      &.error{
        color: $red;
      }
      &.info{
        color: $info;
      }
      &.debug{
        color: $grey-light;
      }
    }
  }
</style>