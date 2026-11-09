document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '☰';
  }));
  const date = document.querySelector('input[name="date"]');
  if (date) {
    const today = new Date();
    date.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const form = document.getElementById('booking-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const message = document.getElementById('form-message');
    button.disabled = true;
    button.textContent = 'SENDING REQUEST…';
    message.textContent = '';
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your request.');
      message.textContent = 'Thank you! Your reservation request has been received. Our team will contact you to confirm.';
      form.reset();
      date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    } catch (error) {
      message.textContent = error.message || 'Something went wrong. Please call us to make your reservation.';
    } finally {
      button.disabled = false;
      button.innerHTML = 'REQUEST MY TABLE <span>↗</span>';
    }
  });
});