# 🚌 netBus - Online Bus Ticket Booking System

Modern, responsive ve type-safe bir otobüs bileti rezervasyon sistemi. React 18+, TypeScript ve Vite ile geliştirilmiştir.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev/)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Teknik Tercihler](#-teknik-tercihler)
- [Mimari ve Component Tree](#-mimari-ve-component-tree)
- [API Endpoints](#-api-endpoints)
- [Test](#-test)
- [Geliştirme Notları](#-geliştirme-notları)

---

## 🚀 Özellikler

### Core Features
- ✅ **Sefer Arama**: Autocomplete destekli kalkış/varış seçimi ve tarih filtreleme
- ✅ **Sefer Listesi**: Firma bazlı filtreleme, fiyat/saat sıralaması
- ✅ **Koltuk Seçimi**: 2+2 oturum düzeni, max 4 koltuk, yanyana koltuk önerileri
- ✅ **Yolcu Bilgileri**: Zod validasyonlu form yönetimi
- ✅ **Rezervasyon Özeti**: Fiyat hesaplama ve PNR kodu
- ✅ **Mock Ödeme**: MSW ile simüle edilmiş ödeme akışı

### UX Features
- 🌍 **i18n**: Türkçe/İngilizce (localStorage persistence)
- 🎨 **Theme**: Light/Dark mode (sistem tercihi algılama)
- 📱 **Responsive**: Mobile-first tasarım
- ♿ **A11y**: ARIA labels, klavye navigasyonu
- 🛡️ **Error Boundary**: 3 katmanlı hata yönetimi
- 🎯 **Autocomplete**: Türkçe karakter desteği, keyboard navigation

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js**: 18.x veya 20.x
- **Package Manager**: npm, yarn veya pnpm

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/arcaglar/vite-test.git
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
# veya
pnpm install
# veya
yarn install
```

### 3. Environment Variables (Opsiyonel)
Proje default değerlerle çalışır. Özelleştirmek isterseniz:

```bash
cp .env.example .env
```

`.env` dosyası içeriği:
```env
VITE_API_BASE_URL=/api
VITE_ENV=development
```

> **Not**: `.env` dosyası olmadan da çalışır, default değerler kullanılır.

### 4. Development Server'ı Başlatın
```bash
npm run dev
```

Uygulama **http://localhost:5173** adresinde çalışacaktır.

### 5. Production Build
```bash
# Build
npm run build

# Preview
npm run preview
```

Build çıktısı `dist/` klasöründe oluşturulur.

### 6. Testleri Çalıştır
```bash
# Tüm testler
npm run test
```

---

## 🎯 Teknik Tercihler

### Neden Bu Teknolojiler?

#### **React 18.3+**
- **Neden**: Modern hooks API, concurrent features, geniş ekosistem
- **Kullanım**: Component-based architecture, state yönetimi
- **Artıları**: Mature, well-documented, large community

#### **TypeScript 5+**
- **Neden**: Type safety, intellisense, refactoring kolaylığı
- **Kullanım**: Tüm codebase strict mode ile yazılmış
- **Artıları**: Runtime hatalarını compile-time'da yakalar

#### **Vite 6+**
- **Neden**: Lightning-fast HMR, native ESM, modern defaults
- **Alternatif**: CRA (deprecated), Webpack (complex config)
- **Artıları**: Dev experience, build speed, zero-config

#### **TanStack Query (React Query v5)**
- **Neden**: Server state yönetimi, caching, background refetch
- **Alternatif**: Redux + RTK Query, SWR, Zustand
- **Kullanım**: API calls, loading/error states, retry logic
- **Artıları**: Deduplication, automatic refetching, garbage collection

#### **React Hook Form + Zod**
- **Neden**: Performans (uncontrolled), type-safe validation
- **Alternatif**: Formik (re-render issues), Yup (less type-safe)
- **Kullanım**: Passenger form, search form, validation schemas
- **Artıları**: Minimal re-renders, TS integration, small bundle

#### **React Router v7**
- **Neden**: De-facto routing library, type-safe routes
- **Kullanım**: Multi-step booking flow navigation
- **Artıları**: Nested routes, code splitting, data loading

#### **Tailwind CSS**
- **Neden**: Utility-first, consistent design system, small bundle
- **Alternatif**: Styled Components (runtime overhead), CSS Modules
- **Kullanım**: Tüm styling, responsive breakpoints, dark mode
- **Artıları**: JIT compiler, purging, no naming conventions

#### **MSW (Mock Service Worker)**
- **Neden**: Gerçekçi API mocking, browser/node ortamlarında çalışır
- **Alternatif**: JSON Server (ayrı server), axios-mock-adapter
- **Kullanım**: Development ve test ortamlarında API simülasyonu
- **Artıları**: Service worker based, network tab'da görünür

#### **Vitest + React Testing Library**
- **Neden**: Vite native, fast, Jest-compatible API
- **Alternatif**: Jest (slow with Vite)
- **Kullanım**: Component tests, integration tests
- **Artıları**: HMR for tests, snapshot testing, coverage

### State Management Stratejisi

```
┌─────────────────────────────────────────┐
│         State Categories                │
├─────────────────────────────────────────┤
│                                         │
│  🌐 Server State                        │
│  └─ TanStack Query                      │
│     • Locations, Trips, Seat Schemas   │
│     • Caching, refetching, mutations   │
│                                         │
│  🔄 Global Client State                 │
│  └─ React Context                       │
│     • Booking Flow (trip, seats, etc.) │
│     • Language (TR/EN)                  │
│     • Theme (light/dark)                │
│                                         │
│  📦 Local Component State               │
│  └─ useState                            │
│     • Form inputs, modals, toggles     │
│                                         │
└─────────────────────────────────────────┘
```

**Neden Redux Kullanılmadı?**
- Server state için TanStack Query yeterli
- Global client state minimal (Context yeterli)
- Boilerplate'i azaltmak
- Bundle size küçültmek

---

## 🏗️ Mimari ve Component Tree

### Folder Structure

```
src/
├── api/                          # API layer
│   ├── index.ts                 # API client functions
│   └── mocks/
│       ├── browser.ts           # MSW setup
│       └── handlers.ts          # Mock API handlers
│
├── components/                   # Shared components
│   ├── Autocomplete.tsx         # Custom autocomplete with TR support
│   ├── ErrorBoundary.tsx        # Error boundary component
│   ├── QueryErrorBoundary.tsx   # Query-specific error boundary
│   ├── ErrorBoundaryTest.tsx    # Dev test button
│   ├── Header.tsx               # App header with theme/lang toggle
│   ├── Footer.tsx               # App footer
│   └── Layout.tsx               # Page layout wrapper
│
├── config/                       # Configuration
│   └── env.ts                   # Type-safe env variables
│
├── context/                      # Global state providers
│   ├── BookingContext.tsx       # Booking flow state
│   ├── LanguageContext.tsx      # i18n translations + state
│   └── ThemeContext.tsx         # Light/dark theme state
│
├── features/                     # Feature-based modules
│   ├── search/
│   │   └── SearchForm.tsx       # Search form with autocomplete
│   ├── schedules/
│   │   └── ScheduleList.tsx     # Trip list with filter/sort
│   ├── seats/
│   │   └── SeatSelection.tsx    # Seat map + adjacency logic
│   └── checkout/
│       ├── PassengerForm.tsx    # Passenger info form
│       ├── ReviewConfirm.tsx    # Booking summary
│       └── SuccessPage.tsx      # Success with PNR
│
├── lib/                          # Library configs
│   └── queryClient.ts           # TanStack Query config
│
├── tests/                        # Test files
│   ├── setup.ts                 # Vitest setup
│   ├── utils.tsx                # Test utilities
│   ├── SearchForm.test.tsx
│   ├── SeatSelection.test.tsx
│   └── ReviewConfirm.test.tsx
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── vite-env.d.ts                # Vite env type definitions
```

### Component Tree

```
App
├── ErrorBoundary (Global)
│   └── QueryClientProvider
│       └── ThemeProvider
│           └── LanguageProvider
│               └── ErrorBoundary (Provider Level)
│                   └── BookingProvider
│                       └── BrowserRouter
│                           └── ErrorBoundary (Route Level)
│                               └── Layout
│                                   ├── Header
│                                   │   ├── LanguageDropdown
│                                   │   └── ThemeToggle
│                                   │
│                                   ├── Routes
│                                   │   ├── / → HomePage
│                                   │   │   ├── SearchForm
│                                   │   │   │   └── Autocomplete (x2)
│                                   │   │   └── ValueProps
│                                   │   │
│                                   │   ├── /schedules → SchedulesPage
│                                   │   │   └── ScheduleList
│                                   │   │       └── TripCard (map)
│                                   │   │
│                                   │   ├── /seats/:id → SeatsPage
│                                   │   │   └── SeatSelection
│                                   │   │       ├── SeatMap
│                                   │   │       └── BookingSummary
│                                   │   │
│                                   │   ├── /passenger-info → PassengerInfoPage
│                                   │   │   └── PassengerForm
│                                   │   │       ├── PassengerCard (map)
│                                   │   │       └── ContactInfo
│                                   │   │
│                                   │   ├── /checkout → CheckoutPage
│                                   │   │   └── ReviewConfirm
│                                   │   │       ├── TripInfo
│                                   │   │       ├── PassengerList
│                                   │   │       ├── ContactInfo
│                                   │   │       └── PaymentSummary
│                                   │   │
│                                   │   └── /success → ResultPage
│                                   │       └── SuccessPage
│                                   │           └── ConfettiAnimation
│                                   │
│                                   ├── ErrorBoundaryTest (Dev only)
│                                   └── Footer
└── (Error screens when error occurs)
```

### Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     User Interaction                          │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  SearchForm (/)                                               │
│  • User selects from/to (Autocomplete)                       │
│  • User picks date                                            │
│  • Form validation (Zod)                                      │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  API Call (TanStack Query)                                    │
│  • fetchSchedules(from, to, date)                            │
│  • MSW intercepts → returns mock data                        │
│  • Query caches result                                        │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  ScheduleList (/schedules)                                    │
│  • Displays trips                                             │
│  • Filter by company                                          │
│  • Sort by price/time                                         │
│  • User clicks "Select Seats"                                │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  BookingContext.setTrip()                                     │
│  • Stores selected trip in context                           │
│  • Navigate to /seats/:tripId                                │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  SeatSelection (/seats/:tripId)                               │
│  • fetchSeatSchema(tripId)                                    │
│  • Render seat map                                            │
│  • User selects seats (max 4)                                │
│  • Show adjacent seat suggestions                            │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  BookingContext.setSelectedSeats()                            │
│  • Stores seats with unitPrice                               │
│  • Navigate to /passenger-info                               │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  PassengerForm (/passenger-info)                              │
│  • Dynamic form (1 per seat)                                  │
│  • React Hook Form + Zod validation                          │
│  • Contact info                                               │
│  • KVKK checkbox                                              │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  BookingContext.setPassengers() + setContact()                │
│  • Stores passenger & contact data                           │
│  • Navigate to /checkout                                      │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  ReviewConfirm (/checkout)                                    │
│  • Display all booking info                                   │
│  • Calculate total price                                      │
│  • User clicks "Pay Securely"                                │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  Mutation (createBooking)                                     │
│  • POST /api/tickets/sell                                     │
│  • MSW returns mock PNR                                       │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  SuccessPage (/success)                                       │
│  • Display PNR code                                           │
│  • Confetti animation                                         │
│  • Reset booking context                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

Tüm endpoint'ler MSW ile mock edilmiştir:

### 1. Get Locations
```http
GET /api/reference/agencies
```

**Response:**
```json
[
  { "id": "ist-alibeykoy", "name": "İstanbul – Alibeyköy" },
  { "id": "ank-astim", "name": "Ankara – AŞTİ" }
]
```

### 2. Search Trips
```http
GET /api/schedules?from={agencyId}&to={agencyId}&date={yyyy-MM-dd}
```

**Response:**
```json
[
  {
    "id": "TRIP-1001",
    "company": "Atlas Lines",
    "from": "ist-alibeykoy",
    "to": "ank-astim",
    "departure": "2025-11-02T08:30:00+03:00",
    "arrival": "2025-11-02T13:15:00+03:00",
    "price": 695,
    "availableSeats": 18
  }
]
```

### 3. Get Seat Schema
```http
GET /api/seatSchemas/{tripId}
```

**Response:**
```json
{
  "tripId": "TRIP-1001",
  "layout": {
    "rows": 10,
    "cols": 5,
    "cells": [[0, 0, 2, 0, 0], ...]
  },
  "seats": [
    { "no": 1, "row": 1, "col": 1, "status": "empty" },
    { "no": 2, "row": 1, "col": 2, "status": "taken" }
  ],
  "unitPrice": 695
}
```

### 4. Create Booking (Mock)
```http
POST /api/tickets/sell
```

**Request:**
```json
{
  "tripId": "TRIP-1001",
  "seats": [1, 3],
  "contact": { "email": "user@example.com", "phone": "+90 5xx" },
  "passengers": [
    { "seat": 1, "firstName": "Ali", "lastName": "Yılmaz", "idNo": "111...", "gender": "male" }
  ]
}
```

**Response:**
```json
{
  "ok": true,
  "pnr": "AT-20251203-ABC",
  "message": "Payment step mocked."
}
```

---

## 🧪 Test

### Test Coverage

```bash
npm run test:coverage
```

**Kapsanan Testler:**
1. ✅ **SearchForm**: Form validation, required fields, autocomplete
2. ✅ **SeatSelection**: Seat map rendering, selection logic
3. ✅ **ReviewConfirm**: Price calculation, booking summary

### Test Yaklaşımı

- **Unit Tests**: Component davranışları
- **Integration Tests**: Component etkileşimleri
- **MSW**: API mocking (browser + node)
- **Providers**: Test utils ile tüm provider'lar wrap edilir

**Test Utilities:**
```tsx
// tests/utils.tsx
export const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BookingProvider>
            <BrowserRouter>
              {ui}
            </BrowserRouter>
          </BookingProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
```

---

## 🚧 Geliştirme Notları

1. **Dark/Light Theme**
   - Sistema uyumlu otomatik başlangıç
   - localStorage persistence
   - FOUC prevention (useLayoutEffect)

2. **Custom Autocomplete**
   - Keyboard navigation (↑↓ Enter Esc)
   - Türkçe karakter desteği (`toLocaleLowerCase('tr-TR')`)
   - ARIA labels (a11y)

3. **Error Boundary**
   - 3-layer error handling
   - Development/Production mod ayrımı
   - Retry logic (404'te retry yok)

4. **Seat Adjacency**
   - Tek koltuk seçilince yan koltuğu önerir
   - Visual highlighting
   - User-friendly info card

5. **Environment Variables**
   - Type-safe env config
   - Vite integration
   - Default değerler

### 📊 Performance Metrics

```
Production Build:
├── CSS:  35.06 kB (gzip: 6.18 kB)
└── JS:  451.98 kB (gzip: 137.16 kB)