/**
 * Gestor de Misiones Diarias (Dentro y Fuera de la Aplicación)
 */

class KiddoMissionsManager {
  constructor() {
    this.missions = KIDDO_DATA.missions;
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const inAppMissions = this.missions.filter(m => m.type === 'in_app');
    const outAppMissions = this.missions.filter(m => m.type === 'out_app');

    const completedCount = this.missions.filter(m => m.completed).length;
    const totalCount = this.missions.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    container.innerHTML = `
      <!-- Cabecera de progreso diario -->
      <div class="missions-header-card">
        <div class="missions-header-info">
          <h2>Lista de Misiones Diarias ⭐</h2>
          <p>¡Completa tus tareas dentro de la app y en tu día a día!</p>
        </div>
        <div class="missions-progress-bar-wrap">
          <div class="missions-progress-meta">
            <span>Progreso de hoy: <strong>${completedCount} de ${totalCount} completadas</strong></span>
            <span class="missions-percent-badge">${progressPercent}%</span>
          </div>
          <div class="missions-progress-track">
            <div class="missions-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- Sección 1: Misiones dentro de la app -->
      <div class="missions-category-block">
        <div class="missions-cat-title">
          <span class="missions-cat-icon">📱</span>
          <h3>Misiones en la Aplicación</h3>
        </div>
        <div class="missions-list">
          ${inAppMissions.map(m => this.renderMissionItem(m)).join('')}
        </div>
      </div>

      <!-- Sección 2: Misiones fuera de la app (vida diaria) -->
      <div class="missions-category-block">
        <div class="missions-cat-title">
          <span class="missions-cat-icon">🌟</span>
          <h3>Misiones para realizar fuera de la aplicación</h3>
        </div>
        <div class="missions-list">
          ${outAppMissions.map(m => this.renderMissionItem(m)).join('')}
        </div>
      </div>
    `;
  }

  renderMissionItem(mission) {
    const isDone = mission.completed;
    return `
      <div class="mission-item-card ${isDone ? 'is-completed' : 'is-pending'}" id="mission-${mission.id}" onclick="window.kiddoMissions.toggleMission('${mission.id}')">
        <div class="mission-checkbox ${isDone ? 'checked' : ''}">
          ${isDone ? '✓' : ''}
        </div>
        <div class="mission-icon-wrap">
          <span class="mission-icon">${mission.icon}</span>
        </div>
        <div class="mission-details">
          <div class="mission-top-row">
            <h4 class="mission-title ${isDone ? 'strikethrough' : ''}">${mission.title}</h4>
            <span class="mission-tag-badge ${mission.type}">${mission.tag}</span>
          </div>
          <p class="mission-desc">${mission.description}</p>
        </div>
        <div class="mission-status-indicator">
          <span class="status-pill ${isDone ? 'completed-pill' : 'pending-pill'}">
            ${isDone ? '¡Completada!' : 'Pendiente'}
          </span>
        </div>
      </div>
    `;
  }

  toggleMission(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission) return;

    mission.completed = !mission.completed;

    if (mission.completed) {
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();
      if (window.kiddoApp) {
        window.kiddoApp.addRecentActivity({
          type: 'mission',
          icon: '⭐',
          title: `Misión: ${mission.title}`,
          subtitle: '¡Misión completada con éxito!',
          color: '#C6F6D5'
        });
      }
    } else {
      if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    }

    this.render('missions-content-container');
  }
}

window.kiddoMissions = new KiddoMissionsManager();
