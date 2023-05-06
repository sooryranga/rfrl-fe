<template>
<div class="container-fluid h-100">
  <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save changes</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-8 input-group">
      <input class="form-control" type="text" placeholder="Search"
        aria-label="Search">
      <div class="input-group-prepend">
        <button class="btn btn-outline-dark input-group-text">Post a question</button>
      </div>
    </div>
  </div>
  <div v-for="question of questions"  v-bind:key="question" class="row mt-5 card">
    <img class="card-img-top" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{question.poster}}</h5>
      <p class="card-text">Some quick example text.</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Cras justo odio</li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>
    <div class="card-body">
      <router-link class="card-link" v-bind:to="`/user/${question.id}/calendar`">Ask Question</router-link>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Questions',
  computed: mapGetters(['questions']),
};
</script>
