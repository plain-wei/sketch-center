/**
 * alarmLevel
 * 
 * 0 - critical
 * 1 - error
 * 2 - warn
 * */

/**
 * alarmCode
 * 
 * 480000 ~ 489999 critical
 */

/**
 * alarmType
 * 
 * 0 - process
 * 1 - api
 */

// export function normalizeCode(code, length = 6) {
//   return (Array(length).join('0') + code).slice(-length);
// }

export function normalizeCode(code) {
  return `${480000 + code}`;
}

const ALARM_NAME = {};

ALARM_NAME[ALARM_NAME.MAIN_PROCESS_CRASH = 0] = 'MAIN_PROCESS_CRASH';
ALARM_NAME[ALARM_NAME.GPU_PROCESS_CRASH = 1] = 'GPU_PROCESS_CRASH';
ALARM_NAME[ALARM_NAME.RENDER_PROCESS_CRASH = 2] = 'RENDER_PROCESS_CRASH';
ALARM_NAME[ALARM_NAME.CONFERENCE_CONNECT_ERROR = 3] = 'CONFERENCE_CONNECT_ERROR';
ALARM_NAME[ALARM_NAME.CONFERENCE_ABRUPT_ERROR = 4] = 'CONFERENCE_ABRUPT_ERROR';
ALARM_NAME[ALARM_NAME.CONFERENCE_CONTROL_API_ERROR = 5] = 'CONFERENCE_CONTROL_API_ERROR';
ALARM_NAME[ALARM_NAME.CONTACT_API_ERROR = 6] = 'CONTACT_API_ERROR';
ALARM_NAME[ALARM_NAME.SCHEDULE_API_ERROR = 7] = 'SCHEDULE_API_ERROR';

export { ALARM_NAME };

const ALARM_TYPE = {};

ALARM_TYPE[ALARM_TYPE.PROCESS_ERROR = 0] = 'PROCESS';
ALARM_TYPE[ALARM_TYPE.API_ERROR = 1] = 'API';

export { ALARM_TYPE };

const ALARM_LEVEL = {};

ALARM_LEVEL[ALARM_LEVEL.CRITICAL = 0] = 'CRITICAL';
ALARM_LEVEL[ALARM_LEVEL.ERROR = 1] = 'ERROR';
ALARM_LEVEL[ALARM_LEVEL.WARN = 2] = 'WARN';

export { ALARM_LEVEL };

export function getAlarm(name, desc = '') {
  let alarmCode = '';

  let alarmName = '';

  let alarmLevel = ALARM_LEVEL.WARN;

  let alarmType = ALARM_TYPE.PROCESS_ERROR;

  const alarmDesc = desc || ALARM_NAME[name];
  const alarmTime = Date.now();

  switch (name) {
    case ALARM_NAME.MAIN_PROCESS_CRASH:
      alarmLevel = ALARM_LEVEL.CRITICAL;
      alarmType = ALARM_TYPE.PROCESS_ERROR;
      break;
    case ALARM_NAME.GPU_PROCESS_CRASH:
      alarmLevel = ALARM_LEVEL.CRITICAL;
      alarmType = ALARM_TYPE.PROCESS_ERROR;
      break;
    case ALARM_NAME.RENDER_PROCESS_CRASH:
      alarmLevel = ALARM_LEVEL.CRITICAL;
      alarmType = ALARM_TYPE.PROCESS_ERROR;
      break;
    case ALARM_NAME.CONFERENCE_CONNECT_ERROR:
      alarmLevel = ALARM_LEVEL.ERROR;
      alarmType = ALARM_TYPE.API_ERROR;
      break;
    case ALARM_NAME.CONFERENCE_ABRUPT_ERROR:
      alarmLevel = ALARM_LEVEL.ERROR;
      alarmType = ALARM_TYPE.API_ERROR;
      break;
    case ALARM_NAME.CONFERENCE_CONTROL_API_ERROR:
      alarmLevel = ALARM_LEVEL.ERROR;
      alarmType = ALARM_TYPE.API_ERROR;
      break;
    case ALARM_NAME.CONTACT_API_ERROR:
      alarmLevel = ALARM_LEVEL.ERROR;
      alarmType = ALARM_TYPE.API_ERROR;
      break;
    case ALARM_NAME.SCHEDULE_API_ERROR:
      alarmLevel = ALARM_LEVEL.ERROR;
      alarmType = ALARM_TYPE.API_ERROR;
      break;
    default:
      break;
  }

  alarmCode = normalizeCode(name);
  alarmName = ALARM_NAME[name];

  return {
    alarmCode,
    alarmName,
    alarmLevel,
    alarmType,
    alarmDesc,
    alarmTime,
  };
}
