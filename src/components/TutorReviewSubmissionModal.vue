<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="about">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{tutorFirstName}} {{tutorLastName}} Review</h5>
            <button v-on:click="cancel(false)" type="button" class="no-styling-button" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <p> Stars </p>
              </div>
              <div class="row">
                <div class="col"
                v-for="(starType, index) in reviewStars"
                v-bind:key="index">
                  <span v-on:click="updateStars(index)" class="material-icons stars">
                    {{starType}}
                  </span>
                </div>
              </div>
              <div class="row">
                <p>Summary Headline</p>
              </div>
              <div class="row">
                <input type="text" class="form-control" placeholder="Summary Headline" v-model="headline"/>
              </div>
              <div class="row">
                <p>Review</p>
              </div>
              <div class="row">
                <textarea class="form-control" aria-label="Review" v-model="review"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel(true)" class="btn btn-secondary">
              Ignore
            </button>
            <button type="button" v-on:click="cancel(false)" class="btn btn-secondary">
              Later
            </button>
            <button type="button" v-on:click="save" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'tutorreview-submission-modal',
  data: function() {
    return {
      reviewStars: Array(5).fill('star_border'),
      headline: '',
      review: '',
      stars: null,
    };
  },
  props: {
    tutorId: String,
    tutorHeadline: String,
    tutorReview: String,
    tutorStars: Number,
    tutorFirstName: String,
    tutorLastName: String,
    reviewId: String,
  },
  methods: {
    ...mapActions('tutorReview', ['submitTutorReview', 'ignoreTutorReview']),
    async save() {
      await this.submitTutorReview({
        id: this.reviewId,
        headline: this.headline,
        review: this.review,
        stars: this.stars,
        tutorId: this.tutorId,
      });

      this.$emit('closeEditor');
    },
    async cancel(ignore) {
      await this.ignoreTutorReview({
        tutorId: this.tutorId,
        ignore,
      });
      this.$emit('closeEditor');
    },
    updateStars(index) {
      this.stars = index+1;
      this.reviewStars = [
        ...Array(index+1).fill('star'),
        ...Array(5-index-1).fill('star_border'),
      ];
    },
  },
  mounted: function() {
    this.review = this.tutorReview;
    this.headline = this.tutorHeadline;
    this.stars = this.tutorStars;
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

.stars {
  width: 15px;
  cursor:pointer;
}
</style>
