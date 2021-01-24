<template>
  <div class="h-100 pt-3 container-xl">
    <div class="row">
      <div class="col-4">
        <div class="row my-auto">
          <h5>Tutoring Session</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {SessionService} from '@/api/SessionService';

export default {
  name: 'session-info',
  data: function() {
    return {
      session: null,
    };
  },
  props: {
    sessionId: {
      type: String,
      required: false,
    },
    localSession: {
      type: Object,
      required: false,
    },
  },
  mounted: async function() {
    try {
      this.session = await SessionService.get(this.sessionId);
    } catch (error) {
      console.error(error);
      this.session = this.localSession;
    }
  },
};
</script>
