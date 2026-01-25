## Installation & Setup

### Prerequisites
- PHP ^8.0.2
- Composer
- Node.js & npm
- MySQL/MariaDB

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Viofel
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   Edit `.env` file with your database credentials:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=viofel
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Start development servers**
   
   Terminal 1 - Laravel backend:
   ```bash
   php artisan serve
   ```
   
   Terminal 2 - Vite frontend:
   ```bash
   npm run dev
   ```

8. **Access the application**
   Open browser to: `http://localhost:8000`

---

## Development Workflow

### Building for Production
```bash
npm run build
```

### Code Formatting
```bash
./vendor/bin/pint
```

### Running Tests
```bash
php artisan test
```

---

## Project Structure (Inertia + React)

```
resources/
├── js/
│   ├── app.jsx                 # Inertia app entry point
│   ├── Pages/                  # React page components
│   │   ├── Welcome.jsx
│   │   ├── Admin/
│   │   ├── Reservations/
│   │   ├── Fleet/
│   │   └── Reports/
│   └── Components/             # Reusable React components
│       ├── Layout/
│       ├── Forms/
│       └── UI/
└── views/
    └── app.blade.php           # Inertia root template

app/Http/Controllers/
├── ReservationController.php
├── PaymentController.php
├── FleetController.php
└── ReportController.php

routes/
└── web.php                     # All routes using Inertia::render()
```

---

## Subsystem Implementation Roadmap

### Phase 1: Foundation (Current)
- ✅ Laravel + Inertia + React setup
- ✅ Basic routing and page structure
- 🔄 Authentication system (reference number-based)

### Phase 2: Core Subsystems
- [ ] Reservation Management Subsystem
- [ ] Payment Processing Subsystem
- [ ] Customer Support Subsystem (Inquiries/FAQs)

### Phase 3: Fleet & Operations
- [ ] Fleet and Route Management Subsystem
- [ ] Real-time bus tracking
- [ ] Maintenance scheduling

### Phase 4: Analytics & Reporting
- [ ] Reporting and Analytics Subsystem
- [ ] Revenue tracking
- [ ] Performance dashboards

---

## Tech Stack Benefits

**Why Laravel + Inertia + React?**

| Feature | Benefit |
|---------|---------|
| **Server-side routing** | Simpler than separate API, easier debugging |
| **Client-side rendering** | Fast, SPA-like user experience |
| **Shared state** | Easy data passing from Laravel to React |
| **Code splitting** | Faster page loads with automatic chunking |
| **TypeScript ready** | Can migrate to TypeScript incrementally |
| **Mobile ready** | Easy to add React Native later |

---

## Contributing

1. Create feature branch: `git checkout -b feature/subsystem-name`
2. Make changes and test thoroughly
3. Run code formatter: `./vendor/bin/pint`
4. Commit changes: `git commit -m "Add feature description"`
5. Push branch: `git push origin feature/subsystem-name`
6. Create Pull Request

---

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
