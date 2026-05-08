# Roadmap: User Profile & Book Improvements (v1.1)

**Milestone:** User Profile & Book Improvements (v1.1)
**Started:** 2026-05-04

---

## Phases

- [x] **Phase 7: Cloud Authentication** - Register, login, and session persistence with cloud database
- [x] **Phase 8: Auth Migration** - Migrate existing localStorage users to cloud (trivially complete — no existing users)
- [x] **Phase 9: User Profile** - Avatar, profile page, display name edit, logout
- [x] **Phase 10: Book Progress** - Reading progress indicators, chapter navigation, mobile optimization (completed 2026-05-06)
- [ ] **Phase 11: Análise Inteligente de Treino** - Progressão automática, heatmap, volume trends, stats e detecção de platô

---

## Phase Details

### Phase 7: Cloud Authentication

**Goal**: Users can register and login with cloud credentials that persist across all devices

**Depends on**: Nothing (first phase of this milestone)

**Requirements**: AUTH-01, AUTH-02, AUTH-03

**Success Criteria** (what must be TRUE):

1. User can register with email/password in cloud database — registration form creates account in Supabase
2. User can login from any device with same credentials — login works on new device with stored credentials
3. Session persists across browser sessions — httpOnly cookies maintain login across page refreshes

**Plans**: 07-01-PLAN.md

---

### Phase 8: Auth Migration

**Goal**: Existing localStorage users can migrate to cloud and auth flows continue working

**Depends on**: Phase 7 (cloud auth must exist before migration)

**Requirements**: AUTH-04, AUTH-05

**Success Criteria** (what must be TRUE):

1. Existing localStorage users can migrate to cloud — migration tool/data transfer from old system
2. Login/logout works correctly after migration — auth flows function with migrated accounts

**Plans**: TBD

---

### Phase 9: User Profile

**Goal**: Users can view and edit their profile, accessible from top bar avatar

**Depends on**: Phase 7 (requires cloud auth for profile sync)

**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05

**Success Criteria** (what must be TRUE):

1. User can see avatar icon in top bar — user avatar displayed in application header
2. User can tap avatar to open profile menu/page — navigation to profile page works
3. User can edit display name on profile page — form allows name update and saves to cloud
4. User can log out from profile page — logout button terminates session
5. Profile data syncs across devices — name changes reflect on other devices after sync

**Plans**: TBD

**UI hint**: yes

---

### Phase 10: Book Progress

**Goal**: Users can track reading progress with mobile-optimized chapter navigation

**Depends on**: Phase 7 (requires cloud auth for progress sync)

**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06

**Success Criteria** (what must be TRUE):

1. User can see reading progress indicator per chapter — visual indicator shows chapter completion
2. User can resume at last read chapter — application opens to last position automatically
3. User can navigate between chapters easily — next/previous controls function properly
4. Progress saves and syncs to cloud — reading position persists across sessions and devices
5. Mobile-optimized reading layout works correctly — touch-friendly controls, adequate text size on mobile
6. Total book progress visible — summary shows completed chapters (e.g., "5 of 12")

**Plans**: 2 plans

- [x] 10-01-PLAN.md — Data layer: Supabase migration, reading-storage module, server actions
- [x] 10-02-PLAN.md — UI layer: ChapterHeader toggle, mobile CSS, dynamic book index

**UI hint**: yes

---

## Phase Details

### Phase 11: Análise Inteligente de Treino

**Goal**: Adicionar funcionalidades de análise avançada de treino inspiradas em MyFit e LiftShift

**Depends on**: Phase 10 (concluído)

**Requirements**: ANAL-01, ANAL-02, ANAL-03, ANAL-04, ANAL-05

**Success Criteria** (what must be TRUE):

1. **Progressão Automática**: Sistema sugere peso automaticamente quando usuário abre exercício na planilha, baseado nos últimos 2-3 registros
2. **Muscle Heatmap**: Dashboard mostra corpo diagramado com cores indicando músculos trabalhados na semana
3. **Volume Trends**: Gráfico CSS/SVG mostra tendência de volume das últimas 4-8 semanas
4. **Stats por Exercício**: Página mostra para cada exercício: maior peso já lifting (PR), volume total, melhor série
5. **Detecção de Platô**: Sistema detecta quando média de peso não evoluiu por 3 semanas e mostra alerta com sugestão

**UI hint**: yes — Manter padrão visual atual (#B8956A, #0A0A0A, tracking-wider, max-w-4xl)

---

### Phase 11a: Base de Dados e Funções Utilitárias

**Goal**: Criar biblioteca de funções para cálculos de progressão, detecção de platô e stats

**Depends on**: Phase 11

**Requirements**: Funções utilitárias em lib/

**Plans**: 11a-PLAN.md

---

### Phase 11b: Stats e PRs por Exercício

**Goal**: Página de estatísticas com PRs, volume total e melhor série por exercício

**Depends on**: Phase 11a

**Requirements**: ANAL-04

**Plans**: 11b-PLAN.md

**UI hint**: yes

---

### Phase 11c: Muscle Heatmap e Volume Trends

**Goal**: Visualizações de músculos trabalhados e evolução de volume

**Depends on**: Phase 11b

**Requirements**: ANAL-02, ANAL-03

**Plans**: 11c-PLAN.md

**UI hint**: yes

---

### Phase 11d: Progressão Automática e Detecção de Platô

**Goal**: Sugestão automática de peso e alertas de platô

**Depends on**: Phase 11c

**Requirements**: ANAL-01, ANAL-05

**Plans**: 11d-PLAN.md

**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 7. Cloud Authentication | 1/1 | Code complete | - |
| 8. Auth Migration | 1/1 | Complete (trivial) | 2026-05-04 |
| 9. User Profile | 1/1 | Code complete | 2026-05-04 |
| 10. Book Progress | 2/2 | Complete    | 2026-05-06 |
| 11. Análise Inteligente | 0/4 | In Progress  | - |

---

*Milestone v1.2 started: 2026-05-07*
*Roadmap updated: 2026-05-07*