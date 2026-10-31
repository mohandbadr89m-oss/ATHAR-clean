<?php

use App\Models\User;

it('shows the public landing page', function () {
    $this->get(route('home'))->assertOk();
});

it('assigns the regular user role to new registrations', function () {
    $response = $this->post(route('signup.store'), [
        'name' => 'Athar Member',
        'email' => 'member@example.com',
        'password' => 'StrongPassword123',
    ]);

    $response->assertRedirect(route('home'));

    $user = User::where('email', 'member@example.com')->firstOrFail();

    expect($user->role)->toBe(User::ROLE_USER)
        ->and(password_verify('StrongPassword123', $user->password))->toBeTrue();
});

it('redirects guests away from the admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

it('prevents regular users from opening the admin dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

it('allows admins to open the admin dashboard', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['role' => User::ROLE_ADMIN])->save();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});

it('allows only the owner to create admin accounts', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['role' => User::ROLE_ADMIN])->save();

    $this->actingAs($admin)
        ->post(route('admin.admins.store'), [
            'name' => 'Another Admin',
            'email' => 'another-admin@example.com',
            'password' => 'StrongPassword123',
            'password_confirmation' => 'StrongPassword123',
        ])
        ->assertForbidden();

    $owner = User::factory()->create();
    $owner->forceFill(['role' => User::ROLE_OWNER])->save();

    $this->actingAs($owner)
        ->post(route('admin.admins.store'), [
            'name' => 'Another Admin',
            'email' => 'another-admin@example.com',
            'password' => 'StrongPassword123',
            'password_confirmation' => 'StrongPassword123',
        ])
        ->assertRedirect(route('admin.dashboard'));

    expect(User::where('email', 'another-admin@example.com')->value('role'))
        ->toBe(User::ROLE_ADMIN);
});
