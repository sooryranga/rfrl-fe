<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="about">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Do you want to report {{accusedClient.username}}
            </h5>
            <button v-on:click="cancel" type="button" class="no-styling-button" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <p>Why?</p>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <textarea class="form-control" aria-label="why" v-model="cause"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel" class="btn btn-secondary">
              cancel
            </button>
            <button type="button" v-on:click="save" class="btn btn-primary">Report</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'report-client-modal',
  data: function() {
    return {
      cause: '',
    };
  },
  computed: {
    ...mapGetters('reportClient', ['accusedClient']),
  },
  methods: {
    ...mapActions('reportClient', ['report', 'setAccusedClient']),
    async save() {
      await this.report({
        cause: this.cause,
      });

      this.$emit('closeEditor');
    },
    cancel() {
      this.setAccusedClient(null);
      this.$emit('closeEditor');
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
