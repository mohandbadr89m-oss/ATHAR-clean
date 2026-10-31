<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): View
    {
        return view('admin.dashboard', [
            'users' => User::latest()->get(),

            'totalUsers' => User::where('role', User::ROLE_USER)->count(),

            'totalAdmins' => User::where('role', User::ROLE_ADMIN)->count(),

            'totalOwners' => User::where('role', User::ROLE_OWNER)->count(),
        ]);
    }

    /**
     * Create a new admin account.
     * Owner only.
     */
    public function storeAdmin(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:50',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $admin->forceFill([
            'role' => User::ROLE_ADMIN,
        ])->save();

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'تم إنشاء حساب المدير بنجاح.');
    }

    /**
     * Revoke an admin's privileges.
     * Owner only.
     */
    public function revokeAdmin(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        if (!$user->hasRole(User::ROLE_ADMIN)) {
            return back()->withErrors([
                'admin' => 'لا يمكن سحب الصلاحية من هذا الحساب.',
            ]);
        }

        $user->forceFill([
            'role' => User::ROLE_USER,
        ])->save();

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'تم سحب صلاحيات المدير وإعادته إلى مستخدم عادي.');
    }
}
