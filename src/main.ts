import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import MainRouterIncoming from './components/RouterComponents/MainRouterIncoming.vue';
import { createPinia } from 'pinia';

// Маршруты
const routes = [
    { path: '/', component: MainRouterIncoming },
    {
        path: '/today',
        component: () => import('./components/RouterComponents/MainRouterToday.vue'),
    },
    {
        path: '/plans',
        component: () => import('./components/RouterComponents/MainRouterPlans.vue'),
    },
];

// Создание роутера
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Генерация корневого VUE файла
const app = createApp(App);

app.directive('click-outside', {
    mounted: (el, binding) => {
        el.clickOutsideEvent = (event: MouseEvent) => {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                binding.value(event);
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted: (el) => {
        document.removeEventListener('click', el.clickOutsideEvent);
    },
});

app.directive<
    HTMLElement,
    {
        onActive?: (next: HTMLElement) => void;
        onUnActive?: (next: HTMLElement) => void;
    }
>('click-in-element', {
    mounted: (el, binding) => {
        const onActive = binding.value.onActive;
        const onUnActive = binding.value.onUnActive;

        el.clickInElementHandler = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (el == target || el.contains(target)) {
                onActive?.(target);
            } else {
                onUnActive?.(target);
            }
        };

        document.addEventListener('click', el.clickInElementHandler);
    },
    unmounted: (el) => {
        document.removeEventListener('click', el.clickInElementHandler);
    },
});

app.use(router);
app.use(createPinia());

app.mount('#app');
