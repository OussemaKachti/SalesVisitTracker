import { redirect } from 'next/navigation';

export default function CataloguePage() {
  redirect('/product-catalog');
  return null;
}
