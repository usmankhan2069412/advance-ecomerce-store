import { redirect } from 'next/navigation';

/**
 * Redirect from /admin/products/add to /admin/products/new
 * This ensures backward compatibility with any existing links
 */
export default function ProductAddRedirect() {
  redirect('/admin/products/new');
} 