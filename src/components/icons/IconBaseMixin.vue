<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: '1em',
    },
    iconColor: {
      type: String,
      default: 'var(--clr-primary)',
    },
    active: {
      type: Boolean,
      default: false,
    },
    hoverExpand: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    iconClass() {
      return {
        'icon-hover': this.hoverExpand,
      };
    },
  },
};
</script>
