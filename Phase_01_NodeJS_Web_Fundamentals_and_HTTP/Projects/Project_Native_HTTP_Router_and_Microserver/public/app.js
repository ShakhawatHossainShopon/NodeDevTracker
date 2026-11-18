const resStatus = document.getElementById('res-status');
const resLatency = document.getElementById('res-latency');
const resBody = document.getElementById('res-body');

async function testRequest(url, options = {}) {
  const start = performance.now();
  resStatus.textContent = 'Requesting...';
  resStatus.style.color = '#eab308';
  resBody.textContent = 'Awaiting server response...';

  try {
    const res = await fetch(url, options);
    const duration = Math.round(performance.now() - start);
    resLatency.textContent = `${duration} ms`;
    resStatus.textContent = `${res.status} ${res.statusText}`;
    resStatus.style.color = res.ok ? '#16a34a' : '#dc2626';

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      resBody.textContent = JSON.stringify(data, null, 2);
    } else {
      const text = await res.text();
      resBody.textContent = text;
    }
  } catch (err) {
    resStatus.textContent = 'Fetch Error';
    resStatus.style.color = '#dc2626';
    resBody.textContent = `Client network error: ${err.message}`;
  }
}

document.getElementById('btn-status').addEventListener('click', () => {
  testRequest('/api/status');
});

document.getElementById('btn-users').addEventListener('click', () => {
  testRequest('/api/users');
});

document.getElementById('btn-user-id').addEventListener('click', () => {
  testRequest('/api/users/1');
});

document.getElementById('btn-search').addEventListener('click', () => {
  testRequest('/api/search?q=developer&limit=3');
});

document.getElementById('btn-post-user').addEventListener('click', () => {
  const randomId = Math.floor(Math.random() * 900) + 100;
  testRequest('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Engineer #${randomId}`,
      email: `engineer${randomId}@example.com`
    })
  });
});
