import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SearchResults from '../views/SearchResults.vue';
import BusDetail from '../views/BusDetail.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ConfirmationView from '../views/ConfirmationView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import OperatorPanel from '../views/OperatorPanel.vue';
import OperatorLoginView from '../views/OperatorLoginView.vue';
import OperatorRegisterView from '../views/OperatorRegisterView.vue';
import BookingHistoryView from '../views/BookingHistoryView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/search', name: 'SearchResults', component: SearchResults },
  { path: '/history', name: 'History', component: BookingHistoryView },
  { path: '/bus/:id', name: 'BusDetail', component: BusDetail, props: true },
  { path: '/checkout', name: 'Checkout', component: CheckoutView },
  { path: '/confirmation', name: 'Confirmation', component: ConfirmationView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/operator-login', name: 'OperatorLogin', component: OperatorLoginView },
  { path: '/operator-register', name: 'OperatorRegister', component: OperatorRegisterView },
  { path: '/operator', name: 'Operator', component: OperatorPanel }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
