import Link from 'next/link';
import React from 'react'

const navLinks = [
  {
    href: "/orders/new",
    label: "Place Order",
  },
  {
    href: "/orders/customer/2",
    label: "My Orders",
  },
  {
    href: "/workers/orders",
    label: "Worker",
  },
];

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tight"
                >
                    Food Delivery
                </Link>

                <nav className="flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
                    Login
                </button>
            </div>
        </header>
    )
}

export default Navbar;
