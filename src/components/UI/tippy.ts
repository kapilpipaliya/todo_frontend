import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function (node, { props, plugins }) {
  tippy(node, props, plugins);
}
// <span use:tippy={{ props, plugins }}>Hover Me</span>
