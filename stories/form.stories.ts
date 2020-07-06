import { action } from '@storybook/addon-actions';

import { showDebug } from '../src/components/UI/debug';
showDebug.set(true)

import SubmitButton from '../src/components/form/SubmitButton.svelte'
import CancelButton from '../src/components/form/CancelButton.svelte'
import TableForm from '../src/components/form/tableform/App.svelte'
import Form from '../src/components/form/Index.svelte'
import Label from '../src/components/form/Label.svelte'

export default {
  title: 'Form',
  //component: SubmitButton,
};

export const SubmitButton_ = () => ({ Component: SubmitButton, props: {}, on: {click: action('clicked')}, })
export const CancelButton_ = () => ({ Component: CancelButton, props: {}, on: {close: action('clicked')}, })
export const TableForm_ = () => ({ Component: TableForm, props: {}, on: {click: action('clicked')}, })
export const SignUpForm_ = () => {
    const props = {
        t: ["signup"],
        b: ["signup2"],
        key: null,
        schema_key: "register",
        form: ["", "", ""],
        fetchConfig: {type: 4, project: null},
        buttonlabels: {save: "Sign up"},
        selector: [],
        headerSchema: [],
        showdbg: true
    }
    return { Component: Form, props, on: {click: action('clicked')}, }}
export const Label_ = () => { const props = { name: "MyLabel" }; return { Component: Label, props};}