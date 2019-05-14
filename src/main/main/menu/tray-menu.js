import { ipcMain } from 'electron';

export const separator = {
  type : 'separator',
};

export const showAppWindow = {
  label : 'Display main panel',
  i18n  : 'showWindow',
  id    : 'show-app-window',
};

export const quit = {
  label : 'Quit',
  i18n  : 'quit',
  id    : 'quit',
};

export const joinConference = {
  label : 'Meet now',
  i18n  : 'joinConference',
  id    : 'join-conference',
};

export const logout = {
  label : 'Log out',
  i18n  : 'logout',
  id    : 'logout',
};

export const language = {
  label   : 'Language',
  i18n    : 'language',
  id      : 'language',
  submenu : [
    {
      label   : '中文',
      type    : 'radio',
      id      : 'language',
      checked : false,
      lang    : 'zh',
    },
    {
      label   : 'English',
      type    : 'radio',
      id      : 'language',
      checked : true,
      lang    : 'en',
    },
  ],
};
