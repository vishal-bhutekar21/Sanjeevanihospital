/**
 * Browser alerts for staff reminders (salary days, licence renewals...).
 * Works without a server: while the admin panel is open in a tab, reminders
 * that are due today or overdue pop up as system notifications, once per
 * reminder per day. Push alerts to phones (Firebase Cloud Messaging) come
 * with the backend; see documentation/08-notifications-plan.md.
 */

import { loadStaffData, todayIso } from './staffStore';

const SENT_KEY = 'hospital-admin-staff-alerted-v1';

export const alertsSupported = () => typeof window !== 'undefined' && 'Notification' in window;

export const alertsPermission = (): NotificationPermission | 'unsupported' =>
  alertsSupported() ? Notification.permission : 'unsupported';

export async function enableAlerts(): Promise<NotificationPermission | 'unsupported'> {
  if (!alertsSupported()) return 'unsupported';
  const result = await Notification.requestPermission();
  if (result === 'granted') notifyDueReminders();
  return result;
}

/** Show one alert per due reminder per day. Returns how many were shown. */
export function notifyDueReminders(): number {
  if (alertsPermission() !== 'granted') return 0;
  const today = todayIso();
  let sent: Record<string, string> = {};
  try {
    sent = JSON.parse(localStorage.getItem(SENT_KEY) || '{}');
  } catch {
    sent = {};
  }
  const due = loadStaffData().reminders.filter((r) => !r.done && r.dueDate <= today && sent[r.id] !== today);
  for (const r of due) {
    try {
      new Notification(r.dueDate < today ? `Overdue: ${r.title}` : `Due today: ${r.title}`, {
        body: [r.employeeName, r.note].filter(Boolean).join(' · ') || 'Open Staff → Reminders to mark it done.',
        tag: `staff-reminder-${r.id}`,
        icon: '/logo.png',
      });
      sent[r.id] = today;
    } catch {
      // Some mobile browsers only allow alerts from a service worker
      return 0;
    }
  }
  try {
    localStorage.setItem(SENT_KEY, JSON.stringify(sent));
  } catch {
    /* alerts may repeat next time; harmless */
  }
  return due.length;
}
