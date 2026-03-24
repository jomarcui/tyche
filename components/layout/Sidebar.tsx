import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-white dark:bg-black p-6 text-black dark:text-white w-64">
      <h1 className="mb-6 text-xl font-bold"><Link href="/">Tyche</Link></h1>


      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/borrowers">Borrowers</Link>
        <Link href="/loans">Loans</Link>
        <Link href="/payments">Payments</Link>
      </nav>
    </aside>
  );
}
