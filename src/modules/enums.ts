  // table:
export enum DisplayType {
  UNINITIALIZED,
  Checkbox = 1,
  Number,
  Text,
  Double,
  Date,
  DateTime,

  ARRAY,
  OBJECT,
  BINARY,
  Url,
  Color
  };
export enum form_type { object = 1, array };

export enum level_of_member {
  predefined, super_admin, organization, project
}