# Requirements: Análise Inteligente de Treino (v1.2)

**Milestone:** v1.2 Análise Inteligente de Treino
**Created:** 2026-05-07

---

## 1. Progressão Automática (PROG)

### Active Requirements

- [ ] **PROG-01**: Sistema sugere peso automaticamente baseado nos últimos 2-3 registros do exercício
- [ ] **PROG-02**: Sugestão exibida abaixo do campo de peso quando usuário abre exercício na planilha
- [ ] **PROG-03**: Progressão considera se usuário completou todas as séries (ex: +2.5kg) ou não

### Future Requirements

- Configuração de incrementação por exercício
- Tipos de progressão (linear, ondulação, progressão baseada em RPE)
- Histórico de progressões sugeridas vs aceitas

### Out of Scope

- Progressão automática em exercícios sem histórico
- Machine learning para predição de peso

---

## 2. Muscle Heatmap (HEAT)

### Active Requirements

- [ ] **HEAT-01**: Dashboard exibe corpo diagramado (silhueta) com cores indicando músculos trabalhados
- [ ] **HEAT-02**: Cores variam por intensidade (nenhum = cinza, leve = amarelo, médio = laranja, intenso = dourado)
- [ ] **HEAT-03**: Cálculo baseado nos exercícios realizados nos últimos 7 dias
- [ ] **HEAT-04**: Músculos mapeados a partir do campo `muscles` existente nos exercícios da biblioteca

### Future Requirements

- Histórico de heatmap por semana
- Comparação com semana anterior
- Músculos mais trabalhados no mês

### Out of Scope

- Mapa 3D ou interativo
- Detalhamento por exercício específico no músculo

---

## 3. Volume Trends (VOL)

### Active Requirements

- [ ] **VOL-01**: Gráfico de linha mostra evolução do volume (peso × reps × sets) ao longo das semanas
- [ ] **VOL-02**: Gráfico usa CSS/SVG puro (sem biblioteca externa)
- [ ] **VOL-03**: Exibe tendência (subindo/estável/descendo) visualmente
- [ ] **VOL-04**: Mostra últimas 4-8 semanas de dados
- [ ] **VOL-05**: Acessível via seção no dashboard ou como modal

### Future Requirements

- Comparação de volume por grupo muscular
- Volume por exercício específico
- Metas de volume semanais

### Out of Scope

- Gráficos 3D ou animados
- Exportação de gráficos como imagem

---

## 4. Stats por Exercício (STAT)

### Active Requirements

- [ ] **STAT-01**: Página `/estatisticas` lista todos os exercícios com stats
- [ ] **STAT-02**: Para cada exercício, mostra PR (maior peso já lifting)
- [ ] **STAT-03**: Para cada exercício, mostra volume total (soma de todas as repetições × peso)
- [ ] **STAT-04**: Para cada exercício, mostra melhor série (melhor combo peso × reps)
- [ ] **STAT-05**: Cards com ícone de troféu para PRs
- [ ] **STAT-06**: Link para stats acessível da planilha

### Future Requirements

- Histórico de PRs por data
- Comparação com período anterior
- Exercises mais frequentes

### Out of Scope

- Gráficos detalhados por exercício
- Exportação de dados

---

## 5. Detecção de Platô (PLAT)

- [ ] **BOOK-01**: User can see reading progress indicator per chapter
- [ ] **BOOK-02**: User can resume at last read chapter (auto-resume)
- [ ] **BOOK-03**: User can navigate between chapters easily
- [ ] **BOOK-04**: Progress saves and syncs to cloud
- [ ] **BOOK-05**: Mobile-optimized reading layout (touch-friendly, adequate text size)
- [ ] **BOOK-06**: Total book progress visible (e.g., "5 of 12 chapters completed")

### Future Requirements

- Reading timer/streaks
- Progress percentage per chapter
- Estimated finish time

### Out of Scope

- Social sharing
- Book catalog/ISBN search
- Quote highlighting

---

## 4. Traceability

| REQ-ID | Phase | Requirement |
|-------|-------|--------------|
| AUTH-01 | Phase 7 | Cloud user registration |
| AUTH-02 | Phase 7 | Cross-device login |
| AUTH-03 | Phase 7 | Cookie session persistence |
| AUTH-04 | Phase 8 | localStorage migration |
| AUTH-05 | Phase 8 | Auth flow validation |
| PROF-01 | Phase 9 | Avatar in top bar |
| PROF-02 | Phase 9 | Profile menu access |
| PROF-03 | Phase 9 | Display name edit |
| PROF-04 | Phase 9 | Logout functionality |
| PROF-05 | Phase 9 | Cloud profile sync |
| BOOK-01 | Phase 10 | Chapter progress indicator |
| BOOK-02 | Phase 10 | Auto-resume |
| BOOK-03 | Phase 10 | Chapter navigation |
| BOOK-04 | Phase 10 | Progress sync |
| BOOK-05 | Phase 10 | Mobile optimization |
| BOOK-06 | Phase 10 | Total progress display |

---

---

# Requirements: Análise Inteligente de Treino (v1.2)

**Milestone:** v1.2 Análise Inteligente de Treino
**Created:** 2026-05-07

