export enum ValueType {
  None,    // not yet initialized
  Illegal, // illegal value
  Null,    // JSON null
  Bool,
  Array,
  Object,
  Double,
  UTCDate,
  External,
  MinKey,
  MaxKey,
  Int,
  UInt,
  SmallInt,
  String,
  Binary,
  BCD,
  Custom,
  Tagged
};
  // table:
export enum DisplayType {
  UNINITIALIZED,
  Checkbox = 1,
  Number,
  Text,
  Double,
  Date,
  DateTime,
  Url,
  Color
  };

export enum FormType {
  button = 1,
  checkbox,
  checkboxes,
  color,
  date,
  datetime_local,
  email,
  file,
  hidden,
  image,
  month,
  number,
  password,
  radio,
  range,
  reset,
  search,
  submit,
  tel,
  text,
  time,
  url,
  week,
  textarea,
  select,
  jsoneditor,
  internal_true_edge,
  multi_select,  // enum_string
  multi_select_hidden,
  text_array,
  multi_select_bool_properties,
  flatpicker,
  WYSIWYG,
  serial,
  codemirror,
  save_time,
  inserted,
  updated,
  dropzone,
  daterange,
  cleditor,
  emoji
  };
