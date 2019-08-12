<template>
  <div class="player">
    <video
      width="100%"
      id="rtsp_player"
      height="auto"
      class="has-text-centered"
      ref="rtspPlayer"
      autoplay />
  </div>
</template>

<script>
import Janus from '../plugins/janus'

export default {
  props: {
    rtspSrc:{
      type: String,
      default: "rtsp://camproxy.ru:8554/bars"
    }
  },
  name: 'appPlayer',
  components: {

  },
  data: () => ({
    isLoading: false,
    janusServerUrl: 'camproxy.ru',
    player: null,
    paused: false,
    streaming: null,
    janus: null,
    ports: {
      http: {
        socket: {
          url: 'wss://%s:8989'
        },
        http: {
          url: 'http://%s:8088/janus'
        },
      },
      https: {
        socket: {
          url: 'wss://%s:8989'
        },
        https: {
          url: 'https://%s:8089/janus'
        },
      }
    }
  }),
  watch: {

  },
  created(){
    window.player = this.player
  },
  computed: {
    client(){
      return this.player.client
    },
    isStoped(){
      return  this.playerEl.client.paused
    },
    playerEl(){
      return this.$refs.rtspPlayer
    },
    rtspHost(){
      return window.location.protocol.replace(':', '')
    },
    isSupportWebsocket(){
      return window.WebSocket ? true : false
    },
    rtspServerUrl(){
      let url = this.ports[this.rtspHost][this.isSupportWebsocket ? `socket` : this.rtspHost].url
      return url.replace('%s', this.janusServerUrl)
    },
    isPlaying:{
      get(){
        return this.$store.state.isPlaying
      },
      set(value){
        this.$store.commit('SET_PLAYING_STATE', value)
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
  mounted() {
    this.player = false

    this.$nextTick(function () {
      this.load();
    })
  },
  methods: {
    load(){
      let vm = this
      let janus = null;
      let opaqueId = "streamingtest-"+Janus.randomString(12);

        // Initialize the library (all console debuggers enabled)
        Janus.init({debug: "all", callback: function() {
        // Use a button to start the demo
        // $(this).attr('disabled', true).unbind('click');
        // // Make sure the browser supports WebRTC
        // if(!Janus.isWebrtcSupported()) {
        //   bootbox.alert("No WebRTC support... ");
        //   return;
        // }
        // Create session
        vm.janus = new Janus(
          {
            server: vm.rtspServerUrl,
            success: function() {
              // Attach to streaming plugin
              vm.janus.attach(
                {
                  plugin: "janus.plugin.gstreamer",
                  opaqueId: opaqueId,
                  success: function(pluginHandle) {
                    vm.streaming = pluginHandle;
                    vm.log("Plugin attached! (" + vm.streaming.getPlugin() + ", id=" + vm.streaming.getId() + ")");
                  },
                  error: function(error) {
                    vm.error("-- Error attaching plugin...:", 'error')
                  },
                  onmessage: function(msg, jsep) {
                    vm.debug(" ::: Got a message :::");
                    vm.debug(msg);
                    let result = msg["result"];
                    if(result !== null && result !== undefined) {
                      if(result["status"] !== undefined && result["status"] !== null) {
                        let status = result["status"];
                        if(status === 'stopped')
                          vm.stopStream();
                      }
                    } else if(msg["error"] !== undefined && msg["error"] !== null) {
                      vm.error(msg["error"])
                      vm.stopStream();
                      return;
                    }
                    if(jsep !== undefined && jsep !== null) {
                      vm.debug("Handling SDP as well...");
                      vm.debug(jsep);
                      // Offer from the plugin, let's answer
                      vm.streaming.createAnswer(
                        {
                          jsep: jsep,
                          media: { audioSend: false, videoSend: false },  // We want recvonly audio/video

                          success: function(jsep) {
                            vm.debug("Got SDP!");
                            vm.debug(jsep);
                            let body = { "request": "start" };
                            vm.streaming.send({"message": body, "jsep": jsep});
                            vm.startStream()
                          },
                          error: function(error) {
                            vm.error("WebRTC error:")
                          }
                        });
                    }
                  },
                  onremotestream: function(stream) {
                    vm.debug(" ::: Got a remote stream :::");
                    vm.debug(stream);
                    Janus.attachMediaStream( vm.playerEl, stream);
                  },
                  oncleanup: function() {
                    vm.log(" ::: Got a cleanup notification :::");
                  }
                });
            },
            error: function(error) {
              vm.error("Error:", error)
            },
          });
        }});
    },
    startStream(){
      console.log('STARTSTREAM()');
      if(this.rtspSrc === undefined || this.rtspSrc === null || !this.rtspSrc) {
        this.error("Enter source MRL")
        return;
      }
      this.isPlaying = true
      let data = { "request": "watch", mrl: this.rtspSrc };
      this.streaming.send({"message": data});
      this.$store.commit('SET_RTSP_SERVER_LIST', this.rtspSrc)
    },
    stopStream() {
      console.log('STOPSTREAM()');
      this.isPlaying = false
      this.streaming.send({"message": { "request": "stop" } });
      this.streaming.hangup();
    },
    destroyed(){
      window.location.reload();
    },
    error(message, error = false) {
      Janus.error(message, error);
      this.console = {message: `${message}... ${error ? JSON.stringify(error) : ''}`, type: 'error'}
      this.$buefy.dialog.alert({
        title: 'Error',
        message: `${message}... ${error ? JSON.stringify(error) : ''}`,
        type: 'is-danger',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa'
      })
    },
    log(message) {
      Janus.log(message);
      this.console = {message: `Janus.log: ${message}`, type: 'debug'}
    },
    debug(message){
      Janus.debug(message);
      this.console = {message: message, type: 'debug'}
    }
  }
}
</script>
