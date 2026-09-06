<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Buat Permissions Dasar
        $permissions = [
            'manage master data',
            'view target accounts',
            'create target accounts',
            'assign target accounts',
            'log outreach',
            'log activity',
            'manage leads',
            'qualify leads',
            'manage opportunities',
            'view pipeline',
            'view performance analytics',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Roles & Assign Permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->givePermissionTo(Permission::all());

        $managerRole = Role::firstOrCreate(['name' => 'Sales Manager']);
        $managerRole->givePermissionTo([
            'view target accounts',
            'create target accounts',
            'assign target accounts',
            'log outreach',
            'log activity',
            'manage leads',
            'qualify leads',
            'manage opportunities',
            'view pipeline',
            'view performance analytics',
        ]);

        $repRole = Role::firstOrCreate(['name' => 'Sales Rep']);
        $repRole->givePermissionTo([
            'view target accounts',
            'create target accounts',
            'log outreach',
            'log activity',
            'manage leads',
            'manage opportunities',
            'view pipeline',
        ]);

        // 3. Buat Super Admin User Default
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@syncore.id'],
            [
                'name' => 'Super Admin SYNCORE',
                'password' => Hash::make('password123'),
                'role' => 'Admin',
                'status' => 'active',
            ]
        );

        // Assign Role Spatie ke Super Admin User
        $superAdmin->assignRole($adminRole);
    }
}