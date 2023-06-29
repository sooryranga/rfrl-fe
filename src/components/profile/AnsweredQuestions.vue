<template>
  <div id="questions" class="p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h5 class="text-left my-2" >Answered Questions</h5>
      </div>
    </div>
    <div class="row mt-1" v-for="(question, index) in questions" v-bind:key="index">
      <div class="col my-auto">
        <div class="row">
          <p>{{shortenQuestion(question.title)}}</p>
        </div>
        <div class="row" id="questionTags">
          <div
            v-for="tag in question.tags"
            v-bind:key="tag.name"
            class="col-auto ml-0 pl-0">
            <button
              type="button"
              class="btn btn-secondary btn-sm">
              {{tag.name}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'answered-questions',
  data: function() {
    return {
      'questions': [],
    };
  },
  props: {
    'profileId': String,
  },
  methods: {
    shortenQuestion: function(title) {
      if (title.length > 45) {
        return title.slice(0, 40) + '...';
      }
      return title;
    },
  },
  mounted: function() {
    this.questions.push({
      title: 'Math question',
      tags: [{name: 'Math'}, {name: 'Calculus'}],
    });
    this.questions.push({
      title: 'Really long math question is here and is not afraid to flex',
      tags: [{name: 'Math'}, {name: 'Calculus'}],
    });
    console.log(this.questions);
  },
};
</script>
