/**
 * P9 Fitness & Gym — Interactive Application Script
 * Location: Elite Colossal Building, FC Road, Shivajinagar, Pune
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveGymStatus();
  initPopularTimes();
  initEquipmentFilter();
  initReviewsFilter();
  initBmiCalculator();
  initTrialModal();
  initMobileNav();
  initPricingPlanButtons();
  updateFooterYear();
  initAboutVideoLoop();
});

/* ==========================================================================
   1. LIVE OPEN / CLOSED STATUS TRACKER
   ========================================================================== */
function initLiveGymStatus() {
  const statusEl = document.getElementById('live-gym-status');
  const crowdVerdict = document.getElementById('live-crowd-verdict');

  const now = new Date();
  const currentHour = now.getHours();

  // Gym hours: 6:00 AM (6) to 11:00 PM (23)
  const isOpen = currentHour >= 6 && currentHour < 23;

  if (statusEl) {
    if (isOpen) {
      statusEl.innerHTML = `<strong>Open Now:</strong> 6:00 AM – 11:00 PM (Closes in ${23 - currentHour}h)`;
    } else {
      statusEl.innerHTML = `<strong>Closed Now:</strong> Opens tomorrow at 6:00 AM`;
    }
  }

  if (crowdVerdict) {
    if (isOpen) {
      if (currentHour >= 18 && currentHour <= 21) {
        crowdVerdict.innerHTML = `Live: <strong>Busier than usual (Peak Hours)</strong> · Closes 11:00 PM`;
      } else if (currentHour >= 11 && currentHour <= 16) {
        crowdVerdict.innerHTML = `Live: <strong>Optimal Training Hours (Low Crowd)</strong> · Closes 11:00 PM`;
      } else {
        crowdVerdict.innerHTML = `Live: <strong>Open & Active</strong> · Closes 11:00 PM`;
      }
    } else {
      crowdVerdict.innerHTML = `Closed for the night · Re-opens 6:00 AM`;
    }
  }
}

/* ==========================================================================
   2. POPULAR TIMES & CROWD TRAFFIC CHART
   ========================================================================== */
const weeklyPopularTimesData = {
  // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  // Format: [6am, 7am, 8am, 9am, 10am, 11am, 12pm, 1pm, 2pm, 3pm, 4pm, 5pm, 6pm, 7pm, 8pm, 9pm, 10pm, 11pm]
  0: [35, 45, 60, 75, 80, 70, 50, 40, 30, 30, 35, 45, 55, 65, 60, 50, 35, 10], // Sun
  1: [50, 70, 85, 75, 55, 40, 30, 25, 25, 30, 45, 70, 90, 95, 90, 80, 50, 15], // Mon (High peak)
  2: [45, 68, 80, 70, 50, 35, 30, 25, 25, 30, 45, 68, 88, 92, 88, 75, 45, 15], // Tue
  3: [45, 65, 80, 70, 50, 35, 30, 25, 25, 30, 45, 70, 88, 90, 85, 75, 45, 15], // Wed
  4: [50, 72, 85, 75, 55, 35, 30, 25, 25, 35, 50, 75, 92, 98, 94, 82, 50, 15], // Thu (From prompt: Busier than usual!)
  5: [50, 70, 85, 75, 50, 35, 30, 25, 25, 30, 45, 70, 85, 90, 85, 75, 45, 15], // Fri
  6: [40, 55, 75, 85, 80, 60, 45, 35, 30, 35, 45, 60, 75, 80, 75, 65, 40, 15]  // Sat
};

const hoursLabels = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
  '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

function initPopularTimes() {
  const container = document.getElementById('crowd-bars');
  const tabs = document.querySelectorAll('.day-tab');
  const refreshBtn = document.getElementById('refresh-time-btn');
  if (!container) return;

  const today = new Date().getDay(); // 0 to 6
  let currentSelectedDay = today;

  // Set active day tab to today by default
  tabs.forEach(tab => {
    const day = parseInt(tab.dataset.day, 10);
    tab.classList.toggle('active', day === today);
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSelectedDay = day;
      renderChart(day);
    });
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      initLiveGymStatus();
      renderChart(currentSelectedDay);
      refreshBtn.textContent = '✓ Synced!';
      setTimeout(() => { refreshBtn.textContent = 'Sync Current Time'; }, 1500);
    });
  }

  renderChart(today);
}

function renderChart(dayIndex) {
  const container = document.getElementById('crowd-bars');
  if (!container) return;

  const data = weeklyPopularTimesData[dayIndex] || weeklyPopularTimesData[4];
  const now = new Date();
  const currentHour = now.getHours();
  const isToday = now.getDay() === dayIndex;

  container.innerHTML = '';

  data.forEach((percentage, idx) => {
    const hourInt = idx + 6; // starts at 6 AM
    const col = document.createElement('div');
    col.className = 'crowd-bar-col';

    const isLiveHour = isToday && currentHour === hourInt;
    const isPeakHour = percentage >= 85;

    if (isLiveHour) col.classList.add('is-live');
    if (isPeakHour) col.classList.add('is-peak');

    col.innerHTML = `
      <div class="bar-tooltip">
        <strong>${hoursLabels[idx]}</strong>: ${percentage}% Busy ${isPeakHour ? '🔥 (Peak)' : ''} ${isLiveHour ? '⚡ (Live Now)' : ''}
      </div>
      <div class="bar-fill" style="height: ${percentage}%;"></div>
    `;

    container.appendChild(col);
  });
}

