// folder contains electron setup
const SETUP_DIR = 'out/setup';
// folder contains dist file for electron(main & renderer)
const OUTPUT_DIR = 'out/dist';
// entry file for electron
const ENTRY_FILE = 'index.js';
const ENTRY_PATH = `src/main/${ENTRY_FILE}`;
// install file
const INSTALLER_DIR = 'out/installer';

module.exports = { SETUP_DIR, OUTPUT_DIR, ENTRY_FILE, ENTRY_PATH, INSTALLER_DIR };
