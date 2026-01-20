<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>



# Viofel

A web-based inquiry and FAQ management system built with Laravel.

---

## System Definition and Implementation

### System Scope

Viofel is a customer inquiry and FAQ management platform designed to streamline communication between users and administrators. The system provides:

**Key Features:**
- **Inquiry Management** – Users can submit inquiries with attachments; admins can view and delete inquiries
- **FAQ Management** – Full CRUD operations for frequently asked questions (Create, Read, Update, Delete)
- **User Authentication** – Secure login/registration system using Laravel Breeze
- **User Profile Management** – Users can edit and manage their profiles
- **File Attachments** – Support for image and document uploads (JPG, PNG, PDF, DOC, DOCX)
- **Admin Dashboard** – Centralized management interface for inquiries and FAQs

**Operational Constraints:**
- Requires PHP 8.0.2 or higher
- MySQL/MariaDB database required
- File upload limit: 20MB
- Supported attachment formats: JPG, JPEG, PNG, PDF, DOC, DOCX

---

## Development Tools, Frameworks & Technologies

| Category | Technology | Version |
|----------|------------|---------|
| **Backend Framework** | Laravel | ^9.19 |
| **PHP Version** | PHP | ^8.0.2 |
| **Frontend Build** | Vite | ^4.0.0 |
| **CSS Framework** | Tailwind CSS | ^3.1.0 |
| **JavaScript** | Alpine.js | ^3.4.2 |
| **Authentication** | Laravel Breeze | ^1.19 |
| **API Authentication** | Laravel Sanctum | ^3.0 |
| **HTTP Client** | Guzzle | ^7.2 |
| **Testing** | PHPUnit | ^9.5.10 |
| **Code Style** | Laravel Pint | ^1.0 |

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
