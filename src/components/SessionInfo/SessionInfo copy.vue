<template>
  <div class="h-100 container-xl">
    <div class="row">
      <div class="col">
        <h1>Tutoring session</h1>
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
      required: true,
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
