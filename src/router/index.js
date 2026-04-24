import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import DocumentPage from '../pages/DocumentPage.vue'
import CastPlaygroundPage from '../pages/CastPlaygroundPage.vue'
import { systemDocMap } from '../data/systemData'
import { parseDocSectionId } from '../utils/docSectionScroll'

const DEFAULT_TITLE = 'LearningSystem'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/docs/:id',
      name: 'document',
      component: DocumentPage,
      props: true,
    },
    {
      path: '/playground/cast',
      name: 'cast-playground',
      component: CastPlaygroundPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.name === 'document' && parseDocSectionId(to.query.section)) {
      return false
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.name === 'document') {
    const id = typeof to.params.id === 'string' ? to.params.id : to.params.id?.[0]
    const doc = id ? systemDocMap[id] : null
    document.title = doc ? `${doc.title} · ${DEFAULT_TITLE}` : DEFAULT_TITLE
    return
  }
  if (to.name === 'home') {
    document.title = `${DEFAULT_TITLE} · Atlas`
    return
  }
  document.title = DEFAULT_TITLE
})

export default router