/* ==========================================================================
   3. EQUIPMENT CATEGORY FILTER
   ========================================================================== */
function initEquipmentFilter() {
  const filterBtns = document.querySelectorAll('#equipment-filters .cat-filter');
  const cards = document.querySelectorAll('#equipment-grid-container .equipment-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCat = btn.dataset.cat;

      cards.forEach(card => {
        const cardCat = card.dataset.category;
        if (targetCat === 'all' || cardCat === targetCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. REVIEWS CATEGORY FILTER
   ========================================================================== */
function initReviewsFilter() {
  const reviewTags = document.querySelectorAll('#review-tag-filters .review-tag-btn');
  const reviewCards = document.querySelectorAll('#reviews-cards-container .review-card');
  if (!reviewTags.length || !reviewCards.length) return;

  reviewTags.forEach(btn => {
    btn.addEventListener('click', () => {
      reviewTags.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      reviewCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. BMI & CALORIE CALCULATOR
   ========================================================================== */
function initBmiCalculator() {
  const form = document.getElementById('bmi-calc-form');
  const resultBox = document.getElementById('calc-result');
  const claimPassBtn = document.getElementById('calc-claim-pass-btn');
  if (!form || !resultBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const gender = document.getElementById('calc-gender').value;
    const age = parseFloat(document.getElementById('calc-age').value) || 25;
    const weight = parseFloat(document.getElementById('calc-weight').value) || 70;
    const heightCm = parseFloat(document.getElementById('calc-height').value) || 172;
    const goal = document.getElementById('calc-goal').value;

    // BMI Calculation: weight (kg) / [height (m)]^2
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    // BMR (Mifflin-St Jeor Formula)
    let bmr = (10 * weight) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // TDEE estimate (Moderate gym activity factor 1.55)
    let tdee = Math.round(bmr * 1.55);

    // Adjustment based on goal
    let targetCalories = tdee;
    let splitRecommendation = '4-Day Upper / Lower Muscle Split';

    if (goal === 'fat_loss') {
      targetCalories = tdee - 450;
      splitRecommendation = 'Full Body Circuit + HIIT Cardio at P9';
    } else if (goal === 'muscle_gain') {
      targetCalories = tdee + 350;
      splitRecommendation = 'Push / Pull / Legs Hypertrophy Split';
    } else if (goal === 'strength') {
      targetCalories = tdee + 200;
      splitRecommendation = '5x5 Strength & Biomechanical Barbell Split';
    } else {
      splitRecommendation = 'Cardio + Functional Mobility Routine';
    }

    // BMI category classification
    let category = 'Normal Weight';
    let catColor = '#10b981';
    if (bmi < 18.5) {
      category = 'Underweight (Bulking Recommended)';
      catColor = '#06b6d4';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight (Fat Loss & Toning Focus)';
      catColor = '#f59e0b';
    } else if (bmi >= 30) {
      category = 'Obese Range (Structured Training Needed)';
      catColor = '#f43f5e';
    }

    // Update UI
    document.getElementById('result-bmi-val').textContent = bmi;
    const catEl = document.getElementById('result-bmi-category');
    catEl.textContent = category;
    catEl.style.backgroundColor = catColor;
    catEl.style.color = '#000';

    document.getElementById('result-calories').textContent = `~${targetCalories.toLocaleString()} kcal/day`;
    document.getElementById('result-split').textContent = splitRecommendation;

    resultBox.removeAttribute('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (claimPassBtn) {
    claimPassBtn.addEventListener('click', () => {
      openTrialModal('Custom BMI Target Consultation & Free Pass');
    });
  }
}

/* ==========================================================================
   6. TRIAL PASS MODAL & VOUCHER GENERATION
   ========================================================================== */
function initTrialModal() {
  const dialog = document.getElementById('trial-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');
  const form = document.getElementById('trial-form');
  const successView = document.getElementById('pass-success-view');
  const resetBtn = document.getElementById('reset-voucher-btn');

  // Trigger buttons across website
  const triggers = [
    document.getElementById('open-trial-modal-btn'),
    document.getElementById('mobile-trial-btn'),
    document.getElementById('hero-claim-trial-btn'),
    document.getElementById('review-claim-pass-btn'),
    document.getElementById('bottom-trial-btn'),
    document.getElementById('sticky-pass-btn')
  ];

  triggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', () => {
        openTrialModal();
      });
    }
  });

  if (closeBtn && dialog) {
    closeBtn.addEventListener('click', () => dialog.close());
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) dialog.close();
    });
  }

  if (form && successView) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('trial-name').value.trim();
      const phone = document.getElementById('trial-phone').value.trim();
      const slot = document.getElementById('trial-slot').options[document.getElementById('trial-slot').selectedIndex].text;
      const plan = document.getElementById('trial-plan-interest').value;

      // Generate randomized voucher code
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const voucherCode = `P9-VIP-${randomNum}`;

      document.getElementById('voucher-user-name').textContent = name;
      document.getElementById('voucher-user-meta').textContent = `Slot: ${slot} | Interest: ${plan}`;
      document.getElementById('voucher-code-display').textContent = voucherCode;

      // WhatsApp direct URL with prefilled payload
      const waMessage = encodeURIComponent(
        `Hello P9 Fitness & Gym!\n\nI have claimed a Free 1-Day Trial Pass on your website.\n\n🎟 Pass Code: ${voucherCode}\n👤 Name: ${name}\n📞 Phone: ${phone}\n⏰ Preferred Slot: ${slot}\n🏋️ Plan Interest: ${plan}\n\nPlease confirm my workout session at Elite Colossal Building, FC Road!`
      );
      const waLink = document.getElementById('pass-whatsapp-confirm');
      if (waLink) {
        waLink.href = `https://wa.me/919765581509?text=${waMessage}`;
      }
      form.style.display = 'none';
      successView.removeAttribute('hidden');
    });
  }

  // Hero Quick Form Integration
  const heroForm = document.getElementById('hero-quick-pass-form');
  if (heroForm && dialog && successView) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('hero-name').value.trim();
      const phone = document.getElementById('hero-phone').value.trim();
      const slotEl = document.getElementById('hero-slot');
      const slot = slotEl ? slotEl.options[slotEl.selectedIndex].text : 'Evening Peak (5:00 PM – 9:00 PM)';

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const voucherCode = `P9-VIP-${randomNum}`;

      document.getElementById('voucher-user-name').textContent = name;
      document.getElementById('voucher-user-meta').textContent = `Slot: ${slot} | Free 1-Day VIP Pass`;
      document.getElementById('voucher-code-display').textContent = voucherCode;

      const waMessage = encodeURIComponent(
        `Hello P9 Fitness & Gym!\n\nI have claimed a Free 1-Day Trial Pass on your website.\n\n🎟 Pass Code: ${voucherCode}\n👤 Name: ${name}\n📞 Phone: ${phone}\n⏰ Preferred Slot: ${slot}\n🏋️ Plan Interest: Free 1-Day Trial\n\nPlease confirm my workout session at Elite Colossal Building, FC Road!`
      );
      const waLink = document.getElementById('pass-whatsapp-confirm');
      if (waLink) {
        waLink.href = `https://wa.me/919765581509?text=${waMessage}`;
      }

      if (form) form.style.display = 'none';
      successView.removeAttribute('hidden');

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  }

  if (resetBtn && form && successView) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      successView.setAttribute('hidden', '');
    });
  }
}