---

## 1. Progressão Automática (PROG)

### Active Requirements

- [ ] **PROG-01**: Sistema sugere peso automaticamente baseado nos últimos 2-3 registros do exercício
- [ ] **PROG-02**: Sugestão exibida abaixo do campo de peso quando usuário abre exercício na planilha
- [ ] **PROG-03**: Progressão considera se usuário completou todas as séries (ex: +2.5kg) ou não

### Future Requirements

- Configuração de incrementação por exercício
- Tipos de progressão (linear, ondulação, progressão baseada em RPE)

### Out of Scope

- Progressão automática em exercícios sem histórico

---

## 2. Muscle Heatmap (HEAT)

### Active Requirements

- [ ] **HEAT-01**: Dashboard exibe corpo diagramado (silhueta) com cores indicando músculos trabalhados
- [ ] **HEAT-02**: Cores variam por intensidade (nenhum = cinza, leve = amarelo, médio = laranja, intenso = dourado)
- [ ] **HEAT-03**: Cálculo baseado nos exercícios realizados nos últimos 7 dias
- [ ] **HEAT-04**: Músculos mapeados a partir do campo `muscles` existente nos exercícios da biblioteca

### Future Requirements

- Histórico de heatmap por semana

### Out of Scope

- Mapa 3D ou interativo

---

## 3. Volume Trends (VOL)

### Active Requirements

- [ ] **VOL-01**: Gráfico de linha mostra evolução do volume (peso × reps × sets) ao longo das semanas
- [ ] **VOL-02**: Gráfico usa CSS/SVG puro (sem biblioteca externa)
- [ ] **VOL-03**: Exibe tendência (subindo/estável/descendo) visualmente
- [ ] **VOL-04**: Mostra últimas 4-8 semanas de dados
- [ ] **VOL-05**: Acessível via seção no dashboard ou como modal

### Future Requirements

- Comparação de volume por grupo muscular

### Out of Scope

- Gráficos 3D ou animados

---

## 4. Stats por Exercício (STAT)

### Active Requirements

- [ ] **STAT-01**: Página `/estatisticas` lista todos os exercícios com stats
- [ ] **STAT-02**: Para cada exercício, mostra PR (maior peso já lifting)
- [ ] **STAT-03**: Para cada exercício, mostra volume total (soma de todas as repetições × peso)
- [ ] **STAT-04**: Para cada exercício, mostra melhor série (melhor combo peso × reps)
- [ ] **STAT-05**: Cards com ícone de troféu para PRs
- [ ] **STAT-06**: Link para stats acessível da planilha

### Future Requirements

- Histórico de PRs por data

### Out of Scope

- Exportação de dados

---

## 5. Detecção de Platô (PLAT)

### Active Requirements

- [ ] **PLAT-01**: Sistema compara média de peso das últimas 3 semanas com 3 semanas anteriores
- [ ] **PLAT-02**: Se diferença < 2.5kg, considera como platô
- [ ] **PLAT-03**: Exibe alerta visual "Você está em platô!" no dashboard quando detectado
- [ ] **PLAT-04**: Sugere mudanças (aumentar reps, cambiar exercício, descansar mais)
- [ ] **PLAT-05**: Badge de alerta amarelo com sugestão

### Future Requirements

- Detecção de platô por grupo muscular específico

### Out of Scope

- Machine learning para predição de platô

---

## 6. Traceability

| REQ-ID | Phase | Requirement |
|--------|-------|-------------|
| PROG-01 | Phase 11d | Sugestão automática de peso |
| PROG-02 | Phase 11d | Exibição da sugestão na UI |
| PROG-03 | Phase 11d | Lógica de progressão |
| HEAT-01 | Phase 11c | Corpo diagramado no dashboard |
| HEAT-02 | Phase 11c | Cores por intensidade |
| HEAT-03 | Phase 11c | Cálculo de 7 dias |
| HEAT-04 | Phase 11c | Mapeamento de músculos |
| VOL-01 | Phase 11c | Gráfico de linha de volume |
| VOL-02 | Phase 11c | CSS/SVG puro |
| VOL-03 | Phase 11c | Indicador de tendência |
| VOL-04 | Phase 11c | 4-8 semanas de dados |
| VOL-05 | Phase 11c | Acessível via dashboard |
| STAT-01 | Phase 11b | Página de estatísticas |
| STAT-02 | Phase 11b | PR por exercício |
| STAT-03 | Phase 11b | Volume total por exercício |
| STAT-04 | Phase 11b | Melhor série por exercício |
| STAT-05 | Phase 11b | UI com troféu para PRs |
| STAT-06 | Phase 11b | Link na planilha |
| PLAT-01 | Phase 11d | Comparação de médias |
| PLAT-02 | Phase 11d | Threshold de 2.5kg |
| PLAT-03 | Phase 11d | Alerta no dashboard |
| PLAT-04 | Phase 11d | Sugestões de mudança |
| PLAT-05 | Phase 11d | Badge visual amarelo |

---

*Requirements defined: 2026-05-07*
*21 Active Requirements | 5 Future | 3 Out of Scope*