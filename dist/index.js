
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function get_binding_group_value(group) {
        const value = [];
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.push(group[i].__value);
        }
        return value;
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function getIDB() {
      /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
      try {
        if (typeof indexedDB !== 'undefined') {
          return indexedDB
        }
        if (typeof webkitIndexedDB !== 'undefined') {
          return webkitIndexedDB
        }
        if (typeof mozIndexedDB !== 'undefined') {
          return mozIndexedDB
        }
        if (typeof OIndexedDB !== 'undefined') {
          return OIndexedDB
        }
        if (typeof msIndexedDB !== 'undefined') {
          return msIndexedDB
        }
      } catch (e) {
        return
      }
    }

    const idb = getIDB();

    function _isPlaceholder(a) {
           return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
    }

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry1(fn) {
      return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
          return f1;
        } else {
          return fn.apply(this, arguments);
        }
      };
    }

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry2(fn) {
      return function f2(a, b) {
        switch (arguments.length) {
          case 0:
            return f2;
          case 1:
            return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
              return fn(a, _b);
            });
          default:
            return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
              return fn(_a, b);
            }) : _isPlaceholder(b) ? _curry1(function (_b) {
              return fn(a, _b);
            }) : fn(a, b);
        }
      };
    }

    function _arity(n, fn) {
      /* eslint-disable no-unused-vars */
      switch (n) {
        case 0:
          return function () {
            return fn.apply(this, arguments);
          };
        case 1:
          return function (a0) {
            return fn.apply(this, arguments);
          };
        case 2:
          return function (a0, a1) {
            return fn.apply(this, arguments);
          };
        case 3:
          return function (a0, a1, a2) {
            return fn.apply(this, arguments);
          };
        case 4:
          return function (a0, a1, a2, a3) {
            return fn.apply(this, arguments);
          };
        case 5:
          return function (a0, a1, a2, a3, a4) {
            return fn.apply(this, arguments);
          };
        case 6:
          return function (a0, a1, a2, a3, a4, a5) {
            return fn.apply(this, arguments);
          };
        case 7:
          return function (a0, a1, a2, a3, a4, a5, a6) {
            return fn.apply(this, arguments);
          };
        case 8:
          return function (a0, a1, a2, a3, a4, a5, a6, a7) {
            return fn.apply(this, arguments);
          };
        case 9:
          return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
            return fn.apply(this, arguments);
          };
        case 10:
          return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            return fn.apply(this, arguments);
          };
        default:
          throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
      }
    }

    /**
     * Internal curryN function.
     *
     * @private
     * @category Function
     * @param {Number} length The arity of the curried function.
     * @param {Array} received An array of arguments received thus far.
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curryN(length, received, fn) {
      return function () {
        var combined = [];
        var argsIdx = 0;
        var left = length;
        var combinedIdx = 0;
        while (combinedIdx < received.length || argsIdx < arguments.length) {
          var result;
          if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
            result = received[combinedIdx];
          } else {
            result = arguments[argsIdx];
            argsIdx += 1;
          }
          combined[combinedIdx] = result;
          if (!_isPlaceholder(result)) {
            left -= 1;
          }
          combinedIdx += 1;
        }
        return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
      };
    }

    /**
     * Returns a curried equivalent of the provided function, with the specified
     * arity. The curried function has two unusual capabilities. First, its
     * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
     * following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
     * the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @since v0.5.0
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curry
     * @example
     *
     *      const sumArgs = (...args) => R.sum(args);
     *
     *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
     *      const f = curriedAddFourNumbers(1, 2);
     *      const g = f(3);
     *      g(4); //=> 10
     */
    var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
      if (length === 1) {
        return _curry1(fn);
      }
      return _arity(length, _curryN(length, [], fn));
    });

    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry3(fn) {
      return function f3(a, b, c) {
        switch (arguments.length) {
          case 0:
            return f3;
          case 1:
            return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            });
          case 2:
            return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
              return fn(_a, b, _c);
            }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            }) : _curry1(function (_c) {
              return fn(a, b, _c);
            });
          default:
            return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
              return fn(_a, _b, c);
            }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
              return fn(_a, b, _c);
            }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            }) : _isPlaceholder(a) ? _curry1(function (_a) {
              return fn(_a, b, c);
            }) : _isPlaceholder(b) ? _curry1(function (_b) {
              return fn(a, _b, c);
            }) : _isPlaceholder(c) ? _curry1(function (_c) {
              return fn(a, b, _c);
            }) : fn(a, b, c);
        }
      };
    }

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */
    var _isArray = Array.isArray || function _isArray(val) {
      return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };

    function _isTransformer(obj) {
      return obj != null && typeof obj['@@transducer/step'] === 'function';
    }

    /**
     * Returns a function that dispatches with different strategies based on the
     * object in list position (last argument). If it is an array, executes [fn].
     * Otherwise, if it has a function with one of the given method names, it will
     * execute that function (functor case). Otherwise, if it is a transformer,
     * uses transducer [xf] to return a new transformer (transducer case).
     * Otherwise, it will default to executing [fn].
     *
     * @private
     * @param {Array} methodNames properties to check for a custom implementation
     * @param {Function} xf transducer to initialize if object is transformer
     * @param {Function} fn default ramda implementation
     * @return {Function} A function that dispatches on object in list position
     */
    function _dispatchable(methodNames, xf, fn) {
      return function () {
        if (arguments.length === 0) {
          return fn();
        }
        var args = Array.prototype.slice.call(arguments, 0);
        var obj = args.pop();
        if (!_isArray(obj)) {
          var idx = 0;
          while (idx < methodNames.length) {
            if (typeof obj[methodNames[idx]] === 'function') {
              return obj[methodNames[idx]].apply(obj, args);
            }
            idx += 1;
          }
          if (_isTransformer(obj)) {
            var transducer = xf.apply(null, args);
            return transducer(obj);
          }
        }
        return fn.apply(this, arguments);
      };
    }

    var _xfBase = {
      init: function () {
        return this.xf['@@transducer/init']();
      },
      result: function (result) {
        return this.xf['@@transducer/result'](result);
      }
    };

    function _map(fn, functor) {
      var idx = 0;
      var len = functor.length;
      var result = Array(len);
      while (idx < len) {
        result[idx] = fn(functor[idx]);
        idx += 1;
      }
      return result;
    }

    function _isString(x) {
      return Object.prototype.toString.call(x) === '[object String]';
    }

    /**
     * Tests whether or not an object is similar to an array.
     *
     * @private
     * @category Type
     * @category List
     * @sig * -> Boolean
     * @param {*} x The object to test.
     * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
     * @example
     *
     *      _isArrayLike([]); //=> true
     *      _isArrayLike(true); //=> false
     *      _isArrayLike({}); //=> false
     *      _isArrayLike({length: 10}); //=> false
     *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
     */
    var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
      if (_isArray(x)) {
        return true;
      }
      if (!x) {
        return false;
      }
      if (typeof x !== 'object') {
        return false;
      }
      if (_isString(x)) {
        return false;
      }
      if (x.nodeType === 1) {
        return !!x.length;
      }
      if (x.length === 0) {
        return true;
      }
      if (x.length > 0) {
        return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
      }
      return false;
    });

    var XWrap = /*#__PURE__*/function () {
      function XWrap(fn) {
        this.f = fn;
      }
      XWrap.prototype['@@transducer/init'] = function () {
        throw new Error('init not implemented on XWrap');
      };
      XWrap.prototype['@@transducer/result'] = function (acc) {
        return acc;
      };
      XWrap.prototype['@@transducer/step'] = function (acc, x) {
        return this.f(acc, x);
      };

      return XWrap;
    }();

    function _xwrap(fn) {
      return new XWrap(fn);
    }

    /**
     * Creates a function that is bound to a context.
     * Note: `R.bind` does not provide the additional argument-binding capabilities of
     * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category Function
     * @category Object
     * @sig (* -> *) -> {*} -> (* -> *)
     * @param {Function} fn The function to bind to context
     * @param {Object} thisObj The context to bind `fn` to
     * @return {Function} A function that will execute in the context of `thisObj`.
     * @see R.partial
     * @example
     *
     *      const log = R.bind(console.log, console);
     *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
     *      // logs {a: 2}
     * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
     */
    var bind$1 = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
      return _arity(fn.length, function () {
        return fn.apply(thisObj, arguments);
      });
    });

    function _arrayReduce(xf, acc, list) {
      var idx = 0;
      var len = list.length;
      while (idx < len) {
        acc = xf['@@transducer/step'](acc, list[idx]);
        if (acc && acc['@@transducer/reduced']) {
          acc = acc['@@transducer/value'];
          break;
        }
        idx += 1;
      }
      return xf['@@transducer/result'](acc);
    }

    function _iterableReduce(xf, acc, iter) {
      var step = iter.next();
      while (!step.done) {
        acc = xf['@@transducer/step'](acc, step.value);
        if (acc && acc['@@transducer/reduced']) {
          acc = acc['@@transducer/value'];
          break;
        }
        step = iter.next();
      }
      return xf['@@transducer/result'](acc);
    }

    function _methodReduce(xf, acc, obj, methodName) {
      return xf['@@transducer/result'](obj[methodName](bind$1(xf['@@transducer/step'], xf), acc));
    }

    var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

    function _reduce(fn, acc, list) {
      if (typeof fn === 'function') {
        fn = _xwrap(fn);
      }
      if (_isArrayLike(list)) {
        return _arrayReduce(fn, acc, list);
      }
      if (typeof list['fantasy-land/reduce'] === 'function') {
        return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
      }
      if (list[symIterator] != null) {
        return _iterableReduce(fn, acc, list[symIterator]());
      }
      if (typeof list.next === 'function') {
        return _iterableReduce(fn, acc, list);
      }
      if (typeof list.reduce === 'function') {
        return _methodReduce(fn, acc, list, 'reduce');
      }

      throw new TypeError('reduce: list must be array or iterable');
    }

    var XMap = /*#__PURE__*/function () {
      function XMap(f, xf) {
        this.xf = xf;
        this.f = f;
      }
      XMap.prototype['@@transducer/init'] = _xfBase.init;
      XMap.prototype['@@transducer/result'] = _xfBase.result;
      XMap.prototype['@@transducer/step'] = function (result, input) {
        return this.xf['@@transducer/step'](result, this.f(input));
      };

      return XMap;
    }();

    var _xmap = /*#__PURE__*/_curry2(function _xmap(f, xf) {
      return new XMap(f, xf);
    });

    function _has(prop, obj) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var toString = Object.prototype.toString;
    var _isArguments = /*#__PURE__*/function () {
      return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString.call(x) === '[object Arguments]';
      } : function _isArguments(x) {
        return _has('callee', x);
      };
    }();

    // cover IE < 9 keys issues
    var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    // Safari bug
    var hasArgsEnumBug = /*#__PURE__*/function () {

      return arguments.propertyIsEnumerable('length');
    }();

    var contains = function contains(list, item) {
      var idx = 0;
      while (idx < list.length) {
        if (list[idx] === item) {
          return true;
        }
        idx += 1;
      }
      return false;
    };

    /**
     * Returns a list containing the names of all the enumerable own properties of
     * the supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @see R.keysIn, R.values
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */
    var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) : /*#__PURE__*/_curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, nIdx;
      var ks = [];
      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });

    /**
     * Takes a function and
     * a [functor](https://github.com/fantasyland/fantasy-land#functor),
     * applies the function to each of the functor's values, and returns
     * a functor of the same shape.
     *
     * Ramda provides suitable `map` implementations for `Array` and `Object`,
     * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
     *
     * Dispatches to the `map` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * Also treats functions as functors and will compose them together.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Functor f => (a -> b) -> f a -> f b
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {Array} list The list to be iterated over.
     * @return {Array} The new list.
     * @see R.transduce, R.addIndex
     * @example
     *
     *      const double = x => x * 2;
     *
     *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
     *
     *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
     * @symb R.map(f, [a, b]) = [f(a), f(b)]
     * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
     * @symb R.map(f, functor_o) = functor_o.map(f)
     */
    var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
      switch (Object.prototype.toString.call(functor)) {
        case '[object Function]':
          return curryN(functor.length, function () {
            return fn.call(this, functor.apply(this, arguments));
          });
        case '[object Object]':
          return _reduce(function (acc, key) {
            acc[key] = fn(functor[key]);
            return acc;
          }, {}, keys(functor));
        default:
          return _map(fn, functor);
      }
    }));

    /**
     * Retrieve the value at a given path.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @typedefn Idx = String | Int
     * @sig [Idx] -> {a} -> a | Undefined
     * @param {Array} path The path to use.
     * @param {Object} obj The object to retrieve the nested property from.
     * @return {*} The data at `path`.
     * @see R.prop
     * @example
     *
     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
     *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
     */
    var path = /*#__PURE__*/_curry2(function path(paths, obj) {
      var val = obj;
      var idx = 0;
      while (idx < paths.length) {
        if (val == null) {
          return;
        }
        val = val[paths[idx]];
        idx += 1;
      }
      return val;
    });

    /**
     * Returns a single item by iterating through the list, successively calling
     * the iterator function and passing it an accumulator value and the current
     * value from the array, and then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*. It may use
     * [`R.reduced`](#reduced) to shortcut the iteration.
     *
     * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
     * is *(value, acc)*.
     *
     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
     * arrays), unlike the native `Array.prototype.reduce` method. For more details
     * on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
     *
     * Dispatches to the `reduce` method of the third argument, if present. When
     * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
     * shortcuting, as this is not implemented by `reduce`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig ((a, b) -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.reduced, R.addIndex, R.reduceRight
     * @example
     *
     *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
     *      //          -               -10
     *      //         / \              / \
     *      //        -   4           -6   4
     *      //       / \              / \
     *      //      -   3   ==>     -3   3
     *      //     / \              / \
     *      //    -   2           -1   2
     *      //   / \              / \
     *      //  0   1            0   1
     *
     * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
     */
    var reduce = /*#__PURE__*/_curry3(_reduce);

    /**
     * Makes a shallow clone of an object, setting or overriding the specified
     * property with the given value. Note that this copies and flattens prototype
     * properties onto the new object as well. All non-primitive properties are
     * copied by reference.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig String -> a -> {k: v} -> {k: v}
     * @param {String} prop The property name to set
     * @param {*} val The new value
     * @param {Object} obj The object to clone
     * @return {Object} A new object equivalent to the original except for the changed property.
     * @see R.dissoc, R.pick
     * @example
     *
     *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
     */
    var assoc = /*#__PURE__*/_curry3(function assoc(prop, val, obj) {
      var result = {};
      for (var p in obj) {
        result[p] = obj[p];
      }
      result[prop] = val;
      return result;
    });

    /**
     * Determine if the passed argument is an integer.
     *
     * @private
     * @param {*} n
     * @category Type
     * @return {Boolean}
     */
    var _isInteger = Number.isInteger || function _isInteger(n) {
      return n << 0 === n;
    };

    /**
     * Checks if the input value is `null` or `undefined`.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Type
     * @sig * -> Boolean
     * @param {*} x The value to test.
     * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
     * @example
     *
     *      R.isNil(null); //=> true
     *      R.isNil(undefined); //=> true
     *      R.isNil(0); //=> false
     *      R.isNil([]); //=> false
     */
    var isNil = /*#__PURE__*/_curry1(function isNil(x) {
      return x == null;
    });

    /**
     * Makes a shallow clone of an object, setting or overriding the nodes required
     * to create the given path, and placing the specific value at the tail end of
     * that path. Note that this copies and flattens prototype properties onto the
     * new object as well. All non-primitive properties are copied by reference.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @typedefn Idx = String | Int
     * @sig [Idx] -> a -> {a} -> {a}
     * @param {Array} path the path to set
     * @param {*} val The new value
     * @param {Object} obj The object to clone
     * @return {Object} A new object equivalent to the original except along the specified path.
     * @see R.dissocPath
     * @example
     *
     *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
     *
     *      // Any missing or non-object keys in path will be overridden
     *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
     */
    var assocPath = /*#__PURE__*/_curry3(function assocPath(path, val, obj) {
      if (path.length === 0) {
        return val;
      }
      var idx = path[0];
      if (path.length > 1) {
        var nextObj = !isNil(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path[1]) ? [] : {};
        val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
      }
      if (_isInteger(idx) && _isArray(obj)) {
        var arr = [].concat(obj);
        arr[idx] = val;
        return arr;
      } else {
        return assoc(idx, val, obj);
      }
    });

    function _pipe(f, g) {
      return function () {
        return g.call(this, f.apply(this, arguments));
      };
    }

    /**
     * This checks whether a function has a [methodname] function. If it isn't an
     * array it will execute that function otherwise it will default to the ramda
     * implementation.
     *
     * @private
     * @param {Function} fn ramda implemtation
     * @param {String} methodname property to check for a custom implementation
     * @return {Object} Whatever the return value of the method is.
     */
    function _checkForMethod(methodname, fn) {
      return function () {
        var length = arguments.length;
        if (length === 0) {
          return fn();
        }
        var obj = arguments[length - 1];
        return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
      };
    }

    /**
     * Returns the elements of the given list or string (or object with a `slice`
     * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
     *
     * Dispatches to the `slice` method of the third argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.4
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @sig Number -> Number -> String -> String
     * @param {Number} fromIndex The start index (inclusive).
     * @param {Number} toIndex The end index (exclusive).
     * @param {*} list
     * @return {*}
     * @example
     *
     *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
     *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
     *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
     *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
     *      R.slice(0, 3, 'ramda');                     //=> 'ram'
     */
    var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
      return Array.prototype.slice.call(list, fromIndex, toIndex);
    }));

    /**
     * Returns all but the first element of the given list or string (or object
     * with a `tail` method).
     *
     * Dispatches to the `slice` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {*} list
     * @return {*}
     * @see R.head, R.init, R.last
     * @example
     *
     *      R.tail([1, 2, 3]);  //=> [2, 3]
     *      R.tail([1, 2]);     //=> [2]
     *      R.tail([1]);        //=> []
     *      R.tail([]);         //=> []
     *
     *      R.tail('abc');  //=> 'bc'
     *      R.tail('ab');   //=> 'b'
     *      R.tail('a');    //=> ''
     *      R.tail('');     //=> ''
     */
    var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

    /**
     * Performs left-to-right function composition. The leftmost function may have
     * any arity; the remaining functions must be unary.
     *
     * In some libraries this function is named `sequence`.
     *
     * **Note:** The result of pipe is not automatically curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.compose
     * @example
     *
     *      const f = R.pipe(Math.pow, R.negate, R.inc);
     *
     *      f(3, 4); // -(3^4) + 1
     * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
     */
    function pipe() {
      if (arguments.length === 0) {
        throw new Error('pipe requires at least one argument');
      }
      return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
    }

    /**
     * Returns a new list or string with the elements or characters in reverse
     * order.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {Array|String} list
     * @return {Array|String}
     * @example
     *
     *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
     *      R.reverse([1, 2]);     //=> [2, 1]
     *      R.reverse([1]);        //=> [1]
     *      R.reverse([]);         //=> []
     *
     *      R.reverse('abc');      //=> 'cba'
     *      R.reverse('ab');       //=> 'ba'
     *      R.reverse('a');        //=> 'a'
     *      R.reverse('');         //=> ''
     */
    var reverse = /*#__PURE__*/_curry1(function reverse(list) {
      return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
    });

    /**
     * Performs right-to-left function composition. The rightmost function may have
     * any arity; the remaining functions must be unary.
     *
     * **Note:** The result of compose is not automatically curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
     * @param {...Function} ...functions The functions to compose
     * @return {Function}
     * @see R.pipe
     * @example
     *
     *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
     *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
     *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
     *
     *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
     *
     * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
     */
    function compose() {
      if (arguments.length === 0) {
        throw new Error('compose requires at least one argument');
      }
      return pipe.apply(this, reverse(arguments));
    }

    function _filter(fn, list) {
      var idx = 0;
      var len = list.length;
      var result = [];

      while (idx < len) {
        if (fn(list[idx])) {
          result[result.length] = list[idx];
        }
        idx += 1;
      }
      return result;
    }

    function _isObject(x) {
      return Object.prototype.toString.call(x) === '[object Object]';
    }

    var XFilter = /*#__PURE__*/function () {
      function XFilter(f, xf) {
        this.xf = xf;
        this.f = f;
      }
      XFilter.prototype['@@transducer/init'] = _xfBase.init;
      XFilter.prototype['@@transducer/result'] = _xfBase.result;
      XFilter.prototype['@@transducer/step'] = function (result, input) {
        return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
      };

      return XFilter;
    }();

    var _xfilter = /*#__PURE__*/_curry2(function _xfilter(f, xf) {
      return new XFilter(f, xf);
    });

    /**
     * Takes a predicate and a `Filterable`, and returns a new filterable of the
     * same type containing the members of the given filterable which satisfy the
     * given predicate. Filterable objects include plain objects or any object
     * that has a filter method such as `Array`.
     *
     * Dispatches to the `filter` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Filterable f => (a -> Boolean) -> f a -> f a
     * @param {Function} pred
     * @param {Array} filterable
     * @return {Array} Filterable
     * @see R.reject, R.transduce, R.addIndex
     * @example
     *
     *      const isEven = n => n % 2 === 0;
     *
     *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
     *
     *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
     */
    var filter = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['filter'], _xfilter, function (pred, filterable) {
      return _isObject(filterable) ? _reduce(function (acc, key) {
        if (pred(filterable[key])) {
          acc[key] = filterable[key];
        }
        return acc;
      }, {}, keys(filterable)) :
      // else
      _filter(pred, filterable);
    }));

    function _isNumber(x) {
      return Object.prototype.toString.call(x) === '[object Number]';
    }

    /**
     * Returns the number of elements in the array by returning `list.length`.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig [a] -> Number
     * @param {Array} list The array to inspect.
     * @return {Number} The length of the array.
     * @example
     *
     *      R.length([]); //=> 0
     *      R.length([1, 2, 3]); //=> 3
     */
    var length = /*#__PURE__*/_curry1(function length(list) {
      return list != null && _isNumber(list.length) ? list.length : NaN;
    });

    /**
     * Returns a lens for the given getter and setter functions. The getter "gets"
     * the value of the focus; the setter "sets" the value of the focus. The setter
     * should not mutate the data structure.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
     * @param {Function} getter
     * @param {Function} setter
     * @return {Lens}
     * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
     * @example
     *
     *      const xLens = R.lens(R.prop('x'), R.assoc('x'));
     *
     *      R.view(xLens, {x: 1, y: 2});            //=> 1
     *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
     *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
     */
    var lens = /*#__PURE__*/_curry2(function lens(getter, setter) {
      return function (toFunctorFn) {
        return function (target) {
          return map(function (focus) {
            return setter(focus, target);
          }, toFunctorFn(getter(target)));
        };
      };
    });

    /**
     * Returns a lens whose focus is the specified path.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @typedefn Idx = String | Int
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig [Idx] -> Lens s a
     * @param {Array} path The path to use.
     * @return {Lens}
     * @see R.view, R.set, R.over
     * @example
     *
     *      const xHeadYLens = R.lensPath(['x', 0, 'y']);
     *
     *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
     *      //=> 2
     *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
     *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
     *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
     *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
     */
    var lensPath = /*#__PURE__*/_curry1(function lensPath(p) {
      return lens(path(p), assocPath(p));
    });

    // `Const` is a functor that effectively ignores the function given to `map`.
    var Const = function (x) {
      return { value: x, 'fantasy-land/map': function () {
          return this;
        } };
    };

    /**
     * Returns a "view" of the given data structure, determined by the given lens.
     * The lens's focus determines which portion of the data structure is visible.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig Lens s a -> s -> a
     * @param {Lens} lens
     * @param {*} x
     * @return {*}
     * @see R.prop, R.lensIndex, R.lensProp
     * @example
     *
     *      const xLens = R.lensProp('x');
     *
     *      R.view(xLens, {x: 1, y: 2});  //=> 1
     *      R.view(xLens, {x: 4, y: 2});  //=> 4
     */
    var view = /*#__PURE__*/_curry2(function view(lens, x) {
      // Using `Const` effectively ignores the setter function of the `lens`,
      // leaving the value returned by the getter function unmodified.
      return lens(Const)(x).value;
    });

    /* Ismael Celis 2010
    Simplified WebSocket events dispatcher
    */
    const ws_connected = writable(false);
    class ServerEventsDispatcher {
      constructor(path, req, res) {
        this.bind = this.bind.bind(this);
        this.bind$ = this.bind$.bind(this);
        this.bind_ = this.bind_.bind(this);
        this.bind_F = this.bind_F.bind(this);
        this.unbind = this.unbind.bind(this);
        this.unbind_ = this.unbind_.bind(this);
        this.trigger = this.trigger.bind(this);
        this.triggerFile = this.triggerFile.bind(this);
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);
        this.onopen = this.onopen.bind(this);
        this.onerror = this.onerror.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.batchBind = this.batchBind.bind(this);
        this.batchBind_T = this.batchBind_T.bind(this);

        this.path = path;
        this.req = req;
        this.res = res;
        this.setupConnection();
        this.callbacks = {};
      }
      setupConnection() {
        this.conn = new WebSocket(this.path, []);
        // dispatch to the right handlers
        this.conn.onmessage = this.onmessage;

        this.conn.onclose = this.onclose;
        //this.conn.onopen = this.onopen;
        this.conn.addEventListener('open', this.onopen);
      }
      destroy() {
        this.conn.onmessage = undefined;
        this.conn.onclose = undefined;
        this.conn.removeEventListener('open', this.onopen);
        this.conn.terminate();
      }

      bind(event, callback, handleMultiple = 0) {
        this.callbacks[JSON.stringify(event)] =
          this.callbacks[JSON.stringify(event)] || [];
        this.callbacks[JSON.stringify(event)].push([handleMultiple, callback]); // 0 means unsubscribe using first time
        return this // chainable
      }
      unbind_(event_names = []) {
        map(event => {
          this.unbind(JSON.stringify(event));
        }, event_names);
        return this // chainable
      }
      batchBind(events) {
        const payload = [];
        for (let i = 0; i < events.length; i++) {
          const e = events[i];
          this.bind(e[0], e[1]);
          payload.push([e[0], e[2]]);
        }
        return payload // chainable
      }
      batchBind_T(events) {
        const payload = this.batchBind(events);
        this.trigger(payload);
        return this // chainable
      }
      bind$(event, callback, handleMultiple) {
        this.unbind(event);
        this.bind(event, callback, handleMultiple);
        return this // chainable
      }
      bind_(event, callback, data, handleMultiple) {
        this.bind$(event, callback, handleMultiple);
        this.trigger([[event, data]]);
        return this // chainable
      }
      bind_F(event, callback, data, handleMultiple, beforeEvent, changeNotice) {
        this.bind$(event, callback, handleMultiple);
        this.triggerFile(event, data, beforeEvent, changeNotice);
        return this // chainable
      }
      unbind(event) {
        this.callbacks[JSON.stringify(event)] = [];
      }
      trigger(payload) {
        const f = this.trigger;
        switch (this.conn.readyState) {
          case 0: // CONNECTING
            // code block
            //This will added to onopen list, take care
            this.conn.addEventListener('open', function() {
              f(payload);
            });
            return this
          case 1: // OPEN
            this.conn.send(JSON.stringify(payload)); // <= send JSON data to socket server
            return this
          case 2: // CLOSING
          case 3: //CLOSED
            // try to reconnect/logout
            this.setupConnection();
            this.conn.addEventListener('open', function() {
              f(payload);
            });
            return this
          default:
            return this
          // code block
        }
      }
      triggerFile(
        event,
        data,
        beforeEvent = ['auth', 'image_meta_data', 0],
        callback
      ) {
        const f = this.triggerFile;
        const f2 = this.trigger;
        switch (this.conn.readyState) {
          case 0: // CONNECTING
            // code block
            //This will added to onopen list, take care
            this.conn.addEventListener('open', function() {
              f(event, data);
            });
            return this
          case 1: // OPEN
            var file = data;
            var reader = new FileReader();
            var rawData = new ArrayBuffer();
            const conn = this.conn;
            const bind$ = this.bind$;
            reader.loadend = function() {};
            reader.onload = function(e) {
              rawData = e.target.result;
              // conn.binaryType = "arraybuffer"
              f2([[beforeEvent, [event, file.name, file.size, file.type]]]);

              bind$(beforeEvent, () => {
                conn.send(rawData);

                if (callback) {
                  var interval = setInterval(() => {
                    if (conn.bufferedAmount > 0) {
                      callback(conn.bufferedAmount);
                    } else {
                      callback(0);
                      clearInterval(interval);
                    }
                  }, 100);
                }
              });

              // conn.binaryType = "blob"
              //alert("the File has been transferred.")
            };
            reader.readAsArrayBuffer(file);

            return this
          case 2: // CLOSING
          case 3: //CLOSED
            // try to reconnect/logout
            this.conn = new IsomorphicWs(this.path);
            this.conn.addEventListener('open', function() {
              f(event, data);
            });
            return this
          default:
            return this
          // code block
        }
      }

      onmessage(evt) {
        if (typeof evt.data === 'string') {
          const data = JSON.parse(evt.data);
          try {
            for (let i = 0; i < data.length; i++) {
              const e = data[i];
              const event = e[0];
              const message = e.splice(1);
              this.dispatch(event, message);
            }
          } catch (error) {
            console.warn('error: ', error);
            console.warn(data);
          }
        }
        // if(evt.data instanceof ArrayBuffer ){
        else {
          const buffer = evt.data;
          console.log('Received arraybuffer');
          this.dispatch(this.event, buffer);
        }
        // if(evt.data instanceof Blob ){
        //   const buffer = event.data;
        //   console.log("Received arraybuffer");
        //   this.dispatch(this.event_name, buffer)
        // }
      }

      onclose(evt) {
        ws_connected.set(false);
        this.dispatch(['close', '', 0], null);
        setTimeout(() => {
          this.setupConnection();
        }, 1000);
        // on reconnection all subscribtion needs to resubscribe.
      }
      onopen(evt) {
        ws_connected.set(true);
        //console.log(this.conn.extensions);
        //console.log("Server Opened")
        this.dispatch(['open', '', 0], null);
      }
      onerror(error) {
        console.log(`[error] ${error.message}`);
        //todo depend on error try to reconnect
        this.dispatch(['error', '', 0], null);
      }

      dispatch(event, message) {
        const chain = this.callbacks[JSON.stringify(event)];
        if (typeof chain == 'undefined') return // no callbacks for this event
        const length = chain.length;
        for (let i = 0; i < length; i++) {
          chain[i][1](message);
          if (chain[i][0] == 0) {
            this.callbacks[JSON.stringify(event)] = [];
          }
        }
      }
    }

    /*
    export const ServerEventsDispatcher = function(){
        const conn = new IsomorphicWs('ws://localhost:8300/echo');

        const callbacks = {};

        this.bind = function(event_name, callback){
          callbacks[event_name] = callbacks[event_name] || [];
          callbacks[event_name].push(callback);
          return this;// chainable
        };

        this.trigger2 = function(event_name, data){
          const payload = JSON.stringify([event_name, data]);
          conn.send( payload ); // <= send JSON data to socket server
          return this;
        };

        // dispatch to the right handlers
        conn.onmessage = function(evt){
          const data = JSON.parse(evt.data),
              event_name = data[0],
              message = data[1];
          dispatch(event_name, message)
        };

        conn.onclose = function(){dispatch('close',null)}
        conn.onopen = function(){dispatch('open',null)}

        const dispatch = function(event_name, message){
          const chain = callbacks[event_name];
          if(typeof chain == 'undefined') return; // no callbacks for this event
          for(let i = 0; i < chain.length; i++){
            chain[i]( message )
          }
        }
      };
    */

    const event_type = {};
    event_type[(event_type['get'] = 1)] = 'get';
    event_type[(event_type['mutate'] = 2)] = 'mutate';
    event_type[(event_type['subscribe'] = 3)] = 'subscribe';
    event_type[(event_type['unsubscribe'] = 4)] = 'unsubscribe';

    const events = {};
    let e = 0;
    events['css_event'] = ++e;
    events['notification_event'] = ++e;
    events['cookie_event'] = ++e;
    events['redirection_event'] = ++e;
    events['translation_event'] = ++e;

    e = 49;
    events['e_global'] = ++e;
    events['user_header'] = ++e;
    events['user_list'] = ++e;
    events['user_mutate'] = ++e;

    events['schema_header'] = ++e;
    events['schema_list'] = ++e;
    events['schema_mutate'] = ++e;

    events['translation_header'] = ++e;
    events['translation_list'] = ++e;
    events['translation_mutate'] = ++e;

    events['session_header'] = ++e;
    events['session_list'] = ++e;
    events['session_mutate'] = ++e;

    events['confirm_header'] = ++e;
    events['confirm_list'] = ++e;
    events['confirm_mutate'] = ++e;


    events['note_header'] = ++e;
    events['note_list'] = ++e;
    events['note_mutate'] = ++e;

    e = 99;
    events[(events['account'] = ++e)] = 'account';
    events[(events['register_user'] = ++e)] = 'register_user';
    events[(events['register_member'] = ++e)] = 'register_member';
    events[(events['login'] = ++e)] = 'login';
    events[(events['logout'] = ++e)] = 'logout';
    events[(events['confirm_email'] = ++e)] = 'confirm_email';
    events[(events['confirm_email_status'] = ++e)] = 'confirm_email_status';
    events[(events['save_user_settings'] = ++e)] = 'save_user_settings';
    events[(events['get_menu'] = ++e)] = 'get_menu';
    events[(events['update_password'] = ++e)] = 'update_password';
    events[(events['update_member'] = ++e)] = 'update_member';
    events[(events['modify_profile'] = ++e)] = 'modify_profile';
    events[(events['is_logged_in'] = ++e)] = 'is_logged_in';
    events[(events['subscribe_test'] = ++e)] = 'subscribe_test';
    events[(events['trigger_test'] = ++e)] = 'trigger_test';


    e = 199;
    events['admin'] = ++e;
    events['dashboard'] = ++e;

    events['organization_header'] = ++e;
    events['organization_list'] = ++e;
    events['organization_mutate'] = ++e;

    events['project_header'] = ++e;
    events['project_list'] = ++e;
    events['project_mutate'] = ++e;



    events['group_header'] = ++e;
    events['group_list'] = ++e;
    events['group_mutate'] = ++e;

    events['role_header'] = ++e;
    events['role_list'] = ++e;
    events['role_mutate'] = ++e;

    events['member_header'] = ++e;
    events['member_list'] = ++e;
    events['member_mutate'] = ++e;

    events['permission_header'] = ++e;
    events['permission_list'] = ++e;
    events['permission_mutate'] = ++e;

    events['color_header'] = ++e;
    events['color_list'] = ++e;
    events['color_mutate'] = ++e;


    events['type_header'] = ++e;
    events['type_list'] = ++e;
    events['type_mutate'] = ++e;

    events['priority_header'] = ++e;
    events['priority_list'] = ++e;
    events['priority_mutate'] = ++e;


    events['status_header'] = ++e;
    events['status_list'] = ++e;
    events['status_mutate'] = ++e;

    events['activity_header'] = ++e;
    events['activity_list'] = ++e;
    events['activity_mutate'] = ++e;


    events['doc_category_header'] = ++e;
    events['doc_category_list'] = ++e;
    events['doc_category_mutate'] = ++e;

    events['announcement_header'] = ++e;
    events['announcement_list'] = ++e;
    events['announcement_mutate'] = ++e;

    events['news_header'] = ++e;
    events['news_list'] = ++e;
    events['news_mutate'] = ++e;

    events['wiki_header'] = ++e;
    events['wiki_list'] = ++e;
    events['wiki_mutate'] = ++e;

    events['work_package_header'] = ++e;
    events['work_package_list'] = ++e;
    events['work_package_mutate'] = ++e;

    events['forum_header'] = ++e;
    events['forum_list'] = ++e;
    events['forum_mutate'] = ++e;

    events['post_header'] = ++e;
    events['post_list'] = ++e,
    events['post_mutate'] = ++e;

    e = 299;
    events['my'] = ++e;
    events['schema_get'] = ++e;
    events['my_schema_mutate'] = ++e;
    events['fields_schema_get'] = ++e;
    events['fields_schema_mutate'] = ++e;
    events['form_schema_get'] = ++e;
    events['form_schema_mutate'] = ++e;

    // import {account} from './global_stores/account.js'
    // import {cookie} from './global_stores/cookie.js'
    // import {member_settings} from './global_stores/member_settings.js'
    // import {menu} from './global_stores/menu.js'
    // import {navigation} from './global_stores/navigation.js'
    // import {notification} from './global_stores/notification.js'
    // import {current_time} from './global_stores/time_store.js'

    const dev_conf = {
      domain: 'localhost',
      port: 8500, //'8300' //susant : '8400' //jimmy-music // '5000' : '5001' // sce
      http_proto: 'http',
      ws_proto: 'ws',
      redirect: 'todo',
    };

    // export const server = process.env.NODE_ENV === 'development' ? dev_conf : prod_conf
    const server = dev_conf;
    const ws_todo = `${server.ws_proto}://${server.domain}:${server.port}/todo`;

    let ws_;
    ws_ = new ServerEventsDispatcher(ws_todo);
    ws_.bind(
      ['take_image_meta'],
      function(data) {
        ws_.event = data[0]; // save value on class.
      },
      1
    );
    const S = ws_;
    // check it already logged in
    const isLoggedIn = async S => {
      const auth = await new Promise((resolve, reject) => {
        S.bind_(
          [event_type.get, events.account, events.is_logged_in, 0],
          ([d]) => {
            resolve(d);
          },
          [[]]
        );
      });
      return auth
    };
    class FormBasic {
      constructor(S, key, e, dp, type='o') {
        this.S = S;
        this.key = key;
        this.dp = dp;
        this.type = type;

        this.events = e;
        if(this.key) {
          e[1][0] = event_type.subscribe;
        } else {
          e[1][0] = event_type.get;
        }
        this.data_evt = e[1];
        this.mutate_evt = e[2];
        this.unsub_evt = [event_type.unsubscribe, ...e[1].slice(1)];
        this.isUpdate = false;
        
        this.mounted = writable(false);
        this.binded = writable(false);
        this.form = writable();
        this.er = writable('');
        this.isSaving = writable(false);
        this.form_disabled = writable(true);

        this.onSave = this.onSave.bind(this);
        this.onMutateGet = this.onMutateGet.bind(this);
      }
      bindMutate(){
        this.S.bind$(this.mutate_evt, this.onMutateGet, 1);
      }
      clearError() {
        this.er.set('');
      }
      onDestroy() {
          if (this.key && this.unsub_evt) this.S.trigger([[this.unsub_evt, {}]]);
          this.S.unbind_(this.events);
      }
      fetch() {
        const filter = [`="${this.key}"`];
        const args = [filter, [], [], { type: this.type, form: true, schema: this.schema_key }];
        const e1 = [this.data_evt, args];
        this.S.trigger([e1]);
      }
      onSave() {
        const form = get_store_value(this.form); // not recommaned to use get
        this.isSaving.set(true);
        const filter = this.isUpdate ? [`="${this.type == 'o' ? form._key : form[0]}"`] : null;
        this.S.trigger([[this.mutate_evt, [form, filter]]]);
      }
      onMutateGet([d]) {
        this.isSaving.set(false);
        let er;
        if (d.ok) {
          er = '';
          this.dp('successSave', { key: this.key, d });
        } else {
          er = d.error;
        }
        this.er.set(er);
      }
    }

    class Form extends FormBasic {
      constructor(S, key, e, dp, type='o') {
        super(S, key, e, dp, type);
        this.form.set({});
        this.onFormDataGet = this.onFormDataGet.bind(this);
      }
      bindAll(){
        this.bindFormDataGet();
        this.bindMutate();
      }
      bindFormDataGet(){
        this.S.bind$(this.data_evt, this.onFormDataGet, 1);
      }
      onFormDataGet(d){
        this.isSaving.set(false);
        const form = Form.onFormDataGetStatic(d);
        if (form._key) {
         this.isUpdate = true;
        }
        this.form.set(form);
        this.form_disabled.set(false);
      }
      //static functions:
      static onFormDataGetStatic([d]) {
        if (d.r) {
          const r = d.r.result;
          if(r.length){
            return r[0]
          } else {
            return {}
          }
        } else if (d.n) ; else if (d.m) {
          const r = d.m.result;
          if(r.length){
            return r[0]
          } else {
            return {}
          }
          //d.m.result
        } else if (d.d) ;
      }
    }
    class FormArray extends FormBasic {
      constructor(S, key, ev, dp, schema_key, type='a') {
        super(S, key, ev, dp, type);
        this.schema_key = schema_key;
        this.form.set([]);
        this.headers = writable([]);
        this.onSchemaDataGet = this.onSchemaDataGet.bind(this);
        this.onFormDataGet = this.onFormDataGet.bind(this);
        this.schemaGetEvt = [event_type.get, events.my, events.fields_schema_get, key ];
      }
      bindAll(){
        this.bindSchemaDataGet();
        this.bindFormDataGet();
        this.bindMutate();
      }
      bindSchemaDataGet(){
        this.S.bind$(this.schemaGetEvt, this.onSchemaDataGet, 1);
      }
      bindFormDataGet(){
        if(this.data_evt) {
          this.S.bind$(this.data_evt, this.onFormDataGet, 1);
        }
      }
      onDestroy() {
        super.onDestroy();
        this.S.unbind_(this.schemaGetEvt);
      }
      fetch() {
        this.S.trigger([[this.schemaGetEvt, [this.schema_key]]]);
      }
      onSchemaDataGet(d){
        this.headers.set(d[0]);
        super.fetch();
      }
      onFormDataGet(d){
        this.isSaving.set(false);
        const form = FormArray.onFormDataGetStatic(d);
        if (form[0]) {
         this.isUpdate = true;
        }
        this.form.set(form);
        this.form_disabled.set(false);
      }
      //static functions:
      static onFormDataGetStatic([d]) {
        if (d.r) {
          const r = d.r.result;
          if(r.length){
            return r[0]
          } else {
            return {}
          }
        } else if (d.n) ; else if (d.m) {
          const r = d.m.result;
          if(r.length){
            return r[0]
          } else {
            return {}
          }
          //d.m.result
        } else if (d.d) ;
      }
    }
    const form_schema_evt = (id) => [event_type.get, events.my, events.form_schema_get, id ];

    const css_frameworks = writable(
    	{ bootstrap: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' },
    	
    	);
    const selected_frameworks = writable(['bootstrap']);

    const css = writable(
    	{ table:{
    		class:{ selected: 'myselected'},
    		css: {count: 0, links: ['one']}
    	} } );

    /*
    [
      title: {
    	class: {},
        css: {
        	count: 0,
        	[{}, {}, {}, {}, ...]
        }
      }
    ]
    */


      S.bind$(
        [event_type.get, events.account, events.css_event, 0],
        function(data) {
          // just properly set css store...
          console.log("i got data: ", data); 
        },
        1
      );

    /* src/components/Css.svelte generated by Svelte v3.16.7 */

    const file = "src/components/Css.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i][0];
    	child_ctx[4] = list[i][1];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i][0];
    	child_ctx[10] = list[i][1];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (9:2) {#if framework == f}
    function create_if_block_1(ctx) {
    	let html_tag;
    	let raw_value = /*link*/ ctx[10] + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(raw_value, null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$css_frameworks*/ 1 && raw_value !== (raw_value = /*link*/ ctx[10] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(9:2) {#if framework == f}",
    		ctx
    	});

    	return block;
    }

    // (8:1) {#each $selected_frameworks as f, index (f)}
    function create_each_block_3(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*framework*/ ctx[9] == /*f*/ ctx[12] && create_if_block_1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*framework*/ ctx[9] == /*f*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(8:1) {#each $selected_frameworks as f, index (f)}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#each Object.entries($css_frameworks) as [framework, link], index (framework)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_3 = /*$selected_frameworks*/ ctx[1];
    	const get_key = ctx => /*f*/ ctx[12];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			const each_value_3 = /*$selected_frameworks*/ ctx[1];
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_3, each_1_anchor, get_each_context_3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(7:0) {#each Object.entries($css_frameworks) as [framework, link], index (framework)}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if comp.css.count}
    function create_if_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_1 = /*comp*/ ctx[4].css.links;
    	const get_key = ctx => /*l*/ ctx[7];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			const each_value_1 = /*comp*/ ctx[4].css.links;
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(17:2) {#if comp.css.count}",
    		ctx
    	});

    	return block;
    }

    // (18:3) {#each comp.css.links as l, index (l)}
    function create_each_block_1(key_1, ctx) {
    	let link;
    	let link_href_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			link = element("link");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", link_href_value = /*l*/ ctx[7]);
    			add_location(link, file, 18, 4, 445);
    			this.first = link;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$css*/ 4 && link_href_value !== (link_href_value = /*l*/ ctx[7])) {
    				attr_dev(link, "href", link_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(18:3) {#each comp.css.links as l, index (l)}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#each Object.entries($css) as [key, comp], index (key)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*comp*/ ctx[4].css.count && create_if_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*comp*/ ctx[4].css.count) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:0) {#each Object.entries($css) as [key, comp], index (key)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let each0_anchor;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let each1_anchor;
    	let each_value_2 = Object.entries(/*$css_frameworks*/ ctx[0]);
    	const get_key = ctx => /*framework*/ ctx[9];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_2(key, child_ctx));
    	}

    	let each_value = Object.entries(/*$css*/ ctx[2]);
    	const get_key_1 = ctx => /*key*/ ctx[3];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(document.head, null);
    			}

    			append_dev(document.head, each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(document.head, null);
    			}

    			append_dev(document.head, each1_anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			const each_value_2 = Object.entries(/*$css_frameworks*/ ctx[0]);
    			each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_2, each0_lookup, each0_anchor.parentNode, destroy_block, create_each_block_2, each0_anchor, get_each_context_2);
    			const each_value = Object.entries(/*$css*/ ctx[2]);
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, each1_anchor.parentNode, destroy_block, create_each_block, each1_anchor, get_each_context);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			detach_dev(each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $css_frameworks;
    	let $selected_frameworks;
    	let $css;
    	validate_store(css_frameworks, "css_frameworks");
    	component_subscribe($$self, css_frameworks, $$value => $$invalidate(0, $css_frameworks = $$value));
    	validate_store(selected_frameworks, "selected_frameworks");
    	component_subscribe($$self, selected_frameworks, $$value => $$invalidate(1, $selected_frameworks = $$value));
    	validate_store(css, "css");
    	component_subscribe($$self, css, $$value => $$invalidate(2, $css = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$css_frameworks" in $$props) css_frameworks.set($css_frameworks = $$props.$css_frameworks);
    		if ("$selected_frameworks" in $$props) selected_frameworks.set($selected_frameworks = $$props.$selected_frameworks);
    		if ("$css" in $$props) css.set($css = $$props.$css);
    	};

    	return [$css_frameworks, $selected_frameworks, $css];
    }

    class Css extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Css",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/MenuF.svelte generated by Svelte v3.16.7 */
    const file$1 = "src/components/MenuF.svelte";

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:0) {#if menu.tabs}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*menu*/ ctx[0].tabs;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu, tabsCount*/ 3) {
    				each_value = /*menu*/ ctx[0].tabs;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:0) {#if menu.tabs}",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#if tabsCount > 1}
    function create_if_block_2(ctx) {
    	let t0;
    	let t1_value = /*tab*/ ctx[3].title + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("  ");
    			t1 = text(t1_value);
    			t2 = text(":");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t1_value !== (t1_value = /*tab*/ ctx[3].title + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(11:1) {#if tabsCount > 1}",
    		ctx
    	});

    	return block;
    }

    // (14:3) {#if !tab.hidden}
    function create_if_block_1$1(ctx) {
    	let t;
    	let each_1_anchor;
    	let each_value_2 = /*c*/ ctx[6];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			t = text("  \n\t\t\t");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1) {
    				each_value_2 = /*c*/ ctx[6];
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(14:3) {#if !tab.hidden}",
    		ctx
    	});

    	return block;
    }

    // (16:3) {#each c as u}
    function create_each_block_2$1(ctx) {
    	let a;
    	let t0_value = /*u*/ ctx[9].title + "";
    	let t0;
    	let a_href_value;
    	let t1_value = " " + "";
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			attr_dev(a, "href", a_href_value = /*u*/ ctx[9].url);
    			add_location(a, file$1, 16, 4, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t0_value !== (t0_value = /*u*/ ctx[9].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*menu*/ 1 && a_href_value !== (a_href_value = /*u*/ ctx[9].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(16:3) {#each c as u}",
    		ctx
    	});

    	return block;
    }

    // (13:1) {#each tab.columns as c}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*tab*/ ctx[3].hidden && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*tab*/ ctx[3].hidden) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(13:1) {#each tab.columns as c}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#each menu.tabs as tab}
    function create_each_block$1(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let if_block = /*tabsCount*/ ctx[1] > 1 && create_if_block_2(ctx);
    	let each_value_1 = /*tab*/ ctx[3].columns;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			add_location(div, file$1, 11, 1, 248);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tabsCount*/ ctx[1] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*menu*/ 1) {
    				each_value_1 = /*tab*/ ctx[3].columns;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:0) {#each menu.tabs as tab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let if_block = /*menu*/ ctx[0].tabs && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$1, 6, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menu*/ ctx[0].tabs) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { menu = {} } = $$props;
    	const h = compose(length, filter(x => !x.hidden));
    	const writable_props = ["menu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MenuF> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("menu" in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	$$self.$capture_state = () => {
    		return { menu, tabsCount };
    	};

    	$$self.$inject_state = $$props => {
    		if ("menu" in $$props) $$invalidate(0, menu = $$props.menu);
    		if ("tabsCount" in $$props) $$invalidate(1, tabsCount = $$props.tabsCount);
    	};

    	let tabsCount;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*menu*/ 1) {
    			 $$invalidate(1, tabsCount = h(menu.tabs));
    		}
    	};

    	return [menu, tabsCount];
    }

    class MenuF extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { menu: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuF",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get menu() {
    		throw new Error("<MenuF>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu(value) {
    		throw new Error("<MenuF>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // use function directly on ws_dispatcher..


    	S.bind$(events.cookie_event, (d) => {
        
      }, 1);

    // use function directly on ws_dispatcher..



    function saveCookie(name, value, max_age) {
    	// read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    	document.cookie = `${name}=${value}; path=/; max-age=${max_age}`;
    }

      S.bind$(
        [event_type.get, events.account, events.cookie_event, 0],
        function(data) {
        	Object.keys(data[0].cookie).forEach(key=>{
    		   saveCookie(key, data[0].cookie[key], data[0].max_age);
    		});
        },
        1
      );

    // use function directly on ws_dispatcher..



    	S.bind$(events.cookie_event, (d) => {
        
      }, 1);

    S.bind$(events.menu_event, (d) => {
        
      }, 1);

    const UrlParser = (urlString, namedUrl = "") => {
      const urlBase = new URL(urlString);

      /**
       * Wrapper for URL.host
       *
       **/
      function host() {
        return urlBase.host;
      }

      /**
       * Wrapper for URL.hostname
       *
       **/
      function hostname() {
        return urlBase.hostname;
      }

      /**
       * Returns an object with all the named params and their values
       *
       **/
      function namedParams() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values[paramKey.value] = allPathName[paramKey.index];
          return values;
        }, {});
      }

      /**
       * Returns an array with all the named param keys
       *
       **/
      function namedParamsKeys() {
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(paramKey.value);
          return values;
        }, []);
      }

      /**
       * Returns an array with all the named param values
       *
       **/
      function namedParamsValues() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(allPathName[paramKey.index]);
          return values;
        }, []);
      }

      /**
       * Returns an array with all named param ids and their position in the path
       * Private
       **/
      function namedParamsWithIndex() {
        const namedUrlParams = getPathNames(namedUrl);

        return namedUrlParams.reduce((validParams, param, index) => {
          if (param[0] === ":") {
            validParams.push({ value: param.slice(1), index });
          }
          return validParams;
        }, []);
      }

      /**
       * Wrapper for URL.port
       *
       **/
      function port() {
        return urlBase.port;
      }

      /**
       * Wrapper for URL.pathname
       *
       **/
      function pathname() {
        return urlBase.pathname;
      }

      /**
       * Wrapper for URL.protocol
       *
       **/
      function protocol() {
        return urlBase.protocol;
      }

      /**
       * Wrapper for URL.search
       *
       **/
      function search() {
        return urlBase.search;
      }

      /**
       * Returns an object with all query params and their values
       *
       **/
      function queryParams() {
        const params = {};
        urlBase.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        return params;
      }

      /**
       * Returns an array with all the query param keys
       *
       **/
      function queryParamsKeys() {
        const params = [];
        urlBase.searchParams.forEach((_value, key) => {
          params.push(key);
        });

        return params;
      }

      /**
       * Returns an array with all the query param values
       *
       **/
      function queryParamsValues() {
        const params = [];
        urlBase.searchParams.forEach(value => {
          params.push(value);
        });

        return params;
      }

      /**
       * Returns an array with all the elements of a pathname
       *
       **/
      function pathNames() {
        return getPathNames(urlBase.pathname);
      }

      /**
       * Returns an array with all the parts of a pathname
       * Private method
       **/
      function getPathNames(pathName) {
        if (pathName === "/" || pathName.trim().length === 0) return [pathName];
        if (pathName.slice(-1) === "/") {
          pathName = pathName.slice(0, -1);
        }
        if (pathName[0] === "/") {
          pathName = pathName.slice(1);
        }

        return pathName.split("/");
      }

      return Object.freeze({
        host: host(),
        hostname: hostname(),
        namedParams: namedParams(),
        namedParamsKeys: namedParamsKeys(),
        namedParamsValues: namedParamsValues(),
        pathNames: pathNames(),
        port: port(),
        pathname: pathname(),
        protocol: protocol(),
        search: search(),
        queryParams: queryParams(),
        queryParamsKeys: queryParamsKeys(),
        queryParamsValues: queryParamsValues()
      });
    };

    var url_parser = { UrlParser };

    const UrlParser$1 = url_parser.UrlParser;

    var urlParamsParser = {
      UrlParser: UrlParser$1
    };
    var urlParamsParser_1 = urlParamsParser.UrlParser;

    const router = writable({});

    function set(route) {
      router.set(route);
    }

    function remove() {
      router.set({});
    }

    const activeRoute = {
      subscribe: router.subscribe,
      set,
      remove
    };

    /**
     * Returns true if object has any nested routes empty
     * @param routeObject
     **/
    function anyEmptyNestedRoutes(routeObject) {
      let result = false;
      if (Object.keys(routeObject).length === 0) {
        return true
      }

      if (routeObject.childRoute && Object.keys(routeObject.childRoute).length === 0) {
        result = true;
      } else if (routeObject.childRoute) {
        result = anyEmptyNestedRoutes(routeObject.childRoute);
      }

      return result
    }

    /**
     * Updates the base route path when route.name has a nested inside like /admin/teams
     * @param basePath string
     * @param pathNames array
     * @param route object
     **/
    function compareRoutes(basePath, pathNames, route) {
      if (basePath === '/' || basePath.trim().length === 0) return basePath
      let basePathResult = basePath;
      let routeName = route.name;
      if (routeName[0] === '/') {
        routeName = routeName.slice(1);
      }
      if (basePathResult[0] === '/') {
        basePathResult = basePathResult.slice(1);
      }

      if (!route.childRoute) {
        let routeNames = routeName.split(':')[0];
        if (routeNames.slice(-1) === '/') {
          routeNames = routeNames.slice(0, -1);
        }
        routeNames = routeNames.split('/');
        routeNames.shift();
        routeNames.forEach(() => {
          const currentPathName = pathNames[0];
          if (currentPathName && route.name.includes(`${basePathResult}/${currentPathName}`)) {
            basePathResult += `/${pathNames.shift()}`;
          } else {
            return basePathResult
          }
        });
        return basePathResult
      } else {
        return basePath
      }
    }

    /**
     * Return all the consecutive named param (placeholders) of a pathname
     * @param pathname
     **/
    function getNamedParams(pathName = '') {
      if (pathName.trim().length === '') return []

      const namedUrlParams = getPathNames(pathName);
      return namedUrlParams.reduce((validParams, param, index) => {
        if (param[0] === ':') {
          validParams.push(param.slice(1));
        }
        return validParams
      }, [])
    }

    /**
     * Split a pathname based on /
     * @param pathName
     * Private method
     **/
    function getPathNames(pathName) {
      if (pathName === '/' || pathName.trim().length === 0) return [pathName]
      if (pathName.slice(-1) === '/') {
        pathName = pathName.slice(0, -1);
      }
      if (pathName[0] === '/') {
        pathName = pathName.slice(1);
      }

      return pathName.split('/')
    }

    /**
     * Return the first part of a pathname until the first named param
     * @param name
     **/
    function nameToPath(name = '') {
      let routeName;
      if (name === '/' || name.trim().length === 0) return name
      if (name[0] === '/') {
        name = name.slice(1);
      }

      routeName = name.split(':')[0];
      if (routeName.slice(-1) === '/') {
        routeName = routeName.slice(0, -1);
      }

      return routeName.toLowerCase()
    }

    /**
     * Return the path name including query params
     * @param name
     **/
    function pathWithSearch(currentRoute) {
      let queryParams = [];
      if (currentRoute.queryParams) {
        for (let [key, value] of Object.entries(currentRoute.queryParams)) {
          queryParams.push(`${key}=${value}`);
        }
      }
      if (queryParams.length > 0) {
        return `${currentRoute.path}?${queryParams.join('&')}`
      } else {
        return currentRoute.path
      }
    }

    const NotFoundPage = '/404.html';
    let userDefinedRoutes = [];
    let routerOptions = {};
    let currentActiveRoute = '';

    /**
     * Object exposes one single property: activeRoute
     * @param routes  Array of routes
     * @param currentUrl current url
     * @param options configuration options
     **/
    async function SpaRouter(routes, currentUrl, options = {}) {
      let redirectTo = '';
      routerOptions = options;
      if (typeof currentUrl === 'undefined' || currentUrl === '') {
        currentUrl = document.location.href;
      }

      if (currentUrl.trim().length > 1 && currentUrl.slice(-1) === '/') {
        currentUrl = currentUrl.slice(0, -1);
      }

      const urlParser = urlParamsParser_1(currentUrl);
      let routeNamedParams = {};
      userDefinedRoutes = routes;

      async function findActiveRoute() {
        redirectTo = '';
        let searchActiveRoute = await searchActiveRoutes(routes, '', urlParser.pathNames);

        if (!searchActiveRoute || anyEmptyNestedRoutes(searchActiveRoute)) {
          if (typeof window !== 'undefined') {
            forceRedirect(NotFoundPage);
          } else {
            searchActiveRoute = { name: '404', component: '', path: '404' };
          }
        } else {
          searchActiveRoute.path = urlParser.pathname;
        }

        return searchActiveRoute
      }

      /**
       * Redirect current route to another
       * @param destinationUrl
       **/
      function forceRedirect(destinationUrl) {
        if (typeof window !== 'undefined') {
          currentActiveRoute = destinationUrl;
          if (destinationUrl === NotFoundPage) {
            window.location = destinationUrl;
          } else {
            navigateTo(destinationUrl);
          }
        }

        return destinationUrl
      }

      function gaTracking(newPage) {
        if (typeof ga !== 'undefined') {
          ga('set', 'page', newPage);
          ga('send', 'pageview');
        }
      }

      async function generate() {
        const currentRoute = await findActiveRoute();

        if (currentRoute.redirectTo) {
          return forceRedirect(redirectTo)
        }
        currentActiveRoute = currentRoute.path;
        activeRoute.set(currentRoute);

        pushActiveRoute(currentRoute);

        return currentRoute
      }

      /**
       * Updates the browser pathname and history with the active route.
       * @param currentRoute
       **/
      function pushActiveRoute(currentRoute) {
        if (typeof window !== 'undefined') {
          const pathAndSearch = pathWithSearch(currentRoute);
          window.history.pushState({ page: pathAndSearch }, '', pathAndSearch);
          if (routerOptions.gaPageviews) {
            gaTracking(pathAndSearch);
          }
        }
      }

      /**
       * Gets an array of routes and the browser pathname and return the active route
       * @param routes
       * @param basePath
       * @param pathNames
       **/
      async function searchActiveRoutes(routes, basePath, pathNames) {
        let currentRoute = {};
        let basePathName = pathNames.shift().toLowerCase();



        async function processRoute(route) {
          basePathName = compareRoutes(basePathName, pathNames, route);

          if (basePathName === nameToPath(route.name)) {
            let namedPath = `${basePath}/${route.name}`;
            let routePath = `${basePath}/${nameToPath(route.name)}`;
            if (routePath === '//') {
              routePath = '/';
            }

            if (route.redirectTo && route.redirectTo.length > 0) {
              redirectTo = route.redirectTo;
            }

            if (route.onlyIf && route.onlyIf.guard) {
              const result = await route.onlyIf.guard();
              if (!result) {
                let destinationUrl = '/';
                if (route.onlyIf.redirect && route.onlyIf.redirect.length > 0) {
                  destinationUrl = route.onlyIf.redirect;
                }
                redirectTo = destinationUrl;
              }
            }

            const namedParams = getNamedParams(route.name);
            if (namedParams && namedParams.length > 0) {
              namedParams.forEach(function() {
                if (pathNames.length > 0) {
                  routePath += `/${pathNames.shift()}`;
                }
              });
            }

            if (currentRoute.name !== routePath) {
              const parsedParams = urlParamsParser_1(`https://fake.com${urlParser.pathname}`, namedPath).namedParams;
              routeNamedParams = { ...routeNamedParams, ...parsedParams };
              currentRoute = {
                name: routePath,
                component: route.component,
                layout: route.layout,
                queryParams: urlParser.queryParams,
                namedParams: routeNamedParams,
                params: route.params
              };
            }

            if (route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length > 0) {
              currentRoute.childRoute = await searchActiveRoutes(route.nestedRoutes, routePath, pathNames);
            } else if (route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0) {
              const indexRoute = await searchActiveRoutes(route.nestedRoutes, routePath, ['index']);
              if (indexRoute && Object.keys(indexRoute).length > 0) {
                currentRoute.childRoute = indexRoute;
              }
            }
          }
        }
        for (const route of routes) {
          await processRoute(route);
        }

        if (redirectTo) {
          currentRoute['redirectTo'] = redirectTo;
        }

        return currentRoute
      }

      return Object.freeze({
        activeRoute: await generate()
      })
    }

    /**
     * Updates the current active route and updates the browser pathname
     * @param pathName
     **/
    function navigateTo(pathName) {
      if (pathName.trim().length > 1 && pathName[0] === '/') {
        pathName = pathName.slice(1);
      }

      const activeRoute = SpaRouter(userDefinedRoutes, 'http://fake.com/' + pathName, routerOptions).activeRoute;

      return activeRoute
    }

    if (typeof window !== 'undefined') {
      // Avoid full page reload on local routes
      window.addEventListener('click', event => {
        if (event.target.pathname && event.target.hostname === window.location.hostname && event.target.localName === 'a') {
          event.preventDefault();
          // event.stopPropagation()
          navigateTo(event.target.pathname + event.target.search);
        }
      });

      window.onpopstate = function(_event) {
        navigateTo(window.location.pathname + window.location.search);
      };
    }

    /* src/components/svelte-router-spa/src/components/route.svelte generated by Svelte v3.16.7 */

    // (10:34) 
    function create_if_block_2$1(ctx) {
    	let current;

    	const route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0].childRoute,
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0].childRoute;
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (8:33) 
    function create_if_block_1$2(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].component;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: {
    					.../*currentRoute*/ ctx[0],
    					component: ""
    				},
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = {
    				.../*currentRoute*/ ctx[0],
    				component: ""
    			};

    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(8:33) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if currentRoute.layout}
    function create_if_block$2(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].layout;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: { .../*currentRoute*/ ctx[0], layout: "" },
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = { .../*currentRoute*/ ctx[0], layout: "" };
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].layout)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:0) {#if currentRoute.layout}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentRoute*/ ctx[0].layout) return 0;
    		if (/*currentRoute*/ ctx[0].component) return 1;
    		if (/*currentRoute*/ ctx[0].childRoute) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { currentRoute = {} } = $$props;
    	let { params = {} } = $$props;
    	const writable_props = ["currentRoute", "params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute, params };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	return [currentRoute, params];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { currentRoute: 0, params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get currentRoute() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/svelte-router-spa/src/components/router.svelte generated by Svelte v3.16.7 */

    function create_fragment$3(ctx) {
    	let current;

    	const route = new Route({
    			props: { currentRoute: /*$activeRoute*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*$activeRoute*/ 1) route_changes.currentRoute = /*$activeRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, $$value => $$invalidate(0, $activeRoute = $$value));
    	let { routes = [] } = $$props;
    	let { options = {} } = $$props;

    	onMount(function () {
    		SpaRouter(routes, document.location.href, options).activeRoute;
    	});

    	const writable_props = ["routes", "options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(1, routes = $$props.routes);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    	};

    	$$self.$capture_state = () => {
    		return { routes, options, $activeRoute };
    	};

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(1, routes = $$props.routes);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("$activeRoute" in $$props) activeRoute.set($activeRoute = $$props.$activeRoute);
    	};

    	return [$activeRoute, routes, options];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { routes: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get routes() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // use function directly on ws_dispatcher..


    S.bind$( [event_type.get, events.account, events.redirection_event, 0],
    	function(data) {
    	  //goto(data[0])
    	  navigateTo(data[0][0]);
    	},
    	1
    );

    // use function directly on ws_dispatcher..



    	S.bind$(events.notification_event, (d) => {
        
      }, 1);

    // use function directly on ws_dispatcher..

    const translation = new writable({});

    const fetchTranslations = async () => {
      const trans = await new Promise((resolve, reject) => {
        S.bind_(
          form_schema_evt('glob_tran'),
          ([d]) => {
            resolve(d[0]);
          },
          ['translation']
        );
      });
      translation.set(trans);
      return trans
    };

    fetchTranslations();


    /*S.bind$( [et.get, e.account, e.translation_event, 0],
    	function(data) {
    	  console.log(data)
    	},
    	1
    )*/

    /* src/components/_SubmitButton.svelte generated by Svelte v3.16.7 */

    const file$2 = "src/components/_SubmitButton.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-13fyh8m-style";
    	style.textContent = ".success.svelte-13fyh8m{color:green}.loading.svelte-13fyh8m{color:grey}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX1N1Ym1pdEJ1dHRvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIl9TdWJtaXRCdXR0b24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgaXNTYXZpbmcgPSBmYWxzZVxuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2VcbiAgZXhwb3J0IGxldCB0aXRsZSA9ICcnXG5cbiAgbGV0IGNsYXNzbjtcbiAgJDoge1xuICAgIGNsYXNzbiA9ICdzdWNjZXNzICdcbiAgICBpZihpc1NhdmluZyB8fCBkaXNhYmxlZCkgY2xhc3NuICs9ICdkaXNhYmxlZCAnXG4gICAgaWYoaXNTYXZpbmcpIGNsYXNzbiArPSAnbG9hZGluZyAnXG4gIH1cblxuXG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuc3VjY2VzcyB7XG4gICAgY29sb3I6IGdyZWVuO1xuICB9XG4gIC5sb2FkaW5nIHtcbiAgICBjb2xvcjogZ3JleTtcbiAgfVxuPC9zdHlsZT5cblxuPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9e2NsYXNzbn0gZGlzYWJsZWQ9e2lzU2F2aW5nIHx8IGRpc2FibGVkfSB7dGl0bGV9PlxuICA8c2xvdD5TYXZlIGNoYW5nZXM8L3Nsb3Q+XG48L2J1dHRvbj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFnQkUsUUFBUSxlQUFDLENBQUMsQUFDUixLQUFLLENBQUUsS0FBSyxBQUNkLENBQUMsQUFDRCxRQUFRLGVBQUMsQ0FBQyxBQUNSLEtBQUssQ0FBRSxJQUFJLEFBQ2IsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    function create_fragment$4(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let button_disabled_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");

    			if (!default_slot) {
    				t = text("Save changes");
    			}

    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*classn*/ ctx[3]) + " svelte-13fyh8m"));
    			button.disabled = button_disabled_value = /*isSaving*/ ctx[0] || /*disabled*/ ctx[1];
    			attr_dev(button, "title", /*title*/ ctx[2]);
    			add_location(button, file$2, 24, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!default_slot) {
    				append_dev(button, t);
    			}

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 16) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[4], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null));
    			}

    			if (!current || dirty & /*classn*/ 8 && button_class_value !== (button_class_value = "" + (null_to_empty(/*classn*/ ctx[3]) + " svelte-13fyh8m"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*isSaving, disabled*/ 3 && button_disabled_value !== (button_disabled_value = /*isSaving*/ ctx[0] || /*disabled*/ ctx[1])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (!current || dirty & /*title*/ 4) {
    				attr_dev(button, "title", /*title*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { isSaving = false } = $$props;
    	let { disabled = false } = $$props;
    	let { title = "" } = $$props;
    	let classn;
    	const writable_props = ["isSaving", "disabled", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SubmitButton> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("isSaving" in $$props) $$invalidate(0, isSaving = $$props.isSaving);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { isSaving, disabled, title, classn };
    	};

    	$$self.$inject_state = $$props => {
    		if ("isSaving" in $$props) $$invalidate(0, isSaving = $$props.isSaving);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("classn" in $$props) $$invalidate(3, classn = $$props.classn);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isSaving, disabled, classn*/ 11) {
    			 {
    				$$invalidate(3, classn = "success ");
    				if (isSaving || disabled) $$invalidate(3, classn += "disabled ");
    				if (isSaving) $$invalidate(3, classn += "loading ");
    			}
    		}
    	};

    	return [isSaving, disabled, title, classn, $$scope, $$slots];
    }

    class SubmitButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-13fyh8m-style")) add_css();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { isSaving: 0, disabled: 1, title: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubmitButton",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get isSaving() {
    		throw new Error("<SubmitButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSaving(value) {
    		throw new Error("<SubmitButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<SubmitButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SubmitButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SubmitButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SubmitButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/_CancelButton.svelte generated by Svelte v3.16.7 */
    const file$3 = "src/components/_CancelButton.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-14ki8w0-style";
    	style.textContent = "button.svelte-14ki8w0{color:darkred}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX0NhbmNlbEJ1dHRvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIl9DYW5jZWxCdXR0b24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IG9uTW91bnQsIG9uRGVzdHJveSwgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJ1xuICBjb25zdCBkcCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXG5cbiAgZXhwb3J0IGxldCBpc1NhdmluZyA9IGZhbHNlXG4gICQ6IGJ1dHRvblNhdmVDbGFzcyA9IGlzU2F2aW5nID09PSB0cnVlID8gJ2Rpc2FibGVkIGxvYWRpbmcnIDogJ3N1Y2Nlc3MnXG4gIGV4cG9ydCBsZXQga2V5ID0gMFxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgYnV0dG9uIHtcbiAgICBjb2xvcjogZGFya3JlZDtcbiAgfVxuPC9zdHlsZT5cblxuPGJ1dHRvblxuICB0eXBlPVwiYnV0dG9uXCJcbiAgY2xhc3M9e2J1dHRvblNhdmVDbGFzc31cbiAgZGlzYWJsZWQ9e2lzU2F2aW5nfVxuICBvbjpjbGljaz17KCkgPT4gZHAoJ2Nsb3NlJywga2V5KX0+XG4gIENhbmNlbFxuPC9idXR0b24+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUUsTUFBTSxlQUFDLENBQUMsQUFDTixLQUFLLENBQUUsT0FBTyxBQUNoQixDQUFDIn0= */";
    	append_dev(document.head, style);
    }

    function create_fragment$5(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Cancel");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*buttonSaveClass*/ ctx[2]) + " svelte-14ki8w0"));
    			button.disabled = /*isSaving*/ ctx[0];
    			add_location(button, file$3, 15, 0, 305);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buttonSaveClass*/ 4 && button_class_value !== (button_class_value = "" + (null_to_empty(/*buttonSaveClass*/ ctx[2]) + " svelte-14ki8w0"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*isSaving*/ 1) {
    				prop_dev(button, "disabled", /*isSaving*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const dp = createEventDispatcher();
    	let { isSaving = false } = $$props;
    	let { key = 0 } = $$props;
    	const writable_props = ["isSaving", "key"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CancelButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dp("close", key);

    	$$self.$set = $$props => {
    		if ("isSaving" in $$props) $$invalidate(0, isSaving = $$props.isSaving);
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    	};

    	$$self.$capture_state = () => {
    		return { isSaving, key, buttonSaveClass };
    	};

    	$$self.$inject_state = $$props => {
    		if ("isSaving" in $$props) $$invalidate(0, isSaving = $$props.isSaving);
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    		if ("buttonSaveClass" in $$props) $$invalidate(2, buttonSaveClass = $$props.buttonSaveClass);
    	};

    	let buttonSaveClass;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isSaving*/ 1) {
    			 $$invalidate(2, buttonSaveClass = isSaving === true ? "disabled loading" : "success");
    		}
    	};

    	return [isSaving, key, buttonSaveClass, dp, click_handler];
    }

    class CancelButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-14ki8w0-style")) add_css$1();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { isSaving: 0, key: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CancelButton",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get isSaving() {
    		throw new Error("<CancelButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSaving(value) {
    		throw new Error("<CancelButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<CancelButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<CancelButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Model.svelte generated by Svelte v3.16.7 */
    const file$4 = "src/components/table/Model.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$6(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let hr0;
    	let t2;
    	let t3;
    	let t4;
    	let hr1;
    	let current;
    	let dispose;
    	const header_slot_template = /*$$slots*/ ctx[2].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[1], get_header_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	const footer_slot_template = /*$$slots*/ ctx[2].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[1], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			if (footer_slot) footer_slot.c();
    			t4 = space();
    			hr1 = element("hr");
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$4, 5, 0, 106);
    			add_location(hr0, file$4, 9, 2, 216);
    			add_location(hr1, file$4, 12, 2, 261);
    			attr_dev(div1, "class", "modal");
    			add_location(div1, file$4, 7, 0, 169);
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[3], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, hr0);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t3);

    			if (footer_slot) {
    				footer_slot.m(div1, null);
    			}

    			append_dev(div1, t4);
    			append_dev(div1, hr1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot && header_slot.p && dirty & /*$$scope*/ 2) {
    				header_slot.p(get_slot_context(header_slot_template, ctx, /*$$scope*/ ctx[1], get_header_slot_context), get_slot_changes(header_slot_template, /*$$scope*/ ctx[1], dirty, get_header_slot_changes));
    			}

    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    			}

    			if (footer_slot && footer_slot.p && dirty & /*$$scope*/ 2) {
    				footer_slot.p(get_slot_context(footer_slot_template, ctx, /*$$scope*/ ctx[1], get_footer_slot_context), get_slot_changes(footer_slot_template, /*$$scope*/ ctx[1], dirty, get_footer_slot_changes));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const dp = createEventDispatcher();
    	let { $$slots = {}, $$scope } = $$props;
    	const click_handler = () => dp("close");

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [dp, $$scope, $$slots, click_handler];
    }

    class Model extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Model",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    function flip(node, animation, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* src/components/table/Config.svelte generated by Svelte v3.16.7 */
    const file$5 = "src/components/table/Config.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[25] = list;
    	child_ctx[26] = i;
    	return child_ctx;
    }

    // (154:2) {#if list && list.length}
    function create_if_block_1$3(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*list*/ ctx[1];
    	const get_key = ctx => /*getKey*/ ctx[11](/*item*/ ctx[24]);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$5, 154, 4, 4056);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const each_value = /*list*/ ctx[1];
    			group_outros();
    			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(154:2) {#if list && list.length}",
    		ctx
    	});

    	return block;
    }

    // (169:10) {#if true}
    function create_if_block_2$2(ctx) {
    	let input;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[21].call(input, /*item*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$5, 169, 12, 4584);
    			dispose = listen_dev(input, "change", input_change_handler);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*item*/ ctx[24].isVisible;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*list*/ 2) {
    				input.checked = /*item*/ ctx[24].isVisible;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(169:10) {#if true}",
    		ctx
    	});

    	return block;
    }

    // (156:6) {#each list as item, index (getKey(item))}
    function create_each_block$2(key_1, ctx) {
    	let li;
    	let t0;
    	let t1_value = /*item*/ ctx[24].form_label + "";
    	let t1;
    	let t2;
    	let li_data_index_value;
    	let li_data_id_value;
    	let li_draggable_value;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let dispose;
    	let if_block =  create_if_block_2$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(li, "data-index", li_data_index_value = /*index*/ ctx[26]);
    			attr_dev(li, "data-id", li_data_id_value = /*getKey*/ ctx[11](/*item*/ ctx[24]));

    			attr_dev(li, "draggable", li_draggable_value = /*disabledDndIdx*/ ctx[12].includes(/*index*/ ctx[26])
    			? "false"
    			: "true");

    			toggle_class(li, "over", /*getKey*/ ctx[11](/*item*/ ctx[24]) === /*isOver*/ ctx[0]);
    			add_location(li, file$5, 156, 8, 4118);

    			dispose = [
    				listen_dev(li, "dragstart", /*start*/ ctx[7], false, false, false),
    				listen_dev(li, "dragover", /*over*/ ctx[8], false, false, false),
    				listen_dev(li, "dragleave", /*leave*/ ctx[9], false, false, false),
    				listen_dev(li, "drop", /*drop*/ ctx[10], false, false, false)
    			];

    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    			if ((!current || dirty & /*list*/ 2) && t1_value !== (t1_value = /*item*/ ctx[24].form_label + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*list*/ 2 && li_data_index_value !== (li_data_index_value = /*index*/ ctx[26])) {
    				attr_dev(li, "data-index", li_data_index_value);
    			}

    			if (!current || dirty & /*list*/ 2 && li_data_id_value !== (li_data_id_value = /*getKey*/ ctx[11](/*item*/ ctx[24]))) {
    				attr_dev(li, "data-id", li_data_id_value);
    			}

    			if (!current || dirty & /*list*/ 2 && li_draggable_value !== (li_draggable_value = /*disabledDndIdx*/ ctx[12].includes(/*index*/ ctx[26])
    			? "false"
    			: "true")) {
    				attr_dev(li, "draggable", li_draggable_value);
    			}

    			if (dirty & /*getKey, list, isOver*/ 2051) {
    				toggle_class(li, "over", /*getKey*/ ctx[11](/*item*/ ctx[24]) === /*isOver*/ ctx[0]);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 300 });
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);

    				if (!li_intro) li_intro = create_in_transition(li, /*receive*/ ctx[6], {
    					key: /*getKey*/ ctx[11](/*item*/ ctx[24])
    				});

    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (li_intro) li_intro.invalidate();

    			li_outro = create_out_transition(li, /*send*/ ctx[5], {
    				key: /*getKey*/ ctx[11](/*item*/ ctx[24])
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			if (detaching && li_outro) li_outro.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(156:6) {#each list as item, index (getKey(item))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let form;
    	let t0;
    	let div;
    	let t1;
    	let t2;
    	let footer;
    	let t3;
    	let button;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let dispose;
    	let if_block0 = /*list*/ ctx[1] && /*list*/ ctx[1].length && create_if_block_1$3(ctx);

    	const submitbutton = new SubmitButton({
    			props: {
    				isSaving: /*isSaving*/ ctx[3],
    				title: "Save current changes"
    			},
    			$$inline: true
    		});

    	const cancelbutton = new CancelButton({
    			props: { isSaving: /*isSaving*/ ctx[3] },
    			$$inline: true
    		});

    	cancelbutton.$on("close", /*close_handler_1*/ ctx[23]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			t1 = text(/*er*/ ctx[2]);
    			t2 = space();
    			footer = element("footer");
    			create_component(submitbutton.$$.fragment);
    			t3 = space();
    			button = element("button");
    			t4 = text("Apply");
    			t5 = space();
    			t6 = space();
    			create_component(cancelbutton.$$.fragment);
    			add_location(div, file$5, 176, 2, 4732);
    			attr_dev(button, "type", "button");
    			button.disabled = /*isSaving*/ ctx[3];
    			attr_dev(button, "title", "Apply changes without saving");
    			add_location(button, file$5, 179, 4, 4824);
    			add_location(footer, file$5, 177, 2, 4750);
    			add_location(form, file$5, 152, 0, 3983);

    			dispose = [
    				listen_dev(button, "click", /*click_handler*/ ctx[22], false, false, false),
    				listen_dev(form, "submit", prevent_default(/*onSave*/ ctx[13]), false, true, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			if (if_block0) if_block0.m(form, null);
    			append_dev(form, t0);
    			append_dev(form, div);
    			append_dev(div, t1);
    			append_dev(form, t2);
    			append_dev(form, footer);
    			mount_component(submitbutton, footer, null);
    			append_dev(footer, t3);
    			append_dev(footer, button);
    			append_dev(button, t4);
    			append_dev(footer, t5);
    			append_dev(footer, t6);
    			mount_component(cancelbutton, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*list*/ ctx[1] && /*list*/ ctx[1].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(form, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*er*/ 4) set_data_dev(t1, /*er*/ ctx[2]);
    			const submitbutton_changes = {};
    			if (dirty & /*isSaving*/ 8) submitbutton_changes.isSaving = /*isSaving*/ ctx[3];
    			submitbutton.$set(submitbutton_changes);

    			if (!current || dirty & /*isSaving*/ 8) {
    				prop_dev(button, "disabled", /*isSaving*/ ctx[3]);
    			}
    			const cancelbutton_changes = {};
    			if (dirty & /*isSaving*/ 8) cancelbutton_changes.isSaving = /*isSaving*/ ctx[3];
    			cancelbutton.$set(cancelbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(submitbutton.$$.fragment, local);
    			transition_in(cancelbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(submitbutton.$$.fragment, local);
    			transition_out(cancelbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block0) if_block0.d();
    			destroy_component(submitbutton);
    			destroy_component(cancelbutton);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { schema_key = "" } = $$props;
    	const dp = createEventDispatcher();

    	const [send, receive] = crossfade({
    		duration: d => Math.sqrt(d * 200),
    		fallback(node, params) {
    			const style = getComputedStyle(node);
    			const transform = style.transform === "none" ? "" : style.transform;

    			return {
    				duration: 300,
    				easing: quintOut,
    				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
    			};
    		}
    	});

    	let isOver = false;

    	const getDraggedParent = node => node.dataset && node.dataset.index
    	? node.dataset
    	: getDraggedParent(node.parentNode);

    	const start = ev => {
    		ev.dataTransfer.setData("source", ev.target.dataset.index);
    	};

    	const over = ev => {
    		const isFromList = ev.dataTransfer.types.includes("source");

    		if (isFromList) {
    			let dragged = getDraggedParent(ev.target);
    			if (disabledDndIdx.includes(Number(dragged.index))) return;
    			if (isOver !== dragged.id) $$invalidate(0, isOver = dragged.id);
    			ev.preventDefault();
    		}
    	};

    	const leave = ev => {
    		let dragged = getDraggedParent(ev.target);
    		if (isOver === dragged.id) $$invalidate(0, isOver = false);
    	};

    	const drop = ev => {
    		$$invalidate(0, isOver = false);
    		ev.preventDefault();
    		let dragged = getDraggedParent(ev.target);
    		let from = ev.dataTransfer.getData("source");
    		let to = dragged.index;

    		if (sortMode === "insert") {
    			insertSort({ from, to });
    		} else {
    			swapSort({ from, to });
    		}
    	};

    	const insertSort = ({ from, to }) => {
    		if (from === to) {
    			return;
    		}

    		let newList = [...list];
    		const movedItem = { ...newList[from] };
    		newList = [];

    		list.forEach((item, i) => {
    			if (i === Number(from)) {
    				return;
    			}

    			if (i === Number(to)) {
    				if (Number(to) > Number(from)) {
    					newList = newList.concat([{ ...item }, movedItem]);
    				} else {
    					newList = newList.concat([movedItem, { ...item }]);
    				}
    			} else {
    				newList = newList.concat([{ ...item }]);
    			}
    		});

    		$$invalidate(1, list = newList);
    		dp("sort", newList);
    	};

    	const swapSort = ({ from, to }) => {
    		let newList = [...list];
    		newList[from] = [newList[to], newList[to] = newList[from]][0];
    		$$invalidate(1, list = newList);
    		dp("sort", newList);
    	};

    	const getKey = item => key_ ? item[key_] : item;
    	let list = [];
    	let sortMode = "insert";
    	let key_ = "form_label";
    	let disabledDndIdx = [0];
    	let er = "";
    	let isSaving = false;

    	onMount(async () => {
    		const [d] = await new Promise((resolve, reject) => {
    				S.bind_(
    					[event_type.get, events.my, events.my_schema_get, `table_${schema_key}`],
    					d => {
    						resolve(d);
    					},
    					[schema_key]
    				);
    			},
    		0);

    		$$invalidate(1, list = d);
    	});

    	async function onSave() {
    		$$invalidate(3, isSaving = true);

    		const [d] = await new Promise((resolve, reject) => {
    				S.bind_(
    					[event_type.mutate, events.my, events.my_schema_mutate, `table_${schema_key}`],
    					d => {
    						resolve(d);
    					},
    					[schema_key, { columns: list }]
    				);
    			},
    		0);

    		$$invalidate(3, isSaving = false);

    		if (d.ok) {
    			$$invalidate(2, er = "Settings saved");

    			setTimeout(
    				function () {
    					$$invalidate(2, er = "");
    				},
    				1500
    			);
    		} else {
    			$$invalidate(2, er = d.error);
    		}
    	}

    	const writable_props = ["schema_key"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Config> was created with unknown prop '${key}'`);
    	});

    	function close_handler(event) {
    		bubble($$self, event);
    	}

    	function input_change_handler(item) {
    		item.isVisible = this.checked;
    		$$invalidate(1, list);
    	}

    	const click_handler = () => dp("configApply", { list });

    	function close_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("schema_key" in $$props) $$invalidate(14, schema_key = $$props.schema_key);
    	};

    	$$self.$capture_state = () => {
    		return {
    			schema_key,
    			isOver,
    			list,
    			sortMode,
    			key_,
    			disabledDndIdx,
    			er,
    			isSaving
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("schema_key" in $$props) $$invalidate(14, schema_key = $$props.schema_key);
    		if ("isOver" in $$props) $$invalidate(0, isOver = $$props.isOver);
    		if ("list" in $$props) $$invalidate(1, list = $$props.list);
    		if ("sortMode" in $$props) sortMode = $$props.sortMode;
    		if ("key_" in $$props) key_ = $$props.key_;
    		if ("disabledDndIdx" in $$props) $$invalidate(12, disabledDndIdx = $$props.disabledDndIdx);
    		if ("er" in $$props) $$invalidate(2, er = $$props.er);
    		if ("isSaving" in $$props) $$invalidate(3, isSaving = $$props.isSaving);
    	};

    	return [
    		isOver,
    		list,
    		er,
    		isSaving,
    		dp,
    		send,
    		receive,
    		start,
    		over,
    		leave,
    		drop,
    		getKey,
    		disabledDndIdx,
    		onSave,
    		schema_key,
    		getDraggedParent,
    		insertSort,
    		swapSort,
    		sortMode,
    		key_,
    		close_handler,
    		input_change_handler,
    		click_handler,
    		close_handler_1
    	];
    }

    class Config extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { schema_key: 14 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Config",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get schema_key() {
    		throw new Error("<Config>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set schema_key(value) {
    		throw new Error("<Config>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Table.svelte generated by Svelte v3.16.7 */

    const { console: console_1 } = globals;
    const file$6 = "src/components/table/Table.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[101] = list[i];
    	child_ctx[103] = i;
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[98] = list[i];
    	child_ctx[100] = i;
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[106] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[104] = list[i];
    	child_ctx[103] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[104] = list[i];
    	child_ctx[103] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[110] = list[i];
    	return child_ctx;
    }

    // (597:0) {#if $css.table}
    function create_if_block$3(ctx) {
    	let div;
    	let button0;
    	let t0_value = (!/*addnewform*/ ctx[20] ? "Add New" : "Close") + "";
    	let t0;
    	let button0_class_value;
    	let t1;
    	let t2;
    	let hr;
    	let t3;
    	let button1;
    	let t5;
    	let span;
    	let t6_value = /*items*/ ctx[7].length + "";
    	let t6;
    	let t7_value = (/*items*/ ctx[7].length <= 1 ? " item" : " items") + "";
    	let t7;
    	let t8;
    	let input0;
    	let input0_updating = false;
    	let t9;
    	let t10;
    	let select;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let button2;
    	let t16;
    	let t17;
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let input1;
    	let t18;
    	let t19;
    	let t20;
    	let tr1;
    	let th1;
    	let t21;
    	let t22;
    	let tbody;
    	let each_blocks = [];
    	let each3_lookup = new Map();
    	let t23;
    	let t24;
    	let if_block5_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*addnewform*/ ctx[20] && create_if_block_25(ctx);

    	function input0_input_handler() {
    		input0_updating = true;
    		/*input0_input_handler*/ ctx[85].call(input0);
    	}
    	let each_value_5 = /*pages*/ ctx[15];
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let if_block2 = /*multipleSelected*/ ctx[26] && create_if_block_23(ctx);
    	let if_block3 = /*config*/ ctx[22] && create_if_block_22(ctx);
    	let each_value_4 = /*headers*/ ctx[6];
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_2[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_2 = /*headers*/ ctx[6];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value = /*items*/ ctx[7];
    	const get_key = ctx => /*l*/ ctx[98][0];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each3_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	let if_block4 = /*contextmenu*/ ctx[23] && create_if_block_2$3(ctx);
    	let if_block5 = /*modalIsVisible*/ ctx[21] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Reset Filters";
    			t5 = space();
    			span = element("span");
    			t6 = text(t6_value);
    			t7 = text(t7_value);
    			t8 = text("\n  Page Size:\n  ");
    			input0 = element("input");
    			t9 = space();
    			t10 = text("\n  Page:\n  ");
    			select = element("select");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t11 = text("\n   / ");
    			t12 = text(/*total_pages*/ ctx[17]);
    			t13 = space();
    			if (if_block2) if_block2.c();
    			t14 = space();
    			button2 = element("button");
    			button2.textContent = "Config";
    			t16 = space();
    			if (if_block3) if_block3.c();
    			t17 = space();
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			input1 = element("input");
    			t18 = text("\n          Actions");
    			t19 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t20 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			t21 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t22 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			if (if_block4) if_block4.c();
    			t24 = space();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    			attr_dev(button0, "name", "table_add");
    			attr_dev(button0, "class", button0_class_value = /*addnewform*/ ctx[20] ? "pressed" : "");
    			add_location(button0, file$6, 599, 2, 15050);
    			add_location(hr, file$6, 615, 2, 15433);
    			attr_dev(button1, "class", "");
    			add_location(button1, file$6, 617, 2, 15443);
    			add_location(span, file$6, 618, 2, 15510);
    			attr_dev(input0, "class", "w60");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			add_location(input0, file$6, 620, 2, 15593);
    			if (/*current_page*/ ctx[16] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[86].call(select));
    			add_location(select, file$6, 630, 2, 15791);
    			attr_dev(button2, "type", "button");
    			add_location(button2, file$6, 639, 2, 16064);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$6, 651, 10, 16334);
    			attr_dev(th0, "colspan", "3");
    			add_location(th0, file$6, 650, 8, 16307);
    			add_location(tr0, file$6, 649, 6, 16294);
    			attr_dev(th1, "colspan", "3");
    			add_location(th1, file$6, 676, 8, 17048);
    			add_location(tr1, file$6, 675, 6, 17035);
    			add_location(thead, file$6, 648, 4, 16280);
    			add_location(tbody, file$6, 737, 4, 19321);
    			add_location(table, file$6, 647, 2, 16268);
    			add_location(div, file$6, 597, 0, 15041);

    			dispose = [
    				listen_dev(button0, "click", /*toogleAddForm*/ ctx[30], false, false, false),
    				listen_dev(button1, "click", /*onResetFilter*/ ctx[29], false, false, false),
    				listen_dev(input0, "input", input0_input_handler),
    				listen_dev(input0, "change", /*onLimitChange*/ ctx[36], false, false, false),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[86]),
    				listen_dev(select, "change", /*refresh*/ ctx[5], false, false, false),
    				listen_dev(button2, "click", /*onConfigClicked*/ ctx[45], false, false, false),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[88]),
    				listen_dev(input1, "click", /*onSelectAllClick*/ ctx[44], false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			/*button0_binding*/ ctx[84](button0);
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, hr);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			append_dev(div, t5);
    			append_dev(div, span);
    			append_dev(span, t6);
    			append_dev(span, t7);
    			append_dev(div, t8);
    			append_dev(div, input0);
    			set_input_value(input0, /*limit*/ ctx[14]);
    			append_dev(div, t9);
    			append_dev(div, t10);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(select, null);
    			}

    			select_option(select, /*current_page*/ ctx[16]);
    			append_dev(div, t11);
    			append_dev(div, t12);
    			append_dev(div, t13);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t14);
    			append_dev(div, button2);
    			append_dev(div, t16);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t17);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, input1);
    			input1.checked = /*allSelected*/ ctx[25];
    			append_dev(th0, t18);
    			append_dev(tr0, t19);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tr0, null);
    			}

    			append_dev(thead, t20);
    			append_dev(thead, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t21);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr1, null);
    			}

    			append_dev(table, t22);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div, t23);
    			if (if_block4) if_block4.m(div, null);
    			insert_dev(target, t24, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, if_block5_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*addnewform*/ 1048576) && t0_value !== (t0_value = (!/*addnewform*/ ctx[20] ? "Add New" : "Close") + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*addnewform*/ 1048576 && button0_class_value !== (button0_class_value = /*addnewform*/ ctx[20] ? "pressed" : "")) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (/*addnewform*/ ctx[20]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_25(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*items*/ 128) && t6_value !== (t6_value = /*items*/ ctx[7].length + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*items*/ 128) && t7_value !== (t7_value = (/*items*/ ctx[7].length <= 1 ? " item" : " items") + "")) set_data_dev(t7, t7_value);

    			if (!input0_updating && dirty[0] & /*limit*/ 16384) {
    				set_input_value(input0, /*limit*/ ctx[14]);
    			}

    			input0_updating = false;

    			if (dirty[0] & /*pages*/ 32768) {
    				each_value_5 = /*pages*/ ctx[15];
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_5(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_5.length;
    			}

    			if (dirty[0] & /*current_page*/ 65536) {
    				select_option(select, /*current_page*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*total_pages*/ 131072) set_data_dev(t12, /*total_pages*/ ctx[17]);

    			if (/*multipleSelected*/ ctx[26]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_23(ctx);
    					if_block2.c();
    					if_block2.m(div, t14);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*config*/ ctx[22]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    					transition_in(if_block3, 1);
    				} else {
    					if_block3 = create_if_block_22(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t17);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*allSelected*/ 33554432) {
    				input1.checked = /*allSelected*/ ctx[25];
    			}

    			if (dirty[0] & /*visible_columns, sortSettings, headers*/ 2624 | dirty[1] & /*handleSort, onHeaderContext*/ 576) {
    				each_value_4 = /*headers*/ ctx[6];
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_4(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tr0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_4.length;
    			}

    			if (dirty[0] & /*visible_columns, customFilter, filterSettings, handleFilter, hiddenColumns, headerColTypes, headers*/ 402655042 | dirty[1] & /*onTextInputContext*/ 1024) {
    				each_value_2 = /*headers*/ ctx[6];
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			const each_value = /*items*/ ctx[7];
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each3_lookup, tbody, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    			check_outros();

    			if (/*contextmenu*/ ctx[23]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$3(ctx);
    					if_block4.c();
    					if_block4.m(div, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*modalIsVisible*/ ctx[21]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    					transition_in(if_block5, 1);
    				} else {
    					if_block5 = create_if_block_1$4(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block3);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*button0_binding*/ ctx[84](null);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_3, detaching);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block4) if_block4.d();
    			if (detaching) detach_dev(t24);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(if_block5_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(597:0) {#if $css.table}",
    		ctx
    	});

    	return block;
    }

    // (607:2) {#if addnewform}
    function create_if_block_25(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*quickcomponent*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				key: null,
    				schema_key: /*schema_key*/ ctx[4],
    				eventsFn: /*eventsFn*/ ctx[0]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("close", /*toogleAddForm*/ ctx[30]);
    		switch_instance.$on("successSave", /*successSave*/ ctx[31]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*schema_key*/ 16) switch_instance_changes.schema_key = /*schema_key*/ ctx[4];
    			if (dirty[0] & /*eventsFn*/ 1) switch_instance_changes.eventsFn = /*eventsFn*/ ctx[0];

    			if (switch_value !== (switch_value = /*quickcomponent*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("close", /*toogleAddForm*/ ctx[30]);
    					switch_instance.$on("successSave", /*successSave*/ ctx[31]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25.name,
    		type: "if",
    		source: "(607:2) {#if addnewform}",
    		ctx
    	});

    	return block;
    }

    // (632:4) {#each pages as p}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*p*/ ctx[110] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*p*/ ctx[110];
    			option.value = option.__value;
    			add_location(option, file$6, 632, 6, 15875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pages*/ 32768 && t_value !== (t_value = /*p*/ ctx[110] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*pages*/ 32768 && option_value_value !== (option_value_value = /*p*/ ctx[110])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(632:4) {#each pages as p}",
    		ctx
    	});

    	return block;
    }

    // (637:2) {#if multipleSelected}
    function create_if_block_23(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			add_location(button, file$6, 637, 4, 15988);
    			dispose = listen_dev(button, "click", /*onDeleteSelected*/ ctx[35], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23.name,
    		type: "if",
    		source: "(637:2) {#if multipleSelected}",
    		ctx
    	});

    	return block;
    }

    // (641:2) {#if config}
    function create_if_block_22(ctx) {
    	let current;

    	const config_1 = new Config({
    			props: { schema_key: /*schema_key*/ ctx[4] },
    			$$inline: true
    		});

    	config_1.$on("close", /*close_handler*/ ctx[87]);
    	config_1.$on("configApply", /*onConfigApply*/ ctx[46]);

    	const block = {
    		c: function create() {
    			create_component(config_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(config_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const config_1_changes = {};
    			if (dirty[0] & /*schema_key*/ 16) config_1_changes.schema_key = /*schema_key*/ ctx[4];
    			config_1.$set(config_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(config_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(config_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(config_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(641:2) {#if config}",
    		ctx
    	});

    	return block;
    }

    // (659:10) {#if visible_columns[index]}
    function create_if_block_19(ctx) {
    	let th;
    	let t0_value = /*h*/ ctx[104] + "";
    	let t0;
    	let t1;
    	let t2;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*sortSettings*/ ctx[11][/*index*/ ctx[103]] === 0) return create_if_block_20;
    		if (/*sortSettings*/ ctx[11][/*index*/ ctx[103]] === 1) return create_if_block_21;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[89](/*index*/ ctx[103], ...args);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			add_location(th, file$6, 659, 12, 16570);

    			dispose = [
    				listen_dev(th, "click", click_handler, false, false, false),
    				listen_dev(th, "contextmenu", prevent_default(/*onHeaderContext*/ ctx[40]), false, true, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			if_block.m(th, null);
    			append_dev(th, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*headers*/ 64 && t0_value !== (t0_value = /*h*/ ctx[104] + "")) set_data_dev(t0, t0_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, t2);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(659:10) {#if visible_columns[index]}",
    		ctx
    	});

    	return block;
    }

    // (668:14) {:else}
    function create_else_block_3(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(668:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (666:50) 
    function create_if_block_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("▼");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(666:50) ",
    		ctx
    	});

    	return block;
    }

    // (664:14) {#if sortSettings[index] === 0}
    function create_if_block_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("▲");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(664:14) {#if sortSettings[index] === 0}",
    		ctx
    	});

    	return block;
    }

    // (658:8) {#each headers as h, index}
    function create_each_block_4(ctx) {
    	let if_block_anchor;
    	let if_block = /*visible_columns*/ ctx[9][/*index*/ ctx[103]] && create_if_block_19(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible_columns*/ ctx[9][/*index*/ ctx[103]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_19(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(658:8) {#each headers as h, index}",
    		ctx
    	});

    	return block;
    }

    // (679:10) {#if visible_columns[index]}
    function create_if_block_11(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*customFilter*/ ctx[1][/*index*/ ctx[103]]) return create_if_block_12;
    		if (show_if == null || dirty[0] & /*headerColTypes*/ 256) show_if = !!!/*hiddenColumns*/ ctx[27].includes(/*headerColTypes*/ ctx[8][/*index*/ ctx[103]]);
    		if (show_if) return create_if_block_13;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(679:10) {#if visible_columns[index]}",
    		ctx
    	});

    	return block;
    }

    // (730:12) {:else}
    function create_else_block_2(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			add_location(th, file$6, 730, 14, 19194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(730:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (690:69) 
    function create_if_block_13(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === INT) return create_if_block_14;
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === TEXT) return create_if_block_15;
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === DOUBLE) return create_if_block_16;
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === BOOL) return create_if_block_17;
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === UTCTIME) return create_if_block_18;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(690:69) ",
    		ctx
    	});

    	return block;
    }

    // (680:12) {#if customFilter[index]}
    function create_if_block_12(ctx) {
    	let th;
    	let select;
    	let t;
    	let dispose;
    	let each_value_3 = /*customFilter*/ ctx[1][/*index*/ ctx[103]];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	function select_change_handler_1() {
    		/*select_change_handler_1*/ ctx[90].call(select, /*index*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (/*filterSettings*/ ctx[10][/*index*/ ctx[103]] === void 0) add_render_callback(select_change_handler_1);
    			add_location(select, file$6, 681, 16, 17214);
    			add_location(th, file$6, 680, 14, 17193);

    			dispose = [
    				listen_dev(select, "change", select_change_handler_1),
    				listen_dev(select, "change", /*handleFilter*/ ctx[28](/*index*/ ctx[103]), false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*customFilter*/ 2) {
    				each_value_3 = /*customFilter*/ ctx[1][/*index*/ ctx[103]];
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*filterSettings*/ 1024) {
    				select_option(select, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_each(each_blocks, detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(680:12) {#if customFilter[index]}",
    		ctx
    	});

    	return block;
    }

    // (727:14) {:else}
    function create_else_block_1(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			th.textContent = "Unknown Type";
    			add_location(th, file$6, 727, 16, 19118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(727:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (725:58) 
    function create_if_block_18(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			th.textContent = "Date";
    			add_location(th, file$6, 725, 16, 19066);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(725:58) ",
    		ctx
    	});

    	return block;
    }

    // (716:55) 
    function create_if_block_17(ctx) {
    	let th;
    	let input;
    	let t;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[94].call(input, /*index*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			input = element("input");
    			t = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "step", "any");
    			add_location(input, file$6, 717, 18, 18712);
    			add_location(th, file$6, 716, 16, 18689);

    			dispose = [
    				listen_dev(input, "change", input_change_handler),
    				listen_dev(input, "change", /*handleFilter*/ ctx[28](/*index*/ ctx[103]), false, false, false),
    				listen_dev(input, "contextmenu", prevent_default(/*onTextInputContext*/ ctx[41]), false, true, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, input);
    			input.checked = /*filterSettings*/ ctx[10][/*index*/ ctx[103]];
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterSettings*/ 1024) {
    				input.checked = /*filterSettings*/ ctx[10][/*index*/ ctx[103]];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(716:55) ",
    		ctx
    	});

    	return block;
    }

    // (707:57) 
    function create_if_block_16(ctx) {
    	let th;
    	let input;
    	let t;
    	let dispose;

    	function input_input_handler_2() {
    		/*input_input_handler_2*/ ctx[93].call(input, /*index*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			input = element("input");
    			t = space();
    			attr_dev(input, "type", "search");
    			attr_dev(input, "step", "any");
    			add_location(input, file$6, 708, 18, 18343);
    			add_location(th, file$6, 707, 16, 18320);

    			dispose = [
    				listen_dev(input, "input", input_input_handler_2),
    				listen_dev(input, "input", /*handleFilter*/ ctx[28](/*index*/ ctx[103]), false, false, false),
    				listen_dev(input, "contextmenu", prevent_default(/*onTextInputContext*/ ctx[41]), false, true, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, input);
    			set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterSettings*/ 1024) {
    				set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(707:57) ",
    		ctx
    	});

    	return block;
    }

    // (699:55) 
    function create_if_block_15(ctx) {
    	let th;
    	let input;
    	let t;
    	let dispose;

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[92].call(input, /*index*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			input = element("input");
    			t = space();
    			attr_dev(input, "type", "search");
    			add_location(input, file$6, 700, 18, 18003);
    			add_location(th, file$6, 699, 16, 17980);

    			dispose = [
    				listen_dev(input, "input", input_input_handler_1),
    				listen_dev(input, "input", /*handleFilter*/ ctx[28](/*index*/ ctx[103]), false, false, false),
    				listen_dev(input, "contextmenu", prevent_default(/*onTextInputContext*/ ctx[41]), false, true, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, input);
    			set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterSettings*/ 1024) {
    				set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(699:55) ",
    		ctx
    	});

    	return block;
    }

    // (691:14) {#if headerColTypes[index] === INT}
    function create_if_block_14(ctx) {
    	let th;
    	let input;
    	let t;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[91].call(input, /*index*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			input = element("input");
    			t = space();
    			attr_dev(input, "type", "search");
    			add_location(input, file$6, 692, 18, 17665);
    			add_location(th, file$6, 691, 16, 17642);

    			dispose = [
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(input, "input", /*handleFilter*/ ctx[28](/*index*/ ctx[103]), false, false, false),
    				listen_dev(input, "contextmenu", prevent_default(/*onTextInputContext*/ ctx[41]), false, true, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, input);
    			set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterSettings*/ 1024) {
    				set_input_value(input, /*filterSettings*/ ctx[10][/*index*/ ctx[103]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(691:14) {#if headerColTypes[index] === INT}",
    		ctx
    	});

    	return block;
    }

    // (685:18) {#each customFilter[index] as f}
    function create_each_block_3$1(ctx) {
    	let option;
    	let t_value = /*f*/ ctx[106][0] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*f*/ ctx[106][1];
    			option.value = option.__value;
    			add_location(option, file$6, 685, 20, 17397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*customFilter*/ 2 && t_value !== (t_value = /*f*/ ctx[106][0] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*customFilter*/ 2 && option_value_value !== (option_value_value = /*f*/ ctx[106][1])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(685:18) {#each customFilter[index] as f}",
    		ctx
    	});

    	return block;
    }

    // (678:8) {#each headers as h, index}
    function create_each_block_2$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*visible_columns*/ ctx[9][/*index*/ ctx[103]] && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible_columns*/ ctx[9][/*index*/ ctx[103]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_11(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(678:8) {#each headers as h, index}",
    		ctx
    	});

    	return block;
    }

    // (758:14) {#if quickcomponent && !quickview.includes(l[0])}
    function create_if_block_9(ctx) {
    	let button;
    	let t;
    	let button_key_value;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[95](/*l*/ ctx[98], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Edit");
    			attr_dev(button, "name", "edit");
    			attr_dev(button, "key", button_key_value = /*l*/ ctx[98][0]);
    			attr_dev(button, "type", "button");
    			add_location(button, file$6, 758, 16, 19987);
    			dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*items*/ 128 && button_key_value !== (button_key_value = /*l*/ ctx[98][0])) {
    				attr_dev(button, "key", button_key_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(758:14) {#if quickcomponent && !quickview.includes(l[0])}",
    		ctx
    	});

    	return block;
    }

    // (775:12) {#if visible_columns[index]}
    function create_if_block_6(ctx) {
    	let td;
    	let t;
    	let if_block = /*l*/ ctx[98][/*index*/ ctx[103]] != null && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			t = space();
    			add_location(td, file$6, 775, 14, 20531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*l*/ ctx[98][/*index*/ ctx[103]] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					if_block.m(td, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(775:12) {#if visible_columns[index]}",
    		ctx
    	});

    	return block;
    }

    // (777:16) {#if l[index] != null}
    function create_if_block_7(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*headerColTypes*/ ctx[8][/*index*/ ctx[103]] === 1114) return create_if_block_8;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(777:16) {#if l[index] != null}",
    		ctx
    	});

    	return block;
    }

    // (780:18) {:else}
    function create_else_block(ctx) {
    	let t_value = /*l*/ ctx[98][/*index*/ ctx[103]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items*/ 128 && t_value !== (t_value = /*l*/ ctx[98][/*index*/ ctx[103]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(780:18) {:else}",
    		ctx
    	});

    	return block;
    }

    // (778:18) {#if headerColTypes[index] === 1114}
    function create_if_block_8(ctx) {
    	let t_value = new Date(/*l*/ ctx[98][/*index*/ ctx[103]]).toLocaleString() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items*/ 128 && t_value !== (t_value = new Date(/*l*/ ctx[98][/*index*/ ctx[103]]).toLocaleString() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(778:18) {#if headerColTypes[index] === 1114}",
    		ctx
    	});

    	return block;
    }

    // (774:10) {#each l as c, index}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*visible_columns*/ ctx[9][/*index*/ ctx[103]] && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible_columns*/ ctx[9][/*index*/ ctx[103]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(774:10) {#each l as c, index}",
    		ctx
    	});

    	return block;
    }

    // (803:8) {#if quickview.includes(l[0])}
    function create_if_block_3(ctx) {
    	let tr;
    	let td;
    	let td_colspan_value;
    	let t;
    	let current;
    	let if_block = /*quickcomponent*/ ctx[3] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(td, "colspan", td_colspan_value = /*l*/ ctx[98].length + 3);
    			add_location(td, file$6, 804, 12, 21406);
    			add_location(tr, file$6, 803, 10, 21389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			if (if_block) if_block.m(td, null);
    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*quickcomponent*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*items*/ 128 && td_colspan_value !== (td_colspan_value = /*l*/ ctx[98].length + 3)) {
    				attr_dev(td, "colspan", td_colspan_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(803:8) {#if quickview.includes(l[0])}",
    		ctx
    	});

    	return block;
    }

    // (806:14) {#if quickcomponent}
    function create_if_block_4(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*quickcomponent*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				key: /*l*/ ctx[98][0],
    				schema_key: /*schema_key*/ ctx[4],
    				eventsFn: /*eventsFn*/ ctx[0]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("close", /*onCancel*/ ctx[32]);
    		switch_instance.$on("successSave", /*successSave*/ ctx[31]);
    		switch_instance.$on("deleteRow", /*deleteRow*/ ctx[33]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 128) switch_instance_changes.key = /*l*/ ctx[98][0];
    			if (dirty[0] & /*schema_key*/ 16) switch_instance_changes.schema_key = /*schema_key*/ ctx[4];
    			if (dirty[0] & /*eventsFn*/ 1) switch_instance_changes.eventsFn = /*eventsFn*/ ctx[0];

    			if (switch_value !== (switch_value = /*quickcomponent*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("close", /*onCancel*/ ctx[32]);
    					switch_instance.$on("successSave", /*successSave*/ ctx[31]);
    					switch_instance.$on("deleteRow", /*deleteRow*/ ctx[33]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(806:14) {#if quickcomponent}",
    		ctx
    	});

    	return block;
    }

    // (739:6) {#each items as l, cindex (l[0])}
    function create_each_block$3(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0;
    	let input;
    	let input_value_value;
    	let input_checked_value;
    	let t1;
    	let td1;
    	let show_if_1 = /*quickcomponent*/ ctx[3] && !/*quickview*/ ctx[12].includes(/*l*/ ctx[98][0]);
    	let t2;
    	let td2;
    	let button;
    	let t3;
    	let button_key_value;
    	let t4;
    	let t5;
    	let tr_class_value;
    	let t6;
    	let show_if = /*quickview*/ ctx[12].includes(/*l*/ ctx[98][0]);
    	let if_block3_anchor;
    	let current;
    	let dispose;
    	let if_block1 = show_if_1 && create_if_block_9(ctx);
    	let each_value_1 = /*l*/ ctx[98];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}
    	let if_block3 = show_if && create_if_block_3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			td1 = element("td");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			td2 = element("td");
    			button = element("button");
    			t3 = text("D");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			t6 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			attr_dev(input, "type", "checkbox");
    			input.value = input_value_value = /*l*/ ctx[98][0];
    			input.checked = input_checked_value = /*selectedRowsKeys*/ ctx[13].includes(/*l*/ ctx[98][0]);
    			add_location(input, file$6, 750, 14, 19703);
    			add_location(td0, file$6, 746, 10, 19598);
    			add_location(td1, file$6, 756, 10, 19902);
    			attr_dev(button, "name", "delete");
    			attr_dev(button, "key", button_key_value = /*l*/ ctx[98][0]);
    			attr_dev(button, "type", "button");
    			add_location(button, file$6, 771, 14, 20341);
    			add_location(td2, file$6, 770, 10, 20322);
    			attr_dev(tr, "draggable", "true");

    			attr_dev(tr, "class", tr_class_value = /*selectedRowsKeys*/ ctx[13].includes(/*l*/ ctx[98][0])
    			? /*$css*/ ctx[24].table.class.selected || "selected"
    			: "");

    			add_location(tr, file$6, 739, 8, 19377);

    			dispose = [
    				listen_dev(input, "click", /*onSelectRowClick*/ ctx[43], false, false, false),
    				listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onDeleteRow*/ ctx[34](/*l*/ ctx[98][0]))) /*onDeleteRow*/ ctx[34](/*l*/ ctx[98][0]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				),
    				listen_dev(tr, "mouseenter", mouseenter_handler, false, false, false),
    				listen_dev(tr, "mouseleave", mouseleave_handler, false, false, false)
    			];

    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, input);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			if (if_block1) if_block1.m(td1, null);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, button);
    			append_dev(button, t3);
    			append_dev(tr, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t5);
    			insert_dev(target, t6, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*items*/ 128 && input_value_value !== (input_value_value = /*l*/ ctx[98][0])) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (!current || dirty[0] & /*selectedRowsKeys, items*/ 8320 && input_checked_value !== (input_checked_value = /*selectedRowsKeys*/ ctx[13].includes(/*l*/ ctx[98][0]))) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty[0] & /*quickcomponent, quickview, items*/ 4232) show_if_1 = /*quickcomponent*/ ctx[3] && !/*quickview*/ ctx[12].includes(/*l*/ ctx[98][0]);

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(td1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[0] & /*items*/ 128 && button_key_value !== (button_key_value = /*l*/ ctx[98][0])) {
    				attr_dev(button, "key", button_key_value);
    			}

    			if (dirty[0] & /*visible_columns, items, headerColTypes*/ 896) {
    				each_value_1 = /*l*/ ctx[98];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t5);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (!current || dirty[0] & /*selectedRowsKeys, items, $css*/ 16785536 && tr_class_value !== (tr_class_value = /*selectedRowsKeys*/ ctx[13].includes(/*l*/ ctx[98][0])
    			? /*$css*/ ctx[24].table.class.selected || "selected"
    			: "")) {
    				attr_dev(tr, "class", tr_class_value);
    			}

    			if (dirty[0] & /*quickview, items*/ 4224) show_if = /*quickview*/ ctx[12].includes(/*l*/ ctx[98][0]);

    			if (show_if) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    					transition_in(if_block3, 1);
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(739:6) {#each items as l, cindex (l[0])}",
    		ctx
    	});

    	return block;
    }

    // (823:0) {#if contextmenu}
    function create_if_block_2$3(ctx) {
    	let div5;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let hr0;
    	let t4;
    	let div2;
    	let t6;
    	let div3;
    	let t8;
    	let hr1;
    	let t9;
    	let div4;
    	let t11;
    	let div19;
    	let div6;
    	let t13;
    	let hr2;
    	let t14;
    	let div7;
    	let t16;
    	let hr3;
    	let t17;
    	let div8;
    	let t19;
    	let div9;
    	let t21;
    	let div10;
    	let t23;
    	let div11;
    	let t25;
    	let hr4;
    	let t26;
    	let div12;
    	let t28;
    	let div13;
    	let t30;
    	let div14;
    	let t32;
    	let div15;
    	let t34;
    	let div16;
    	let t36;
    	let div17;
    	let t38;
    	let div18;
    	let t40;
    	let div25;
    	let div20;
    	let t42;
    	let div21;
    	let t44;
    	let hr5;
    	let t45;
    	let div22;
    	let t47;
    	let div23;
    	let t49;
    	let hr6;
    	let t50;
    	let div24;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "Share On Facebook";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Share On Twitter";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			div2 = element("div");
    			div2.textContent = "Search On Google";
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = "Search On Bing";
    			t8 = space();
    			hr1 = element("hr");
    			t9 = space();
    			div4 = element("div");
    			div4.textContent = "Bookmark";
    			t11 = space();
    			div19 = element("div");
    			div6 = element("div");
    			div6.textContent = "Close";
    			t13 = space();
    			hr2 = element("hr");
    			t14 = space();
    			div7 = element("div");
    			div7.textContent = "What's This?";
    			t16 = space();
    			hr3 = element("hr");
    			t17 = space();
    			div8 = element("div");
    			div8.textContent = "Is NULL";
    			t19 = space();
    			div9 = element("div");
    			div9.textContent = "Is not NULL";
    			t21 = space();
    			div10 = element("div");
    			div10.textContent = "Is empty";
    			t23 = space();
    			div11 = element("div");
    			div11.textContent = "Is not empty";
    			t25 = space();
    			hr4 = element("hr");
    			t26 = space();
    			div12 = element("div");
    			div12.textContent = "Equal to...";
    			t28 = space();
    			div13 = element("div");
    			div13.textContent = "Not equal to...";
    			t30 = space();
    			div14 = element("div");
    			div14.textContent = "Greater than...";
    			t32 = space();
    			div15 = element("div");
    			div15.textContent = "Less than...";
    			t34 = space();
    			div16 = element("div");
    			div16.textContent = "Greater or equal...";
    			t36 = space();
    			div17 = element("div");
    			div17.textContent = "Less or equal...";
    			t38 = space();
    			div18 = element("div");
    			div18.textContent = "In range...";
    			t40 = space();
    			div25 = element("div");
    			div20 = element("div");
    			div20.textContent = "Share On Facebook";
    			t42 = space();
    			div21 = element("div");
    			div21.textContent = "Share On Twitter";
    			t44 = space();
    			hr5 = element("hr");
    			t45 = space();
    			div22 = element("div");
    			div22.textContent = "Search On Google";
    			t47 = space();
    			div23 = element("div");
    			div23.textContent = "Search On Bing";
    			t49 = space();
    			hr6 = element("hr");
    			t50 = space();
    			div24 = element("div");
    			div24.textContent = "Bookmark";
    			attr_dev(div0, "class", "menu-item");
    			add_location(div0, file$6, 824, 4, 21913);
    			attr_dev(div1, "class", "menu-item");
    			add_location(div1, file$6, 825, 4, 21964);
    			add_location(hr0, file$6, 826, 4, 22014);
    			attr_dev(div2, "class", "menu-item");
    			add_location(div2, file$6, 827, 4, 22025);
    			attr_dev(div3, "class", "menu-item");
    			add_location(div3, file$6, 828, 4, 22075);
    			add_location(hr1, file$6, 829, 4, 22123);
    			attr_dev(div4, "class", "menu-item");
    			add_location(div4, file$6, 830, 4, 22134);
    			attr_dev(div5, "class", "menu");
    			add_location(div5, file$6, 823, 2, 21890);
    			attr_dev(div6, "class", "menu-item");
    			add_location(div6, file$6, 833, 4, 22212);
    			add_location(hr2, file$6, 834, 4, 22277);
    			attr_dev(div7, "class", "menu-item");
    			add_location(div7, file$6, 835, 4, 22288);
    			add_location(hr3, file$6, 836, 4, 22334);
    			attr_dev(div8, "class", "menu-item");
    			add_location(div8, file$6, 837, 4, 22345);
    			attr_dev(div9, "class", "menu-item");
    			add_location(div9, file$6, 838, 4, 22386);
    			attr_dev(div10, "class", "menu-item");
    			add_location(div10, file$6, 839, 4, 22431);
    			attr_dev(div11, "class", "menu-item");
    			add_location(div11, file$6, 840, 4, 22473);
    			add_location(hr4, file$6, 841, 4, 22519);
    			attr_dev(div12, "class", "menu-item");
    			add_location(div12, file$6, 842, 4, 22530);
    			attr_dev(div13, "class", "menu-item");
    			add_location(div13, file$6, 843, 4, 22575);
    			attr_dev(div14, "class", "menu-item");
    			add_location(div14, file$6, 844, 4, 22624);
    			attr_dev(div15, "class", "menu-item");
    			add_location(div15, file$6, 845, 4, 22673);
    			attr_dev(div16, "class", "menu-item");
    			add_location(div16, file$6, 846, 4, 22719);
    			attr_dev(div17, "class", "menu-item");
    			add_location(div17, file$6, 847, 4, 22772);
    			attr_dev(div18, "class", "menu-item");
    			add_location(div18, file$6, 848, 4, 22822);
    			attr_dev(div19, "class", "menu-input");
    			add_location(div19, file$6, 832, 2, 22183);
    			attr_dev(div20, "class", "menu-item");
    			add_location(div20, file$6, 851, 4, 22897);
    			attr_dev(div21, "class", "menu-item");
    			add_location(div21, file$6, 852, 4, 22948);
    			add_location(hr5, file$6, 853, 4, 22998);
    			attr_dev(div22, "class", "menu-item");
    			add_location(div22, file$6, 854, 4, 23009);
    			attr_dev(div23, "class", "menu-item");
    			add_location(div23, file$6, 855, 4, 23059);
    			add_location(hr6, file$6, 856, 4, 23107);
    			attr_dev(div24, "class", "menu-item");
    			add_location(div24, file$6, 857, 4, 23118);
    			attr_dev(div25, "class", "menu");
    			add_location(div25, file$6, 850, 2, 22874);
    			dispose = listen_dev(div6, "click", /*closeInputMenu*/ ctx[42], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div5, t3);
    			append_dev(div5, hr0);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, hr1);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div6);
    			append_dev(div19, t13);
    			append_dev(div19, hr2);
    			append_dev(div19, t14);
    			append_dev(div19, div7);
    			append_dev(div19, t16);
    			append_dev(div19, hr3);
    			append_dev(div19, t17);
    			append_dev(div19, div8);
    			append_dev(div19, t19);
    			append_dev(div19, div9);
    			append_dev(div19, t21);
    			append_dev(div19, div10);
    			append_dev(div19, t23);
    			append_dev(div19, div11);
    			append_dev(div19, t25);
    			append_dev(div19, hr4);
    			append_dev(div19, t26);
    			append_dev(div19, div12);
    			append_dev(div19, t28);
    			append_dev(div19, div13);
    			append_dev(div19, t30);
    			append_dev(div19, div14);
    			append_dev(div19, t32);
    			append_dev(div19, div15);
    			append_dev(div19, t34);
    			append_dev(div19, div16);
    			append_dev(div19, t36);
    			append_dev(div19, div17);
    			append_dev(div19, t38);
    			append_dev(div19, div18);
    			insert_dev(target, t40, anchor);
    			insert_dev(target, div25, anchor);
    			append_dev(div25, div20);
    			append_dev(div25, t42);
    			append_dev(div25, div21);
    			append_dev(div25, t44);
    			append_dev(div25, hr5);
    			append_dev(div25, t45);
    			append_dev(div25, div22);
    			append_dev(div25, t47);
    			append_dev(div25, div23);
    			append_dev(div25, t49);
    			append_dev(div25, hr6);
    			append_dev(div25, t50);
    			append_dev(div25, div24);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div19);
    			if (detaching) detach_dev(t40);
    			if (detaching) detach_dev(div25);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(823:0) {#if contextmenu}",
    		ctx
    	});

    	return block;
    }

    // (863:0) {#if modalIsVisible}
    function create_if_block_1$4(ctx) {
    	let current;

    	const modal = new Model({
    			props: {
    				$$slots: {
    					default: [create_default_slot],
    					header: [create_header_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("close", /*closeModal*/ ctx[47]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty[0] & /*modelcomponent, headers, items*/ 196 | dirty[3] & /*$$scope*/ 1048576) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(863:0) {#if modalIsVisible}",
    		ctx
    	});

    	return block;
    }

    // (865:4) <header slot="header">
    function create_header_slot(ctx) {
    	let header;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(button, "class", "");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$6, 865, 6, 23265);
    			attr_dev(header, "slot", "header");
    			add_location(header, file$6, 864, 4, 23236);
    			dispose = listen_dev(button, "click", /*closeModal*/ ctx[47], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, button);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(865:4) <header slot=\\\"header\\\">",
    		ctx
    	});

    	return block;
    }

    // (864:2) <Modal on:close={closeModal}>
    function create_default_slot(ctx) {
    	let t;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*modelcomponent*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				headers: /*headers*/ ctx[6],
    				items: /*items*/ ctx[7]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("close", /*closeModal*/ ctx[47]);
    		switch_instance.$on("successSave", /*refresh*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			t = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*headers*/ 64) switch_instance_changes.headers = /*headers*/ ctx[6];
    			if (dirty[0] & /*items*/ 128) switch_instance_changes.items = /*items*/ ctx[7];

    			if (switch_value !== (switch_value = /*modelcomponent*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("close", /*closeModal*/ ctx[47]);
    					switch_instance.$on("successSave", /*refresh*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(864:2) <Modal on:close={closeModal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*$css*/ ctx[24].table && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			t0 = text(/*er*/ ctx[18]);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*er*/ 262144) set_data_dev(t0, /*er*/ ctx[18]);

    			if (/*$css*/ ctx[24].table) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BOOL = 10,
    	INT = 20,
    	TEXT = 30,
    	DOUBLE = 40,
    	UTCTIME = 50,
    	ARRAY = 60,
    	OBJECT = 70,
    	BINARY = 80;

    const mouseenter_handler = e => {
    	
    };

    const mouseleave_handler = e => {
    	
    };

    function instance$8($$self, $$props, $$invalidate) {
    	let $css;
    	let $ws_connected;
    	validate_store(css, "css");
    	component_subscribe($$self, css, $$value => $$invalidate(24, $css = $$value));
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(66, $ws_connected = $$value));
    	const dp = createEventDispatcher();
    	let { eventsFn = () => 0 } = $$props;
    	let events;
    	let headers;
    	let items;
    	let count;
    	let { customFilter = {} } = $$props;
    	let { requiredFilter = {} } = $$props;
    	let { modelcomponent = false } = $$props;
    	let { quickcomponent = false } = $$props;
    	let { query = {} } = $$props;
    	let { schema_key = "" } = $$props;
    	let formLabels = [];
    	let headerColTypes = [];
    	let visible_columns = [];
    	let options = {};
    	const hiddenColumns = [ARRAY, OBJECT, BINARY];
    	let filterSettings = [];
    	let sortSettings = [];
    	let quickview = [];
    	let selectedRowsKeys = [];
    	let first_visibile_column = 0;
    	let fetchConfig = { type: "a" };
    	let limit = Number(query.limit) || 0;
    	let pages = [1, 2];
    	let current_page = Number(query.page) || 1;
    	let total_pages = Math.max(current_page, 1);
    	let mounted = false;
    	let binded = false;
    	let er = "";
    	let doms = {};
    	let addnewform = false;
    	let headerFetched = false;
    	let modalIsVisible = false;
    	let item = [];
    	let config = false;
    	let contextmenu = false;
    	let header_evt;
    	let data_evt;
    	let unsub;
    	let mutate_evt;

    	function unRegister() {
    		unsub && S.trigger([[unsub, {}]]);
    		events && S.unbind_(events);
    	}

    	function reset() {
    		unRegister();
    		events = eventsFn(0, schema_key);
    		$$invalidate(6, headers = []);
    		$$invalidate(7, items = []);
    		count = 0;
    		formLabels = [];
    		$$invalidate(8, headerColTypes = []);
    		$$invalidate(9, visible_columns = []);
    		options = {};
    		$$invalidate(10, filterSettings = []);
    		$$invalidate(11, sortSettings = []);
    		$$invalidate(12, quickview = []);
    		$$invalidate(13, selectedRowsKeys = []);
    		first_visibile_column = 0;
    		fetchConfig = { type: "a" };
    		$$invalidate(14, limit = Number(query.limit) || 0);
    		$$invalidate(15, pages = [1, 2]);
    		$$invalidate(16, current_page = Number(query.page) || 1);
    		$$invalidate(17, total_pages = Math.max(current_page, 1));
    		$$invalidate(56, mounted = true);
    		$$invalidate(57, binded = false);
    		$$invalidate(18, er = "");
    		$$invalidate(20, addnewform = false);
    		headerFetched = false;
    		$$invalidate(21, modalIsVisible = false);
    		item = [];
    		$$invalidate(22, config = false);
    		$$invalidate(23, contextmenu = false);
    		header_evt = events[0];
    		data_evt = events[1];
    		unsub = [event_type.unsubscribe, ...events[1].slice(1)];
    		mutate_evt = events[2];
    		console.log("reset complete");
    	}

    	onMount(async () => {
    		$$invalidate(56, mounted = true);
    		set_store_value(css, $css.table.css.count = $css.table.css.count + 1, $css);
    	});

    	onDestroy(() => {
    		unRegister();
    		set_store_value(css, $css.table.css.count = $css.table.css.count - 1, $css);
    	});

    	const bindOnce = () => {
    		if (!binded) {
    			{
    				S.bind$(data_evt, onDataGet, 1);
    				S.bind$(header_evt, onHeaderGet, 1);

    				if (header_evt) {
    					const e1 = [header_evt, fetchConfig];
    					S.trigger([e1]);
    				}
    			}
    		}
    	};

    	const onWSConnect = () => {
    		if (headerFetched) {
    			refresh();
    		}
    	};

    	const refresh = () => {
    		const args = [filterSettings, sortSettings, [limit, 0, current_page], fetchConfig];
    		const e1 = [data_evt, args];
    		S.trigger([e1]);
    	};

    	const onHeaderGet = ([d]) => {
    		fillHeadersArray(d);
    		refresh();
    		headerFetched = true;
    	};

    	const fillHeadersArray = d => {
    		$$invalidate(6, headers = d[0] || []);
    		formLabels = d[1] || [];
    		$$invalidate(8, headerColTypes = d[2] || []);
    		$$invalidate(9, visible_columns = d[3] || []);
    		let i;

    		for (i = 0; i < visible_columns.length; i++) {
    			if (visible_columns[i]) {
    				first_visibile_column = i;
    				break;
    			}
    		}

    		options = d[4];
    		resetFilter_();
    	};

    	function onDataGet([d]) {
    		if (d.r) {
    			$$invalidate(7, items = d.r.result || []);
    			count = d.r.extra.stats.fullCount;
    			$$invalidate(16, current_page = d.r.pagination[2]);
    			calc_pagination();
    			selectAll_(false);
    		} else if (d.n) {
    			items.push(...d.n.result);
    			count = count + 1;
    			$$invalidate(7, items);
    		} else if (d.m) {
    			d.m.result.forEach(mod => {
    				const findIndex = items.findIndex(i => {
    					return i[0] == mod[0];
    				});

    				if (findIndex !== -1) {
    					items.splice(findIndex, 1, mod);
    				}
    			});

    			$$invalidate(7, items);
    		} else if (d.d) {
    			deleteRows_(d.d);
    		}
    	}

    	const handleFilter = col => event => {
    		$$invalidate(16, current_page = 1);
    		refresh();
    	};

    	const resetFilter_ = () => {
    		const array = new Array(headers.length);
    		array.fill(null);

    		for (let key in requiredFilter) {
    			array[key] = requiredFilter[key];
    		}

    		$$invalidate(10, filterSettings = array);
    	};

    	const onResetFilter = event => {
    		resetFilter_();
    		refresh();
    	};

    	const toogleAddForm = () => {
    		$$invalidate(20, addnewform = !addnewform);
    		doms.addbutton.focus();
    	};

    	const closeForm_ = key => {
    		const idx = quickview.findIndex(x => x == key);

    		if (idx !== -1) {
    			quickview.splice(idx, 1);
    			$$invalidate(12, quickview);
    		}
    	};

    	const closeForms_ = keys => {
    		let isFind = false;

    		keys.forEach(key => {
    			const idx = quickview.findIndex(x => x == key);

    			if (idx !== -1) {
    				isFind = true;
    				quickview.splice(idx, 1);
    			}
    		});

    		if (isFind) {
    			$$invalidate(12, quickview);
    		}
    	};

    	const editButtonFocus = async key => {
    		await tick();
    		const element = document.querySelector(`button[key='${key}'][name='edit']`);

    		if (element) {
    			element.focus();
    		}
    	};

    	const successSave = e => {
    		const { key, d } = e.detail;

    		if (key === null) {
    			toogleAddForm();
    			doms.addbutton.focus();
    		} else {
    			closeForm_(key);
    			editButtonFocus(key);
    		}
    	};

    	const onCancel = event => {
    		const key = event.detail;
    		closeForm_(key);
    		editButtonFocus(key);
    	};

    	const deleteRows_ = keys => {
    		keys.forEach(k => {
    			const index = selectedRowsKeys.findIndex(x => k === x);

    			if (index > -1) {
    				selectedRowsKeys.splice(index, 1);
    			}
    		});

    		$$invalidate(13, selectedRowsKeys);
    		closeForms_(keys);

    		keys.forEach(k => {
    			const findIndex = items.findIndex(i => {
    				return i[0] == k;
    			});

    			if (findIndex !== -1) {
    				items.splice(findIndex, 1);
    			}
    		});

    		$$invalidate(7, items);
    	};

    	const deleteRow = e => {
    		const { key } = e.detail;
    		deleteRows_([key]);
    	};

    	const onDeleteRow = key => async () => {
    		const r = confirm("Are You Sure?");

    		if (r == true) {
    			mutate_evt.pop();
    			mutate_evt.push(key);
    			const filter = [`="${key}"`];

    			const [d] = await new Promise((resolve, reject) => {
    					S.bind_(
    						mutate_evt,
    						d => {
    							resolve(d);
    						},
    						["DEL", filter]
    					);
    				},
    			0);

    			if (d.ok) {
    				deleteRows_([key]);
    			} else {
    				alert(d.error);
    			}
    		}
    	};

    	const onDeleteSelected = async () => {
    		const r = confirm("Are You Sure to delete selected rows?");

    		if (r == true) {
    			mutate_evt.pop();
    			mutate_evt.push(12345);
    			const filter = [JSON.stringify(selectedRowsKeys)];

    			const [d] = await new Promise((resolve, reject) => {
    					S.bind_(
    						mutate_evt,
    						d => {
    							resolve(d);
    						},
    						["DEL", filter]
    					);
    				},
    			0);

    			if (d.ok) {
    				deleteRows_(selectedRowsKeys);
    			} else {
    				alert(d.error);
    			}
    		}
    	};

    	const calc_pagination = () => {
    		if (limit <= 0) {
    			$$invalidate(14, limit = 0);
    			$$invalidate(17, total_pages = 1);
    			$$invalidate(15, pages = [1]);
    			$$invalidate(16, current_page = 1);
    		} else {
    			$$invalidate(17, total_pages = Math.ceil(count / limit));
    			const arr = [];

    			for (let i = 1; i <= total_pages; i++) {
    				arr.push(i);
    			}

    			$$invalidate(15, pages = arr);

    			if (!pages.includes(current_page)) {
    				$$invalidate(16, current_page = 1);
    			}
    		}
    	};

    	const onLimitChange = () => {
    		calc_pagination();
    		refresh();
    	};

    	const handleSort = (e, col) => {
    		if (e.ctrlKey) ; else {
    			const sortOrder = sortSettings[col];
    			$$invalidate(11, sortSettings = []);

    			if (sortOrder === undefined) {
    				$$invalidate(11, sortSettings[col] = 0, sortSettings);
    			} else if (sortOrder === 0) {
    				$$invalidate(11, sortSettings[col] = 1, sortSettings);
    			} else {
    				$$invalidate(11, sortSettings[col] = undefined, sortSettings);
    			}
    		}

    		refresh();
    	};

    	function onItemClick(litem) {
    		dp("onItemClick", { item: litem });
    	}

    	function onDeleteClick(litem) {
    		dp("onDeleteClick", { item: litem });
    		return true;
    	}

    	let menuDisplayed = false;
    	let inputMenuDisplayed = false;

    	const onHeaderContext = event => {
    		const left = event.clientX;
    		const top = event.clientY;
    		const menuBox = window.document.querySelector(".menu");

    		if (menuBox) {
    			menuBox.style.left = left + "px";
    			menuBox.style.top = top + "px";
    			menuBox.style.display = "block";
    			menuDisplayed = true;
    		}
    	};

    	const onTextInputContext = event => {
    		const left = event.clientX;
    		const top = event.clientY;
    		const menuBox = window.document.querySelector(".menu-input");

    		if (menuBox) {
    			menuBox.style.left = left + "px";
    			menuBox.style.top = top + "px";
    			menuBox.style.display = "block";
    			inputMenuDisplayed = true;
    		}
    	};

    	const closeInputMenu = event => {
    		const menuBox = window.document.querySelector(".menu-input");

    		if (inputMenuDisplayed == true) {
    			menuBox.style.display = "none";
    		}
    	};

    	const onSelectRowClick = e => {
    		const index = selectedRowsKeys.findIndex(x => e.target.value == x);

    		if (index > -1) {
    			selectedRowsKeys.splice(index, 1);
    		} else {
    			selectedRowsKeys.push(e.target.value);
    		}

    		$$invalidate(13, selectedRowsKeys);
    	};

    	const selectAll_ = v => {
    		if (v) {
    			$$invalidate(13, selectedRowsKeys = items.map(x => x[0]));
    		} else {
    			$$invalidate(13, selectedRowsKeys = []);
    		}
    	};

    	const onSelectAllClick = e => {
    		selectAll_(e.target.checked);
    	};

    	const onConfigClicked = async () => {
    		$$invalidate(22, config = !config);
    	};

    	const onConfigApply = e => {
    		const { list } = e.detail;
    		fetchConfig.columns = list;
    		$$invalidate(22, config = false);
    		const e1 = [header_evt, fetchConfig];
    		S.trigger([e1]);
    		$$invalidate(11, sortSettings = []);
    	};

    	function closeModal() {
    		$$invalidate(21, modalIsVisible = false);
    	}

    	function openModal() {
    		$$invalidate(21, modalIsVisible = true);
    	}

    	function onNewClick() {
    		item = [];
    		openModal();
    	}

    	const writable_props = [
    		"eventsFn",
    		"customFilter",
    		"requiredFilter",
    		"modelcomponent",
    		"quickcomponent",
    		"query",
    		"schema_key"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	function button0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms.addbutton = $$value;
    			$$invalidate(19, doms);
    		});
    	}

    	function input0_input_handler() {
    		limit = to_number(this.value);
    		$$invalidate(14, limit);
    	}

    	function select_change_handler() {
    		current_page = select_value(this);
    		$$invalidate(16, current_page);
    		$$invalidate(15, pages);
    	}

    	const close_handler = () => $$invalidate(22, config = !config);

    	function input1_change_handler() {
    		allSelected = this.checked;
    		(($$invalidate(25, allSelected), $$invalidate(13, selectedRowsKeys)), $$invalidate(7, items));
    	}

    	const click_handler = (index, e) => handleSort(e, index);

    	function select_change_handler_1(index) {
    		filterSettings[index] = select_value(this);
    		$$invalidate(10, filterSettings);
    		$$invalidate(1, customFilter);
    	}

    	function input_input_handler(index) {
    		filterSettings[index] = this.value;
    		$$invalidate(10, filterSettings);
    		$$invalidate(1, customFilter);
    	}

    	function input_input_handler_1(index) {
    		filterSettings[index] = this.value;
    		$$invalidate(10, filterSettings);
    		$$invalidate(1, customFilter);
    	}

    	function input_input_handler_2(index) {
    		filterSettings[index] = this.value;
    		$$invalidate(10, filterSettings);
    		$$invalidate(1, customFilter);
    	}

    	function input_change_handler(index) {
    		filterSettings[index] = this.checked;
    		$$invalidate(10, filterSettings);
    		$$invalidate(1, customFilter);
    	}

    	const click_handler_1 = l => {
    		quickview.push(l[0]);
    		$$invalidate(12, quickview);
    	};

    	const click_handler_2 = l => onItemClick(l);
    	const click_handler_3 = l => onDeleteClick(l);

    	$$self.$set = $$props => {
    		if ("eventsFn" in $$props) $$invalidate(0, eventsFn = $$props.eventsFn);
    		if ("customFilter" in $$props) $$invalidate(1, customFilter = $$props.customFilter);
    		if ("requiredFilter" in $$props) $$invalidate(48, requiredFilter = $$props.requiredFilter);
    		if ("modelcomponent" in $$props) $$invalidate(2, modelcomponent = $$props.modelcomponent);
    		if ("quickcomponent" in $$props) $$invalidate(3, quickcomponent = $$props.quickcomponent);
    		if ("query" in $$props) $$invalidate(49, query = $$props.query);
    		if ("schema_key" in $$props) $$invalidate(4, schema_key = $$props.schema_key);
    	};

    	$$self.$capture_state = () => {
    		return {
    			eventsFn,
    			events,
    			headers,
    			items,
    			count,
    			customFilter,
    			requiredFilter,
    			modelcomponent,
    			quickcomponent,
    			query,
    			schema_key,
    			formLabels,
    			headerColTypes,
    			visible_columns,
    			options,
    			filterSettings,
    			sortSettings,
    			quickview,
    			selectedRowsKeys,
    			first_visibile_column,
    			fetchConfig,
    			limit,
    			pages,
    			current_page,
    			total_pages,
    			mounted,
    			binded,
    			er,
    			doms,
    			addnewform,
    			headerFetched,
    			modalIsVisible,
    			item,
    			config,
    			contextmenu,
    			header_evt,
    			data_evt,
    			unsub,
    			mutate_evt,
    			menuDisplayed,
    			inputMenuDisplayed,
    			$css,
    			$ws_connected,
    			allSelected,
    			multipleSelected
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("eventsFn" in $$props) $$invalidate(0, eventsFn = $$props.eventsFn);
    		if ("events" in $$props) events = $$props.events;
    		if ("headers" in $$props) $$invalidate(6, headers = $$props.headers);
    		if ("items" in $$props) $$invalidate(7, items = $$props.items);
    		if ("count" in $$props) count = $$props.count;
    		if ("customFilter" in $$props) $$invalidate(1, customFilter = $$props.customFilter);
    		if ("requiredFilter" in $$props) $$invalidate(48, requiredFilter = $$props.requiredFilter);
    		if ("modelcomponent" in $$props) $$invalidate(2, modelcomponent = $$props.modelcomponent);
    		if ("quickcomponent" in $$props) $$invalidate(3, quickcomponent = $$props.quickcomponent);
    		if ("query" in $$props) $$invalidate(49, query = $$props.query);
    		if ("schema_key" in $$props) $$invalidate(4, schema_key = $$props.schema_key);
    		if ("formLabels" in $$props) formLabels = $$props.formLabels;
    		if ("headerColTypes" in $$props) $$invalidate(8, headerColTypes = $$props.headerColTypes);
    		if ("visible_columns" in $$props) $$invalidate(9, visible_columns = $$props.visible_columns);
    		if ("options" in $$props) options = $$props.options;
    		if ("filterSettings" in $$props) $$invalidate(10, filterSettings = $$props.filterSettings);
    		if ("sortSettings" in $$props) $$invalidate(11, sortSettings = $$props.sortSettings);
    		if ("quickview" in $$props) $$invalidate(12, quickview = $$props.quickview);
    		if ("selectedRowsKeys" in $$props) $$invalidate(13, selectedRowsKeys = $$props.selectedRowsKeys);
    		if ("first_visibile_column" in $$props) first_visibile_column = $$props.first_visibile_column;
    		if ("fetchConfig" in $$props) fetchConfig = $$props.fetchConfig;
    		if ("limit" in $$props) $$invalidate(14, limit = $$props.limit);
    		if ("pages" in $$props) $$invalidate(15, pages = $$props.pages);
    		if ("current_page" in $$props) $$invalidate(16, current_page = $$props.current_page);
    		if ("total_pages" in $$props) $$invalidate(17, total_pages = $$props.total_pages);
    		if ("mounted" in $$props) $$invalidate(56, mounted = $$props.mounted);
    		if ("binded" in $$props) $$invalidate(57, binded = $$props.binded);
    		if ("er" in $$props) $$invalidate(18, er = $$props.er);
    		if ("doms" in $$props) $$invalidate(19, doms = $$props.doms);
    		if ("addnewform" in $$props) $$invalidate(20, addnewform = $$props.addnewform);
    		if ("headerFetched" in $$props) headerFetched = $$props.headerFetched;
    		if ("modalIsVisible" in $$props) $$invalidate(21, modalIsVisible = $$props.modalIsVisible);
    		if ("item" in $$props) item = $$props.item;
    		if ("config" in $$props) $$invalidate(22, config = $$props.config);
    		if ("contextmenu" in $$props) $$invalidate(23, contextmenu = $$props.contextmenu);
    		if ("header_evt" in $$props) header_evt = $$props.header_evt;
    		if ("data_evt" in $$props) data_evt = $$props.data_evt;
    		if ("unsub" in $$props) unsub = $$props.unsub;
    		if ("mutate_evt" in $$props) mutate_evt = $$props.mutate_evt;
    		if ("menuDisplayed" in $$props) menuDisplayed = $$props.menuDisplayed;
    		if ("inputMenuDisplayed" in $$props) inputMenuDisplayed = $$props.inputMenuDisplayed;
    		if ("$css" in $$props) css.set($css = $$props.$css);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    		if ("allSelected" in $$props) $$invalidate(25, allSelected = $$props.allSelected);
    		if ("multipleSelected" in $$props) $$invalidate(26, multipleSelected = $$props.multipleSelected);
    	};

    	let allSelected;
    	let multipleSelected;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items*/ 128) {
    			 {
    				setContext("items", items);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*eventsFn, schema_key*/ 17 | $$self.$$.dirty[1] & /*query, requiredFilter*/ 393216) {
    			 (reset());
    		}

    		if ($$self.$$.dirty[1] & /*binded, mounted*/ 100663296 | $$self.$$.dirty[2] & /*$ws_connected*/ 16) {
    			 {

    				if (mounted) {
    					if ($ws_connected) {
    						bindOnce();
    						$$invalidate(57, binded = true);
    						$$invalidate(18, er = "");
    						onWSConnect();
    					} else {
    						$$invalidate(18, er = "Reconnecting...");
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowsKeys, items*/ 8320) {
    			 $$invalidate(25, allSelected = selectedRowsKeys.length == items.length ? true : false);
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowsKeys*/ 8192) {
    			 $$invalidate(26, multipleSelected = selectedRowsKeys.length ? true : false);
    		}
    	};

    	return [
    		eventsFn,
    		customFilter,
    		modelcomponent,
    		quickcomponent,
    		schema_key,
    		refresh,
    		headers,
    		items,
    		headerColTypes,
    		visible_columns,
    		filterSettings,
    		sortSettings,
    		quickview,
    		selectedRowsKeys,
    		limit,
    		pages,
    		current_page,
    		total_pages,
    		er,
    		doms,
    		addnewform,
    		modalIsVisible,
    		config,
    		contextmenu,
    		$css,
    		allSelected,
    		multipleSelected,
    		hiddenColumns,
    		handleFilter,
    		onResetFilter,
    		toogleAddForm,
    		successSave,
    		onCancel,
    		deleteRow,
    		onDeleteRow,
    		onDeleteSelected,
    		onLimitChange,
    		handleSort,
    		onItemClick,
    		onDeleteClick,
    		onHeaderContext,
    		onTextInputContext,
    		closeInputMenu,
    		onSelectRowClick,
    		onSelectAllClick,
    		onConfigClicked,
    		onConfigApply,
    		closeModal,
    		requiredFilter,
    		query,
    		events,
    		count,
    		formLabels,
    		options,
    		first_visibile_column,
    		fetchConfig,
    		mounted,
    		binded,
    		headerFetched,
    		item,
    		header_evt,
    		data_evt,
    		unsub,
    		mutate_evt,
    		menuDisplayed,
    		inputMenuDisplayed,
    		$ws_connected,
    		dp,
    		unRegister,
    		reset,
    		bindOnce,
    		onWSConnect,
    		onHeaderGet,
    		fillHeadersArray,
    		onDataGet,
    		resetFilter_,
    		closeForm_,
    		closeForms_,
    		editButtonFocus,
    		deleteRows_,
    		calc_pagination,
    		selectAll_,
    		openModal,
    		onNewClick,
    		button0_binding,
    		input0_input_handler,
    		select_change_handler,
    		close_handler,
    		input1_change_handler,
    		click_handler,
    		select_change_handler_1,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				eventsFn: 0,
    				customFilter: 1,
    				requiredFilter: 48,
    				modelcomponent: 2,
    				quickcomponent: 3,
    				query: 49,
    				schema_key: 4,
    				refresh: 5
    			},
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get eventsFn() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventsFn(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customFilter() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customFilter(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requiredFilter() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requiredFilter(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modelcomponent() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modelcomponent(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quickcomponent() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quickcomponent(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get query() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get schema_key() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set schema_key(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refresh() {
    		return this.$$.ctx[5];
    	}

    	set refresh(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function toVal(mix) {
    	var k, y, str='';
    	if (mix) {
    		if (typeof mix === 'object') {
    			if (!!mix.push) {
    				for (k=0; k < mix.length; k++) {
    					if (mix[k] && (y = toVal(mix[k]))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			} else {
    				for (k in mix) {
    					if (mix[k] && (y = toVal(k))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			}
    		} else if (typeof mix !== 'boolean' && !mix.call) {
    			str && (str += ' ');
    			str += mix;
    		}
    	}
    	return str;
    }

    function clsx () {
    	var i=0, x, str='';
    	while (i < arguments.length) {
    		if (x = toVal(arguments[i++])) {
    			str && (str += ' ');
    			str += x;
    		}
    	}
    	return str;
    }

    /* src/components/form/Checkboxes.svelte generated by Svelte v3.16.7 */
    const file$7 = "src/components/form/Checkboxes.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (20:0) {#each props['options'] as v, i (i)}
    function create_each_block$4(key_1, ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let input_class_value;
    	let t0;
    	let t1_value = /*v*/ ctx[12] + "";
    	let t1;
    	let t2;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			input.__value = input_value_value = /*v*/ ctx[12];
    			input.value = input.__value;
    			input.required = /*required*/ ctx[2];
    			input.disabled = /*disabled*/ ctx[3];
    			input.readOnly = /*readonly*/ ctx[4];
    			attr_dev(input, "title", /*title*/ ctx[5]);
    			attr_dev(input, "tabindex", /*tabindex*/ ctx[6]);
    			attr_dev(input, "style", /*style*/ ctx[7]);
    			attr_dev(input, "class", input_class_value = clsx(/*classe*/ ctx[8]));
    			/*$$binding_groups*/ ctx[11][0].push(input);
    			add_location(input, file$7, 21, 3, 338);
    			add_location(label, file$7, 20, 1, 327);
    			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[10]);
    			this.first = label;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~/*value*/ ctx[0].indexOf(input.__value);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (dirty & /*props*/ 512 && input_value_value !== (input_value_value = /*v*/ ctx[12])) {
    				prop_dev(input, "__value", input_value_value);
    			}

    			input.value = input.__value;

    			if (dirty & /*required*/ 4) {
    				prop_dev(input, "required", /*required*/ ctx[2]);
    			}

    			if (dirty & /*disabled*/ 8) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty & /*title*/ 32) {
    				attr_dev(input, "title", /*title*/ ctx[5]);
    			}

    			if (dirty & /*tabindex*/ 64) {
    				attr_dev(input, "tabindex", /*tabindex*/ ctx[6]);
    			}

    			if (dirty & /*style*/ 128) {
    				attr_dev(input, "style", /*style*/ ctx[7]);
    			}

    			if (dirty & /*classe*/ 256 && input_class_value !== (input_class_value = clsx(/*classe*/ ctx[8]))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = ~/*value*/ ctx[0].indexOf(input.__value);
    			}

    			if (dirty & /*props*/ 512 && t1_value !== (t1_value = /*v*/ ctx[12] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input), 1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(20:0) {#each props['options'] as v, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*props*/ ctx[9]["options"];
    	const get_key = ctx => /*i*/ ctx[14];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			const each_value = /*props*/ ctx[9]["options"];
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { name } = $$props;
    	let { required } = $$props;
    	let { disabled } = $$props;
    	let { readonly } = $$props;
    	let { title } = $$props;
    	let { tabindex } = $$props;
    	let { style } = $$props;
    	let { classe } = $$props;
    	let { value } = $$props;
    	let { props } = $$props;

    	const writable_props = [
    		"name",
    		"required",
    		"disabled",
    		"readonly",
    		"title",
    		"tabindex",
    		"style",
    		"classe",
    		"value",
    		"props"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Checkboxes> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		value = get_binding_group_value($$binding_groups[0]);
    		$$invalidate(0, value);
    	}

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("required" in $$props) $$invalidate(2, required = $$props.required);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ("title" in $$props) $$invalidate(5, title = $$props.title);
    		if ("tabindex" in $$props) $$invalidate(6, tabindex = $$props.tabindex);
    		if ("style" in $$props) $$invalidate(7, style = $$props.style);
    		if ("classe" in $$props) $$invalidate(8, classe = $$props.classe);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("props" in $$props) $$invalidate(9, props = $$props.props);
    	};

    	$$self.$capture_state = () => {
    		return {
    			name,
    			required,
    			disabled,
    			readonly,
    			title,
    			tabindex,
    			style,
    			classe,
    			value,
    			props
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("required" in $$props) $$invalidate(2, required = $$props.required);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ("title" in $$props) $$invalidate(5, title = $$props.title);
    		if ("tabindex" in $$props) $$invalidate(6, tabindex = $$props.tabindex);
    		if ("style" in $$props) $$invalidate(7, style = $$props.style);
    		if ("classe" in $$props) $$invalidate(8, classe = $$props.classe);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("props" in $$props) $$invalidate(9, props = $$props.props);
    	};

    	return [
    		value,
    		name,
    		required,
    		disabled,
    		readonly,
    		title,
    		tabindex,
    		style,
    		classe,
    		props,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class Checkboxes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			name: 1,
    			required: 2,
    			disabled: 3,
    			readonly: 4,
    			title: 5,
    			tabindex: 6,
    			style: 7,
    			classe: 8,
    			value: 0,
    			props: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkboxes",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'name'");
    		}

    		if (/*required*/ ctx[2] === undefined && !("required" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'required'");
    		}

    		if (/*disabled*/ ctx[3] === undefined && !("disabled" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'disabled'");
    		}

    		if (/*readonly*/ ctx[4] === undefined && !("readonly" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'readonly'");
    		}

    		if (/*title*/ ctx[5] === undefined && !("title" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'title'");
    		}

    		if (/*tabindex*/ ctx[6] === undefined && !("tabindex" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'tabindex'");
    		}

    		if (/*style*/ ctx[7] === undefined && !("style" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'style'");
    		}

    		if (/*classe*/ ctx[8] === undefined && !("classe" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'classe'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'value'");
    		}

    		if (/*props*/ ctx[9] === undefined && !("props" in props)) {
    			console.warn("<Checkboxes> was created without expected prop 'props'");
    		}
    	}

    	get name() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classe() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classe(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<Checkboxes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<Checkboxes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/form/Form.svelte generated by Svelte v3.16.7 */
    const file$8 = "src/components/form/Form.svelte";

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[51] = list[i];
    	return child_ctx;
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[48] = list[i];
    	child_ctx[50] = i;
    	return child_ctx;
    }

    // (462:35) 
    function create_if_block_15$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let radio;
    	let i = /*i*/ ctx[50];
    	let radio_levels = [/*props*/ ctx[13][/*i*/ ctx[50]]];
    	let radio_data = {};

    	for (let i = 0; i < radio_levels.length; i += 1) {
    		radio_data = assign(radio_data, radio_levels[i]);
    	}

    	const assign_radio = () => /*radio_binding*/ ctx[46](radio, i);
    	const unassign_radio = () => /*radio_binding*/ ctx[46](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			radio = element("radio");
    			add_location(span, file$8, 462, 6, 10783);
    			set_attributes(radio, radio_data);
    			add_location(radio, file$8, 463, 6, 10814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, radio, anchor);
    			assign_radio();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);
    			set_attributes(radio, get_spread_update(radio_levels, [dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]]));

    			if (i !== /*i*/ ctx[50]) {
    				unassign_radio();
    				i = /*i*/ ctx[50];
    				assign_radio();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(radio);
    			unassign_radio();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$1.name,
    		type: "if",
    		source: "(462:35) ",
    		ctx
    	});

    	return block;
    }

    // (456:36) 
    function create_if_block_14$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let select;
    	let i = /*i*/ ctx[50];
    	let select_levels = [/*props*/ ctx[13][/*i*/ ctx[50]]];
    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const assign_select = () => /*select_binding*/ ctx[45](select, i);
    	const unassign_select = () => /*select_binding*/ ctx[45](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			select = element("select");
    			add_location(span, file$8, 456, 6, 10645);
    			set_attributes(select, select_data);
    			add_location(select, file$8, 457, 6, 10676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);
    			assign_select();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);
    			set_attributes(select, get_spread_update(select_levels, [dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]]));

    			if (i !== /*i*/ ctx[50]) {
    				unassign_select();
    				i = /*i*/ ctx[50];
    				assign_select();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			unassign_select();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$1.name,
    		type: "if",
    		source: "(456:36) ",
    		ctx
    	});

    	return block;
    }

    // (447:37) 
    function create_if_block_13$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let textarea;
    	let i = /*i*/ ctx[50];
    	let dispose;
    	let textarea_levels = [{ rows: 10 }, { cols: 20 }, /*props*/ ctx[13][/*i*/ ctx[50]]];
    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	function textarea_input_handler() {
    		/*textarea_input_handler*/ ctx[43].call(textarea, /*i*/ ctx[50]);
    	}

    	const assign_textarea = () => /*textarea_binding*/ ctx[44](textarea, i);
    	const unassign_textarea = () => /*textarea_binding*/ ctx[44](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			textarea = element("textarea");
    			add_location(span, file$8, 447, 6, 10444);
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$8, 448, 6, 10475);
    			dispose = listen_dev(textarea, "input", textarea_input_handler);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_textarea();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(textarea, get_spread_update(textarea_levels, [
    				{ rows: 10 },
    				{ cols: 20 },
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				set_input_value(textarea, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_textarea();
    				i = /*i*/ ctx[50];
    				assign_textarea();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(textarea);
    			unassign_textarea();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(447:37) ",
    		ctx
    	});

    	return block;
    }

    // (425:35) 
    function create_if_block_12$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let each_value_1 = /*form*/ ctx[0][/*i*/ ctx[50]];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(span, file$8, 425, 4, 9923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*form, labels, required, placeholder, form_disabled, disabled, title, classe, props, doms*/ 28585) {
    				each_value_1 = /*form*/ ctx[0][/*i*/ ctx[50]];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(425:35) ",
    		ctx
    	});

    	return block;
    }

    // (408:38) 
    function create_if_block_11$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let updating_value;
    	let i = /*i*/ ctx[50];
    	let current;

    	function checkboxes_value_binding(value) {
    		/*checkboxes_value_binding*/ ctx[38].call(null, value, /*i*/ ctx[50]);
    	}

    	const assign_checkboxes = () => /*checkboxes_binding*/ ctx[39](checkboxes, i);
    	const unassign_checkboxes = () => /*checkboxes_binding*/ ctx[39](null, i);

    	let checkboxes_props = {
    		name: /*labels*/ ctx[5][/*i*/ ctx[50]],
    		required: /*required*/ ctx[7][/*i*/ ctx[50]],
    		disabled: /*form_disabled*/ ctx[3]
    		? true
    		: /*disabled*/ ctx[9][/*i*/ ctx[50]],
    		title: /*title*/ ctx[10][/*i*/ ctx[50]],
    		classe: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]]),
    		props: /*props*/ ctx[13][/*i*/ ctx[50]]
    	};

    	if (/*form*/ ctx[0][/*i*/ ctx[50]] !== void 0) {
    		checkboxes_props.value = /*form*/ ctx[0][/*i*/ ctx[50]];
    	}

    	const checkboxes = new Checkboxes({ props: checkboxes_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkboxes, "value", checkboxes_value_binding));
    	assign_checkboxes();

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(checkboxes.$$.fragment);
    			add_location(span, file$8, 408, 4, 9550);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(checkboxes, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*labels*/ 32) && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			if (i !== /*i*/ ctx[50]) {
    				unassign_checkboxes();
    				i = /*i*/ ctx[50];
    				assign_checkboxes();
    			}

    			const checkboxes_changes = {};
    			if (dirty[0] & /*labels*/ 32) checkboxes_changes.name = /*labels*/ ctx[5][/*i*/ ctx[50]];
    			if (dirty[0] & /*required*/ 128) checkboxes_changes.required = /*required*/ ctx[7][/*i*/ ctx[50]];

    			if (dirty[0] & /*form_disabled, disabled*/ 520) checkboxes_changes.disabled = /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]];

    			if (dirty[0] & /*title*/ 1024) checkboxes_changes.title = /*title*/ ctx[10][/*i*/ ctx[50]];
    			if (dirty[0] & /*classe*/ 2048) checkboxes_changes.classe = clsx(/*classe*/ ctx[11][/*i*/ ctx[50]]);
    			if (dirty[0] & /*props*/ 8192) checkboxes_changes.props = /*props*/ ctx[13][/*i*/ ctx[50]];

    			if (!updating_value && dirty[0] & /*form*/ 1) {
    				updating_value = true;
    				checkboxes_changes.value = /*form*/ ctx[0][/*i*/ ctx[50]];
    				add_flush_callback(() => updating_value = false);
    			}

    			checkboxes.$set(checkboxes_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkboxes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkboxes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			unassign_checkboxes();
    			destroy_component(checkboxes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(408:38) ",
    		ctx
    	});

    	return block;
    }

    // (391:65) 
    function create_if_block_10(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "checkbox" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{
    			title: /*title*/ ctx[10][/*i*/ ctx[50]] + "a"
    		},
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_change_handler_1() {
    		/*input_change_handler_1*/ ctx[36].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_9*/ ctx[37](input, i);
    	const unassign_input = () => /*input_binding_9*/ ctx[37](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 391, 4, 9125);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 392, 7, 9157);
    			dispose = listen_dev(input, "change", input_change_handler_1);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			input.checked = /*form*/ ctx[0][/*i*/ ctx[50]];
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "checkbox" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({
    					title: /*title*/ ctx[10][/*i*/ ctx[50]] + "a"
    				}),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				input.checked = /*form*/ ctx[0][/*i*/ ctx[50]];
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(391:65) ",
    		ctx
    	});

    	return block;
    }

    // (373:34) 
    function create_if_block_9$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "text" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_6() {
    		/*input_input_handler_6*/ ctx[34].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_8*/ ctx[35](input, i);
    	const unassign_input = () => /*input_binding_8*/ ctx[35](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 373, 4, 8682);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 374, 7, 8714);
    			dispose = listen_dev(input, "input", input_input_handler_6);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "text" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1 && input.value !== /*form*/ ctx[0][/*i*/ ctx[50]]) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(373:34) ",
    		ctx
    	});

    	return block;
    }

    // (355:36) 
    function create_if_block_8$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "search" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_5() {
    		/*input_input_handler_5*/ ctx[32].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_7*/ ctx[33](input, i);
    	const unassign_input = () => /*input_binding_7*/ ctx[33](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 355, 4, 8268);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 356, 7, 8300);
    			dispose = listen_dev(input, "input", input_input_handler_5);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "search" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(355:36) ",
    		ctx
    	});

    	return block;
    }

    // (338:35) 
    function create_if_block_7$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "range" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_change_input_handler() {
    		/*input_change_input_handler*/ ctx[30].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_6*/ ctx[31](input, i);
    	const unassign_input = () => /*input_binding_6*/ ctx[31](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 338, 4, 7854);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 339, 7, 7886);

    			dispose = [
    				listen_dev(input, "change", input_change_input_handler),
    				listen_dev(input, "input", input_change_input_handler)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "range" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(338:35) ",
    		ctx
    	});

    	return block;
    }

    // (321:38) 
    function create_if_block_6$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "password" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_4() {
    		/*input_input_handler_4*/ ctx[28].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_5*/ ctx[29](input, i);
    	const unassign_input = () => /*input_binding_5*/ ctx[29](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 321, 4, 7438);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 322, 7, 7470);
    			dispose = listen_dev(input, "input", input_input_handler_4);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "password" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1 && input.value !== /*form*/ ctx[0][/*i*/ ctx[50]]) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(321:38) ",
    		ctx
    	});

    	return block;
    }

    // (304:36) 
    function create_if_block_5(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let input_updating = false;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "number" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_3() {
    		input_updating = true;
    		/*input_input_handler_3*/ ctx[26].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_4*/ ctx[27](input, i);
    	const unassign_input = () => /*input_binding_4*/ ctx[27](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 304, 4, 7021);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 305, 7, 7053);
    			dispose = listen_dev(input, "input", input_input_handler_3);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "number" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (!input_updating && dirty[0] & /*form*/ 1) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			input_updating = false;

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(304:36) ",
    		ctx
    	});

    	return block;
    }

    // (288:36) 
    function create_if_block_4$1(ctx) {
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "hidden" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_2() {
    		/*input_input_handler_2*/ ctx[24].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_3*/ ctx[25](input, i);
    	const unassign_input = () => /*input_binding_3*/ ctx[25](null, i);

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$8, 288, 7, 6638);
    			dispose = listen_dev(input, "input", input_input_handler_2);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "hidden" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(288:36) ",
    		ctx
    	});

    	return block;
    }

    // (271:34) 
    function create_if_block_3$1(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "file" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[22].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_2*/ ctx[23](input, i);
    	const unassign_input = () => /*input_binding_2*/ ctx[23](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 271, 4, 6222);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 272, 7, 6254);
    			dispose = listen_dev(input, "change", input_change_handler);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "file" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(271:34) ",
    		ctx
    	});

    	return block;
    }

    // (254:35) 
    function create_if_block_2$4(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "email" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[20].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_1*/ ctx[21](input, i);
    	const unassign_input = () => /*input_binding_1*/ ctx[21](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 254, 4, 5810);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 255, 7, 5842);
    			dispose = listen_dev(input, "input", input_input_handler_1);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "email" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1 && input.value !== /*form*/ ctx[0][/*i*/ ctx[50]]) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(254:35) ",
    		ctx
    	});

    	return block;
    }

    // (237:4) {#if types[i] === 'color'}
    function create_if_block_1$5(ctx) {
    	let span;
    	let t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "";
    	let t0;
    	let t1;
    	let input;
    	let i = /*i*/ ctx[50];
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "color" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[18].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding*/ ctx[19](input, i);
    	const unassign_input = () => /*input_binding*/ ctx[19](null, i);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			add_location(span, file$8, 237, 4, 5397);
    			set_attributes(input, input_data);
    			add_location(input, file$8, 238, 7, 5429);
    			dispose = listen_dev(input, "input", input_input_handler);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			assign_input();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*labels*/ 32 && t0_value !== (t0_value = /*labels*/ ctx[5][/*i*/ ctx[50]] + "")) set_data_dev(t0, t0_value);

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "color" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				set_input_value(input, /*form*/ ctx[0][/*i*/ ctx[50]]);
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(237:4) {#if types[i] === 'color'}",
    		ctx
    	});

    	return block;
    }

    // (427:4) {#each form[i] as v}
    function create_each_block_1$3(ctx) {
    	let label;
    	let input;
    	let i = /*i*/ ctx[50];
    	let t0;
    	let t1_value = /*v*/ ctx[51] + "";
    	let t1;
    	let t2;
    	let dispose;

    	let input_levels = [
    		{ name: /*labels*/ ctx[5][/*i*/ ctx[50]] },
    		{ type: "radio" },
    		{
    			required: /*required*/ ctx[7][/*i*/ ctx[50]]
    		},
    		{
    			placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    		},
    		{ autocomplete: false },
    		{
    			disabled: /*form_disabled*/ ctx[3]
    			? true
    			: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    		},
    		{ title: /*title*/ ctx[10][/*i*/ ctx[50]] },
    		{
    			class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    		},
    		/*props*/ ctx[13][/*i*/ ctx[50]]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_change_handler_2() {
    		/*input_change_handler_2*/ ctx[40].call(input, /*i*/ ctx[50]);
    	}

    	const assign_input = () => /*input_binding_10*/ ctx[42](input, i);
    	const unassign_input = () => /*input_binding_10*/ ctx[42](null, i);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[41][1].push(input);
    			add_location(input, file$8, 428, 9, 9995);
    			add_location(label, file$8, 427, 5, 9978);
    			dispose = listen_dev(input, "change", input_change_handler_2);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*form*/ ctx[0][/*i*/ ctx[50]];
    			assign_input();
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*labels*/ 32 && ({ name: /*labels*/ ctx[5][/*i*/ ctx[50]] }),
    				{ type: "radio" },
    				dirty[0] & /*required*/ 128 && ({
    					required: /*required*/ ctx[7][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*placeholder*/ 256 && ({
    					placeholder: /*placeholder*/ ctx[8][/*i*/ ctx[50]]
    				}),
    				{ autocomplete: false },
    				dirty[0] & /*form_disabled, disabled*/ 520 && ({
    					disabled: /*form_disabled*/ ctx[3]
    					? true
    					: /*disabled*/ ctx[9][/*i*/ ctx[50]]
    				}),
    				dirty[0] & /*title*/ 1024 && ({ title: /*title*/ ctx[10][/*i*/ ctx[50]] }),
    				dirty[0] & /*classe*/ 2048 && ({
    					class: clsx(/*classe*/ ctx[11][/*i*/ ctx[50]])
    				}),
    				dirty[0] & /*props*/ 8192 && /*props*/ ctx[13][/*i*/ ctx[50]]
    			]));

    			if (dirty[0] & /*form*/ 1) {
    				input.checked = input.__value === /*form*/ ctx[0][/*i*/ ctx[50]];
    			}

    			if (i !== /*i*/ ctx[50]) {
    				unassign_input();
    				i = /*i*/ ctx[50];
    				assign_input();
    			}

    			if (dirty[0] & /*form*/ 1 && t1_value !== (t1_value = /*v*/ ctx[51] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[41][1].splice(/*$$binding_groups*/ ctx[41][1].indexOf(input), 1);
    			unassign_input();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(427:4) {#each form[i] as v}",
    		ctx
    	});

    	return block;
    }

    // (470:4) {#if description[i]}
    function create_if_block$4(ctx) {
    	let t_value = /*description*/ ctx[12][/*i*/ ctx[50]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*description*/ 4096 && t_value !== (t_value = /*description*/ ctx[12][/*i*/ ctx[50]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(470:4) {#if description[i]}",
    		ctx
    	});

    	return block;
    }

    // (235:0) {#each form as f, i}
    function create_each_block$5(ctx) {
    	let label;
    	let show_if;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let current;

    	const if_block_creators = [
    		create_if_block_1$5,
    		create_if_block_2$4,
    		create_if_block_3$1,
    		create_if_block_4$1,
    		create_if_block_5,
    		create_if_block_6$1,
    		create_if_block_7$1,
    		create_if_block_8$1,
    		create_if_block_9$1,
    		create_if_block_10,
    		create_if_block_11$1,
    		create_if_block_12$1,
    		create_if_block_13$1,
    		create_if_block_14$1,
    		create_if_block_15$1
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "color") return 0;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "email") return 1;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "file") return 2;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "hidden") return 3;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "number") return 4;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "password") return 5;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "range") return 6;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "search") return 7;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "text") return 8;
    		if (dirty[0] & /*types, form*/ 65) show_if = !!(/*types*/ ctx[6][/*i*/ ctx[50]] === "checkbox" && !Array.isArray(/*form*/ ctx[0][/*i*/ ctx[50]]));
    		if (show_if) return 9;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "checkbox") return 10;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "radio") return 11;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "textarea") return 12;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "select") return 13;
    		if (/*types*/ ctx[6][/*i*/ ctx[50]] === "radio") return 14;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx, -1))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*description*/ ctx[12][/*i*/ ctx[50]] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(label, file$8, 235, 2, 5354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(label, null);
    			}

    			append_dev(label, t);
    			if (if_block1) if_block1.m(label, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(label, t);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*description*/ ctx[12][/*i*/ ctx[50]]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(label, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(235:0) {#each form as f, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let form_1;
    	let t0;
    	let footer;
    	let t1;
    	let current;
    	let dispose;
    	let each_value = /*form*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const submitbutton = new SubmitButton({
    			props: { isSaving: /*isSaving*/ ctx[2] },
    			$$inline: true
    		});

    	const cancelbutton = new CancelButton({
    			props: {
    				isSaving: /*isSaving*/ ctx[2],
    				key: /*key*/ ctx[1]
    			},
    			$$inline: true
    		});

    	cancelbutton.$on("close", /*close_handler*/ ctx[47]);

    	const block = {
    		c: function create() {
    			form_1 = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			footer = element("footer");
    			create_component(submitbutton.$$.fragment);
    			t1 = space();
    			create_component(cancelbutton.$$.fragment);
    			add_location(footer, file$8, 474, 2, 10993);
    			add_location(form_1, file$8, 233, 0, 5292);
    			dispose = listen_dev(form_1, "submit", prevent_default(/*save*/ ctx[4]), false, true, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form_1, null);
    			}

    			append_dev(form_1, t0);
    			append_dev(form_1, footer);
    			mount_component(submitbutton, footer, null);
    			append_dev(footer, t1);
    			mount_component(cancelbutton, footer, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*description, types, labels, required, placeholder, form_disabled, disabled, title, classe, props, form, doms*/ 32745) {
    				each_value = /*form*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form_1, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const submitbutton_changes = {};
    			if (dirty[0] & /*isSaving*/ 4) submitbutton_changes.isSaving = /*isSaving*/ ctx[2];
    			submitbutton.$set(submitbutton_changes);
    			const cancelbutton_changes = {};
    			if (dirty[0] & /*isSaving*/ 4) cancelbutton_changes.isSaving = /*isSaving*/ ctx[2];
    			if (dirty[0] & /*key*/ 2) cancelbutton_changes.key = /*key*/ ctx[1];
    			cancelbutton.$set(cancelbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(submitbutton.$$.fragment, local);
    			transition_in(cancelbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(submitbutton.$$.fragment, local);
    			transition_out(cancelbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(submitbutton);
    			destroy_component(cancelbutton);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { key } = $$props;
    	let { isSaving } = $$props;
    	let { headers } = $$props;
    	let { form } = $$props;
    	let { form_disabled = true } = $$props;
    	let { save = () => 0 } = $$props;
    	let labels = [];
    	let types = [];
    	let required = [];
    	let placeholder = [];
    	let disabled = [];
    	let title = [];
    	let classe = [];
    	let description = [];
    	let props = [];
    	let doms = {};
    	let mounted = false;
    	let once = true;

    	onMount(() => {
    		$$invalidate(16, mounted = true);
    	});

    	const writable_props = ["key", "isSaving", "headers", "form", "form_disabled", "save"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function input_input_handler(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_1(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_1($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_change_handler(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_2($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_2(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_3($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_3(i) {
    		form[i] = to_number(this.value);
    		$$invalidate(0, form);
    	}

    	function input_binding_4($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_4(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_5($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_change_input_handler(i) {
    		form[i] = to_number(this.value);
    		$$invalidate(0, form);
    	}

    	function input_binding_6($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_5(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_7($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_input_handler_6(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function input_binding_8($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_change_handler_1(i) {
    		form[i] = this.checked;
    		$$invalidate(0, form);
    	}

    	function input_binding_9($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function checkboxes_value_binding(value, i) {
    		form[i] = value;
    		$$invalidate(0, form);
    	}

    	function checkboxes_binding($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function input_change_handler_2(i) {
    		form[i] = this.__value;
    		$$invalidate(0, form);
    	}

    	function input_binding_10($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function textarea_input_handler(i) {
    		form[i] = this.value;
    		$$invalidate(0, form);
    	}

    	function textarea_binding($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function select_binding($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function radio_binding($$value, i) {
    		if (doms[i] === $$value) return;

    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			doms[i] = $$value;
    			$$invalidate(14, doms);
    		});
    	}

    	function close_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    		if ("isSaving" in $$props) $$invalidate(2, isSaving = $$props.isSaving);
    		if ("headers" in $$props) $$invalidate(15, headers = $$props.headers);
    		if ("form" in $$props) $$invalidate(0, form = $$props.form);
    		if ("form_disabled" in $$props) $$invalidate(3, form_disabled = $$props.form_disabled);
    		if ("save" in $$props) $$invalidate(4, save = $$props.save);
    	};

    	$$self.$capture_state = () => {
    		return {
    			key,
    			isSaving,
    			headers,
    			form,
    			form_disabled,
    			save,
    			labels,
    			types,
    			required,
    			placeholder,
    			disabled,
    			title,
    			classe,
    			description,
    			props,
    			doms,
    			mounted,
    			once
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    		if ("isSaving" in $$props) $$invalidate(2, isSaving = $$props.isSaving);
    		if ("headers" in $$props) $$invalidate(15, headers = $$props.headers);
    		if ("form" in $$props) $$invalidate(0, form = $$props.form);
    		if ("form_disabled" in $$props) $$invalidate(3, form_disabled = $$props.form_disabled);
    		if ("save" in $$props) $$invalidate(4, save = $$props.save);
    		if ("labels" in $$props) $$invalidate(5, labels = $$props.labels);
    		if ("types" in $$props) $$invalidate(6, types = $$props.types);
    		if ("required" in $$props) $$invalidate(7, required = $$props.required);
    		if ("placeholder" in $$props) $$invalidate(8, placeholder = $$props.placeholder);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ("title" in $$props) $$invalidate(10, title = $$props.title);
    		if ("classe" in $$props) $$invalidate(11, classe = $$props.classe);
    		if ("description" in $$props) $$invalidate(12, description = $$props.description);
    		if ("props" in $$props) $$invalidate(13, props = $$props.props);
    		if ("doms" in $$props) $$invalidate(14, doms = $$props.doms);
    		if ("mounted" in $$props) $$invalidate(16, mounted = $$props.mounted);
    		if ("once" in $$props) $$invalidate(17, once = $$props.once);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*headers*/ 32768) {
    			 {
    				$$invalidate(5, labels = headers[0] || []);
    				$$invalidate(6, types = headers[1] || []);
    				$$invalidate(7, required = headers[2] || []);
    				$$invalidate(8, placeholder = headers[3] || []);
    				$$invalidate(9, disabled = headers[4] || []);
    				$$invalidate(10, title = headers[5] || []);
    				$$invalidate(11, classe = headers[6] || []);
    				$$invalidate(12, description = headers[7] || []);
    				$$invalidate(13, props = headers[8] || []);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*mounted, once, disabled, doms*/ 213504) {
    			 {
    				if (mounted && once) {
    					let index = -1;
    					let i = -1;

    					for (i = 0; i < disabled.length; i++) {
    						if (!disabled[i]) {
    							index = i;
    							break;
    						}
    					}

    					if (index > -1) {
    						setTimeout(
    							function () {
    								if (doms[index]) doms[index].focus();
    							},
    							200
    						);

    						$$invalidate(17, once = false);
    					}
    				}
    			}
    		}
    	};

    	return [
    		form,
    		key,
    		isSaving,
    		form_disabled,
    		save,
    		labels,
    		types,
    		required,
    		placeholder,
    		disabled,
    		title,
    		classe,
    		description,
    		props,
    		doms,
    		headers,
    		mounted,
    		once,
    		input_input_handler,
    		input_binding,
    		input_input_handler_1,
    		input_binding_1,
    		input_change_handler,
    		input_binding_2,
    		input_input_handler_2,
    		input_binding_3,
    		input_input_handler_3,
    		input_binding_4,
    		input_input_handler_4,
    		input_binding_5,
    		input_change_input_handler,
    		input_binding_6,
    		input_input_handler_5,
    		input_binding_7,
    		input_input_handler_6,
    		input_binding_8,
    		input_change_handler_1,
    		input_binding_9,
    		checkboxes_value_binding,
    		checkboxes_binding,
    		input_change_handler_2,
    		$$binding_groups,
    		input_binding_10,
    		textarea_input_handler,
    		textarea_binding,
    		select_binding,
    		radio_binding,
    		close_handler
    	];
    }

    class Form$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				key: 1,
    				isSaving: 2,
    				headers: 15,
    				form: 0,
    				form_disabled: 3,
    				save: 4
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*key*/ ctx[1] === undefined && !("key" in props)) {
    			console.warn("<Form> was created without expected prop 'key'");
    		}

    		if (/*isSaving*/ ctx[2] === undefined && !("isSaving" in props)) {
    			console.warn("<Form> was created without expected prop 'isSaving'");
    		}

    		if (/*headers*/ ctx[15] === undefined && !("headers" in props)) {
    			console.warn("<Form> was created without expected prop 'headers'");
    		}

    		if (/*form*/ ctx[0] === undefined && !("form" in props)) {
    			console.warn("<Form> was created without expected prop 'form'");
    		}
    	}

    	get key() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSaving() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSaving(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headers() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form_disabled() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form_disabled(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get save() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set save(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/form/Index.svelte generated by Svelte v3.16.7 */

    function create_fragment$b(ctx) {
    	let updating_headers;
    	let updating_form;
    	let t0;
    	let t1;
    	let current;

    	function form_1_headers_binding(value) {
    		/*form_1_headers_binding*/ ctx[20].call(null, value);
    	}

    	function form_1_form_binding(value_1) {
    		/*form_1_form_binding*/ ctx[21].call(null, value_1);
    	}

    	let form_1_props = {
    		save: /*f*/ ctx[6].onSave,
    		key: /*key*/ ctx[0],
    		isSaving: /*$isSaving*/ ctx[2],
    		form_disabled: /*$form_disabled*/ ctx[3]
    	};

    	if (/*$headers*/ ctx[4] !== void 0) {
    		form_1_props.headers = /*$headers*/ ctx[4];
    	}

    	if (/*$form*/ ctx[5] !== void 0) {
    		form_1_props.form = /*$form*/ ctx[5];
    	}

    	const form_1 = new Form$1({ props: form_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(form_1, "headers", form_1_headers_binding));
    	binding_callbacks.push(() => bind(form_1, "form", form_1_form_binding));
    	form_1.$on("close", /*close_handler*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(form_1.$$.fragment);
    			t0 = space();
    			t1 = text(/*$er*/ ctx[1]);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(form_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const form_1_changes = {};
    			if (dirty & /*key*/ 1) form_1_changes.key = /*key*/ ctx[0];
    			if (dirty & /*$isSaving*/ 4) form_1_changes.isSaving = /*$isSaving*/ ctx[2];
    			if (dirty & /*$form_disabled*/ 8) form_1_changes.form_disabled = /*$form_disabled*/ ctx[3];

    			if (!updating_headers && dirty & /*$headers*/ 16) {
    				updating_headers = true;
    				form_1_changes.headers = /*$headers*/ ctx[4];
    				add_flush_callback(() => updating_headers = false);
    			}

    			if (!updating_form && dirty & /*$form*/ 32) {
    				updating_form = true;
    				form_1_changes.form = /*$form*/ ctx[5];
    				add_flush_callback(() => updating_form = false);
    			}

    			form_1.$set(form_1_changes);
    			if (!current || dirty & /*$er*/ 2) set_data_dev(t1, /*$er*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $mounted;
    	let $ws_connected;
    	let $er;
    	let $binded;
    	let $isSaving;
    	let $form_disabled;
    	let $headers;
    	let $form;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(17, $ws_connected = $$value));
    	let { eventsFn = () => 0 } = $$props;
    	let { key = 0 } = $$props;
    	let { schema_key } = $$props;

    	const f = new FormArray(S, key, eventsFn(key, schema_key), createEventDispatcher(), schema_key),
    		er = f.er,
    		isSaving = f.isSaving,
    		form = f.form,
    		headers = f.headers,
    		mounted = f.mounted,
    		binded = f.binded,
    		form_disabled = f.form_disabled;

    	validate_store(form_disabled, "form_disabled");
    	component_subscribe($$self, form_disabled, value => $$invalidate(3, $form_disabled = value));
    	validate_store(binded, "binded");
    	component_subscribe($$self, binded, value => $$invalidate(18, $binded = value));
    	validate_store(mounted, "mounted");
    	component_subscribe($$self, mounted, value => $$invalidate(16, $mounted = value));
    	validate_store(headers, "headers");
    	component_subscribe($$self, headers, value => $$invalidate(4, $headers = value));
    	validate_store(form, "form");
    	component_subscribe($$self, form, value => $$invalidate(5, $form = value));
    	validate_store(isSaving, "isSaving");
    	component_subscribe($$self, isSaving, value => $$invalidate(2, $isSaving = value));
    	validate_store(er, "er");
    	component_subscribe($$self, er, value => $$invalidate(1, $er = value));

    	onMount(() => {
    		set_store_value(mounted, $mounted = true);
    	});

    	onDestroy(() => {
    		f.onDestroy();
    	});

    	function funcBindingOnce() {
    		if (!$binded) {
    			f.bindAll();
    			set_store_value(binded, $binded = true);
    			f.fetch();
    		}
    	}

    	const writable_props = ["eventsFn", "key", "schema_key"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	function form_1_headers_binding(value) {
    		$headers = value;
    		headers.set($headers);
    	}

    	function form_1_form_binding(value_1) {
    		$form = value_1;
    		form.set($form);
    	}

    	function close_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("eventsFn" in $$props) $$invalidate(14, eventsFn = $$props.eventsFn);
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("schema_key" in $$props) $$invalidate(15, schema_key = $$props.schema_key);
    	};

    	$$self.$capture_state = () => {
    		return {
    			eventsFn,
    			key,
    			schema_key,
    			$mounted,
    			$ws_connected,
    			$er,
    			$binded,
    			$isSaving,
    			$form_disabled,
    			$headers,
    			$form
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("eventsFn" in $$props) $$invalidate(14, eventsFn = $$props.eventsFn);
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("schema_key" in $$props) $$invalidate(15, schema_key = $$props.schema_key);
    		if ("$mounted" in $$props) mounted.set($mounted = $$props.$mounted);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    		if ("$er" in $$props) er.set($er = $$props.$er);
    		if ("$binded" in $$props) binded.set($binded = $$props.$binded);
    		if ("$isSaving" in $$props) isSaving.set($isSaving = $$props.$isSaving);
    		if ("$form_disabled" in $$props) form_disabled.set($form_disabled = $$props.$form_disabled);
    		if ("$headers" in $$props) headers.set($headers = $$props.$headers);
    		if ("$form" in $$props) form.set($form = $$props.$form);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$mounted, $ws_connected*/ 196608) {
    			 if ($mounted) {
    				if ($ws_connected) {
    					set_store_value(er, $er = "");
    					funcBindingOnce();
    				} else {
    					set_store_value(er, $er = "Reconnecting...");
    				}
    			}
    		}
    	};

    	return [
    		key,
    		$er,
    		$isSaving,
    		$form_disabled,
    		$headers,
    		$form,
    		f,
    		er,
    		isSaving,
    		form,
    		headers,
    		mounted,
    		binded,
    		form_disabled,
    		eventsFn,
    		schema_key,
    		$mounted,
    		$ws_connected,
    		$binded,
    		funcBindingOnce,
    		form_1_headers_binding,
    		form_1_form_binding,
    		close_handler
    	];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { eventsFn: 14, key: 0, schema_key: 15 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*schema_key*/ ctx[15] === undefined && !("schema_key" in props)) {
    			console.warn("<Index> was created without expected prop 'schema_key'");
    		}
    	}

    	get eventsFn() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventsFn(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get schema_key() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set schema_key(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/account/login.svelte generated by Svelte v3.16.7 */
    const file$9 = "src/account/login.svelte";

    // (25:0) {#if query.message}
    function create_if_block$5(ctx) {
    	let span;
    	let t_value = /*query*/ ctx[0].message + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = /*query*/ ctx[0].type);
    			add_location(span, file$9, 25, 2, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*query*/ 1 && t_value !== (t_value = /*query*/ ctx[0].message + "")) set_data_dev(t, t_value);

    			if (dirty & /*query*/ 1 && span_class_value !== (span_class_value = /*query*/ ctx[0].type)) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(25:0) {#if query.message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let t;
    	let current;
    	let if_block = /*query*/ ctx[0].message && create_if_block$5(ctx);

    	const generalform = new Index({
    			props: {
    				eventsFn: /*loginMutateEvents*/ ctx[1],
    				key: null,
    				schema_key: "login"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(generalform.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(generalform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*query*/ ctx[0].message) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(generalform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(generalform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(generalform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { query = {} } = $$props;
    	let { server = "" } = $$props;

    	const loginMutateEvents = (id = 0) => {
    		return [
    			null,
    			[event_type.get, events.my, events.form_schema_get, id],
    			[event_type.mutate, events.account, events.login, id]
    		];
    	};

    	onMount(() => {
    		
    	});

    	const writable_props = ["query", "server"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    		if ("server" in $$props) $$invalidate(2, server = $$props.server);
    	};

    	$$self.$capture_state = () => {
    		return { query, server };
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    		if ("server" in $$props) $$invalidate(2, server = $$props.server);
    	};

    	return [query, loginMutateEvents, server];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			query: 0,
    			server: 2,
    			loginMutateEvents: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get query() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get server() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set server(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loginMutateEvents() {
    		return this.$$.ctx[1];
    	}

    	set loginMutateEvents(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/account/logout.svelte generated by Svelte v3.16.7 */
    const file$a = "src/account/logout.svelte";

    // (103:0) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Sign in\n      ");
    			a = element("a");
    			a.textContent = "Sign in";
    			t2 = text("\n      .");
    			attr_dev(a, "href", "/account/login");
    			add_location(a, file$a, 106, 6, 2066);
    			add_location(p, file$a, 104, 4, 2042);
    			attr_dev(div, "class", "signin");
    			add_location(div, file$a, 103, 2, 2017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, a);
    			append_dev(p, t2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(103:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:0) {#if loging_out}
    function create_if_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Logging out...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(101:0) {#if loging_out}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*loging_out*/ ctx[2]) return create_if_block$6;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*header*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*er*/ ctx[0]);
    			t3 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file$a, 96, 2, 1933);
    			add_location(p, file$a, 97, 2, 1953);
    			attr_dev(div, "class", "header");
    			add_location(div, file$a, 95, 0, 1910);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*header*/ 2) set_data_dev(t0, /*header*/ ctx[1]);
    			if (dirty & /*er*/ 1) set_data_dev(t2, /*er*/ ctx[0]);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function saveCookie$1(d) {
    	document.cookie = `time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $ws_connected;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(6, $ws_connected = $$value));
    	let { query = {} } = $$props;
    	let mounted = false;
    	let binded = false;
    	let er = "";
    	let header = "";
    	let subtitle = "";
    	let loging_out = true;
    	const fns = [[event_type.mutate, events.account, events.logout, 0]], [logout] = fns;

    	const bindOnce = () => {
    		if (!binded) {
    			S.bind$(logout, onLogout, 1);
    			binded = true;
    		}
    	};

    	onMount(async () => {
    		$$invalidate(4, mounted = true);
    		$$invalidate(1, header = "Logging out");
    		$$invalidate(0, er = "Please wait ...");
    	});

    	onDestroy(() => {
    		S.unbind_(fns);
    	});

    	function onLogout([d]) {
    		if (d.ok) {
    			$$invalidate(2, loging_out = false);
    			$$invalidate(1, header = "Logged out successfully!");
    			$$invalidate(0, er = "Thank you for visiting. See you again soon.");
    			saveCookie$1();
    		} else {
    			$$invalidate(1, header = "Error");
    			$$invalidate(0, er = d.error);
    		}
    	}

    	const writable_props = ["query"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logout> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(3, query = $$props.query);
    	};

    	$$self.$capture_state = () => {
    		return {
    			query,
    			mounted,
    			binded,
    			er,
    			header,
    			subtitle,
    			loging_out,
    			$ws_connected
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(3, query = $$props.query);
    		if ("mounted" in $$props) $$invalidate(4, mounted = $$props.mounted);
    		if ("binded" in $$props) binded = $$props.binded;
    		if ("er" in $$props) $$invalidate(0, er = $$props.er);
    		if ("header" in $$props) $$invalidate(1, header = $$props.header);
    		if ("subtitle" in $$props) subtitle = $$props.subtitle;
    		if ("loging_out" in $$props) $$invalidate(2, loging_out = $$props.loging_out);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mounted, $ws_connected, query*/ 88) {
    			 {
    				if (mounted) {
    					if ($ws_connected) {
    						$$invalidate(0, er = "");
    						bindOnce();
    						S.trigger([[logout, query]]);
    					} else {
    						$$invalidate(0, er = "Reconnecting...");
    					}
    				}
    			}
    		}
    	};

    	return [er, header, loging_out, query];
    }

    class Logout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { query: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logout",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get query() {
    		throw new Error("<Logout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Logout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/account/register.svelte generated by Svelte v3.16.7 */
    const file$b = "src/account/register.svelte";

    // (28:0) {#if query.message}
    function create_if_block$7(ctx) {
    	let span;
    	let t_value = /*query*/ ctx[0].message + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = /*query*/ ctx[0].type);
    			add_location(span, file$b, 28, 2, 1020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*query*/ 1 && t_value !== (t_value = /*query*/ ctx[0].message + "")) set_data_dev(t, t_value);

    			if (dirty & /*query*/ 1 && span_class_value !== (span_class_value = /*query*/ ctx[0].type)) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(28:0) {#if query.message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let a0;
    	let t4;
    	let t5;
    	let div;
    	let p1;
    	let t6;
    	let a1;
    	let t8;
    	let t9;
    	let p2;
    	let current;
    	let if_block = /*query*/ ctx[0].message && create_if_block$7(ctx);

    	const generalform = new Index({
    			props: {
    				eventsFn: /*registerMutateEvents*/ ctx[1],
    				key: null,
    				schema_key: "register"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(generalform.$$.fragment);
    			t1 = space();
    			p0 = element("p");
    			t2 = text("By creating an account you agree to our\n  ");
    			a0 = element("a");
    			a0.textContent = "Terms & Privacy";
    			t4 = text("\n  .");
    			t5 = space();
    			div = element("div");
    			p1 = element("p");
    			t6 = text("Already have an account?\n    ");
    			a1 = element("a");
    			a1.textContent = "Sign in";
    			t8 = text("\n    .");
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "An account is needed to purchase a product";
    			attr_dev(a0, "href", "page/privacy");
    			add_location(a0, file$b, 34, 2, 1206);
    			add_location(p0, file$b, 32, 0, 1158);
    			attr_dev(a1, "href", "account/login");
    			add_location(a1, file$b, 41, 4, 1319);
    			add_location(p1, file$b, 39, 2, 1282);
    			add_location(p2, file$b, 44, 2, 1370);
    			attr_dev(div, "class", "signin");
    			add_location(div, file$b, 38, 0, 1259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(generalform, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, a0);
    			append_dev(p0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p1);
    			append_dev(p1, t6);
    			append_dev(p1, a1);
    			append_dev(p1, t8);
    			append_dev(div, t9);
    			append_dev(div, p2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*query*/ ctx[0].message) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(generalform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(generalform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(generalform, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { query = {} } = $$props;

    	const registerMutateEvents = (id = 0) => {
    		return [
    			null,
    			[event_type.get, events.my, events.form_schema_get, id],
    			[event_type.mutate, events.account, events.register_user, id]
    		];
    	};

    	onMount(() => {
    		
    	});

    	const writable_props = ["query"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	$$self.$capture_state = () => {
    		return { query };
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	return [query, registerMutateEvents];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { query: 0, registerMutateEvents: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get query() {
    		throw new Error("<Register>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Register>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerMutateEvents() {
    		return this.$$.ctx[1];
    	}

    	set registerMutateEvents(value) {
    		throw new Error("<Register>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/account/confirm.svelte generated by Svelte v3.16.7 */
    const file$c = "src/account/confirm.svelte";

    // (87:0) {:else}
    function create_else_block$2(ctx) {
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let div1;
    	let p1;
    	let t4;
    	let a;
    	let t6;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*result_title*/ ctx[4]);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*er*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t4 = text("Sign in\n      ");
    			a = element("a");
    			a.textContent = "Sign in";
    			t6 = text("\n      .");
    			add_location(h1, file$c, 88, 4, 1746);
    			add_location(p0, file$c, 89, 4, 1774);
    			attr_dev(div0, "class", "header");
    			add_location(div0, file$c, 87, 2, 1721);
    			attr_dev(a, "href", "account/login");
    			add_location(a, file$c, 95, 6, 1847);
    			add_location(p1, file$c, 93, 4, 1823);
    			attr_dev(div1, "class", "signin");
    			add_location(div1, file$c, 92, 2, 1798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p1);
    			append_dev(p1, t4);
    			append_dev(p1, a);
    			append_dev(p1, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result_title*/ 16) set_data_dev(t0, /*result_title*/ ctx[4]);
    			if (dirty & /*er*/ 1) set_data_dev(t2, /*er*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(87:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:0) {#if confirming}
    function create_if_block$8(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*header*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*subtitle*/ ctx[2]);
    			add_location(h1, file$c, 83, 4, 1662);
    			add_location(p, file$c, 84, 4, 1684);
    			attr_dev(div, "class", "header");
    			add_location(div, file$c, 82, 2, 1637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*header*/ 2) set_data_dev(t0, /*header*/ ctx[1]);
    			if (dirty & /*subtitle*/ 4) set_data_dev(t2, /*subtitle*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(82:0) {#if confirming}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*confirming*/ ctx[3]) return create_if_block$8;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $ws_connected;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(8, $ws_connected = $$value));
    	let { query = {} } = $$props;
    	let mounted = false;
    	let binded = false;
    	let er = "";
    	let header = "";
    	let subtitle = "";
    	let confirming = true;
    	let result_title = "";

    	const fns = [
    			[event_type.mutate, events.account, events.confirm_email, 0],
    			[event_type.subscribe, events.account, events.confirm_email_status, 0],
    			[event_type.unsubscribe, events.account, events.confirm_email_status, 0]
    		],
    		[doconfirm, sub, unsub] = fns;

    	const bindOnce = () => {
    		if (!binded) {
    			S.bind$(sub, onSubGet, 1);
    			binded = true;
    		}
    	};

    	onMount(async () => {
    		$$invalidate(6, mounted = true);

    		if (query.token) {
    			$$invalidate(1, header = "Confirming");
    			$$invalidate(2, subtitle = "Please wait ...");
    		} else {
    			$$invalidate(1, header = "Email Verification");
    			$$invalidate(2, subtitle = "Please check your inbox to verify email.");
    		}
    	});

    	onDestroy(() => {
    		S.trigger([[unsub, {}]]);
    		S.unbind_(fns);
    	});

    	function onSubGet([d]) {
    		if (d.ok) {
    			$$invalidate(3, confirming = false);
    			$$invalidate(4, result_title = "Success");
    			$$invalidate(0, er = "Your Email is confirmed.");
    		} else {
    			$$invalidate(4, result_title = "Error");
    			$$invalidate(0, er = d.error);
    		}
    	}

    	const writable_props = ["query"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Confirm> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(5, query = $$props.query);
    	};

    	$$self.$capture_state = () => {
    		return {
    			query,
    			mounted,
    			binded,
    			er,
    			header,
    			subtitle,
    			confirming,
    			result_title,
    			$ws_connected
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(5, query = $$props.query);
    		if ("mounted" in $$props) $$invalidate(6, mounted = $$props.mounted);
    		if ("binded" in $$props) binded = $$props.binded;
    		if ("er" in $$props) $$invalidate(0, er = $$props.er);
    		if ("header" in $$props) $$invalidate(1, header = $$props.header);
    		if ("subtitle" in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ("confirming" in $$props) $$invalidate(3, confirming = $$props.confirming);
    		if ("result_title" in $$props) $$invalidate(4, result_title = $$props.result_title);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mounted, $ws_connected, query*/ 352) {
    			 {
    				if (mounted) {
    					if ($ws_connected) {
    						$$invalidate(0, er = "");
    						bindOnce();
    						S.trigger([[sub, {}]]);

    						if (query.token) {
    							S.trigger([[doconfirm, query]]);
    						}
    					} else {
    						$$invalidate(0, er = "Reconnecting...");
    					}
    				}
    			}
    		}
    	};

    	return [er, header, subtitle, confirming, result_title, query];
    }

    class Confirm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { query: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirm",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get query() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/public/layout.svelte generated by Svelte v3.16.7 */
    const file$d = "src/views/public/layout.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let section;
    	let current;

    	const route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			create_component(route.$$.fragment);
    			attr_dev(section, "class", "section");
    			add_location(section, file$d, 9, 2, 234);
    			attr_dev(div, "class", "app");
    			add_location(div, file$d, 7, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			mount_component(route, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	let { params } = $$props;
    	const writable_props = ["currentRoute", "params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute, params };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	return [currentRoute, params];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { currentRoute: 0, params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console.warn("<Layout> was created without expected prop 'currentRoute'");
    		}

    		if (/*params*/ ctx[1] === undefined && !("params" in props)) {
    			console.warn("<Layout> was created without expected prop 'params'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/TreeSidebar.svelte generated by Svelte v3.16.7 */
    const file$e = "src/components/TreeSidebar.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:1) {#if !m.hidden}
    function create_if_block_1$6(ctx) {
    	let li;
    	let a;
    	let t_value = /*m*/ ctx[1].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*m*/ ctx[1].path);
    			add_location(a, file$e, 7, 6, 113);
    			add_location(li, file$e, 7, 2, 109);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*m*/ ctx[1].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*menu*/ 1 && a_href_value !== (a_href_value = /*m*/ ctx[1].path)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(7:1) {#if !m.hidden}",
    		ctx
    	});

    	return block;
    }

    // (10:1) {#if m.children}
    function create_if_block$9(ctx) {
    	let current;

    	const treesidebar = new TreeSidebar({
    			props: { menu: /*m*/ ctx[1].children },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(treesidebar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(treesidebar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const treesidebar_changes = {};
    			if (dirty & /*menu*/ 1) treesidebar_changes.menu = /*m*/ ctx[1].children;
    			treesidebar.$set(treesidebar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(treesidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(treesidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(treesidebar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(10:1) {#if m.children}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#each menu as m}
    function create_each_block$6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = !/*m*/ ctx[1].hidden && create_if_block_1$6(ctx);
    	let if_block1 = /*m*/ ctx[1].children && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*m*/ ctx[1].hidden) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*m*/ ctx[1].children) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(6:0) {#each menu as m}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let ul;
    	let current;
    	let each_value = /*menu*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$e, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menu*/ 1) {
    				each_value = /*menu*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { menu = {} } = $$props;
    	const writable_props = ["menu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TreeSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("menu" in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	$$self.$capture_state = () => {
    		return { menu };
    	};

    	$$self.$inject_state = $$props => {
    		if ("menu" in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	return [menu];
    }

    class TreeSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { menu: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TreeSidebar",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get menu() {
    		throw new Error("<TreeSidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu(value) {
    		throw new Error("<TreeSidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/admin/layout.svelte generated by Svelte v3.16.7 */

    const { console: console_1$1 } = globals;
    const file$f = "src/views/admin/layout.svelte";

    // (36:4) {#if menus.admin}
    function create_if_block$a(ctx) {
    	let current;

    	const treesidebar = new TreeSidebar({
    			props: { menu: /*menus*/ ctx[2].admin },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(treesidebar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(treesidebar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const treesidebar_changes = {};
    			if (dirty & /*menus*/ 4) treesidebar_changes.menu = /*menus*/ ctx[2].admin;
    			treesidebar.$set(treesidebar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(treesidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(treesidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(treesidebar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(36:4) {#if menus.admin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let if_block = /*menus*/ ctx[2].admin && create_if_block$a(ctx);

    	const route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(route.$$.fragment);
    			add_location(div0, file$f, 34, 2, 1009);
    			set_style(div1, "display", "flex");
    			add_location(div1, file$f, 33, 0, 979);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t);
    			mount_component(route, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menus*/ ctx[2].admin) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(route);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $ws_connected;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(6, $ws_connected = $$value));
    	let { currentRoute } = $$props;
    	let { params } = $$props;
    	let mounted = false;
    	let er = "";
    	let binded = false;
    	let menu_evt = [event_type.get, events.my, events.form_schema_get, "side_admin_menu"];
    	let menus = [];

    	onMount(() => {
    		$$invalidate(3, mounted = true);
    	});

    	onDestroy(() => {
    		S.unbind_([menu_evt]);
    	});

    	const funcBindingOnce = () => {
    		if (!binded) {
    			S.bind$(
    				menu_evt,
    				d => {
    					if (d[0].length && d[0][0]) {
    						$$invalidate(2, menus = d[0][0]);
    						console.log(menus);
    					}
    				},
    				1
    			);

    			binded = true;
    			S.trigger([[menu_evt, ["side_menu"]]]);
    		}
    	};

    	const writable_props = ["currentRoute", "params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => {
    		return {
    			currentRoute,
    			params,
    			mounted,
    			er,
    			binded,
    			menu_evt,
    			menus,
    			$ws_connected
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    		if ("mounted" in $$props) $$invalidate(3, mounted = $$props.mounted);
    		if ("er" in $$props) er = $$props.er;
    		if ("binded" in $$props) binded = $$props.binded;
    		if ("menu_evt" in $$props) menu_evt = $$props.menu_evt;
    		if ("menus" in $$props) $$invalidate(2, menus = $$props.menus);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mounted, $ws_connected*/ 72) {
    			 if (mounted) {
    				if ($ws_connected) {
    					er = "";
    					funcBindingOnce();
    				} else {
    					er = "Reconnecting...";
    				}
    			}
    		}
    	};

    	return [currentRoute, params, menus];
    }

    class Layout$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { currentRoute: 0, params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console_1$1.warn("<Layout> was created without expected prop 'currentRoute'");
    		}

    		if (/*params*/ ctx[1] === undefined && !("params" in props)) {
    			console_1$1.warn("<Layout> was created without expected prop 'params'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/admin/index.svelte generated by Svelte v3.16.7 */

    function create_fragment$j(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Admin Dash Board");
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Admin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Admin",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/views/admin/employees/index.svelte generated by Svelte v3.16.7 */

    function create_fragment$k(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("abc");
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Employees extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Employees",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;

    var hexTable = (function () {
        var array = [];
        for (var i = 0; i < 256; ++i) {
            array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
        }

        return array;
    }());

    var compactQueue = function compactQueue(queue) {
        while (queue.length > 1) {
            var item = queue.pop();
            var obj = item.obj[item.prop];

            if (isArray(obj)) {
                var compacted = [];

                for (var j = 0; j < obj.length; ++j) {
                    if (typeof obj[j] !== 'undefined') {
                        compacted.push(obj[j]);
                    }
                }

                item.obj[item.prop] = compacted;
            }
        }
    };

    var arrayToObject = function arrayToObject(source, options) {
        var obj = options && options.plainObjects ? Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
            if (typeof source[i] !== 'undefined') {
                obj[i] = source[i];
            }
        }

        return obj;
    };

    var merge = function merge(target, source, options) {
        /* eslint no-param-reassign: 0 */
        if (!source) {
            return target;
        }

        if (typeof source !== 'object') {
            if (isArray(target)) {
                target.push(source);
            } else if (target && typeof target === 'object') {
                if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                    target[source] = true;
                }
            } else {
                return [target, source];
            }

            return target;
        }

        if (!target || typeof target !== 'object') {
            return [target].concat(source);
        }

        var mergeTarget = target;
        if (isArray(target) && !isArray(source)) {
            mergeTarget = arrayToObject(target, options);
        }

        if (isArray(target) && isArray(source)) {
            source.forEach(function (item, i) {
                if (has.call(target, i)) {
                    var targetItem = target[i];
                    if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                        target[i] = merge(targetItem, item, options);
                    } else {
                        target.push(item);
                    }
                } else {
                    target[i] = item;
                }
            });
            return target;
        }

        return Object.keys(source).reduce(function (acc, key) {
            var value = source[key];

            if (has.call(acc, key)) {
                acc[key] = merge(acc[key], value, options);
            } else {
                acc[key] = value;
            }
            return acc;
        }, mergeTarget);
    };

    var assign$1 = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function (acc, key) {
            acc[key] = source[key];
            return acc;
        }, target);
    };

    var decode = function (str, decoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, ' ');
        if (charset === 'iso-8859-1') {
            // unescape never throws, no try...catch needed:
            return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        // utf-8
        try {
            return decodeURIComponent(strWithoutPlus);
        } catch (e) {
            return strWithoutPlus;
        }
    };

    var encode = function encode(str, defaultEncoder, charset) {
        // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
        // It has been adapted here for stricter adherence to RFC 3986
        if (str.length === 0) {
            return str;
        }

        var string = str;
        if (typeof str === 'symbol') {
            string = Symbol.prototype.toString.call(str);
        } else if (typeof str !== 'string') {
            string = String(str);
        }

        if (charset === 'iso-8859-1') {
            return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
                return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
            });
        }

        var out = '';
        for (var i = 0; i < string.length; ++i) {
            var c = string.charCodeAt(i);

            if (
                c === 0x2D // -
                || c === 0x2E // .
                || c === 0x5F // _
                || c === 0x7E // ~
                || (c >= 0x30 && c <= 0x39) // 0-9
                || (c >= 0x41 && c <= 0x5A) // a-z
                || (c >= 0x61 && c <= 0x7A) // A-Z
            ) {
                out += string.charAt(i);
                continue;
            }

            if (c < 0x80) {
                out = out + hexTable[c];
                continue;
            }

            if (c < 0x800) {
                out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            i += 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
            out += hexTable[0xF0 | (c >> 18)]
                + hexTable[0x80 | ((c >> 12) & 0x3F)]
                + hexTable[0x80 | ((c >> 6) & 0x3F)]
                + hexTable[0x80 | (c & 0x3F)];
        }

        return out;
    };

    var compact = function compact(value) {
        var queue = [{ obj: { o: value }, prop: 'o' }];
        var refs = [];

        for (var i = 0; i < queue.length; ++i) {
            var item = queue[i];
            var obj = item.obj[item.prop];

            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                var val = obj[key];
                if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                    queue.push({ obj: obj, prop: key });
                    refs.push(val);
                }
            }
        }

        compactQueue(queue);

        return value;
    };

    var isRegExp = function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    var isBuffer = function isBuffer(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }

        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };

    var combine = function combine(a, b) {
        return [].concat(a, b);
    };

    var utils = {
        arrayToObject: arrayToObject,
        assign: assign$1,
        combine: combine,
        compact: compact,
        decode: decode,
        encode: encode,
        isBuffer: isBuffer,
        isRegExp: isRegExp,
        merge: merge
    };

    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;



    var Format = {
        RFC1738: 'RFC1738',
        RFC3986: 'RFC3986'
    };

    var formats = utils.assign(
        {
            'default': Format.RFC3986,
            formatters: {
                RFC1738: function (value) {
                    return replace.call(value, percentTwenties, '+');
                },
                RFC3986: function (value) {
                    return String(value);
                }
            }
        },
        Format
    );

    var toISO = Date.prototype.toISOString;

    var defaultFormat = formats['default'];
    var defaults = {
        addQueryPrefix: false,
        allowDots: false,
        charset: 'utf-8',
        charsetSentinel: false,
        delimiter: '&',
        encode: true,
        encoder: utils.encode,
        encodeValuesOnly: false,
        format: defaultFormat,
        formatter: formats.formatters[defaultFormat],
        // deprecated
        indices: false,
        serializeDate: function serializeDate(date) {
            return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
    };

    /* src/global/SchemaForm.svelte generated by Svelte v3.16.7 */
    const file$g = "src/global/SchemaForm.svelte";

    function create_fragment$l(ctx) {
    	let link;
    	let t0;
    	let form_1;
    	let label0;
    	let span0;
    	let t2;
    	let input0;
    	let t3;
    	let label1;
    	let span1;
    	let t5;
    	let input1;
    	let t6;
    	let label2;
    	let span2;
    	let t8;
    	let input2;
    	let input2_updating = false;
    	let t9;
    	let div2;
    	let div0;
    	let t11;
    	let div1;
    	let t12;
    	let div9;
    	let div5;
    	let div3;
    	let t14;
    	let div4;
    	let t15;
    	let div8;
    	let div6;
    	let t17;
    	let div7;
    	let t18;
    	let div10;
    	let t19;
    	let t20;
    	let footer;
    	let t21;
    	let current;
    	let dispose;

    	function input2_input_handler() {
    		input2_updating = true;
    		/*input2_input_handler*/ ctx[24].call(input2);
    	}

    	const submitbutton = new SubmitButton({
    			props: { isSaving: /*$isSaving*/ ctx[6] },
    			$$inline: true
    		});

    	const cancelbutton = new CancelButton({
    			props: {
    				isSaving: /*$isSaving*/ ctx[6],
    				key: /*key*/ ctx[0]
    			},
    			$$inline: true
    		});

    	cancelbutton.$on("close", /*close_handler*/ ctx[28]);

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			form_1 = element("form");
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "Key";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "Tag";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			label2 = element("label");
    			span2 = element("span");
    			span2.textContent = "Index";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Form Object:";
    			t11 = space();
    			div1 = element("div");
    			t12 = space();
    			div9 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Fields Array:";
    			t14 = space();
    			div4 = element("div");
    			t15 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div6.textContent = "Columns Object:";
    			t17 = space();
    			div7 = element("div");
    			t18 = space();
    			div10 = element("div");
    			t19 = text(/*$er*/ ctx[5]);
    			t20 = space();
    			footer = element("footer");
    			create_component(submitbutton.$$.fragment);
    			t21 = space();
    			create_component(cancelbutton.$$.fragment);
    			attr_dev(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "type", "text/css");
    			add_location(link, file$g, 56, 4, 1898);
    			add_location(span0, file$g, 60, 4, 2090);
    			attr_dev(input0, "name", "key");
    			attr_dev(input0, "type", "text");
    			input0.required = true;
    			add_location(input0, file$g, 61, 4, 2111);
    			add_location(label0, file$g, 59, 2, 2078);
    			add_location(span1, file$g, 64, 4, 2202);
    			attr_dev(input1, "name", "tag");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$g, 65, 4, 2223);
    			add_location(label1, file$g, 63, 2, 2190);
    			add_location(span2, file$g, 68, 4, 2304);
    			attr_dev(input2, "name", "index");
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$g, 69, 4, 2327);
    			add_location(label2, file$g, 67, 2, 2292);
    			add_location(div0, file$g, 72, 4, 2412);
    			attr_dev(div1, "name", "form");
    			set_style(div1, "width", "1200px");
    			set_style(div1, "height", "400px");
    			add_location(div1, file$g, 73, 4, 2440);
    			add_location(div2, file$g, 71, 2, 2402);
    			add_location(div3, file$g, 77, 6, 2584);
    			attr_dev(div4, "name", "fields");
    			set_style(div4, "width", "400px");
    			set_style(div4, "height", "400px");
    			add_location(div4, file$g, 78, 6, 2615);
    			add_location(div5, file$g, 76, 4, 2572);
    			add_location(div6, file$g, 81, 6, 2733);
    			attr_dev(div7, "name", "columns");
    			set_style(div7, "width", "400px");
    			set_style(div7, "height", "400px");
    			add_location(div7, file$g, 82, 6, 2766);
    			add_location(div8, file$g, 80, 4, 2721);
    			set_style(div9, "display", "flex");
    			add_location(div9, file$g, 75, 2, 2539);
    			add_location(div10, file$g, 85, 2, 2881);
    			add_location(footer, file$g, 86, 2, 2900);
    			add_location(form_1, file$g, 58, 0, 2035);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[22]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[23]),
    				listen_dev(input2, "input", input2_input_handler),
    				listen_dev(form_1, "submit", prevent_default(/*onSave*/ ctx[12]), false, true, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, label0);
    			append_dev(label0, span0);
    			append_dev(label0, t2);
    			append_dev(label0, input0);
    			set_input_value(input0, /*$form*/ ctx[4]._key);
    			append_dev(form_1, t3);
    			append_dev(form_1, label1);
    			append_dev(label1, span1);
    			append_dev(label1, t5);
    			append_dev(label1, input1);
    			set_input_value(input1, /*$form*/ ctx[4].tag);
    			append_dev(form_1, t6);
    			append_dev(form_1, label2);
    			append_dev(label2, span2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*$form*/ ctx[4].index);
    			append_dev(form_1, t9);
    			append_dev(form_1, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[25](div1);
    			append_dev(form_1, t12);
    			append_dev(form_1, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t14);
    			append_dev(div5, div4);
    			/*div4_binding*/ ctx[26](div4);
    			append_dev(div9, t15);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			/*div7_binding*/ ctx[27](div7);
    			append_dev(form_1, t18);
    			append_dev(form_1, div10);
    			append_dev(div10, t19);
    			append_dev(form_1, t20);
    			append_dev(form_1, footer);
    			mount_component(submitbutton, footer, null);
    			append_dev(footer, t21);
    			mount_component(cancelbutton, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$form*/ 16 && input0.value !== /*$form*/ ctx[4]._key) {
    				set_input_value(input0, /*$form*/ ctx[4]._key);
    			}

    			if (dirty & /*$form*/ 16 && input1.value !== /*$form*/ ctx[4].tag) {
    				set_input_value(input1, /*$form*/ ctx[4].tag);
    			}

    			if (!input2_updating && dirty & /*$form*/ 16) {
    				set_input_value(input2, /*$form*/ ctx[4].index);
    			}

    			input2_updating = false;
    			if (!current || dirty & /*$er*/ 32) set_data_dev(t19, /*$er*/ ctx[5]);
    			const submitbutton_changes = {};
    			if (dirty & /*$isSaving*/ 64) submitbutton_changes.isSaving = /*$isSaving*/ ctx[6];
    			submitbutton.$set(submitbutton_changes);
    			const cancelbutton_changes = {};
    			if (dirty & /*$isSaving*/ 64) cancelbutton_changes.isSaving = /*$isSaving*/ ctx[6];
    			if (dirty & /*key*/ 1) cancelbutton_changes.key = /*key*/ ctx[0];
    			cancelbutton.$set(cancelbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submitbutton.$$.fragment, local);
    			transition_in(cancelbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submitbutton.$$.fragment, local);
    			transition_out(cancelbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(form_1);
    			/*div1_binding*/ ctx[25](null);
    			/*div4_binding*/ ctx[26](null);
    			/*div7_binding*/ ctx[27](null);
    			destroy_component(submitbutton);
    			destroy_component(cancelbutton);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $form;
    	let $mounted;
    	let $ws_connected;
    	let $er;
    	let $binded;
    	let $isSaving;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(18, $ws_connected = $$value));
    	let { key = 0 } = $$props;
    	let { eventsFn = () => 0 } = $$props;

    	const f = new Form(S, key, eventsFn(key, "schema"), createEventDispatcher()),
    		er = f.er,
    		isSaving = f.isSaving,
    		form = f.form,
    		mounted = f.mounted,
    		binded = f.binded;

    	validate_store(binded, "binded");
    	component_subscribe($$self, binded, value => $$invalidate(19, $binded = value));
    	validate_store(mounted, "mounted");
    	component_subscribe($$self, mounted, value => $$invalidate(17, $mounted = value));
    	validate_store(form, "form");
    	component_subscribe($$self, form, value => $$invalidate(4, $form = value));
    	validate_store(isSaving, "isSaving");
    	component_subscribe($$self, isSaving, value => $$invalidate(6, $isSaving = value));
    	validate_store(er, "er");
    	component_subscribe($$self, er, value => $$invalidate(5, $er = value));
    	let jsoneditorformDom = null;
    	let jsoneditorFieldsDom = null;
    	let jsoneditorcolumnsDom = null;
    	let editorform;
    	let editorFields;
    	let editorcolumns;

    	onMount(async () => {
    		const options = { mode: "code", modes: ["code", "tree"] };
    		await import('https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js');
    		await tick();
    		editorform = new JSONEditor(jsoneditorformDom, options, $form.form || ({}));
    		editorFields = new JSONEditor(jsoneditorFieldsDom, options, $form.columns || ({}));
    		editorcolumns = new JSONEditor(jsoneditorcolumnsDom, options, $form.columns || ({}));
    		set_store_value(mounted, $mounted = true);
    	});

    	onDestroy(() => {
    		f.onDestroy();
    	});

    	const funcBindingOnce = () => {
    		if (!$binded) {
    			S.bind$(
    				f.data_evt,
    				d => {
    					f.onFormDataGet(d);

    					if (d[0].r) {
    						editorform.set($form.form || ({}));
    						editorFields.set($form.fields || []);
    						editorcolumns.set($form.columns || []);
    					}
    				},
    				1
    			);

    			f.bindMutate();
    			f.fetch();
    			set_store_value(binded, $binded = true);
    		}
    	};

    	function onSave() {
    		set_store_value(form, $form.form = editorform.get(), $form);
    		set_store_value(form, $form.fields = editorFields.get(), $form);
    		set_store_value(form, $form.columns = editorcolumns.get(), $form);
    		f.onSave();
    	}

    	const writable_props = ["key", "eventsFn"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SchemaForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$form._key = this.value;
    		form.set($form);
    	}

    	function input1_input_handler() {
    		$form.tag = this.value;
    		form.set($form);
    	}

    	function input2_input_handler() {
    		$form.index = to_number(this.value);
    		form.set($form);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, jsoneditorformDom = $$value);
    		});
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, jsoneditorFieldsDom = $$value);
    		});
    	}

    	function div7_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(3, jsoneditorcolumnsDom = $$value);
    		});
    	}

    	function close_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("eventsFn" in $$props) $$invalidate(13, eventsFn = $$props.eventsFn);
    	};

    	$$self.$capture_state = () => {
    		return {
    			key,
    			eventsFn,
    			jsoneditorformDom,
    			jsoneditorFieldsDom,
    			jsoneditorcolumnsDom,
    			editorform,
    			editorFields,
    			editorcolumns,
    			$form,
    			$mounted,
    			$ws_connected,
    			$er,
    			$binded,
    			$isSaving
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("eventsFn" in $$props) $$invalidate(13, eventsFn = $$props.eventsFn);
    		if ("jsoneditorformDom" in $$props) $$invalidate(1, jsoneditorformDom = $$props.jsoneditorformDom);
    		if ("jsoneditorFieldsDom" in $$props) $$invalidate(2, jsoneditorFieldsDom = $$props.jsoneditorFieldsDom);
    		if ("jsoneditorcolumnsDom" in $$props) $$invalidate(3, jsoneditorcolumnsDom = $$props.jsoneditorcolumnsDom);
    		if ("editorform" in $$props) editorform = $$props.editorform;
    		if ("editorFields" in $$props) editorFields = $$props.editorFields;
    		if ("editorcolumns" in $$props) editorcolumns = $$props.editorcolumns;
    		if ("$form" in $$props) form.set($form = $$props.$form);
    		if ("$mounted" in $$props) mounted.set($mounted = $$props.$mounted);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    		if ("$er" in $$props) er.set($er = $$props.$er);
    		if ("$binded" in $$props) binded.set($binded = $$props.$binded);
    		if ("$isSaving" in $$props) isSaving.set($isSaving = $$props.$isSaving);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$form*/ 16) {
    			 set_store_value(form, $form._key = $form._key || "", $form);
    		}

    		if ($$self.$$.dirty & /*$mounted, $ws_connected*/ 393216) {
    			 if ($mounted) {
    				if ($ws_connected) {
    					set_store_value(er, $er = "");
    					funcBindingOnce();
    				} else {
    					set_store_value(er, $er = "Reconnecting...");
    				}
    			}
    		}
    	};

    	return [
    		key,
    		jsoneditorformDom,
    		jsoneditorFieldsDom,
    		jsoneditorcolumnsDom,
    		$form,
    		$er,
    		$isSaving,
    		er,
    		isSaving,
    		form,
    		mounted,
    		binded,
    		onSave,
    		eventsFn,
    		editorform,
    		editorFields,
    		editorcolumns,
    		$mounted,
    		$ws_connected,
    		$binded,
    		f,
    		funcBindingOnce,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		div1_binding,
    		div4_binding,
    		div7_binding,
    		close_handler
    	];
    }

    class SchemaForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$l, safe_not_equal, { key: 0, eventsFn: 13 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SchemaForm",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get key() {
    		throw new Error("<SchemaForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<SchemaForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventsFn() {
    		throw new Error("<SchemaForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventsFn(value) {
    		throw new Error("<SchemaForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/global/TranslationForm.svelte generated by Svelte v3.16.7 */
    const file$h = "src/global/TranslationForm.svelte";

    function create_fragment$m(ctx) {
    	let link;
    	let t0;
    	let form_1;
    	let label;
    	let span;
    	let t2;
    	let input;
    	let t3;
    	let div3;
    	let div2;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let div4;
    	let t7;
    	let t8;
    	let footer;
    	let t9;
    	let current;
    	let dispose;

    	const submitbutton = new SubmitButton({
    			props: { isSaving: /*$isSaving*/ ctx[4] },
    			$$inline: true
    		});

    	const cancelbutton = new CancelButton({
    			props: {
    				isSaving: /*$isSaving*/ ctx[4],
    				key: /*key*/ ctx[0]
    			},
    			$$inline: true
    		});

    	cancelbutton.$on("close", /*close_handler*/ ctx[20]);

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			form_1 = element("form");
    			label = element("label");
    			span = element("span");
    			span.textContent = "Key";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Object:";
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			div4 = element("div");
    			t7 = text(/*$er*/ ctx[3]);
    			t8 = space();
    			footer = element("footer");
    			create_component(submitbutton.$$.fragment);
    			t9 = space();
    			create_component(cancelbutton.$$.fragment);
    			attr_dev(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "type", "text/css");
    			add_location(link, file$h, 43, 4, 1403);
    			add_location(span, file$h, 47, 4, 1595);
    			attr_dev(input, "name", "key");
    			attr_dev(input, "type", "text");
    			input.required = true;
    			add_location(input, file$h, 48, 4, 1616);
    			add_location(label, file$h, 46, 2, 1583);
    			add_location(div0, file$h, 52, 6, 1740);
    			attr_dev(div1, "name", "form");
    			set_style(div1, "width", "1200px");
    			set_style(div1, "height", "400px");
    			add_location(div1, file$h, 53, 6, 1765);
    			add_location(div2, file$h, 51, 4, 1728);
    			set_style(div3, "display", "flex");
    			add_location(div3, file$h, 50, 2, 1695);
    			add_location(div4, file$h, 56, 2, 1875);
    			add_location(footer, file$h, 57, 2, 1894);
    			add_location(form_1, file$h, 45, 0, 1540);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[18]),
    				listen_dev(form_1, "submit", prevent_default(/*onSave*/ ctx[10]), false, true, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, label);
    			append_dev(label, span);
    			append_dev(label, t2);
    			append_dev(label, input);
    			set_input_value(input, /*$form*/ ctx[2]._key);
    			append_dev(form_1, t3);
    			append_dev(form_1, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[19](div1);
    			append_dev(form_1, t6);
    			append_dev(form_1, div4);
    			append_dev(div4, t7);
    			append_dev(form_1, t8);
    			append_dev(form_1, footer);
    			mount_component(submitbutton, footer, null);
    			append_dev(footer, t9);
    			mount_component(cancelbutton, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$form*/ 4 && input.value !== /*$form*/ ctx[2]._key) {
    				set_input_value(input, /*$form*/ ctx[2]._key);
    			}

    			if (!current || dirty & /*$er*/ 8) set_data_dev(t7, /*$er*/ ctx[3]);
    			const submitbutton_changes = {};
    			if (dirty & /*$isSaving*/ 16) submitbutton_changes.isSaving = /*$isSaving*/ ctx[4];
    			submitbutton.$set(submitbutton_changes);
    			const cancelbutton_changes = {};
    			if (dirty & /*$isSaving*/ 16) cancelbutton_changes.isSaving = /*$isSaving*/ ctx[4];
    			if (dirty & /*key*/ 1) cancelbutton_changes.key = /*key*/ ctx[0];
    			cancelbutton.$set(cancelbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submitbutton.$$.fragment, local);
    			transition_in(cancelbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submitbutton.$$.fragment, local);
    			transition_out(cancelbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(form_1);
    			/*div1_binding*/ ctx[19](null);
    			destroy_component(submitbutton);
    			destroy_component(cancelbutton);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $form;
    	let $mounted;
    	let $ws_connected;
    	let $er;
    	let $binded;
    	let $isSaving;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(14, $ws_connected = $$value));
    	let { key = 0 } = $$props;
    	let { eventsFn = () => 0 } = $$props;

    	const f = new Form(S, key, eventsFn(key, "translation"), createEventDispatcher()),
    		er = f.er,
    		isSaving = f.isSaving,
    		form = f.form,
    		mounted = f.mounted,
    		binded = f.binded;

    	validate_store(binded, "binded");
    	component_subscribe($$self, binded, value => $$invalidate(15, $binded = value));
    	validate_store(mounted, "mounted");
    	component_subscribe($$self, mounted, value => $$invalidate(13, $mounted = value));
    	validate_store(form, "form");
    	component_subscribe($$self, form, value => $$invalidate(2, $form = value));
    	validate_store(isSaving, "isSaving");
    	component_subscribe($$self, isSaving, value => $$invalidate(4, $isSaving = value));
    	validate_store(er, "er");
    	component_subscribe($$self, er, value => $$invalidate(3, $er = value));
    	let jsoneditorformDom = null;
    	let editorform;

    	onMount(async () => {
    		const options = { mode: "code", modes: ["code", "tree"] };
    		await import('https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js');
    		await tick();
    		editorform = new JSONEditor(jsoneditorformDom, options, $form.form || ({}));
    		set_store_value(mounted, $mounted = true);
    	});

    	onDestroy(() => {
    		f.onDestroy();
    	});

    	const funcBindingOnce = () => {
    		if (!$binded) {
    			S.bind$(
    				f.data_evt,
    				d => {
    					f.onFormDataGet(d);

    					if (d[0].r) {
    						editorform.set($form.form || ({}));
    					}
    				},
    				1
    			);

    			f.bindMutate();
    			f.fetch();
    			set_store_value(binded, $binded = true);
    		}
    	};

    	function onSave() {
    		set_store_value(form, $form = editorform.get());
    		f.onSave();
    	}

    	const writable_props = ["key", "eventsFn"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TranslationForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$form._key = this.value;
    		form.set($form);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, jsoneditorformDom = $$value);
    		});
    	}

    	function close_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("eventsFn" in $$props) $$invalidate(11, eventsFn = $$props.eventsFn);
    	};

    	$$self.$capture_state = () => {
    		return {
    			key,
    			eventsFn,
    			jsoneditorformDom,
    			editorform,
    			$form,
    			$mounted,
    			$ws_connected,
    			$er,
    			$binded,
    			$isSaving
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("key" in $$props) $$invalidate(0, key = $$props.key);
    		if ("eventsFn" in $$props) $$invalidate(11, eventsFn = $$props.eventsFn);
    		if ("jsoneditorformDom" in $$props) $$invalidate(1, jsoneditorformDom = $$props.jsoneditorformDom);
    		if ("editorform" in $$props) editorform = $$props.editorform;
    		if ("$form" in $$props) form.set($form = $$props.$form);
    		if ("$mounted" in $$props) mounted.set($mounted = $$props.$mounted);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    		if ("$er" in $$props) er.set($er = $$props.$er);
    		if ("$binded" in $$props) binded.set($binded = $$props.$binded);
    		if ("$isSaving" in $$props) isSaving.set($isSaving = $$props.$isSaving);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$form*/ 4) {
    			 set_store_value(form, $form._key = $form._key || "", $form);
    		}

    		if ($$self.$$.dirty & /*$mounted, $ws_connected*/ 24576) {
    			 if ($mounted) {
    				if ($ws_connected) {
    					set_store_value(er, $er = "");
    					funcBindingOnce();
    				} else {
    					set_store_value(er, $er = "Reconnecting...");
    				}
    			}
    		}
    	};

    	return [
    		key,
    		jsoneditorformDom,
    		$form,
    		$er,
    		$isSaving,
    		er,
    		isSaving,
    		form,
    		mounted,
    		binded,
    		onSave,
    		eventsFn,
    		editorform,
    		$mounted,
    		$ws_connected,
    		$binded,
    		f,
    		funcBindingOnce,
    		input_input_handler,
    		div1_binding,
    		close_handler
    	];
    }

    class TranslationForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$m, safe_not_equal, { key: 0, eventsFn: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TranslationForm",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get key() {
    		throw new Error("<TranslationForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<TranslationForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventsFn() {
    		throw new Error("<TranslationForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventsFn(value) {
    		throw new Error("<TranslationForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* process events from database:
    //sample
    export const schemaEvents = (id=0) => {
      const ev = [
          [et.subscribe, e.e_global, e.schema_header],
          [et.subscribe, e.e_global, e.schema_list],
          [et.mutate, e.e_global, e.schema_mutate],
        ]
      return  R.map(x=>{x.push(id); return x}, ev)
    }
    const processEvent = (id, evt) => {
      evt[0] = et[evt[0]]
      evt[1] = e[evt[1]]
      evt[2] = e[evt[2]]
      evt.push(id)
      return evt
    }
    export const schemaEvents2 = (id=0, schema) => {
      return R.map(R.curry(processEvent)(id), schema)
    }
    */
    // generate event from schema:
    const schemaEvents = (id=0, schema) => {
      const h = events[`${schema}_header`];
      let e0 = 0;
      if(h > 49 && h < 100){
        e0 = events.e_global;
      } else if (h > 100 && h < 200) {
        e0 = events.account;
      } else if (h > 200 && h < 300) {
        e0 = events.admin;
      } else if (h > 300 && h < 400) {
        e0 = events.my;
      }
      return [
          [event_type.subscribe, e0, h, id],
          [event_type.subscribe, e0, events[`${schema}_list`], id],
          [event_type.mutate, e0, events[`${schema}_mutate`], id],
        ]
    };

    const tableOptions = {
      schema: {
        title: 'schema_title',
        table: {
          eventsFn: schemaEvents,
          customFilter: {},
          modelcomponent: SchemaForm,
          quickcomponent: SchemaForm,
          schema_key: 'schema'
          // object form
        }
      },
      translation: {
        title: 'translation_title',
        table: {
          eventsFn: schemaEvents,
          customFilter: {},
          modelcomponent: TranslationForm,
          quickcomponent: TranslationForm,
          schema_key: 'translation'
          // object form
        }
      },
    };

    const getTableOptions =  (query = {}) => { 
      const schema_key = query.page || query.table || query;
      const o = tableOptions[schema_key];
      if (o) {
        o.table.query = query;
        return o
      } else {
        // user, session, note, confirm, org, 
        return {
        title: 'genaric',
        table: {
          eventsFn: schemaEvents,
          customFilter: {},
          modelcomponent: Index,
          quickcomponent: Index,
          schema_key,
          query
        }
      }
      }
    };

    /* src/Page.svelte generated by Svelte v3.16.7 */
    const file$i = "src/Page.svelte";

    // (41:2) {#if subtitle}
    function create_if_block$b(ctx) {
    	let div;
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t = text(/*subtitle*/ ctx[2]);
    			add_location(h2, file$i, 42, 4, 1073);
    			add_location(div, file$i, 41, 2, 1063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 4) set_data_dev(t, /*subtitle*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(41:2) {#if subtitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let title_value;
    	let t0;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	document.title = title_value = /*title*/ ctx[1];
    	let if_block = /*subtitle*/ ctx[2] && create_if_block$b(ctx);
    	const table_spread_levels = [/*options*/ ctx[0].table];
    	let table_props = {};

    	for (let i = 0; i < table_spread_levels.length; i += 1) {
    		table_props = assign(table_props, table_spread_levels[i]);
    	}

    	const table = new Table({ props: table_props, $$inline: true });

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			create_component(table.$$.fragment);
    			add_location(h1, file$i, 38, 4, 1018);
    			add_location(div0, file$i, 37, 2, 1008);
    			add_location(div1, file$i, 36, 2, 1000);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t3);
    			mount_component(table, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*title*/ 2) && title_value !== (title_value = /*title*/ ctx[1])) {
    				document.title = title_value;
    			}

    			if (!current || dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);

    			if (/*subtitle*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(div1, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const table_changes = (dirty & /*options*/ 1)
    			? get_spread_update(table_spread_levels, [get_spread_object(/*options*/ ctx[0].table)])
    			: {};

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $translation;
    	validate_store(translation, "translation");
    	component_subscribe($$self, translation, $$value => $$invalidate(5, $translation = $$value));
    	let { currentRoute } = $$props;
    	let options = {};
    	let schema_key = "";
    	const writable_props = ["currentRoute"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Page> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(3, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => {
    		return {
    			currentRoute,
    			options,
    			schema_key,
    			title,
    			$translation,
    			subtitle
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(3, currentRoute = $$props.currentRoute);
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("schema_key" in $$props) $$invalidate(4, schema_key = $$props.schema_key);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("$translation" in $$props) translation.set($translation = $$props.$translation);
    		if ("subtitle" in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    	};

    	let title;
    	let subtitle;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentRoute, schema_key*/ 24) {
    			 {
    				if (currentRoute.params && currentRoute.params.table) {
    					$$invalidate(4, schema_key = currentRoute.params.table);
    					$$invalidate(0, options = getTableOptions(schema_key));
    				} else {
    					$$invalidate(4, schema_key = currentRoute.namedParams.table || "");
    					$$invalidate(0, options = getTableOptions(schema_key));
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*schema_key, $translation*/ 48) {
    			 $$invalidate(1, title = view(lensPath([schema_key, "title"]), $translation));
    		}

    		if ($$self.$$.dirty & /*schema_key, $translation*/ 48) {
    			 $$invalidate(2, subtitle = view(lensPath([schema_key, "subtitle"]), $translation));
    		}
    	};

    	return [options, title, subtitle, currentRoute];
    }

    class Page extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$n, safe_not_equal, { currentRoute: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[3] === undefined && !("currentRoute" in props)) {
    			console.warn("<Page> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Page>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Page>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$j = "src/App.svelte";

    // (126:1) {#if menus.navData}
    function create_if_block_3$2(ctx) {
    	let current;

    	const menuf = new MenuF({
    			props: { menu: /*menus*/ ctx[1].navData.account },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menuf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuf, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuf_changes = {};
    			if (dirty & /*menus*/ 2) menuf_changes.menu = /*menus*/ ctx[1].navData.account;
    			menuf.$set(menuf_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(126:1) {#if menus.navData}",
    		ctx
    	});

    	return block;
    }

    // (130:1) {#if menus.navData}
    function create_if_block_2$5(ctx) {
    	let current;

    	const menuf = new MenuF({
    			props: { menu: /*menus*/ ctx[1].navData.global },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menuf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuf, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuf_changes = {};
    			if (dirty & /*menus*/ 2) menuf_changes.menu = /*menus*/ ctx[1].navData.global;
    			menuf.$set(menuf_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(130:1) {#if menus.navData}",
    		ctx
    	});

    	return block;
    }

    // (134:1) {#if menus.navData}
    function create_if_block_1$7(ctx) {
    	let current;

    	const menuf = new MenuF({
    			props: { menu: /*menus*/ ctx[1].navData.admin },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menuf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuf, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuf_changes = {};
    			if (dirty & /*menus*/ 2) menuf_changes.menu = /*menus*/ ctx[1].navData.admin;
    			menuf.$set(menuf_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(134:1) {#if menus.navData}",
    		ctx
    	});

    	return block;
    }

    // (139:0) {#if routes.length}
    function create_if_block$c(ctx) {
    	let current;

    	const router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*routes*/ 1) router_changes.routes = /*routes*/ ctx[0];
    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(139:0) {#if routes.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let t0;
    	let nav;
    	let div;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let if_block3_anchor;
    	let current;
    	const css = new Css({ $$inline: true });
    	let if_block0 = /*menus*/ ctx[1].navData && create_if_block_3$2(ctx);
    	let if_block1 = /*menus*/ ctx[1].navData && create_if_block_2$5(ctx);
    	let if_block2 = /*menus*/ ctx[1].navData && create_if_block_1$7(ctx);
    	let if_block3 = /*routes*/ ctx[0].length && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			create_component(css.$$.fragment);
    			t0 = space();
    			nav = element("nav");
    			div = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$j, 121, 2, 3908);
    			attr_dev(a1, "href", "/about");
    			add_location(a1, file$j, 122, 2, 3931);
    			add_location(div, file$j, 120, 1, 3900);
    			add_location(nav, file$j, 119, 0, 3893);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(css, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, a0);
    			append_dev(div, t2);
    			append_dev(div, a1);
    			append_dev(nav, t4);
    			if (if_block0) if_block0.m(nav, null);
    			append_dev(nav, t5);
    			if (if_block1) if_block1.m(nav, null);
    			append_dev(nav, t6);
    			if (if_block2) if_block2.m(nav, null);
    			insert_dev(target, t7, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menus*/ ctx[1].navData) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(nav, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*menus*/ ctx[1].navData) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_2$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(nav, t6);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*menus*/ ctx[1].navData) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    					transition_in(if_block2, 1);
    				} else {
    					if_block2 = create_if_block_1$7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(nav, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*routes*/ ctx[0].length) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    					transition_in(if_block3, 1);
    				} else {
    					if_block3 = create_if_block$c(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(css.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(css.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(css, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t7);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function isLoggedIn$1() {
    	const auth = await isLoggedIn(S);
    	return auth.ok;
    }

    async function isNotLoggedIn() {
    	const auth = await isLoggedIn(S);
    	console.log(!auth.ok);
    	return !auth.ok;
    }

    function userIsAdmin() {
    	return true;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $ws_connected;
    	validate_store(ws_connected, "ws_connected");
    	component_subscribe($$self, ws_connected, $$value => $$invalidate(5, $ws_connected = $$value));
    	let mounted = false;
    	let er = "";
    	let binded = false;
    	const menu_form_evt = form_schema_evt(9999);
    	const menu_evt = [event_type.get, events.my, events.form_schema_get, 8888];
    	let routes = [];
    	let menus = [];

    	onMount(() => {
    		$$invalidate(2, mounted = true);
    	});

    	onDestroy(() => {
    		S.unbind_([menu_form_evt, menu_evt]);
    	});

    	const funcBindingOnce = () => {
    		if (!binded) {
    			S.bind$(
    				menu_form_evt,
    				d => {
    					if (d[0].length && d[0][0].routes) {
    						$$invalidate(0, routes = map(x => modifyObj(x), d[0][0].routes));
    					}
    				},
    				1
    			);

    			S.bind$(
    				menu_evt,
    				d => {
    					if (d[0].length && d[0][0]) {
    						$$invalidate(1, menus = d[0][0]);
    					}
    				},
    				1
    			);

    			binded = true;
    			S.trigger([[menu_form_evt, ["routes"]], [menu_evt, ["menu"]]]);
    		}
    	};

    	const modifyComp = (key, obj) => {
    		switch (obj[key]) {
    			case "PublicLayout":
    				obj[key] = Layout;
    				break;
    			case "AdminLayout":
    				obj[key] = Layout$1;
    				break;
    			case "Register":
    				obj[key] = Register;
    				break;
    			case "Login":
    				obj[key] = Login;
    				break;
    			case "Logout":
    				obj[key] = Logout;
    				break;
    			case "AdminIndex":
    				obj[key] = Admin;
    				break;
    			case "EmployeesIndex":
    				obj[key] = Employees;
    				break;
    			case "Confirm":
    				obj[key] = Confirm;
    				break;
    			case "Page":
    				obj[key] = Page;
    				break;
    		}

    		return obj;
    	};

    	const modifyGuard = obj => {
    		if (obj.onlyIf) {
    			switch (obj.onlyIf.guard) {
    				case "userIsAdmin":
    					obj.onlyIf.guard = userIsAdmin;
    					break;
    				case "isNotLoggedIn":
    					obj.onlyIf.guard = isNotLoggedIn;
    					break;
    				case "isLoggedIn":
    					obj.onlyIf.guard = isLoggedIn$1;
    					break;
    			}
    		}

    		return obj;
    	};

    	const modifyObj = obj => {
    		obj = modifyComp("component", obj);
    		obj = modifyComp("layout", obj);
    		obj = modifyGuard(obj);

    		if (obj.nestedRoutes) {
    			obj.nestedRoutes = map(x => modifyObj(x), obj.nestedRoutes);
    		}

    		return obj;
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("mounted" in $$props) $$invalidate(2, mounted = $$props.mounted);
    		if ("er" in $$props) er = $$props.er;
    		if ("binded" in $$props) binded = $$props.binded;
    		if ("routes" in $$props) $$invalidate(0, routes = $$props.routes);
    		if ("menus" in $$props) $$invalidate(1, menus = $$props.menus);
    		if ("$ws_connected" in $$props) ws_connected.set($ws_connected = $$props.$ws_connected);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mounted, $ws_connected*/ 36) {
    			 if (mounted) {
    				if ($ws_connected) {
    					er = "";
    					funcBindingOnce();
    				} else {
    					er = "Reconnecting...";
    				}
    			}
    		}
    	};

    	return [routes, menus];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=index.js.map
