<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>



# Viofel Transport Management System

A comprehensive transport management platform for Viofel Transport, handling reservations, payments, fleet management, and customer support.

## About Viofel Transport

Established in 2014, Viofel Transport first served services mostly in Fairview. Current operations rely heavily on transit cooperators overseeing many routes under Viofel's auspices. Viofel Transport works with cooperators who own and run buses under Viofel's corporate umbrella, providing:
- Tour bus services (reservation-based with set schedules)
- Everyday bus journeys (running almost around the clock)
- Dependable, adaptable transportation options

## Proposed System Architecture

The system digitalizes Viofel Transport's operations through an integrated platform with five core subsystems:

1. **Reservation Management Subsystem** - Online booking for tour buses with route and schedule options
2. **Payment Processing Subsystem** - Secure digital payments with tracking and receipts
3. **Fleet and Route Management Subsystem** - Real-time monitoring, maintenance scheduling, and automated expense calculation
4. **Customer Support Subsystem** - Communication tools for inquiries and complaints
5. **Reporting and Analytics Subsystem** - Revenue, bookings, performance, and incident reports

---

## Functional Objectives
- Enable online booking and cancellations for tour and daily bus services
- Allow digital payment options with transaction confirmation
- Provide administrators with tools to manage routes and schedules
- Automate revenue and expense calculations with real-time data inputs
- Facilitate incident reporting and maintenance scheduling

## Non-Functional Objectives
- Ensure high system availability to support near 24/7 operations
- Maintain data security and passenger privacy
- Provide a user-friendly interface accessible via web and mobile devices
- Support scalability for future expansion of routes and services
- Optimize system performance to minimize booking and payment processing times

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **PHP** | ^8.0.2 | Server-side language |
| **Laravel** | ^9.19 | Backend framework, routing, database |
| **Inertia.js** | Latest | Server-side routing with client-side rendering |
| **MySQL** | - | Primary database |
| **Guzzle** | ^7.2 | HTTP client for API calls |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.x | UI components and interactivity |
| **Inertia.js React Adapter** | Latest | Seamless Laravel-React integration |
| **Tailwind CSS** | ^3.1.0 | Utility-first styling |
| **Vite** | ^4.0.0 | Build tool and development server |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **PHPUnit** | ^9.5.10 | PHP testing framework |
| **Laravel Pint** | ^1.0 | Code formatting |
| **Axios** | ^1.1.2 | HTTP requests |

### Why This Stack?
- **Laravel + Inertia + React**: Perfect for complex real-time features (bookings, fleet tracking, payments)
- **Single-page feel** with server-side routing - best of both worlds
- **Scalable architecture** for future mobile app development
- **Rich UI capabilities** for dashboards, analytics, and interactive booking flows

---

## Coding Plan (MVC Architecture)

### Directory Structure

```
app/
├── Console/              # Artisan commands
├── Exceptions/           # Exception handlers
├── Http/
│   ├── Controllers/      # Application controllers
│   │   ├── Auth/         # Authentication controllers
│   │   ├── FaqController.php
│   │   ├── HomeController.php
│   │   ├── InquiryController.php
│   │   └── ProfileController.php
│   ├── Middleware/       # HTTP middleware
│   └── Requests/         # Form request validation
├── Models/               # Eloquent models
│   ├── Faq.php
│   ├── Inquiry.php
│   └── User.php
├── Providers/            # Service providers
└── View/Components/      # Blade components

database/
├── factories/            # Model factories
├── migrations/           # Database migrations
└── seeders/              # Database seeders

resources/views/
├── admin/                # Admin panel views
├── auth/                 # Authentication views
├── components/           # Reusable Blade components
├── layouts/              # Layout templates
├── passenger/            # Passenger/user views
└── profile/              # Profile management views

routes/
├── web.php               # Web routes
├── api.php               # API routes
└── auth.php              # Authentication routes
```

### Models

| Model | Table | Primary Key | Fillable Fields |
|-------|-------|-------------|-----------------|
| `User` | users | id | name, email, password |
| `Inquiry` | inquiries | message_id | name, email, contact_number, message, attachment |
| `Faq` | faqs | faq_id | question, answer |

