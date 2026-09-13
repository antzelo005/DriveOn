import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { business, contactLinks } from "../data/business";
import { navigation } from "../data/content";
import { Logo } from "./Shared";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        if (e.shiftKey && document.activeElement === links[0]) {
          e.preventDefault();
          toggle.current?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === links[links.length - 1]
        ) {
          e.preventDefault();
          toggle.current?.focus();
        } else if (document.activeElement === toggle.current) {
          e.preventDefault();
          links[e.shiftKey ? links.length - 1 : 0].focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1000) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>
      {business.demo && (
        <div className="demo-strip">
          DEMO WEBSITE <span>Μια νέα διαδρομή για τη δική σου σχολή.</span>
          <a href="#demo-info">
            Σχετικά με το demo <ArrowUpRight size={12} />
          </a>
        </div>
      )}
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Κύρια πλοήγηση">
            {navigation.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "active" : ""}
                aria-current={active === id ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="header-phone" href={contactLinks.phone}>
              <Phone size={16} />
              {business.phone}
            </a>
            <a className="button button-yellow header-cta" href="#epikoinonia">
              Ξεκίνα τώρα <ArrowUpRight size={17} />
            </a>
            <button
              className="icon-button menu-toggle"
              ref={toggle}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          ref={nav}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Πλοήγηση κινητού"
          hidden={!open}
        >
          {navigation.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a href="#epikoinonia" onClick={() => setOpen(false)}>
            Επικοινωνία
            <ArrowUpRight size={18} />
          </a>
          <a href={contactLinks.phone} onClick={() => setOpen(false)}>
            <Phone size={18} />
            {business.phone}
          </a>
        </nav>
      </header>
      {open && (
        <div
          className="menu-backdrop"
          onClick={() => {
            setOpen(false);
            toggle.current?.focus();
          }}
        />
      )}
    </>
  );
}
