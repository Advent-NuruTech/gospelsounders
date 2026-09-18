const STORAGE_KEY = "gs_admin_login_attempts";
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

interface AttemptState {
  count: number;
  firstAttemptAt: number;
  lockUntil: number;
}

export interface LoginThrottleState {
  locked: boolean;
  remainingAttempts: number;
  lockUntil: number;
}

function emptyState(now: number): AttemptState {
  return {
    count: 0,
    firstAttemptAt: now,
    lockUntil: 0,
  };
}

function readState(now = Date.now()): AttemptState {
  if (typeof window === "undefined") return emptyState(now);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState(now);

    const parsed = JSON.parse(raw) as Partial<AttemptState>;
    const state = {
      count: Number(parsed.count) || 0,
      firstAttemptAt: Number(parsed.firstAttemptAt) || now,
      lockUntil: Number(parsed.lockUntil) || 0,
    };

    if (state.lockUntil && state.lockUntil <= now) {
      clearLoginAttempts();
      return emptyState(now);
    }

    if (!state.lockUntil && now - state.firstAttemptAt > WINDOW_MS) {
      clearLoginAttempts();
      return emptyState(now);
    }

    return state;
  } catch {
    clearLoginAttempts();
    return emptyState(now);
  }
}

function writeState(state: AttemptState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLoginThrottleState(now = Date.now()): LoginThrottleState {
  const state = readState(now);
  const locked = state.lockUntil > now;

  return {
    locked,
    lockUntil: state.lockUntil,
    remainingAttempts: locked ? 0 : Math.max(MAX_ATTEMPTS - state.count, 0),
  };
}

export function recordFailedLoginAttempt(now = Date.now()): LoginThrottleState {
  const current = readState(now);
  const state =
    now - current.firstAttemptAt > WINDOW_MS && !current.lockUntil
      ? emptyState(now)
      : current;

  const nextCount = state.count + 1;
  const nextState: AttemptState = {
    count: nextCount,
    firstAttemptAt: state.firstAttemptAt || now,
    lockUntil: nextCount >= MAX_ATTEMPTS ? now + WINDOW_MS : 0,
  };

  writeState(nextState);
  return getLoginThrottleState(now);
}

export function clearLoginAttempts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function formatLockout(lockUntil: number, now = Date.now()) {
  const remainingMs = Math.max(lockUntil - now, 0);
  const minutes = Math.max(Math.ceil(remainingMs / 60000), 1);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
