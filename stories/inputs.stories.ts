import { action } from '@storybook/addon-actions';

import { showDebug } from '../src/components/UI/debug';
showDebug.set(true)

import Checkboxes from '../src/components/form/input/Checkboxes.svelte';
import Color from '../src/components/form/input/Color.svelte';
import Email from '../src/components/form/input/Email.svelte';
import File from '../src/components/form/input/File.svelte';
import Hidden from '../src/components/form/input/Hidden.svelte';
import Number from '../src/components/form/input/Number.svelte';
import Password from '../src/components/form/input/Password.svelte';
import Range from '../src/components/form/input/Range.svelte';
import Search from '../src/components/form/input/Search.svelte';
import Text from '../src/components/form/input/Text.svelte';
import Checkbox from '../src/components/form/input/Checkbox.svelte';
import Radio from '../src/components/form/input/Radio.svelte';
import Select from '../src/components/form/input/Select.svelte';
import Textarea from '../src/components/form/input/Textarea.svelte';
// Can't resolve 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js' 
import JsonEditor from '../src/components/form/input/JsonEditor.svelte';
// Can't resolve 'https://unpkg.com/flatpickr/dist/flatpickr.js'
import Flatpicker from '../src/components/form/input/Flatpicker.svelte';
import CodeMirror from '../src/components/form/input/codemirror/CodeMirror.svelte';
import DropZone from '../src/components/form/input/DropZone.svelte';
import DateRange from '../src/components/form/input/DateRange.svelte';
import Emoji from '../src/components/form/input/Emoji.svelte';
import CLEditor from '../src/components/form/input/CLEditor.svelte';
import TableForm from '../src/components/form/tableform/TableForm.svelte';
import ArrayForm from '../src/components/form/input/Array.svelte';
import Url from '../src/components/form/input/Url.svelte';

export default {
  title: 'Inputs',
  component: Color,
};

export const Checkboxes_ = () => ({ Component: Checkboxes, props: {}, on: {click: action('clicked')}, })
export const Color_ = () => ({ Component: Color, props: {}, on: {click: action('clicked')}, })
export const Email_ = () => ({ Component: Email, props: {}, on: {click: action('clicked')}, })
export const File_ = () => ({ Component: File, props: {}, on: {click: action('clicked')}, })
export const Hidden_ = () => ({ Component: Hidden, props: {}, on: {click: action('clicked')}, })
export const Number_ = () => ({ Component: Number, props: {}, on: {click: action('clicked')}, })
export const Password_ = () => ({ Component: Password, props: {}, on: {click: action('clicked')}, })
export const Range_ = () => ({ Component: Range, props: {}, on: {click: action('clicked')}, })
export const Search_ = () => ({ Component: Search, props: {}, on: {click: action('clicked')}, })
export const Text_ = () => ({ Component: Text, props: {}, on: {click: action('clicked')}, })
export const Checkbox_ = () => ({ Component: Checkbox, props: {}, on: {click: action('clicked')}, })
export const Radio_ = () => ({ Component: Radio, props: {}, on: {click: action('clicked')}, })
export const Select_ = () => ({ Component: Select, props: {}, on: {click: action('clicked')}, })
export const Textarea_ = () => ({ Component: Textarea, props: {}, on: {click: action('clicked')}, })
export const JsonEditor_ = () => ({ Component: JsonEditor, props: {}, on: {click: action('clicked')}, })
export const Flatpicker_ = () => ({ Component: Flatpicker, props: {}, on: {click: action('clicked')}, })
export const CodeMirror_ = () => ({ Component: CodeMirror, props: {}, on: {click: action('clicked')}, })
export const DropZone_ = () => ({ Component: DropZone, props: {}, on: {click: action('clicked')}, })
export const DateRange_ = () => ({ Component: DateRange, props: {}, on: {click: action('clicked')}, })
export const Emoji_ = () => ({ Component: Emoji, props: {}, on: {click: action('clicked')}, })
export const CLEditor_ = () => ({ Component: CLEditor, props: {}, on: {click: action('clicked')}, })
export const TableForm_ = () => {
  let data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
  ];
  let values = [1, 10];
  let dp = [1, ' - ', 2];
  let keyIdx = 0;
  return { Component: TableForm, props: {  data, values, dp, keyIdx  }, on: {click: action('clicked')}, }}
export const ArrayForm_ = () => ({ Component: ArrayForm, props: {}, on: {click: action('clicked')}, })
export const Url_ = () => ({ Component: Url, props: {}, on: {click: action('clicked')}, })
