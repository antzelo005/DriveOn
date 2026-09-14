import { ContactActionLink } from "../components/ContactActions";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { business } from "../data/business";
import { navigation } from "../data/content";
import { Logo } from "./Shared";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const followSection = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const heading = document
        .getElementById(id)
        ?.querySelector<HTMLElement>("h2, h3");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.addEventListener(
        "blur",
        () => heading.removeAttribute("tabindex"),
        { once: true },
      );
    });
  };
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
      .querySelectorAll("#diplomata, #sxoli, #oximata, #faq")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    nav.current?.querySelector("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const links = nav.current?.querySelectorAll<HTMLElement>("a, button");
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
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("menu-open");
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
          CONCEPT DEMO{" "}
          <span>Φανταστική σχολή · Πραγματικές δυνατότητες σχεδιασμού.</span>
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
            <ContactActionLink className="header-phone" action="phone">
              <Phone size={16} />
              {business.phone}
            </ContactActionLink>
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
            <a key={id} href={`#${id}`} onClick={() => followSection(id)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a href="#epikoinonia" onClick={() => followSection("epikoinonia")}>
            Επικοινωνία
            <ArrowUpRight size={18} />
          </a>
          <ContactActionLink
            action="phone"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
          >
            <Phone size={18} />
            {business.phone}
          </ContactActionLink>
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
