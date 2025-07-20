export interface URLParams {
  sessionId?: string;
  quizId?: string;
  mode?: 'host' | 'player';
}

export function parseURL(): URLParams {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    sessionId: urlParams.get('session') || undefined,
    quizId: urlParams.get('quiz') || undefined,
    mode: (urlParams.get('mode') as 'host' | 'player') || undefined
  };
}

export function updateURL(params: URLParams): void {
  const url = new URL(window.location.href);
  
  if (params.sessionId) url.searchParams.set('session', params.sessionId);
  if (params.quizId) url.searchParams.set('quiz', params.quizId);
  if (params.mode) url.searchParams.set('mode', params.mode);
  
  window.history.pushState({}, '', url.toString());
}

export function clearURL(): void {
  window.history.pushState({}, '', window.location.pathname);
}