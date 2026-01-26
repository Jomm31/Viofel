<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reservation Details - Viofel Admin</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <style>
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #2563eb;
            text-decoration: none;
            margin-bottom: 1.5rem;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        
        .detail-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 2rem;
            margin-bottom: 1.5rem;
        }
        .detail-card h3 {
            margin: 0 0 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #eee;
            color: #374151;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .detail-item label {
            font-size: 0.85rem;
            color: #6b7280;
            font-weight: 500;
        }
        .detail-item p {
            margin: 0;
            font-size: 1rem;
            color: #111827;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 999px;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: capitalize;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        
        .reference-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: #7f1d1d;
            font-family: monospace;
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        .action-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .confirm-btn { background: #10b981; color: white; }
        .confirm-btn:hover { background: #059669; }
        .complete-btn { background: #3b82f6; color: white; }
        .complete-btn:hover { background: #2563eb; }
        .cancel-btn { background: #f59e0b; color: white; }
        .cancel-btn:hover { background: #d97706; }
        .delete-btn { background: #ef4444; color: white; }
        .delete-btn:hover { background: #dc2626; }
        
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- Sidebar --}}
        @include('admin.side-bar')

        {{-- Main Content --}}
        <div class="main-content">
            <a href="{{ route('admin.reservations.index') }}" class="back-link">
                ← Back to Reservations
            </a>
            
            @if(session('success'))
                <div class="success-message">{{ session('success') }}</div>
            @endif
            
            <h2>Reservation Details</h2>
            
            {{-- Reference & Status --}}
            <div class="detail-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <label style="font-size: 0.85rem; color: #6b7280;">Reference Number</label>
                        <p class="reference-number">{{ $reservation->bookingReference?->booking_reference ?? 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="status-badge status-{{ $reservation->status }}">{{ $reservation->status }}</span>
                    </div>
                </div>
            </div>
            
            {{-- Customer Details --}}
            <div class="detail-card">
                <h3>Customer Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Full Name</label>
                        <p>{{ $reservation->customer->full_name }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Email</label>
                        <p>{{ $reservation->customer->email }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Phone</label>
                        <p>{{ $reservation->customer->phone }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Address</label>
                        <p>{{ $reservation->customer->address ?? 'N/A' }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Valid ID</label>
                        <p>{{ $reservation->customer->valid_id ?? 'N/A' }}</p>
                    </div>
                </div>
            </div>
            
            {{-- Trip Details --}}
            <div class="detail-card">
                <h3>Trip Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Origin</label>
                        <p>{{ $reservation->origin }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Destination</label>
                        <p>{{ $reservation->destination }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Reservation Date</label>
                        <p>{{ $reservation->reservation_date->format('F d, Y') }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Departure Time</label>
                        <p>{{ $reservation->departure_time?->format('h:i A') ?? 'N/A' }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Arrival Time</label>
                        <p>{{ $reservation->arrival_time?->format('h:i A') ?? 'N/A' }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Travel Options</label>
                        <p>{{ ucfirst(str_replace('-', ' ', $reservation->travel_options ?? 'N/A')) }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Estimated Passengers</label>
                        <p>{{ $reservation->estimated_passengers }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Distance</label>
                        <p>{{ $reservation->distance_km ? number_format($reservation->distance_km, 2) . ' km' : 'N/A' }}</p>
                    </div>
                </div>
            </div>
            
            {{-- Booking Info --}}
            <div class="detail-card">
                <h3>Booking Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Booked On</label>
                        <p>{{ $reservation->created_at->format('F d, Y h:i A') }}</p>
                    </div>
                    <div class="detail-item">
                        <label>Last Updated</label>
                        <p>{{ $reservation->updated_at->format('F d, Y h:i A') }}</p>
                    </div>
                </div>
            </div>
            
            {{-- Action Buttons --}}
            <div class="action-buttons">
                @if($reservation->status == 'pending')
                    <form action="{{ route('admin.reservations.update-status', $reservation->reservation_id) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="confirmed">
                        <button type="submit" class="action-btn confirm-btn">✓ Confirm Reservation</button>
                    </form>
                @endif
                
                @if($reservation->status == 'confirmed')
                    <form action="{{ route('admin.reservations.update-status', $reservation->reservation_id) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="completed">
                        <button type="submit" class="action-btn complete-btn">✓ Mark as Completed</button>
                    </form>
                @endif
                
                @if($reservation->status != 'cancelled')
                    <form action="{{ route('admin.reservations.update-status', $reservation->reservation_id) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="cancelled">
                        <button type="submit" class="action-btn cancel-btn">✗ Cancel Reservation</button>
                    </form>
                @endif
                
                <form action="{{ route('admin.reservations.destroy', $reservation->reservation_id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this reservation?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="action-btn delete-btn">Delete</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
