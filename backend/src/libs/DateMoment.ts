import moment from 'moment-timezone';

export function getTransDate(): string {
  return moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
}
