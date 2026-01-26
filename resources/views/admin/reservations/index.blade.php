<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reservations - Viofel Admin</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <style>
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        .filters input, .filters select {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.9rem;
        }
        .filters input {
            flex: 1;
            min-width: 250px;
        }
        .filters button {
            padding: 0.5rem 1.5rem;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .filters button:hover {
            background: #1d4ed8;
        }
        
        .reservation-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .reservation-table th, .reservation-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .reservation-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #374151;
        }
        .reservation-table tr:hover {
            background: #f9fafb;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: capitalize;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        
        .action-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            margin-right: 0.5rem;
        }
        .view-btn { background: #3b82f6; color: white; }
        .view-btn:hover { background: #2563eb; }
        .delete-btn { background: #ef4444; color: white; }
        .delete-btn:hover { background: #dc2626; }
        
        .status-select {
            padding: 0.4rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.85rem;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        .pagination a, .pagination span {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-decoration: none;
            color: #374151;
        }
        .pagination a:hover {
            background: #f3f4f6;
        }
        .pagination .current {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
        
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
        
        .stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .stat-card {
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
            font-size: 0.9rem;
            color: #6b7280;
            margin: 0;
        }
        .stat-card p {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0.5rem 0 0;
            color: #111827;
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- Sidebar --}}
        @include('admin.side-bar')

        {{-- Main Content --}}
        <div class="main-content">
            <h2>Reservations</h2>
            
            @if(session('success'))
                <div class="success-message">{{ session('success') }}</div>
            @endif
            
            {{-- Stats --}}
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Reservations</h3>
                    <p>{{ $reservations->total() }}</p>
                </div>
            </div>
            
            {{-- Filters --}}
            <form class="filters" method="GET" action="{{ route('admin.reservations.index') }}">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Search by name, email, or reference..." 
                    value="{{ $search }}"
                >
                <select name="status">
                    <option value="all" {{ $currentStatus == 'all' ? 'selected' : '' }}>All Status</option>
                    <option value="pending" {{ $currentStatus == 'pending' ? 'selected' : '' }}>Pending</option>
                    <option value="confirmed" {{ $currentStatus == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                    <option value="completed" {{ $currentStatus == 'completed' ? 'selected' : '' }}>Completed</option>
                    <option value="cancelled" {{ $currentStatus == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                </select>
                <button type="submit">Filter</button>
            </form>
            
            {{-- Reservations Table --}}
            <table class="reservation-table">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Customer</th>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Passengers</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($reservations as $reservation)
                        <tr>
                            <td>
                                <strong>{{ $reservation->bookingReference?->booking_reference ?? 'N/A' }}</strong>
                            </td>
                            <td>
                                <div>{{ $reservation->customer->full_name }}</div>
                                <small style="color: #6b7280;">{{ $reservation->customer->email }}</small>
                            </td>
                            <td>
                                <div style="font-size: 0.85rem;">
                                    <strong>From:</strong> {{ Str::limit($reservation->origin, 30) }}<br>
                                    <strong>To:</strong> {{ Str::limit($reservation->destination, 30) }}
                                </div>
                            </td>
                            <td>{{ $reservation->reservation_date->format('M d, Y') }}</td>
                            <td>{{ $reservation->estimated_passengers }}</td>
                            <td>
                                <form action="{{ route('admin.reservations.update-status', $reservation->reservation_id) }}" method="POST" style="display: inline;">
                                    @csrf
                                    @method('PATCH')
                                    <select name="status" class="status-select" onchange="this.form.submit()">
                                        <option value="pending" {{ $reservation->status == 'pending' ? 'selected' : '' }}>Pending</option>
                                        <option value="confirmed" {{ $reservation->status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                                        <option value="completed" {{ $reservation->status == 'completed' ? 'selected' : '' }}>Completed</option>
                                        <option value="cancelled" {{ $reservation->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                    </select>
                                </form>
                            </td>
                            <td>
                                <a href="{{ route('admin.reservations.show', $reservation->reservation_id) }}" class="action-btn view-btn">View</a>
                                <form action="{{ route('admin.reservations.destroy', $reservation->reservation_id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this reservation?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="action-btn delete-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                                No reservations found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
            
            {{-- Pagination --}}
            @if($reservations->hasPages())
                <div class="pagination">
                    {{ $reservations->appends(['search' => $search, 'status' => $currentStatus])->links() }}
                </div>
            @endif
        </div>
    </div>
</body>
</html>
