import { t } from '../core/i18n.js';
import { esc, speakBtn } from '../core/utils.js';
import { settings, progress } from '../core/store.js';
import { CONVERSATIONS } from '../data/conversations.js';
import { advanceConversation, answerConversation, getActiveConversation, startConversation } from '../core/conversation-practice.js';
import { pageHead, progressBar, statCard } from './shell.js';

const text = (item, key) => settings.uiLang === 'en' ? item[key] : item[`${key}Ar`] || item[key];

export function renderConversations(host) {
  const totals = progress.conversations || { completed: {}, sessions: 0, turns: 0, correct: 0 };
  let active = getActiveConversation();

  function renderPicker() {
    active = null;
    host.innerHTML = `
      ${pageHead({ icon: '💬', title: t('conversation.title'), subtitle: t('conversation.subtitle') })}
      <div class="conversation-intro card">
        <span class="conversation-intro__icon" aria-hidden="true">🗣️</span>
        <div><h2>${esc(t('conversation.introTitle'))}</h2><p>${esc(t('conversation.introDesc'))}</p><small>🔒 ${esc(t('journey.localOnly'))}</small></div>
      </div>
      <div class="grid grid--3 conversation-scenes">
        ${CONVERSATIONS.map((scene) => {
          const completed = totals.completed?.[scene.id];
          return `<button class="conversation-scene card" type="button" data-scene="${scene.id}">
            <span class="conversation-scene__top"><span aria-hidden="true">${scene.icon}</span><span class="chip">${esc(scene.level)}</span></span>
            <b>${esc(text(scene, 'title'))}</b><small>${esc(text(scene, 'context'))}</small>
            <span class="conversation-scene__foot">${scene.turns.length} ${esc(t('conversation.turns'))} · ${completed ? `${esc(t('conversation.best'))}: ${completed.best}/${scene.turns.length}` : esc(t('conversation.new'))}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="grid grid--3 conversation-total">
        ${statCard({ label: t('journey.completedTalks'), value: totals.sessions || 0 })}
        ${statCard({ label: t('journey.questions'), value: totals.turns || 0 })}
        ${statCard({ label: t('stats.accuracy'), value: `${totals.turns ? Math.round((totals.correct / totals.turns) * 100) : 0}%` })}
      </div>`;
    host.querySelectorAll('[data-scene]').forEach((button) => button.addEventListener('click', () => {
      startConversation(button.dataset.scene);
      renderActive();
    }));
  }

  function renderActive() {
    active = getActiveConversation();
    if (!active) return renderPicker();
    const scene = CONVERSATIONS.find((item) => item.id === active.id);
    const turn = scene.turns[active.turn];
    const answer = active.answers[active.turn];
    const selected = answer ? turn.options[answer.optionIndex] : null;
    const pct = Math.round((active.turn / scene.turns.length) * 100);
    host.innerHTML = `
      ${pageHead({
        icon: scene.icon, title: text(scene, 'title'), subtitle: text(scene, 'context'),
        actionsHtml: `<button class="btn btn--sm" type="button" id="conversationExit">${esc(t('common.back'))}</button>`,
      })}
      <section class="conversation-play card" aria-labelledby="conversationPrompt">
        <div class="conversation-play__meta"><span class="chip chip--brand">${esc(scene.level)}</span><span>${active.turn + 1}/${scene.turns.length} ${esc(t('conversation.turns'))}</span><span>${active.correct} ⭐</span></div>
        ${progressBar(pct)}
        <div class="conversation-bubble conversation-bubble--other">
          <small>${esc(t('conversation.partner'))}</small>
          <h2 id="conversationPrompt" lang="en" dir="ltr">${esc(turn.prompt)}</h2>
          <p dir="${settings.uiLang === 'en' ? 'ltr' : 'rtl'}">${esc(text(turn, 'promptAr'))}</p>
          ${speakBtn(turn.prompt)}
        </div>
        ${answer ? `
          <div class="conversation-feedback ${answer.correct ? 'is-correct' : 'is-review'}" role="status" aria-live="polite">
            <b>${answer.correct ? `✓ ${esc(t('conversation.nice'))}` : `↻ ${esc(t('conversation.tryLearn'))}`}</b>
            <div class="conversation-bubble conversation-bubble--you">
              <small>${esc(t('conversation.you'))}</small><p lang="en" dir="ltr">${esc(selected.en)}</p><span>${esc(selected.ar)}</span>${speakBtn(selected.en)}
            </div>
            ${!answer.correct ? `<p>${esc(t('conversation.suggested'))} <b lang="en" dir="ltr">${esc(turn.reply)}</b> <span>${esc(turn.replyAr)}</span>${speakBtn(turn.reply)}</p>` : ''}
          </div>` : `
          <h3 class="conversation-choice-title">${esc(t('conversation.chooseReply'))}</h3>
          <div class="conversation-options" role="group" aria-label="${esc(t('conversation.chooseReply'))}">
            ${turn.options.map((option, index) => `<button class="conversation-option" type="button" data-reply="${index}">
              <span lang="en" dir="ltr">${esc(option.en)}</span><small>${esc(option.ar)}</small>
            </button>`).join('')}
          </div>`}
        ${answer ? `<button class="btn btn--primary conversation-next" type="button" id="conversationNext">${esc(active.turn === scene.turns.length - 1 ? t('conversation.finish') : t('common.next'))} →</button>` : ''}
      </section>`;

    host.querySelectorAll('[data-reply]').forEach((button) => button.addEventListener('click', () => {
      answerConversation(Number(button.dataset.reply));
      renderActive();
    }));
    host.querySelector('#conversationNext')?.addEventListener('click', () => {
      const result = advanceConversation();
      if (result.complete) renderCompleted(scene, result);
      else renderActive();
    });
    host.querySelector('#conversationDone')?.addEventListener('click', renderPicker);
    host.querySelector('#conversationExit')?.addEventListener('click', renderPicker);
  }

  function renderCompleted(scene, result) {
    host.innerHTML = `
      ${pageHead({ icon: scene.icon, title: text(scene, 'title'), subtitle: text(scene, 'context') })}
      <section class="card conversation-finish" aria-live="polite">
        <span aria-hidden="true">🎉</span><h2>${esc(t('conversation.completed'))}</h2>
        <p>${esc(t('conversation.score'))}: <b>${result.score}/${result.total}</b> · ${Math.round((result.score / result.total) * 100)}%</p>
        <p>${esc(t('conversation.localSaved'))}</p>
        <div class="row row--wrap"><button class="btn btn--primary" type="button" id="conversationDone">${esc(t('conversation.chooseAnother'))}</button><a class="btn" href="#/journey">${esc(t('journey.title'))}</a></div>
      </section>`;
    host.querySelector('#conversationDone')?.addEventListener('click', renderPicker);
  }

  if (active) renderActive();
  else renderPicker();
}
