<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('central_data_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->unsignedBigInteger('admin_id');
            $table->string('report_type');
            $table->dateTime('date_generated');
            $table->text('description')->nullable();
            $table->string('data_source');
            $table->timestamps();
            
            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
        });
        
        Schema::create('management_dashboards', function (Blueprint $table) {
            $table->id('dashboard_id');
            $table->unsignedBigInteger('report_id');
            $table->string('metric');
            $table->decimal('value', 15, 2);
            $table->dateTime('timestamp');
            $table->timestamps();
            
            $table->foreign('report_id')->references('report_id')->on('central_data_reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('management_dashboards');
        Schema::dropIfExists('central_data_reports');
    }
};
