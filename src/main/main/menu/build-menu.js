import { ipcMain, MenuItem, Menu } from 'electron';
import { $t, getLanguage } from '../language';


function emit(name) {
  return (menuItem, window) => {
    if (window) {
      window.webContents.send('menu-event', { name });
    }
    else {
      ipcMain.emit('menu-event', { name, menuItem });
    }
  };
}

function genTemplate(options, lang) {
  options.label = $t(options.i18n, lang) || options.label;

  if (options.checked != null) options.checked = options.lang === lang;

  return {
    ...options,
    click : options.click || (options.role ? null : emit(options.id)),
  };
}


export function buildTemplate(options, language) {
  const template = genTemplate(options, language);

  if (template.submenu) {
    template.submenu = template.submenu.map((temp) => buildTemplate(temp, language));
  }

  return template;
}

export function buildMenuItem(options, language) {
  return new MenuItem(buildTemplate(options, language));
}

export async function buildMenu(template = [], language) {
  if (!language) language = await getLanguage();

  const menuItems = [];

  template.forEach((options) => {
    menuItems.push(
      buildMenuItem(options, language)
    );
  });

  const menu = new Menu();

  menuItems.forEach((x) => menu.append(x));

  return menu;
}
