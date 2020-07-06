import { curry, pipe } from 'ramda';
import { map } from 'rambda';

export function modifyRoutes(routes, Components: {}, Guards: {}) {
  return map((x) => modifyObj(x, Components, Guards), routes);
}

const modifyObj = (o, Components, Guards) => {
  const get_component = (k) => {
    if (k == '' || k == undefined) return;
    const c = Components[k];
    if (!c) console.error('No Component Found For key: ', k);
    return c;
  };
  const get_guard = (k) => {
    const c = Guards[k];
    if (!c) console.error('No Guard Found For key: ', k);
    return c;
  };
  const modify_component = curry((k, o) => {
    let c = get_component(o[k]);
    if (c) o[k] = c;
    return o;
  });
  const modify_guard = (o) => {
    if (o.onlyIf) {
      let g = get_guard(o.onlyIf.guard);
      if (g) o.onlyIf.guard = g;
    }
    return o;
  };
  const modify_nested = (o) => {
    if (o.nestedRoutes) o.nestedRoutes = map((x) => modifyObj(x, Components, Guards), o.nestedRoutes);
    return o;
  };
  o = pipe(modify_component('component'), modify_component('layout'), modify_guard, modify_nested)(o);
  return o;
};
