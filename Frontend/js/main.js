import { state } from './state.js';
import { loginView } from './auth.js';
import { shell, updateSidebarBadge } from './navigation.js';

// Import Views
import {
  coursesView, setupCoursesListeners,
  registrationView, setupRegistrationListeners,
  resultsView, setupResultsListeners,
  timetableView,
  assignmentsView, setupAssignmentsListeners,
  examsView,
  resourcesView,
  libraryView, setupLibraryListeners,
  lecturersView
} from './views/academic.js';

import {
  feesView, setupFeesListeners,
  convocationView, setupConvocationListeners
} from './views/financial.js';

import {
  transcriptView, setupTranscriptListeners,
  documentsView, setupDocumentsListeners,
  biodataView, setupBiodataListeners
} from './views/documents.js';

import {
  announcementsView, setupAnnouncementsListeners,
  eventsView,
  communityView, setupCommunityListeners,
  innovationView, setupInnovationListeners,
  researchView,
  achievementsView,
  notificationsView, setupNotificationsListeners,
  messagesView,
  supportView, setupSupportListeners
} from './views/community.js';

import {
  dashboardView,
  profileView, setupProfileListeners,
  settingsView, setupSettingsListeners,
  accommodationView, setupAccommodationListeners,
  passwordView, setupPasswordListeners
} from './views/user.js';

export function render() {
  document.body.classList.toggle('dark', state.dark);

  if (!state.loggedIn && state.route !== 'login') {
    loginView();
    return;
  }

  if (state.route === 'login') {
    loginView();
    return;
  }

  if (window.loginBgTimer) {
    clearInterval(window.loginBgTimer);
    window.loginBgTimer = null;
  }

  let contentHtml = '';

  switch (state.route) {
    case 'dashboard': contentHtml = dashboardView(); break;
    case 'courses': contentHtml = coursesView(); break;
    case 'registration': contentHtml = registrationView(); break;
    case 'results': contentHtml = resultsView(); break;
    case 'accommodation': contentHtml = accommodationView(); break;
    case 'timetable': contentHtml = timetableView(); break;
    case 'fees': contentHtml = feesView(); break;
    case 'documents': contentHtml = documentsView(); break;
    case 'biodata': contentHtml = biodataView(); break;
    case 'community': contentHtml = communityView(); break;
    case 'convocation': contentHtml = convocationView(); break;
    case 'profile': contentHtml = profileView(); break;
    case 'settings': contentHtml = settingsView(); break;
    case 'password': contentHtml = passwordView(); break;
    case 'transcript': contentHtml = transcriptView(); break;
    case 'exams': contentHtml = examsView(); break;
    case 'assignments': contentHtml = assignmentsView(); break;
    case 'resources': contentHtml = resourcesView(); break;
    case 'library': contentHtml = libraryView(); break;
    case 'lecturers': contentHtml = lecturersView(); break;
    case 'announcements': contentHtml = announcementsView(); break;
    case 'events': contentHtml = eventsView(); break;
    case 'innovation': contentHtml = innovationView(); break;
    case 'research': contentHtml = researchView(); break;
    case 'achievements': contentHtml = achievementsView(); break;
    case 'notifications': contentHtml = notificationsView(); break;
    case 'messages': contentHtml = messagesView(); break;
    case 'support': contentHtml = supportView(); break;
    default: contentHtml = dashboardView(); break;
  }

  shell(contentHtml);

  // Attach view-specific interactive event handlers
  if (state.route === 'courses') setupCoursesListeners();
  if (state.route === 'registration') setupRegistrationListeners();
  if (state.route === 'results') setupResultsListeners();
  if (state.route === 'accommodation') setupAccommodationListeners();
  if (state.route === 'documents') setupDocumentsListeners();
  if (state.route === 'biodata') setupBiodataListeners();
  if (state.route === 'convocation') setupConvocationListeners();
  if (state.route === 'password') setupPasswordListeners();
  if (state.route === 'transcript') setupTranscriptListeners();
  if (state.route === 'assignments') setupAssignmentsListeners();
  if (state.route === 'fees') setupFeesListeners();
  if (state.route === 'library') setupLibraryListeners();
  if (state.route === 'announcements') setupAnnouncementsListeners();
  if (state.route === 'community') setupCommunityListeners();
  if (state.route === 'innovation') setupInnovationListeners();
  if (state.route === 'notifications') setupNotificationsListeners();
  if (state.route === 'support') setupSupportListeners();
  if (state.route === 'profile') setupProfileListeners();
  if (state.route === 'settings') setupSettingsListeners();
}

// Expose render globally for navigation dispatcher
window.appRender = render;

// Router Event Listeners
window.addEventListener('hashchange', () => {
  state.route = location.hash.slice(1) || 'dashboard';
  render();
});

window.addEventListener('resize', updateSidebarBadge);

// Initialize Application
render();
