import config from "./business.json";

export const business = config;
export const contactLinks = {
  phone: `tel:${business.phoneHref}`,
  mobile: `tel:${business.mobileHref}`,
  email: `mailto:${business.email}`,
  whatsapp: `https://wa.me/${business.mobileHref.replace("+", "")}?text=${encodeURIComponent("Γεια σας! Θα ήθελα πληροφορίες για μαθήματα οδήγησης.")}`,
  viber: `viber://chat?number=${encodeURIComponent(business.mobileHref)}`,
  maps: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.demo ? "Περιστέρι, Αθήνα" : `${business.address}, ${business.postalCode} ${business.city}`)}`,
};
