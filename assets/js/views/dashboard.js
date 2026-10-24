/* Home: one clear next step, with progress kept in view. */
import { t } from '../core/i18n.js';
import { goalForToday } from '../core/store.js';
import { pct } from '../core/utils.js';

export function renderDashboard(host) {
  const goal = goalForToday();
  const progress = pct(goal.done, goal.target);
  const circumference = 2 * Math.PI * 58;
  const offset = circumference * (1 - progress / 100);

  document.body.classList.add('home-focus-mode');
  host.innerHTML = `
    <section class="dashboard-home" aria-labelledby="dashboardTitle">
      <p class="dashboard-home__greeting">${t('dash.welcome')}</p>
      <h1 id="dashboardTitle">${t('dash.homePrompt')}</h1>
      <div class="dashboard-home__progress" role="progressbar" aria-label="${t('dash.todayProgress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
        <svg viewBox="0 0 140 140" aria-hidden="true">
          <circle class="dashboard-home__track" cx="70" cy="70" r="58"></circle>
          <circle class="dashboard-home__arc" cx="70" cy="70" r="58" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <span class="dashboard-home__value">${progress}%</span>
        <span class="dashboard-home__caption">${t('dash.todayProgress')}</span>
      </div>
      <a class="dashboard-home__start" href="#/drill?mode=goal">${t('dash.startLearning')}<span aria-hidden="true">↗</span></a>
    </section>
  `;
}
