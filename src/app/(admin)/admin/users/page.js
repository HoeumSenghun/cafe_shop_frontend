import Link from 'next/link'
import { loadAdminUsers } from '@/actions/admin-actions'
import { toggleUserEnabledAction } from '@/actions/admin-actions'
import CreateStaffForm from './create-staff-form'

export default async function AdminUsersPage () {
  const res = await loadAdminUsers()
  const users = res.ok && Array.isArray(res.data?.content) ? res.data.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>Users</h1>

      <CreateStaffForm />

      {!res.ok && (
        <p className='mt-6 text-sm text-red-600'>{res.message}</p>
      )}

      {res.ok && (
        <ul className='mt-8 space-y-3'>
          {users.map((u) => (
            <li key={String(u.id)} className='flex flex-wrap items-center justify-between gap-3 rounded border p-4'>
              <div>
                <div className='font-medium'>{u.fullName || u.email}</div>
                <div className='text-sm text-gray-600'>
                  {u.email} · {String(u.role || '—')}
                </div>
              </div>
              <form action={toggleUserEnabledAction}>
                <input name='userId' type='hidden' value={String(u.id)} />
                <input
                  name='enabled'
                  type='hidden'
                  value={u.enabled === false ? 'true' : 'false'}
                />
                <button className='rounded border px-3 py-1 text-sm' type='submit'>
                  {u.enabled === false ? 'Enable' : 'Disable'}
                </button>
              </form>
            </li>
          ))}
          {users.length === 0 && (
            <p className='text-sm text-gray-600'>No users.</p>
          )}
        </ul>
      )}

      <p className='mt-6 text-sm'>
        <Link className='underline' href='/admin'>
          Back to dashboard
        </Link>
      </p>
    </main>
  )
}
