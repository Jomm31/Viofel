<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FuelPrice;

class FuelPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        FuelPrice::create([
            'fuel_price' => 65.50,
            'date_effective' => now(),
            'price_per_liter' => 65.50,
            'distance_km' => 0
        ]);
    }
}