function openTrialModal(preferredPlan) {
  const dialog = document.getElementById('trial-dialog');
  if (!dialog) return;

  if (preferredPlan) {
    const planSelect = document.getElementById('trial-plan-interest');
    if (planSelect) {
      let matched = false;
      for (let i = 0; i < planSelect.options.length; i++) {
        if (planSelect.options[i].value === preferredPlan) {
          planSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Add dynamic option if custom
        const opt = new Option(preferredPlan, preferredPlan, true, true);
        planSelect.add(opt);
      }
    }
  }

  // Reset view to form if was on voucher
  const form = document.getElementById('trial-form');
  const successView = document.getElementById('pass-success-view');
  if (form && successView) {
    form.style.display = 'flex';
    successView.setAttribute('hidden', '');
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

/* ==========================================================================
   7. PRICING PLAN CARDS INTEGRATION
   ========================================================================== */
function initPricingPlanButtons() {
  const planBtns = document.querySelectorAll('.select-plan-btn');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.dataset.plan;
      openTrialModal(planName);
    });
  });
}

/* ==========================================================================
   8. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isHidden = drawer.hasAttribute('hidden');
    if (isHidden) {
      drawer.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      drawer.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close drawer when any internal navigation link is tapped
  const mobileLinks = drawer.querySelectorAll('.mobile-link, #mobile-trial-btn');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   9. DYNAMIC FOOTER YEAR
   ========================================================================== */
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   10. ABOUT VIDEO LOOP MANAGER (SKIP INTRO ON LOOP)
   ========================================================================== */
function initAboutVideoLoop() {
  const iframe = document.querySelector('.about-video-iframe');
  if (!iframe) return;

  window.addEventListener('message', (event) => {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (data && data.event === 'onStateChange') {
        // State 0 = ENDED, seek to 7s to skip intro logo on loop
        if (data.info === 0) {
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [7, true]
          }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo'
          }), '*');
        }
      }
    } catch (e) {}
  });
}

