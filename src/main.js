import App from './App.svelte';

// Add links to be analyzed
const urls = [
  '',
];

const app = new App({
  target: document.body,
  props: { urls },
});
