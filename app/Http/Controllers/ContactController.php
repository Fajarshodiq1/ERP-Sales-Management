<?php

namespace App\Http\Controllers;

use App\Actions\Contact\UpsertContactAction;
use App\Data\ContactData;
use App\Models\Account;
use App\Models\Contact;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ContactController extends Controller
{
    public function index(): Response
    {
        $contacts = QueryBuilder::for(Contact::class)
            ->with(['account']) 
            ->allowedFilters(
                'name',
                'position',
                'email',
                'phone',
                'status',
                AllowedFilter::exact('account_id')
            )
            ->allowedIncludes('account')
            ->defaultSort('-created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('contacts/form', [
            'accounts' => Account::where('status', 'active')->get(['id', 'company_name']),
        ]);
    }

    public function store(ContactData $data, UpsertContactAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()->route('contacts.index')->with('success', 'Contact berhasil ditambahkan.');
    }

    public function show(Contact $contact): Response
    {
        return Inertia::render('Contacts/Show', [
            'contact' => $contact->load('account'),
        ]);
    }

    public function edit(Contact $contact): Response
    {
        return Inertia::render('contacts/form', [
            'contact' => $contact,
            'accounts' => Account::where('status', 'active')->get(['id', 'company_name']),
        ]);
    }

    public function update(ContactData $data, Contact $contact, UpsertContactAction $action): RedirectResponse
    {
        $action->execute($data, $contact);

        return redirect()->route('contacts.index')->with('success', 'Contact berhasil diperbarui.');
    }
    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();
        return redirect()->route('contacts.index')->with('success', 'Contact berhasil dihapus.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:contacts,id'],
        ]);

        Contact::whereIn('id', $request->input('ids'))->delete();
        return redirect()->route('contacts.index')->with('success', 'Kontak terpilih berhasil dihapus.');
    }
}