### Routes Overview

| Method | URI | Controller Action | Description |
|--------|-----|-------------------|-------------|
| GET | `/homepage` | HomeController@homepage | Display homepage |
| POST | `/inquiries` | InquiryController@store | Submit inquiry |
| DELETE | `/inquiries/{id}` | InquiryController@destroy | Delete inquiry |
| GET | `/admin/inquiries` | InquiryController@index | List all inquiries |
| GET | `/admin/faqs` | FaqController@index | List all FAQs |
| POST | `/admin/faqs` | FaqController@store | Create FAQ |
| GET | `/admin/faqs/{id}/edit` | FaqController@edit | Edit FAQ form |
| PUT | `/admin/faqs/{id}` | FaqController@update | Update FAQ |
| DELETE | `/admin/faqs/{id}` | FaqController@destroy | Delete FAQ |

### CRUD Operations

**Inquiry Module:**
- **Create:** Users submit inquiries via form with optional file attachment
- **Read:** Admins view all inquiries in dashboard
- **Delete:** Admins can remove inquiries (with attachment cleanup)

**FAQ Module:**
- **Create:** Admins add new FAQ entries
- **Read:** Display FAQs to users and admins
- **Update:** Admins can edit existing FAQs
- **Delete:** Admins can remove FAQs

---

## Coding Standards

### PHP Standards (PSR-12)

- Use **PascalCase** for class names: `InquiryController`, `FaqController`
- Use **camelCase** for methods and variables: `$contactNumber`, `getInquiries()`
- Use **snake_case** for database columns: `message_id`, `contact_number`
- Use **4 spaces** for indentation (no tabs)
- Opening braces `{` on same line for classes and methods
- One class per file

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Controllers | Singular + Controller | `FaqController` |
| Models | Singular PascalCase | `Inquiry` |
| Migrations | snake_case with timestamp | `2025_09_24_180502_create_inquiries_table` |
| Views | kebab-case | `edit-faq.blade.php` |
| Routes | kebab-case | `admin.faqs.edit` |

### Validation Rules

All form inputs are validated using Laravel's validation system:

```php
// Inquiry validation
$request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email|max:255',
    'contact_number' => 'nullable|string|max:20',
    'message' => 'nullable|string',
    'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:20048',
]);

// FAQ validation
$request->validate([
    'question' => 'required|string|max:255',
    'answer' => 'required|string',
]);
```

### Documentation Practices

- All controllers should have PHPDoc comments for methods
- Complex logic should include inline comments
- README must be kept up-to-date with system changes

---

## Repository Structure

```
Viofel/
├── app/                  # Application core code
├── bootstrap/            # Framework bootstrap files
├── config/               # Configuration files
├── database/             # Migrations, factories, seeders
├── lang/                 # Localization files
├── public/               # Public assets (entry point)
├── resources/            # Views, raw assets
├── routes/               # Route definitions
├── storage/              # Logs, cache, uploads
├── tests/                # Automated tests
├── .env.example          # Environment template
├── artisan               # CLI tool
├── composer.json         # PHP dependencies
├── package.json          # Node dependencies
├── phpunit.xml           # Testing configuration
├── tailwind.config.js    # Tailwind CSS config
├── vite.config.js        # Vite build config
└── README.md             # This file
```

---

## Setup and Installation

### Prerequisites

- PHP >= 8.0.2
- Composer
- Node.js & NPM
- MySQL/MariaDB

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Viofel
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database** in `.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=viofel
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Create storage link** (for file uploads)
   ```bash
   php artisan storage:link
   ```

8. **Build frontend assets**
   ```bash
   npm run build
   ```

### Running the Application

**Development:**
```bash
# Start Laravel development server
php artisan serve

# Start Vite dev server (in separate terminal)
npm run dev
```

**Production:**
```bash
npm run build
php artisan serve --env=production
```

Access the application at: `http://localhost:8000`

---

## Testing

Run the test suite:
```bash
php artisan test
```

Or using PHPUnit directly:
```bash
./vendor/bin/phpunit
```

---

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
