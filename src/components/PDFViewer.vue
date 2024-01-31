<template>
  <div id="pdf-container">
    <loading :active.sync="isLoading" :is-full-page="false"/>
    <div id="pdf" :style="pdfStyle">
      <pdf
        :src="loadingSrc"
        :page="page"
        @num-pages="numPages = $event"
        @progress="progress = $event"/>
    </div>
    <div v-if="!isOpen" id="overlay">
    </div>
    <button
      v-if="!isOpen"
      type="button"
      id="see-more-button"
      class="primary-btn primary-btn-dark"
      @click="isOpen = true"
    >
        Show More
    </button>
    <div v-if="isOpen && numPages>1" style="width:100%">
      <div id="page-changer">
        <input
            v-if="!isLoading"
            v-model.number="page"
            type="number"
            min="1"
            style="width:3rem"
            :max="numPages"
          >
        / {{numPages}}
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import pdf from 'vue-pdf';

export default {
  props: {
    src: {
      type: String,
    },
  },
  components: {
    pdf,
    Loading,
  },
  computed: {
    isLoading() {
      return this.progress < 1;
    },
    loadingSrc() {
      return pdf.createLoadingTask(this.src);
    },
    pdfStyle() {
      if (!this.isOpen) {
        return {
          height: '10rem',
          top: 0,
          left: 0,
          overflow: 'hidden',
          // width: '80%',
          // marginLeft: 'auto',
          // marginRight: 'auto',
        };
      }

      return {
        top: 0,
        left: 0,
        height: '100%',
        // width: '80%',
        // marginLeft: 'auto',
        // marginRight: 'auto',
      };
    },
  },
  data() {
    return {
      isOpen: false,
      numPages: 0,
      page: 1,
      progress: 1,
    };
  },
};
</script>

<style scoped>
#pdf-container{
  width:100%;
  position:relative;
  margin-bottom: 1rem;
}

#page-changer{
  margin-left:auto;
  margin-right:auto;
  width: 5rem;
  height: 2rem;
}

#see-more-button{
  padding-left:2rem;
  padding-right:2rem;
  padding-top:0.5rem;
  padding-bottom: 0.5rem;
  bottom:-1.25rem;
  left:50%;
  transform: translateX(-50%);
  z-index: 3;
  position:absolute;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.3);
  box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.3);
}

#overlay{
  height: 10rem;
  width:100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0,0,0,0.05);
}

.smooth-enter-active, .smooth-leave-active {
  transition: all .5s;
}
.smooth-enter, .smooth-leave-to {
  height: 10rem;
}

</style>
