/**
 * Client-side message singleton.
 *
 * `I18nProvider` calls `messageStore.init()` synchronously during every
 * render, ensuring that `translate()` always reflects the current locale
 * before any children paint — no async delay, no flash of untranslated keys.
 */

type Messages = Record<string, unknown>;

let _locale: string = "en";
let _messages: Messages = {};

export const messageStore = {
  init(locale: string, messages: Messages) {
    _locale = locale;
    _messages = messages;
  },
  get locale() {
    return _locale;
  },
  get messages() {
    return _messages;
  },
};
