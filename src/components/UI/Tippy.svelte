<script lang="ts">
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';
  import { followCursor } from 'tippy.js';

  function mytippy(node, { props, plugins }) {
    tippy(node, { ...props, plugins: plugins });
  }

  let props = {
    content: '<div class="tooltip">Styled tooltip text</div>',
    onShow: function(instance) {
      //console.log(instance);
    }
  };
  const plugins = [];
</script>

<span class="tippy-tooltip" use:mytippy={{ props, plugins }}>Hover Me</span>
