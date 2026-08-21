const BASE_URL = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    // The API always answers errors as { error, details? }, so surface both:
    // the details array is what tells the user which field was wrong.
    const message = payload?.error ?? `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload?.details;
    throw error;
  }

  return payload;
}

export const api = {
  getApplications: ({ stage, search } = {}) => {
    const params = new URLSearchParams();
    if (stage && stage !== 'all') params.set('stage', stage);
    if (search?.trim()) params.set('search', search.trim());
    const query = params.toString();
    return request(`/applications${query ? `?${query}` : ''}`);
  },
  getApplication: (id) => request(`/applications/${id}`),
  createApplication: (body) =>
    request('/applications', { method: 'POST', body: JSON.stringify(body) }),
  updateApplication: (id, body) =>
    request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
  getApplicationInterviews: (id) => request(`/applications/${id}/interviews`),
  getCompanies: () => request('/companies'),
  getCompanyApplications: (id) => request(`/companies/${id}/applications`),
  getPipelineStats: () => request('/stats/pipeline')
};
