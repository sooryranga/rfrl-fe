export const ErrorMixin = {
  data() {
    return {
      error: '',
      showError: false,
    };
  },
  methods: {
    setError(error) {
      this.error = error;
      this.showError = true;
      setTimeout(function() {
        this.error = null;
        this.showError = false;
      }.bind(this), 2000);
    },
  },
};
